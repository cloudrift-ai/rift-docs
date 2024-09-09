---
sidebar_position: 1
---

# Ollama and Open WebUI

Run [Ollama](https://ollama.com/) LLM server and leverage [Open WebUI](https://github.com/open-webui/open-webui) to interact with the model.

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate
entirely offline. It supports various LLM runners, including Ollama and OpenAI-compatible APIs.

![llama](/img/llama.png)

## Pull and Run the Ollama Image

Once you have rented a GPU and connected to the Fair server, run the 
following Docker command to pull and start the Docker container for Ollama:

```bash
fair docker run -p 11434 -it --name ollama --rm ollama/ollama:latest
```

The fair docker run command will automatically select the executor (machine)
in your fair cluster and start the Ollama container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `fair cluster info`.

Here's what this command does:
- `fair docker run`: Pulls the image and starts the container.
- `-p 11434`: Maps port 11434 on your server to port 11434 on the container, allowing users to access Ollama.
- `-it`: Runs the container in interactive mode with a pseudo-TTY, ensuring that container is not
stopped while you keep the terminal open (note that it will stop if you close the terminal).
- `--name ollama` (optional): Specifies the name for the container
allowing you to reference it by this name in other commands,
- `--rm` (optional): Removes the container when it stops.
- `ollama/ollama:latest` : Specifies the Docker image to be run.

After running this command, you'll see output similar to the following. The important message is the message
about the server listening on port 11434 and the GPU information:

```bash
Pulling image 'ollama/ollama:latest'
[==================================================>]    884MB/884MBBB
... lots of log messages ...
... lots of log messages ...
time=2024-09-08T01:19:29.171Z level=INFO source=routes.go:1172 msg="Listening on [::]:11434 (version 0.3.9)"
... lots of log messages ...
time=2024-09-08T01:19:39.998Z level=INFO source=gpu.go:200 msg="looking for compatible GPUs"
time=2024-09-08T01:19:40.138Z level=INFO source=types.go:107 msg="inference compute" id=GPU-47f63bea-1fec-1313-ed56-15b956d0843b
... library=cuda variant=v12 compute=8.9 driver=12.4 name="NVIDIA GeForce RTX 4090" total="23.6 GiB" available="23.3 GiB"
```

The last line of the output is the container ID, which you can use to reference the container in other commands
if you haven't specified the name for the container.

:::caution

If you need to close the terminal window, but you want your container to keep running,
press Ctrl-P followed by Ctrl-Q. This will detach the terminal from the container.

If you press Ctrl-C or Ctrl-D, the container will stop. Also, you can specify `-d` flag
instead of `-it` to run the container in the background when launching it.

:::

## Ensure Ollama is Up and Running

To ensure that Ollama server is up and running make a curl request to the server:
```shell
curl {ollama-IP-address}:11434
```

Replace `{ollama-IP-address}` with the IP address received while renting the
machine. Additionally, you can type `http://{ollama-IP-address}:11434` in the browser window
if curl is not available on your machine. To find out the IP address of machines in your cluster
you can use the following command:

```shell
fair cluster info
```

Additionally, you can run the following command to check if the Ollama container is running:

```shell
fair docker ps
```

You should see an out similar to the following:
```shell
 EXECUTOR                              CONTAINER ID  IMAGE                 COMMAND            CREATED              STATUS   NAMES 
 6d8e900e-6e15-11ef-899d-cb8e9e11f3d2  8b5ef3802b5c  ollama/ollama:latest  /bin/ollama serve  2024-09-08 19:07:15  Running  /ollama 
```

:::tip

**cURL** is not available on Windows by default. You can install [Git BASH](https://gitforwindows.org/)
to have typical Linux command line tools available for you.

:::

## Chat with LLama

To interact with Ollama container run the following command:

```shell
fair docker exec -it ollama ollama run llama3
```

For this tutorial, we are running LLama-3 by Meta AI, one of the most powerful 
LLMs in the open-source ML community. You can also run inferences on any LLM of
your choice supported by the Ollama library. You can find the list of models 
supported by Ollama in the [model hub](https://ollama.com/library).

After running the above command, you will see output similar to the following:

```shell
pulling manifest 
pulling 2af3b81862c6... 100% ▕████████████████▏ 637 MB                         
pulling af0ddbdaaa26... 100% ▕████████████████▏   70 B                         
pulling c8472cd9daed... 100% ▕████████████████▏   31 B                         
pulling fa956ab37b8c... 100% ▕████████████████▏   98 B                         
pulling 6331358be52a... 100% ▕████████████████▏  483 B                         
verifying sha256 digest 
writing manifest 
removing any unused layers 
success 
>>> Send a message (/? for help)
```

Use API to Make Inferences with LLMs Using Ollama
You can also use API calls to pull and chat with the model. Here's how you do it:

## Run LLM Inference Using Ollama REST API

Ollama provides a comprehensive REST API to interact with the models.
You can find the API documentation [here](https://github.com/ollama/ollama/blob/main/docs/api.md).
Bindings for Python and other languages are also available through 3rdParty libraries.

To pull the model, run the following command:

```shell
curl <node-IP-address>:11434/api/pull -d '{ 
  "name": "llama3"
}'
```

Run the following command, specifying the name of the model pulled and the prompt for the model to generate a response:

```shell
curl <node-IP-address>:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Explain large language models"
}'  
```

## Large Language Models with Vision Capabilities

Note that Ollama also supports large language models with vision capabilities.
Check out [LLaVA](https://ollama.com/library/llava) for more information.

## Launch Open WebUI

[Open WebUI](https://openwebui.com/) is a browser-based interface that you can run locally that
allows you to interact with the model. To start a WebUI server, run the following command:

```shell
fair docker run -it -p 8080 -e OLLAMA_BASE_URL=http://ollama:11434 --name open-webui --rm ghcr.io/open-webui/open-webui:main
```

Here's what this command does:

1. `fair docker run`: Pulls the image and starts the container.
   e.g. `fair docker exec` used below to interact with the container.
2. `-p 8080`: Maps port 8080 on your server to port 8080 on the container, allowing users to access Open WebUI.
3. `-it`: Runs the container in interactive mode with a pseudo-TTY, ensuring that container is not
   stopped while you keep the terminal open (note that it will stop if you close the terminal).
4. `-e OLLAMA_BASE_URL=http://ollama:11434`: Pass `OLLAMA_BASE_URL` environment variable to the container
   to specify the base URL for the Ollama server. The reason why we use http://ollama:11434 is that
   we've started ollama in the container named `ollama` and are using the port `11434`. We start all the
   containers on the same network by default, so they can find each other by name.
5. `--name open-webui` (optional): Specifies the name for the container
   allowing you to reference it by this name in other commands.
5. `--rm` (optional): Removes the container when it stops.
6. `ghcr.io/open-webui/open-webui:main` : Specifies the Docker image to be run.

After running this command, you'll see output similar to the following:
```shell
... lots of log messages ...
... lots of log messages ...
  ___                    __        __   _     _   _ ___ 
 / _ \ _ __   ___ _ __   \ \      / /__| |__ | | | |_ _|
| | | | '_ \ / _ \ '_ \   \ \ /\ / / _ \ '_ \| | | || | 
| |_| | |_) |  __/ | | |   \ V  V /  __/ |_) | |_| || | 
 \___/| .__/ \___|_| |_|    \_/\_/ \___|_.__/ \___/|___|
      |_|                                               

      
v0.3.21 - building the best open-source AI user interface.

https://github.com/open-webui/open-webui

INFO:     Started server process [1]
INFO:     Waiting for application startup.
Running migrations
INFO  [alembic.runtime.migration] Context impl SQLiteImpl.
INFO  [alembic.runtime.migration] Will assume non-transactional DDL.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8080 (Press CTRL+C to quit)
INFO  [open_webui.apps.openai.main] get_all_models()
INFO  [open_webui.apps.ollama.main] get_all_models()
INFO:     98.42.0.120:45318 - "GET /ws/socket.io/?EIO=4&transport=polling&t=P7JslJn HTTP/1.1" 200 OK
```

Then you can open the browser and type in `http://{ollama-IP-address}:8080` URL.
Replace {node-IP-address} with the IP address of the executor. The Open WebUI
will ask you to log in or sign up. No need to worry, the Open WebUI is a local
server running on your machine, and you can sign up with any username and password.
This is needed to prevent unauthorized access to the WebUI.

After signing up, you will see the Open WebUI interface where you can chat with the model.

![open webui](/img/open-webui-chat.png)

## Download Models for WebUI

The models available in the Open WebUI are the same as the ones available in the Ollama library.
If you've followed the steps above, you should see the `llama3` model available in the Open WebUI.
If you want to download other models, you can do so by running the ollama pull command as follows:

```shell
fair docker exec -it ollama ollama pull <model-name>
```

List of supported models can be found [here](https://ollama.com/library).

Once the model is downloaded, refresh the Open WebUI page, and you should see the new model available for chat.

![why the sky is blue](/img/open-webui-why-the-sky-is-blue.png)