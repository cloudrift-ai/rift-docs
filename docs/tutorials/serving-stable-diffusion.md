---
sidebar_position: 2
---

# Serving Stable Diffusion

In this tutorial we will show how to deploy Stable Diffusion model
on HuggingFace and run inference on your computer using Fair. This way
you can leverage your GPU to run inference and avoid paying for expensive
cloud GPU instances.

## Preparing the Docker Image

For this tutorial we'll be using OctoAI tools to streamline
the process of creating a Docker image with our service.
Alternatively, https://replicate.com can be used to achieve
similar results.

A full tutorial can be found at their [website](https://docs.octoai.cloud/docs/containerize-your-code-with-our-cli)
and the code for this example can be found at https://github.com/faircompute/diffusion-octo.

Here is a short explanation of the workflow:
1. Install [OctoAI Tool and Python SDK](https://docs.octoai.cloud/docs/installation-links).
2. Run `octoai init` in the project directory and follow prompts. The tool will create several
   files in the directory.
3. The [octoai.yaml](https://github.com/faircompute/diffusion-octo/blob/main/octoai.yaml)
   instructs OctoML on how to deploy the model on OctoAI. Since we're going
   to deploy the model on Fair cluster, the contents of this file is mostly irrelevant.
   The relevant parts are the `host, path` and `tag` options as they define the name
   of the Docker image. You will likely want to change these to fit your naming conventions.
   ```yaml
   endpoint_config:
     name: diffusion-octo
     hardware: gpu.a10g.medium
     registry:
       host: faircompute     #  <-- change this
       path: diffusion-octo  #  <-- change this
       tag: latest
   ```
4. The [requirements.txt](https://github.com/faircompute/diffusion-octo/blob/main/requirements.txt)
   containing relevant Python requirements for our project. For Stable Diffusion
   we need PyTorch, Transformers, HuggingFace libraries, etc.
   ```
   # need PyTorch 2.0.1 with CUDA 11.8 to get best performance, default is CUDA 11.6
   torch @ https://download.pytorch.org/whl/cu118/torch-2.0.1%2Bcu118-cp310-cp310-linux_x86_64.whl
   accelerate==0.20.3
   diffusers==0.17.1
   huggingface==0.0.1
   transformers==4.30.2
   ```
5. The [service.py](https://github.com/faircompute/diffusion-octo/blob/main/service.py) file contains
   the definition of our service. Here we instruct OctoAI on how to load our model and how to perform
   the inference:
   ```python
   def setup(self):
       """Load the model into memory to make running multiple predictions efficient"""
       start_time = time.time()
       print(f'Model loaded in {(time.time() - start_time) * 1000:.2f}ms')
       DiffusionPipeline.download("runwayml/stable-diffusion-v1-5",
                                  torch_dtype=torch.float16, revision="fp16")
       self.pipe = DiffusionPipeline.from_pretrained("runwayml/stable-diffusion-v1-5",
                                                     torch_dtype=torch.float16, revision="fp16")
       if torch.cuda.is_available():
           self.pipe = self.pipe.to('cuda')
           cuda_capability = torch.cuda.get_device_capability(device=None)

   def infer(self, prompt: Text) -> Image:
       """Run a single prediction on the model"""
       prompt = prompt.text
       print("Prompt:", prompt)
       print(f"Running on '{torch.cuda.get_device_name()}'")
       start_time = time.time()
       image = self.pipe(prompt, num_inference_steps=30).images[0]
       print(f"Inference done in {(time.time() - start_time) * 1000:.2f}ms")
       return Image.from_pil(image)   
   ```

Now we can build this image using `octoai build --setup` command.
It will build the Docker image with name as specified in `octoai.yaml` file.
The `--setup` flag indicates that we want to run `setup` function during the build.
This ensures that model weights are downloaded during the build and saved in the container
image. This way the container will start much faster.

If you're running this image on a machine with GPU and Docker installed you can run it.
It will spin up a service available under port `8080` locally that will accept requests
for image generation and will respond with generated images.
```shell
docker run -it --rm --gpus all -p 8080:8080 faircompute/diffusion-octo:latest
```

To test the service you can invoke the provided test - [test_request.py](https://github.com/faircompute/diffusion-octo/blob/main/test_request.py)
```shell
python3 test_request.py | jq -r ".output.image_b64" | base64 --decode > result.jpg
```

The image will be saved under `result.png`

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
Note that you can host everything completely at Fair. However, it might
be convenient to use HuggingFace to make your work more discoverable.
Also, it is possible to make the system more available. For example,
you can leverage Fair and your computer when it is available and
use slow CPU inference on HuggingFace when your computer is busy.

You can use the FairCompute [demo space](https://huggingface.co/spaces/faircompute/stable-diffusion-v1-5/blob/main/app.py)
as a starting point. No code modifications are needed to the space,
except that we need to modify the `infer` function to send requests
to Fair which we will discuss in the next section.

## Communicating with Fair Compute

Let's take a look at the `text_to_image` function in the
[text_to_image.py](https://huggingface.co/spaces/faircompute/stable-diffusion-v1-5/blob/main/text_to_image.py).
This function is responsible for sending prompts to Fair and retrieving generated images.

However, first we need to start the Fair server, so the function first checks whether
stable diffusion server is running and if not - starts it.

```python
def text_to_image(text):
    try:
        wait_for_server(retries=1, timeout=1.0, delay=0.0)
    except ServerNotReadyException:
        start_server()

    client = EndpointClient()
    return client.infer(text)
```

To start the server we will be using Fair Python API. You can install it via `pip install faircompute`.

Here is the code for starting the server:
```python
SERVER_ADDRESS = "https://faircompute.com:8000"
TARGET_NODE = "use 'fair cluster info' command to get the node id"
DOCKER_IMAGE = "faircompute/diffusion-octo:v1"

def start_server():
    client = FairClient(server_address=SERVER_ADDRESS,
                        user_email=os.getenv('FAIRCOMPUTE_EMAIL', "debug-usr"),
                        user_password=os.environ.get('FAIRCOMPUTE_PASSWORD', "debug-pwd"))

    client.run(node=TARGET_NODE,
               image=DOCKER_IMAGE,
               ports=[(5000, 8080)],
               detach=True)

    # wait until the server is ready
    wait_for_server(retries=10, timeout=1.0)
```

It consists of three steps:
1. Create a Fair client object. It will be used to communicate with the server. The `SERVER_ADDRESS` is usually
   just `https://faircompute.com:8000`. The user email and password are the ones you've created when registering
   on Fair. On HuggingFace you can use configure secret environment variables in the space settings to store them.
2. Run the server. The `node` argument specifies the node on which the server will be running. If you have only
   one node in the cluster - you can omit this argument. Otherwise, you can use `fair cluster info` command to
   retrieve the node ID you wish to use. The `DOCKER_IMAGE` is the name of the Docker image we've created in the
   previous section. The `ports` argument specifies the port mapping from the container to the host. We will be
   using port 5000 to communicate to the container, while the container will be listening on port 8080.
   The `detach` argument indicates that we want to run the server in the background and don't want to block
3. Finally, we just wait some time for server to start. It can take a bit to bootstrap the container and start
   the server. Note that if the container image is not downloaded on the target node - it can take more time
   depending on the internet connection speed.

## Communicating with Stable Diffusion Endpoint

:::info

At the moment your PC need to be publicly accessible from the internet to be able to receive requests from HuggingFace.
We're working on a solution that will allow you to run inference on your PC without exposing it to the internet.
For now though, you need to have a public IP address and configure your router to forward port `5000` to your PC.

:::


Finally, we're ready to take a look at the code for communicating with the stable diffusion endpoint.
First we need to wait until the server is ready. We will simply be sending requests to the root endpoint
until it responds with 200 status code. If it doesn't respond after several retries - we will raise an exception.

```python
ENDPOINT_ADDRESS = "http://<your PC public IP>:5000"

class ServerNotReadyException(Exception):
    pass

def wait_for_server(retries, timeout, delay=1.0):
    for i in range(retries):
        try:
            r = requests.get(ENDPOINT_ADDRESS, timeout=timeout)
            r.raise_for_status()
            return
        except (requests.exceptions.ConnectionError, requests.exceptions.HTTPError, requests.exceptions.Timeout) as e:
            if i == retries - 1:
                raise ServerNotReadyException("Failed to start the server") from e
            else:
                logger.info("Server is not ready yet")
                time.sleep(delay)
```

Now we're ready to make inference request to the OctoAI stable diffusion inference endpoint
that we've created in the first section. The code sends a request to the endpoint and retrieves
the generated image  encoded in base64 format. Then it decodes the image and returns it as a PIL image.

```python
from octoai.client import Client as OctoAiClient

ENDPOINT_ADDRESS = "http://<your PC public IP>:5000"

class EndpointClient:
    def infer(self, prompt):
        client = OctoAiClient()

        inputs = {"prompt": {"text": prompt}}
        response = client.infer(endpoint_url=f"{ENDPOINT_ADDRESS}/infer", inputs=inputs)

        image_b64 = response["output"]["image_b64"]
        image_data = base64.b64decode(image_b64)
        image_data = BytesIO(image_data)
        image = Image.open(image_data)

        return image
```

That's it. Now you can use your hardware to run inference and avoid paying for expensive cloud GPU instances.

## Terminating the Server

For simplicity, we've omitted the code for terminating the server. If you want to do so, better to incorporate
that logic in the inference endpoint itself that we've created in the first section. For example, if no requests
have been received for a set period  of time, the inference server will self-destruct. The next time request is
received Fair will start the server again.

Another option is to just manually terminate the server using `fair node <node_id> kill <container_id>` command.
To get the container ID you can use `fair node <node_id> list` command. Check out the
[CLI documentation](/docs/docs/cli-interface/communicating-with-nodes) for more information.
