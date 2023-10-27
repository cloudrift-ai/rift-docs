---
sidebar_position: 2
---

# Serving Stable Diffusion

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

## Sending Requests from HuggingFace to Fair