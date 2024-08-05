---
sidebar_position: 2
---

# Run Ollama locally 

<div>
<img src={require("/static/img/llama.png").default} alt="Ollama"/>
</div>


In this tutorial we will see how to run OLLama
using Fair Compute platform

## Pull and run the OLlama Image

Once you have rented a gpu and connected to the fair server, 
run the following Docker command to pull and start the docker 
container for ollama. 

```bash
fair docker run -d \      
  --name ollama \
  -p 11434:11434 \
  -v ollama_volume:/root/.ollama \
  ollama/ollama:latest

```

The fair docker command will automatically select the rented machine available
without the need to specify the specific machine ID.

Here's what this command does:
1. fair docker run: Pulls image and starts the container.
2. --name ollama : Specifies the name for the image.
3. -p 11434:11434: Maps port 11434 on your server to port 11434 on the container,
allowing you to access the Ollama.
4. -v ollama_volume:/root/.ollama : Specify the path of directory for downloading 
all the related files needed to run ollama. 
5. ollama/ollama:latest : Specifies the docker image to be run.

After running this command, you'll see output similar to the following:

```bash
# b3501dc206e22f10e69e3c597d7a912423aa84dc665c0fc749b9c5a40c32632b
```

## Ensure Ollama is up and running

You can add the port number ahead of your GPU URL and you will see
"Ollama is running" on your system. You can also make a curl request 
to make sure that the model is up and running using the following 
command :

```bash
curl <node-IP-address>/11434
```

Replace the node-IP-address with the IP address received while renting the
Fair Compute GPU or you can also run the following command to get 
the IP address of the machine.

```shell
fair cluster info
```

## Run inferences with LLMs using Ollama container

To interact with LLM using the running fair docker container for 
ollama , run the following command :

```shell
fair docker exec -it ollama ollama run llama3
```

For this tutorial purpose, we are running LLama-3 by Meta AI, which
is one of the most powerful LLM in the open-source ML community.
You can also run inferences on any LLM from your choice supported
by the Ollama library. You can find the list of models supported by
Ollama [model hub](https://ollama.com/library).

After running the above command you will see output similar to the 
following :

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

That's it. Now you can use run Ollama locally and 
avoid paying for expensive cloud GPU instances using
Fair Compute Platform.