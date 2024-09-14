---
sidebar_position: 1
---

# Ollama and Open WebUI

Run [Ollama](https://ollama.com/) LLM server and leverage [Open WebUI](https://github.com/open-webui/open-webui) to interact with the model.

Open WebUI is an extensible, feature-rich, and user-friendly self-hosted WebUI designed to operate
entirely offline. It supports various LLM runners, including Ollama and OpenAI-compatible APIs.

![llama](/img/llama.png)

## Pull and Run the Ollama Image

Once you have rented a GPU (rent at [https://neuralrack.ai](https://neuralrack.ai)) and connected to the Fair server, run the 
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
curl {ollama-IP-address}:11434/api/pull -d '{ 
  "name": "llama3"
}'
```

Run the following command, specifying the name of the model pulled and the prompt for the model to generate a response:

```shell
curl {ollama-IP-address}:11434/api/generate -d '{
  "model": "llama3",
  "prompt": "Explain large language models"
}'
```

To disable streaming output and get the full response, add the `stream` parameter:

```shell
curl {ollama-IP-address}:11434/api/generate -d '{
  "model": "llama3",
  "stream": false,
  "prompt": "Explain large language models"
}'
```

The output will look like follows:
```json
{"model":"llama3","created_at":"2024-09-11T01:09:02.398526148Z","response":"Large Language Models (LLMs) are a type of artificial intelligence (AI) technology that has revolutionized the field of natural language processing (NLP). In this explanation, I'll cover what LLMs are, how they work, and their applications.\n\n**What are Large Language Models?**\n\nA Large Language Model is a neural network-based AI model that is trained on vast amounts of text data to generate human-like language understanding. These models are designed to process and analyze natural language input, such as text or speech, to perform tasks like:\n\n1. Text classification\n2. Sentiment analysis\n3. Question answering\n4. Language translation\n5. Text generation\n\nLLMs are typically trained on massive datasets of text data, often comprising billions of words, to learn patterns, relationships, and nuances of language.\n\n**How do Large Language Models work?**\n\nThe core idea behind LLMs is the concept of self-supervised learning, where a model learns from its own mistakes. Here's a simplified overview of how LLMs work:\n\n1. **Data preparation**: A large corpus of text data is prepared and formatted for training.\n2. **Model architecture**: The model consists of multiple layers, including an encoder (transformer) and a decoder. The transformer layer processes the input text, while the decoder generates output based on the encoded representation.\n3. **Training**: The model is trained on the prepared dataset using various techniques, such as masked language modeling, next sentence prediction, and sentence ordering.\n4. **Self-supervised learning**: During training, the model predicts its own outputs (masked words or next sentences) to learn from its mistakes. This process helps the model develop a deep understanding of language patterns.\n5. **Fine-tuning**: The trained model can be fine-tuned for specific tasks by adjusting the model architecture and retraining it on relevant datasets.\n\n**Applications of Large Language Models**\n\nThe impact of LLMs has been significant, with applications across various industries:\n\n1. **Conversational AI**: LLMs power chatbots, virtual assistants, and customer service platforms.\n2. **Natural Language Processing (NLP)**: LLMs enable NLP tasks like text classification, sentiment analysis, and named entity recognition.\n3. **Language Translation**: LLMs can translate languages with high accuracy, enabling global communication and commerce.\n4. **Text Generation**: LLMs generate text for various purposes, such as content creation, email summarization, or chatbot responses.\n5. **Research and Education**: LLMs facilitate research in areas like linguistics, cognitive science, and human-computer interaction.\n\n**Key Characteristics of Large Language Models**\n\n1. **Scale**: Trained on massive datasets (often billions of words).\n2. **Contextual understanding**: Models learn to understand language context and nuances.\n3. **Self-supervised learning**: Models learn from their own mistakes during training.\n4. **Flexibility**: LLMs can be fine-tuned for specific tasks or domains.\n\nIn summary, Large Language Models are powerful AI tools that have revolutionized natural language processing. By understanding how they work and their applications, we can better harness the potential of these models to drive innovation and improve human-computer interaction.","done":true,"done_reason":"stop","context":[128006,882,128007,271,849,21435,3544,4221,4211,128009,128006,78191,128007,271,35353,11688,27972,320,4178,22365,8,527,264,955,315,21075,11478,320,15836,8,5557,430,706,14110,1534,279,2115,315,5933,4221,8863,320,45,12852,570,763,420,16540,11,358,3358,3504,1148,445,11237,82,527,11,1268,814,990,11,323,872,8522,382,334,3923,527,20902,11688,27972,30,57277,32,20902,11688,5008,374,264,30828,4009,6108,15592,1646,430,374,16572,389,13057,15055,315,1495,828,311,7068,3823,12970,4221,8830,13,4314,4211,527,6319,311,1920,323,24564,5933,4221,1988,11,1778,439,1495,477,8982,11,311,2804,9256,1093,1473,16,13,2991,24790,198,17,13,24248,3904,6492,198,18,13,16225,36864,198,19,13,11688,14807,198,20,13,2991,9659,271,4178,22365,527,11383,16572,389,11191,30525,315,1495,828,11,3629,46338,33151,315,4339,11,311,4048,12912,11,12135,11,323,84889,315,4221,382,334,4438,656,20902,11688,27972,990,30,57277,791,6332,4623,4920,445,11237,82,374,279,7434,315,659,59615,79090,6975,11,1405,264,1646,47310,505,1202,1866,21294,13,5810,596,264,44899,24131,315,1268,445,11237,82,990,1473,16,13,3146,1061,18459,96618,362,3544,43194,315,1495,828,374,10235,323,24001,369,4967,627,17,13,3146,1747,18112,96618,578,1646,17610,315,5361,13931,11,2737,459,24592,320,4806,261,8,323,264,25569,13,578,43678,6324,11618,279,1988,1495,11,1418,279,25569,27983,2612,3196,389,279,21136,13340,627,18,13,3146,38030,96618,578,1646,374,16572,389,279,10235,10550,1701,5370,12823,11,1778,439,43248,4221,34579,11,1828,11914,20212,11,323,11914,22106,627,19,13,3146,12363,59615,79090,6975,96618,12220,4967,11,279,1646,56978,1202,1866,16674,320,82635,4339,477,1828,23719,8,311,4048,505,1202,21294,13,1115,1920,8779,279,1646,2274,264,5655,8830,315,4221,12912,627,20,13,3146,64816,2442,38302,96618,578,16572,1646,649,387,7060,2442,49983,369,3230,9256,555,43468,279,1646,18112,323,312,31754,433,389,9959,30525,382,334,51459,315,20902,11688,27972,57277,791,5536,315,445,11237,82,706,1027,5199,11,449,8522,4028,5370,19647,1473,16,13,3146,1128,3078,1697,15592,96618,445,11237,82,2410,6369,63005,11,4200,57619,11,323,6130,2532,15771,627,17,13,3146,55381,11688,29225,320,45,12852,33395,25,445,11237,82,7431,452,12852,9256,1093,1495,24790,11,27065,6492,11,323,7086,5502,18324,627,18,13,3146,14126,39141,96618,445,11237,82,649,15025,15823,449,1579,13708,11,28462,3728,10758,323,36754,627,19,13,3146,1199,24367,96618,445,11237,82,7068,1495,369,5370,10096,11,1778,439,2262,9886,11,2613,29385,2065,11,477,6369,6465,14847,627,20,13,3146,28528,323,11930,96618,445,11237,82,28696,3495,304,5789,1093,39603,5706,11,25702,8198,11,323,3823,11733,11533,16628,382,334,1622,85084,315,20902,11688,27972,57277,16,13,3146,7092,96618,1183,2692,389,11191,30525,320,61917,33151,315,4339,4390,17,13,3146,2014,940,8830,96618,27972,4048,311,3619,4221,2317,323,84889,627,18,13,3146,12363,59615,79090,6975,96618,27972,4048,505,872,1866,21294,2391,4967,627,19,13,3146,32771,3225,96618,445,11237,82,649,387,7060,2442,49983,369,3230,9256,477,31576,382,644,12399,11,20902,11688,27972,527,8147,15592,7526,430,617,14110,1534,5933,4221,8863,13,3296,8830,1268,814,990,323,872,8522,11,584,649,2731,33508,279,4754,315,1521,4211,311,6678,19297,323,7417,3823,11733,11533,16628,13],"total_duration":15825905319,"load_duration":2728497135,"prompt_eval_count":15,"prompt_eval_duration":49362000,"eval_count":656,"eval_duration":13046275000}
```

## Large Language Models with Vision Capabilities

Note that Ollama also supports large language models with vision capabilities.
Here is the steps you need to do to analyze an image using LLaVA model.

Pull the LLaVA model:
```shell
fair docker exec ollama ollama pull llava
```

Encode the image. You can use the following command to encode the image in the terminal or use
one of the many online tools available to encode the image, like [this one](https://www.base64-image.de/).
Let's feed FairCompute logo to the model and see what it predicts:
```shell
openssl base64 -in ./static/img/fair-logo-64.png
```

The output will be a long incomprehensible string of characters. Copy this string and use it in the next command.
```shell noInline
iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBDsQgCLz7in2CAio8x267yf5gn7+j0qZtOokjMGREwvb7fsKrg5IEyVWLlRIBMTFqCDROtMEpyuABcQn5pR4OgVBi3DxTLd6/19NhMK+GKJ+M9O3CchXMXyC9GflD3CciBKsbmRsxTSG5QZvfisW0nr+wbPEKnSd04jq8D5N7LhXbWzOKTLRx4ghm1jkA9yOBGwIDdxkDc0Wc0dZZfRIs5GlPO8If5oNZKKGO6zAAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1PFr4qDHUQcMlQnC6KijlqFIlQItUKrDiaXfkGThiTFxVFwLTj4sVh1cHHW1cFVEAQ/QJwdnBRdpMT/JYUWMR4c9+PdvcfdO0ColZhmtY0Bmm6byXhMTGdWxY5XdKEHQBTTMrOMOUlKwHd83SPA17soz/I/9+foVbMWAwIi8SwzTJt4g3hq0zY47xOHWUFWic+JR026IPEj1xWP3zjnXRZ4ZthMJeeJw8RivoWVFmYFUyOeJI6omk75QtpjlfMWZ61UYY178heGsvrKMtdpDiGORSxBgggFFRRRgk19FaGTYiFJ+zEf/6Drl8ilkKsIRo4FlKFBdv3gf/C7Wys3Me4lhWJA+4vjfAwDHbtAveo438eOUz8Bgs/Ald70l2vAzCfp1aYWOQL6toGL66am7AGXO8DAkyGbsisFaQq5HPB+Rt+UAfpvge41r7fGPk4fgBR1lbgBDg6BkTxlr/u8u7O1t3/PNPr7AZ+3crl6L7CwAAAN+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjZlY2UwODE3LTcxZjEtNGU1Yy1iZjYxLWEyNDdjMDcyMTJmYiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MDZhYWEzNi1jZTBkLTRhNjgtYjZlOC1lYzVjNDljZjRjNWMiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMDc2ZjI5OC00MWQ2LTQ2NzYtYmUzOC04ZTBiYTY1YjUwODAiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0ODAiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI1MTIiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcyNjAxNjA0MDIxNTU4MSIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjM4IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNDowOToxMFQxNzo1Mzo1OC0wNzowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQ6MDk6MTBUMTc6NTM6NTgtMDc6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjE3ODRjOS0wZWI4LTQwMzMtYWQzOS1lMzA2ZTg2ZDliYWYiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA5LTEwVDE3OjU0OjAwLTA3OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmBuvScAAAAGYktHRADEAGcA4AhEyrkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCQsANgBlzkdKAAAMKklEQVR42u2beZRWdRnHP/d9Z5hhn0jGDfSaA+SSuBWKV4/lbi6HKMslTDMukZm5pKLQycRCTXPnhiuZNgJZEZYJYnoxBdFcYlE73lFkURBB1mFmbn/c79UfP+77zjvORid/53AO98593/t7nt/zfJ/vs7wO7bRCP+oKHAV8DRgMVAHrgDeAZ4A/AW96gdtIJy6nHQR3gP2BXwGHAV0yHmsC1gIP67k3vMBtKvKdFUC9F7jxdq2A0K9zID4auB/YuYSPxMB7wB1AALxnWkTo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
````

