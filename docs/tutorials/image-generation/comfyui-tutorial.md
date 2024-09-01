---
sidebar_position: 3
---

# ComfyUI with DreamShaper and FLUX.1

Run ComfyUI on a GPU-enabled machine managed by Fair Compute and learn how to:
- Start a container with ComfyUI.
- Download DreamShaper-V8 or FLUX.1 checkpoints
- Generate images using Comfy web UI.

<div>
    <div style={{ "justify-content": "center", "width": "100%", "text-align": "center" }}>
        <table style={{ "border-collapse": "collapse" }} >
            <tr style={{ "border": "none" }}>
                <td style={{ "border": "none" }}><img src={require("/static/img/dreamshaper-girl-knight.png").default} alt="Girl Knight"/></td>
                <td style={{ "border": "none" }}><img src={require("/static/img/dreamshaper-mecha.png").default} alt="Mecha"/></td>
            </tr>
            <tr style={{ "border": "none" }}>
                <td colspan="2" style={{ "border": "none" }}>Images generated using the DreamShaper V&infin; model from <a href="https://civitai.com/models/4384/dreamshaper">Civitai</a>.</td>
            </tr>
        </table>
    </div>
</div>

## Pull and Run the ComfyUI Image

Once you have rented a GPU and connected to the Fair server, run the 
following Docker command to pull and start the Docker container for ComfyUI:

```bash
fair docker run --name comfyui -p 8188 -e WEB_ENABLE_AUTH=false -d ghcr.io/ai-dock/comfyui:latest-cuda
```

The fair docker run command will automatically select the executor (machine)
in your fair cluster and start the ComfyUI container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `fair cluster info`.

Here's what this command does:

1. `fair docker run`: Pulls the Docker image and starts the container.
2. `--name comfyui` (optional): Specifies the name for the container
allowing you to reference it by this name in other commands,
e.g. `fair docker exec` used below to download the checkpoint.
3. `-p 8188`: Maps port 8188 on your server to port 8188 on the container, allowing you to access Comfy web UI.
4. `-e WEB_ENABLE_AUTH=false`: Passes `WEB_ENABLE_AUTH` environment variable to the container
to disable authentication for the web UI. See available environment variables [here](https://github.com/ai-dock/comfyui).
5. `-d` (optional): Runs the container in the background. If you omit this flag, the container will stop once you close the terminal.
6. `--rm` (optional): Removes the container when it stops. This is useful when you need to start the container multiple times.
If you don't specify it, you'll need to invoke `fair docker rm <container-id>` to remove the container manually. However, if the
container is removed, you'll lose all the data stored in it and will need to download the checkpoint again.
7. `ghcr.io/ai-dock/comfyui:latest-cuda` : Specifies the Docker image to be run.

After running this command, you'll see that the image being pulled and the container started, printing the container ID.
If the image is already downloaded, it will start the container right away.
```bash
$ fair docker run --name comfyui -p 8188 -e WEB_ENABLE_AUTH=false -d --rm ghcr.io/ai-dock/comfyui:latest-cuda
Pulling image 'ai-dock/comfyui:latest-cuda'
[==================================================>]  221.3MB/221.3MB
37803ae894d97163f9efd7c59182db05b191af212db929ba7079e4e83c980e08
```

The last line of the output is the container ID, which you can use to reference the container in other commands
if you haven't specified the name for the container.

## Ensure ComfyUI is Up and Running

To confirm that the container is running, you can run `fair docker ps` command. It will show you the list of running containers:
```bash
$ fair docker ps
 EXECUTOR                              CONTAINER ID  IMAGE                                COMMAND  CREATED              STATUS   NAMES 
 0b94918a-67b4-11ef-899d-77923e9a9038  37803ae894d9  ghcr.io/ai-dock/comfyui:latest-cuda  init.sh  2024-08-31 17:39:29  Running  /comfyui
```

Open the browser and type in `http://{node-IP-address}:8188` URL. Replace {node-IP-address} with the IP address received while renting the
Fair Compute GPU, or run `fair cluster info` to get the IP address of the executor. The output should look like this:
```bash
fair cluster info
```

## Download Checkpoint

A lot of checkpoints are available at [Civit.ai](https://civit.ai/). In this tutorial we will be using the
[DreamShaper-V8](https://civitai.com/models/4384/dreamshaper) checkpoint.

To download the checkpoint:
1. Connect to the container using `fair docker exec -it comfyui bash` command:
2. Run `cd /opt/ComfyUI/models/checkpoints/` to navigate to the checkpoints directory.
3. Run `wget https://civitai.com/api/download/models/128713 --content-disposition` command to download the checkpoint.

Here is the example of running the aforementioned command:
```
$ fair docker -x 0b94918a-67b4-11ef-899d-77923e9a9038 exec -it comfyui bash
(comfyui) root@957ce9414eea:/opt# cd /opt/ComfyUI/models/checkpoints
(comfyui) root@957ce9414eea:/opt/ComfyUI/models/checkpoints# wget https://civitai.com/api/download/models/128713 --content-disposition
Resolving civitai.com (civitai.com)... 172.67.12.143, 104.22.18.237, 104.22.19.237, ...
...
dreamshaper_8.safet 100%[===================>]   1.99G  12.1MB/s    in 60s     
...
2024-08-31 17:54:55 (33.9 MB/s) - ‘dreamshaper_8.safetensors’ saved [2132625894/2132625894]
```

## Start Using ComfyUI

Open the browser and type in `http://{node-IP-address}:8188` URL. Replace {node-IP-address} with the IP address of the
executor that you can get by running `fair cluster info` command.

You should see the ComfyUI web interface. Click "Queue Prompt" to generate images using the DreamShaper checkpoint.

<div>
<img src={require("/static/img/comfyui-screenshot.png").default} alt="ComfyUI"/>
</div>

## Generate with FLUX.1

You can download FLUX.1 checkpoint from the [Comfy Flux Checkpoint Page](https://huggingface.co/Comfy-Org/flux1-schnell/blob/main/flux1-schnell-fp8.safetensors).
Right-click on the download button and select "Copy link". Then use the `wget` command to download the checkpoint to the container.
```
$ fair docker exec -it comfyui bash
(comfyui) root@957ce9414eea:/opt# cd /opt/ComfyUI/models/checkpoints
(comfyui) root@957ce9414eea:/opt/ComfyUI/models/checkpoints# wget https://huggingface.co/Comfy-Org/flux1-schnell/resolve/main/flux1-schnell-fp8.safetensors
```

Refresh the ComfyUI web interface. You should see the FLUX.1 checkpoint available in the "ckpt_name" field of the
"Load Checkpoint" module. Select the FLUX.1 checkpoint.

To get better results set `cfg=1.0`.

Hit "Queue Prompt" to generate image - it should take around 4 seconds on `RTX 4090`.

**Don't forget to stop the executor once you're done using it to avoid unnecessary charges.**
