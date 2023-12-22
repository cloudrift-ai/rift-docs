---
sidebar_position: 2
---

# Stable Diffusion on HuggingFace

In this tutorial we will show how to deploy Stable Diffusion model
on HuggingFace and run inference on your computer using Fair. This way
you can leverage your GPU to run inference and avoid paying for expensive
cloud compute.

However, the UI for your model will be hosted on Hugging Face making your
demo always available to the internet.

Additionally, we will establish a tunnel to allow requests to your machine
running Stable Diffusion even if your machine is not publicly available,
i.e. is behind NAT or firewall.

<div>
<img src={require("/static/img/tunnel-tutorial.png").default} alt="Tutorial Scheme"/>
</div>

We're going to do the following:
1. Prepare a Docker image that will run an inference server.
   Inference server will accept a text prompt and return an image.
2. Upload created Docker image to some container registry such that Fair can access it.
3. Create a HuggingFace space that will host the UI for our demo.
4. Use Fair to launch the tunneling server on a publicly available machine.
5. Use Fair to launch the inference server on your computer with a GPU.

## Preparing the Docker Image

The docker image used to serve Stable Diffusion (SDXL Turbo) is based on [docker-diffusers-api](https://github.com/kiri-art/docker-diffusers-api).

Specifically, [docker-diffusers-api-build-download](https://github.com/kiri-art/docker-diffusers-api-build-download)
base image has been used with the following command to build the image:

```bash
docker build \
  --build-arg MODEL_ID="lykon/dreamshaper-8" \
  --build-arg MODEL_REVISION="" \
  -t faircompute/diffusers-api-dreamshaper-8 .
```

## Uploading Docker Image

You need to host a newly created Docker image somewhere
to make it accessible to Fair. For example, [Docker Hub](https://hub.docker.com)
Cloud providers like GCP or Digital Ocean typically offer container registry service as well.
Often a free tier is available.

If you're using Docker Hub, then once you configure your account you
can simply push it using the command:
```shell
docker push <image_repository>/<image_name>:latest
```

:::info

We're working on a solution that would remove the need to configure your own container registry
to make it easier to get started. For now though, you need to host the image yourself.

:::

## Creating a HuggingFace Space for Hosting

We will be using HuggingFace to host the UI for accessing our model.
It might be convenient to use HuggingFace to make your work more discoverable.

You can use the FairCompute [demo space](https://huggingface.co/spaces/faircompute/stable-diffusion/blob/main/app.py)
as a starting point. Only a few code modifications are needed to the space
which we will discuss in following sections.

## Creating Fair Client

To start necessary services we will be using Fair Python API. You can install it via `pip install faircompute`.
Then create a client by providing your email and the password that you've used during registration.
```python
SERVER_ADDRESS = "https://faircompute.com:8000"

def create_fair_client():
    return FairClient(server_address=SERVER_ADDRESS,
                      user_email=os.getenv('FAIRCOMPUTE_EMAIL', "debug-usr"),
                      user_password=os.environ.get('FAIRCOMPUTE_PASSWORD', "debug-pwd"))
```

## Starting an Inference Server

Then we start an inference server by specifying Docker image and a node id that we want to run the server
on. You'll need to **replace the node id** with the one you want to run the server on. You can find one
using `fair cluster info` command.

The `ports` argument specifies the port mapping from the container to the host. We will be using port 5000
to communicate to the container, while the container will be listening on port 8000. The `detach` argument
indicates that we want to run the server in the background and don't want to block the client.
```python
INFERENCE_NODE = "<id of the node for running inference>"
INFERENCE_DOCKER_IMAGE = "faircompute/diffusers-api-dreamshaper-8"

def start_inference_server(fc: FairClient):
    fc.run(node=INFERENCE_NODE,
           image=INFERENCE_DOCKER_IMAGE,
           runtime="nvidia",
           ports=[(5001, 8000)],
           detach=True)
```

## Opening a Tunnel

Now we open the tunnel. If your node is available to the internet, then we don't need to do this.
However, it is likely that the machine is behind the NAT or firewall, and thus we need to establish a tunnel
to communicate with it. Please refer to [https://github.com/rapiz1/rathole](https://github.com/rapiz1/rathole)
documentation to understand how tunneling works.

:::info

We're working on a solution that would remove the need to configure your own tunneling node.
Fow now, you can use a free tier node from AWS or GCP and the following snippet for establishing
your tunneling node.

:::

```python
TUNNEL_NODE = "<id of the node for running tunnel>"

def start_tunnel(fc: FairClient):
    # generate fixed random authentication token based off some secret
    token = hashlib.sha256(os.environ.get('FAIRCOMPUTE_PASSWORD', "debug-pwd").encode()).hexdigest()

    # start tunnel node
    server_config = f"""
[server]
bind_addr = "0.0.0.0:2333"  # port that rathole listens for clients

[server.services.inference_server]
token = "{token}"           # token that is used to authenticate the client for the service
bind_addr = "0.0.0.0:5000"  # port that exposes service to the Internet
"""
    with open('server.toml', 'w') as file:
        file.write(server_config)
    fc.run(node=TUNNEL_NODE,
           image=TUNNEL_DOCKER_IMAGE,
           command=["--server", "/app/config.toml"],
           volumes=[("./server.toml", "/app/config.toml")],
           network="host",
           detach=True)

    server_address = next(info['host_address'] for info in fc.get_nodes() if info['node_id'] == TUNNEL_NODE)
    client_config = f"""
[client]
remote_addr = "{server_address}:2333"       # address of the rathole server

[client.services.inference_server]
token = "{token}"                           # token that is used to authenticate the client for the service
local_addr = "127.0.0.1:5001"               # address of the service that needs to be forwarded
"""
    with open('client.toml', 'w') as file:
        file.write(client_config)
    fc.run(node=INFERENCE_NODE,
           image=TUNNEL_DOCKER_IMAGE,
           command=["--client", "/app/config.toml"],
           volumes=[("./client.toml", "/app/config.toml")],
           network="host",
           detach=True)
```

## Communicating with the Stable Diffusion Endpoint

Finally, we're ready to take a look at the code for communicating with the stable diffusion endpoint.
First, we need to wait until the server is ready. We will simply be sending requests to the server
until it responds with 200 status code. If it doesn't respond after several retries - we will raise an exception
and invoke function to start the services from the section above.

Note that you need to communicate with the tunnel server and not the stable diffusion server.
Tunneling server will forward requests to stable diffusion endpoint. We get the public address
of the tunneling server by inspecting the `host_address` field of the node info structure.

```python
class ServerNotReadyException(Exception):
    pass

def create_endpoint_client(fc, retries, timeout=1.0, delay=2.0):
    # use tunneling node IP for communicating with the endpoint
    server_address = next(info['host_address'] for info in fc.get_nodes() if info['node_id'] == TUNNEL_NODE)
    for i in range(retries):
        try:
            return EndpointClient(server_address, timeout=timeout)
        except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError, requests.exceptions.Timeout) as e:
            logging.exception(e)
            time.sleep(delay)

    raise ServerNotReadyException("Failed to start the server")
```

Now we're ready to make inference request to the stable diffusion inference endpoint
that we've started above. The code sends a request to the endpoint and retrieves
the generated image encoded in base64 format. Then it decodes the image and returns it as a PIL image.

```python
class EndpointClient:
    def __init__(self, server_address, timeout):
        self.endpoint_address = f'http://{server_address}:5000'
        response = requests.get(os.path.join(self.endpoint_address, 'healthcheck'), timeout=timeout).json()
        if response['state'] != 'healthy':
            raise Exception("Server is not healthy")

    def infer(self, prompt):
        inputs = {
            "modelInputs": {
                "prompt": prompt,
                "num_inference_steps": 25,
                "width": 512,
                "height": 512,
            },
            "callInputs": {
                "MODEL_ID": "lykon/dreamshaper-8",
                "PIPELINE": "AutoPipelineForText2Image",
                "SCHEDULER": "DEISMultistepScheduler",
                "PRECISION": "fp16",
                "REVISION": "fp16",
            },
        }

        response = requests.post(self.endpoint_address, json=inputs).json()
        image_data = BytesIO(base64.b64decode(response["image_base64"]))
        image = Image.open(image_data)

        return image
```

## Starting All Services

Finally, we can put it all together, i.e.
1. Connect to Fair.
2. Start inference server.
3. Open a tunnel to the inference server.
4. Generate an image.

The logic for doing so is in the `text_to_image` function in the
[text_to_image.py](https://huggingface.co/spaces/faircompute/stable-diffusion/blob/main/text_to_image.py).

```python
def text_to_image(text):
    global endpoint_client
    global fair_client
    if fair_client is None:
        fair_client = create_fair_client()

    try:
        # client is configured, try to do inference right away
        if endpoint_client is not None:  
            return endpoint_client.infer(text) 
        # client is not configured, try connecting to the inference server, maybe it is running
        else: 
            endpoint_client = create_endpoint_client(fair_client, 1)
    except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError, requests.exceptions.Timeout):
        # inference server is not ready, start all services
        start_services(fair_client)
        endpoint_client = create_endpoint_client(fair_client, retries=10)

    # run inference
    return endpoint_client.infer(text)
```

That's it. Now you can use your hardware to run inference and avoid paying for expensive cloud GPU instances.

## Terminating the Server

For simplicity, we've omitted the code for terminating the server. If you want to do so, better to incorporate
that logic in the inference endpoint itself that we've created in the first section. For example, if no requests
have been received for a set period  of time, the inference server will self-destruct. The next time request is
received Fair will start the server again.

Another option is to just manually terminate the server using `fair node <node_id> kill <container_id>` command.
To get the container ID you can use `fair node <node_id> list` command. Check out the
[CLI documentation](/docs/docs/cli-interface/launching-jobs) for more information.
