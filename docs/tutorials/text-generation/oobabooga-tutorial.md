---
sidebar_position: 1
---

# Oobabooga LLM WebUI

![oobabooga](/img/oobabooga.webp)

In this tutorial, we will explore how to run Oobabooga LLM WebUI using the Fair Compute platform.

## Start Oobabooga LLM WebUI

We will be using [Atinoda/text-generation-webui-docker](https://github.com/Atinoda/text-generation-webui-docker) Docker image
for this tutorial. Once you have rented a GPU and connected to the Fair server, run the
following Docker command to pull and start the Oobabooga container.

```bash
fair docker run -n oobabooga -p 7860 -it --rm -e EXTRA_LAUNCH_ARGS="--listen --verbose" atinoda/text-generation-webui:default-nvidia
```

The fair docker run command will automatically select the executor (machine)
in your fair cluster and start the Oobabooga container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `fair cluster info`.

Here's what this command does:

1. `fair docker run`: Pulls the image and starts the container.
2. `-n oobabooga` (optional): Specifies the name for the container
allowing you to reference it by this name in other commands.
3. `-p 7860`: Maps port 7860 on your server to port 7860 on the container, allowing you to access Oobabooga.
4. `-it`: Runs the container in interactive mode with a pseudo-TTY, ensuring that container is not
stopped while you keep the terminal open (note that it will stop if you close the terminal).
5. `--rm` (optional): Removes the container when it stops to save space.
6. `-e EXTRA_LAUNCH_ARGS="--listen --verbose"`: Passes environment variables to the container to enable listening and verbose mode.
7. `atinoda/text-generation-webui:default-nvidia` : Specifies the Docker image to be run.

After running this command, you'll see output similar to the following:

```bash
$ fair docker run -it --rm -e EXTRA_LAUNCH_ARGS="--listen --verbose" --gpus all -p 7860:7860 atinoda/text-generation-webui:default-nvidia
=== Running text-generation-webui variant: 'Nvidia Extended' v1.14 ===
=== (This version is 4 commits behind origin main) ===
=== Image build date: 2024-08-20 21:23:03 ===
18:33:19-894366 INFO     Starting Text generation web UI                                                                                                                                                                        
18:33:19-898214 WARNING                                                                                                                                                                                                         
                         You are potentially exposing the web UI to the entire internet without any access password.                                                                                                            
                         You can create one with the "--gradio-auth" flag like this:                                                                                                                                            
                                                                                                                                                                                                                                
                         --gradio-auth username:password                                                                                                                                                                        
                                                                                                                                                                                                                                
                         Make sure to replace username:password with your own.                                                                                                                                                  

Running on local URL:  http://0.0.0.0:7860
```

## Open Oobabooga LLM WebUI

Open the browser and type in `http://{node-IP-address}:7860` URL. Replace {node-IP-address} with the IP address received while renting the
Fair Compute GPU, or run `fair cluster info` to get the IP address of the executor.

## Download and Select Model

In this tutorial we will be using the `microsoft/Phi-3.5-mini-instruct` model. Note that you can use most of the
[Hugging Face Text Generation Models](https://huggingface.co/models?pipeline_tag=text-generation&sort=trending)
with the Oobabooga LLM WebUI. Just copy the model name and paste it in the model name field.

![huggingface phi](/img/huggingface-phi.png)

Navigate to the model tab and download the desired model by pasting its name in the model name field and clicking
the download button.

![download model](/img/oobabooga-download-model.png)

Then hit the refresh button near model selection, select the downloaded model and click "Load".

![select model](/img/oobabooga-select-model.png)

## Generate Text

Once the model is loaded, navigate to the "Chat" tab and start generating text.

![chat tab](/img/oobabooga-chat.png)
