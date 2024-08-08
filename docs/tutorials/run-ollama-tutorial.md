---
sidebar_position: 2
---

# Run Ollama locally 

<div>
<img src={require("/static/img/llama.png").default} alt="Ollama"/>
</div>


In this tutorial, we will see how to run Ollama using the Fair Compute platform.

## Pull and Run the Ollama Image
Once you have rented a GPU and connected to the Fair server, run the 
following Docker command to pull and start the Docker container for Ollama:

```bash
fair docker run -d\      
  --name ollama \
  -p 11434:11434 \
  ollama/ollama:latest

```

The fair docker run command will automatically select the rented machine 
available without the need to specify the specific machine ID.

Here's what this command does:

fair docker run: Pulls the image and starts the container.
--name ollama: Specifies the name for the container.
-p 11434:11434: Maps port 11434 on your server to port 11434 on the container, 
allowing you to access Ollama.
ollama/ollama
: Specifies the Docker image to be run.
After running this command, you'll see output similar to the following:

```bash
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICVVUCIu1WHLAWRDazpJrpnKg4G3IQPzrockSXpegDHH
```

## Ensure Ollama is Up and Running
You can add the port number ahead of your GPU URL, and you will see 
"Ollama is running" on your system. You can also make a curl request
to ensure that the model is up and running using the following command:

```bash
curl {node-IP-address}:11434
```

Replace {node-IP-address} with the IP address received while renting the
Fair Compute GPU, or you can run the following command to get the IP address
 of the machine:

```shell
fair cluster info
```

Run Inferences with LLMs Using Ollama Container
To interact with LLMs using the running Fair Docker container for Ollama, 
run the following command:

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

## Pull the model using the following command:

```shell
curl <node-IP-address>:11434/api/pull -d '{ 
  "name": "llama3"
}'
```

Interact with the Model Using API Calls
Run the following command, specifying the name of the model pulled and the prompt for the model to generate a response:

```shell
curl <node-IP-address>:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Explain large language models"
}'  
```

That's it! Now you can run Ollama locally and avoid paying for expensive cloud GPU instances using the Fair Compute platform.

