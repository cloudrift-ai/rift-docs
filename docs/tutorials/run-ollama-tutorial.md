---
sidebar_position: 2
---

# LLM (and Vision) Inference with Ollama 

<div>
<img src={require("/static/img/llama.png").default} alt="Ollama"/>
</div>


In this tutorial, we will explore how to run LLM inference with Ollama using the Fair Compute platform.

## Pull and Run the Ollama Image

Once you have rented a GPU and connected to the Fair server, run the 
following Docker command to pull and start the Docker container for Ollama:

```bash
fair docker run -n ollama -p=11434 -d --rm ollama/ollama:latest
```

The fair docker run command will automatically select the executor (machine)
in your fair cluster and start the Ollama container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `fair cluster info`.

Here's what this command does:

1. `fair docker run`: Pulls the image and starts the container.
2. `-n ollama` (optional): Specifies the name for the container
allowing you to reference it by this name in other commands,
e.g. `fair docker exec` used below to interact with the container.
3. `-p 11434`: Maps port 11434 on your server to port 11434 on the container, allowing users to access Ollama.
4. `-d` (optional): Runs the container in the background.
5. `--rm` (optional): Removes the container when it stops .
6. `ollama/ollama` : Specifies the Docker image to be run.

After running this command, you'll see output similar to the following:

```bash
$ fair docker -x de442328-6612-11ef-899d-c35ace334926 run -n ollama -p=11434 -d --rm ollama/ollama:latest
Pulling image 'ollama/ollama:latest'
[==================================================>]    884MB/884MBBB
8474598f5e0997bb5634bdd2e910df9160c50dc2929a3759e4cd832a805ff69a
```

The last line of the output is the container ID, which you can use to reference the container in other commands
if you haven't specified the name for the container.

## Ensure Ollama is Up and Running

You can add the port number ahead of your GPU URL, and you will see 
"Ollama is running" on your system. You can also make a curl request
to ensure that the model is up and running using the following command:

:::info

**cURL** is not available on Windows by default. Instead, you can simply type in
the address in the browser window or install [Git BASH](https://gitforwindows.org/)
to have typical Linux command line tools available for you.

:::

```bash
curl {node-IP-address}:11434
```

Replace {node-IP-address} with the IP address received while renting the
Fair Compute GPU, or you can run the following command to get the IP address of the executor:

```shell
fair cluster info
```

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