Replace the content of "images" field with the encoded image string and run the following command to analyze the image.
Change the {ollama-IP-address} to address of the machine where Ollama is running like in the previous examples:
```shell
curl http://{ollama-IP-address}:11434/api/generate -d '{
  "model": "llava",
  "prompt": "What is in this picture?",
  "stream": false,
  "images": ["iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAxXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjabVBBDsQgCLz7in2CAio8x267yf5gn7+j0qZtOokjMGREwvb7fsKrg5IEyVWLlRIBMTFqCDROtMEpyuABcQn5pR4OgVBi3DxTLd6/19NhMK+GKJ+M9O3CchXMXyC9GflD3CciBKsbmRsxTSG5QZvfisW0nr+wbPEKnSd04jq8D5N7LhXbWzOKTLRx4ghm1jkA9yOBGwIDdxkDc0Wc0dZZfRIs5GlPO8If5oNZKKGO6zAAAAGEaUNDUElDQyBwcm9maWxlAAB4nH2RPUjDQBzFX1PFr4qDHUQcMlQnC6KijlqFIlQItUKrDiaXfkGThiTFxVFwLTj4sVh1cHHW1cFVEAQ/QJwdnBRdpMT/JYUWMR4c9+PdvcfdO0ColZhmtY0Bmm6byXhMTGdWxY5XdKEHQBTTMrOMOUlKwHd83SPA17soz/I/9+foVbMWAwIi8SwzTJt4g3hq0zY47xOHWUFWic+JR026IPEj1xWP3zjnXRZ4ZthMJeeJw8RivoWVFmYFUyOeJI6omk75QtpjlfMWZ61UYY178heGsvrKMtdpDiGORSxBgggFFRRRgk19FaGTYiFJ+zEf/6Drl8ilkKsIRo4FlKFBdv3gf/C7Wys3Me4lhWJA+4vjfAwDHbtAveo438eOUz8Bgs/Ald70l2vAzCfp1aYWOQL6toGL66am7AGXO8DAkyGbsisFaQq5HPB+Rt+UAfpvge41r7fGPk4fgBR1lbgBDg6BkTxlr/u8u7O1t3/PNPr7AZ+3crl6L7CwAAAN+mlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPgogPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4KICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iCiAgICB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIgogICAgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIgogICAgeG1sbnM6ZXhpZj0iaHR0cDovL25zLmFkb2JlLmNvbS9leGlmLzEuMC8iCiAgICB4bWxuczpHSU1QPSJodHRwOi8vd3d3LmdpbXAub3JnL3htcC8iCiAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyIKICAgIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIKICAgeG1wTU06RG9jdW1lbnRJRD0iZ2ltcDpkb2NpZDpnaW1wOjZlY2UwODE3LTcxZjEtNGU1Yy1iZjYxLWEyNDdjMDcyMTJmYiIKICAgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo5MDZhYWEzNi1jZTBkLTRhNjgtYjZlOC1lYzVjNDljZjRjNWMiCiAgIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDpmMDc2ZjI5OC00MWQ2LTQ2NzYtYmUzOC04ZTBiYTY1YjUwODAiCiAgIGRjOkZvcm1hdD0iaW1hZ2UvcG5nIgogICBleGlmOkNvbG9yU3BhY2U9IjEiCiAgIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0ODAiCiAgIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI1MTIiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IkxpbnV4IgogICBHSU1QOlRpbWVTdGFtcD0iMTcyNjAxNjA0MDIxNTU4MSIKICAgR0lNUDpWZXJzaW9uPSIyLjEwLjM4IgogICB0aWZmOk9yaWVudGF0aW9uPSIxIgogICB4bXA6Q3JlYXRvclRvb2w9IkdJTVAgMi4xMCIKICAgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyNDowOToxMFQxNzo1Mzo1OC0wNzowMCIKICAgeG1wOk1vZGlmeURhdGU9IjIwMjQ6MDk6MTBUMTc6NTM6NTgtMDc6MDAiPgogICA8eG1wTU06SGlzdG9yeT4KICAgIDxyZGY6U2VxPgogICAgIDxyZGY6bGkKICAgICAgc3RFdnQ6YWN0aW9uPSJzYXZlZCIKICAgICAgc3RFdnQ6Y2hhbmdlZD0iLyIKICAgICAgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo5MjE3ODRjOS0wZWI4LTQwMzMtYWQzOS1lMzA2ZTg2ZDliYWYiCiAgICAgIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkdpbXAgMi4xMCAoTGludXgpIgogICAgICBzdEV2dDp3aGVuPSIyMDI0LTA5LTEwVDE3OjU0OjAwLTA3OjAwIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/PmBuvScAAAAGYktHRADEAGcA4AhEyrkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfoCQsANgBlzkdKAAAMKklEQVR42u2beZRWdRnHP/d9Z5hhn0jGDfSaA+SSuBWKV4/lbi6HKMslTDMukZm5pKLQycRCTXPnhiuZNgJZEZYJYnoxBdFcYlE73lFkURBB1mFmbn/c79UfP+77zjvORid/53AO98593/t7nt/zfJ/vs7wO7bRCP+oKHAV8DRgMVAHrgDeAZ4A/AW96gdtIJy6nHQR3gP2BXwGHAV0yHmsC1gIP67k3vMBtKvKdFUC9F7jxdq2A0K9zID4auB/YuYSPxMB7wB1AALxnWkTo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"]
}'
```

The output will be similar to the following:
```json
{"model":"llava","created_at":"2024-09-11T00:59:07.184796178Z","response":" The image appears to be a stylized graphic or icon. It features what looks like a hexagon with several smaller shapes and lines inside it, suggesting some sort of complexity or network within the hexagonal frame. The overall appearance is abstract, and without additional context, it's difficult to determine its exact purpose or significance. ","done":true,"done_reason":"stop","context":[733,16289,28793,733,5422,28733,28734,28793,13,13,3195,349,297,456,5754,28804,733,28748,16289,28793,415,3469,8045,298,347,264,341,2951,1332,22693,442,9460,28723,661,4190,767,4674,737,264,19703,4959,395,2856,7000,17187,304,4715,3416,378,28725,20223,741,3127,302,17599,442,3681,2373,272,19703,16901,4108,28723,415,7544,9293,349,11576,28725,304,1671,4870,2758,28725,378,28742,28713,3796,298,7655,871,3459,6032,442,18309,28723,28705],"total_duration":2034093261,"load_duration":11254571,"prompt_eval_count":1,"prompt_eval_duration":807163000,"eval_count":68,"eval_duration":1172215000}
```

## Launch Open WebUI

[Open WebUI](https://openwebui.com/) is a browser-based interface that you can run locally that
allows you to interact with the model. To start a WebUI server, run the following command:

```shell
fair docker run -it -p 8080 -e OLLAMA_BASE_URL=http://ollama:11434 --name open-webui --rm ghcr.io/open-webui/open-webui:main
```

Here's what this command does:

- `fair docker run`: Pulls the image and starts the container,
e.g. `fair docker exec` used below to interact with the container.
- `-p 8080`: Maps port 8080 on your server to port 8080 on the container, allowing users to access Open WebUI.
- `-it`: Runs the container in interactive mode with a pseudo-TTY, ensuring that container is not
stopped while you keep the terminal open (note that it will stop if you close the terminal).
- `-e OLLAMA_BASE_URL=http://ollama:11434`: Pass `OLLAMA_BASE_URL` environment variable to the container
to specify the base URL for the Ollama server. The reason why we use http://ollama:11434 is that
we've started ollama in the container named `ollama` and are using the port `11434`. We start all the
containers on the same network by default, so they can find each other by name.
- `--name open-webui` (optional): Specifies the name for the container
 allowing you to reference it by this name in other commands.
- `--rm` (optional): Removes the container when it stops. This is useful when you need to start the container multiple times.
If you don't specify it, you'll need to invoke `fair docker rm <container-id>` to remove the container manually. However, if the
container is removed, you'll lose all the data stored in it and will need to download the checkpoint again.
- `ghcr.io/open-webui/open-webui:main` : Specifies the Docker image to be run.

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