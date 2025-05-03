---
sidebar_position: 2
---

# Godot Game Server with Chat Bots

## Building a Game Server with Chat Bots in Godot

In this tutorial, we'll explore how to leverage GPU capabilities on a game server by integrating Ollama API for LLM communication.
We'll build upon this simple multiplayer game template: [Godot 3D Multiplayer Template](https://github.com/devmoreir4/godot-3d-multiplayer-template)

The complete source code is available in this repository: <https://github.com/6erun/godot-3d-chatbots>

![Chat Interface](/img/chat_demo.png)

### Understanding Ollama Integration

We'll use Ollama to handle communication with the Large Language Model. The API documentation is available at [Ollama API](https://github.com/ollama/ollama/blob/main/docs/api.md).
For our chat implementation, we only need the chat completion and model pull endpoints.

An Ollama chat request is a simple POST request with a JSON body. Here's an example:

```json
{
  "model": "llama3.2",
  "messages": [
    {
      "role": "user",
      "content": "why is the sky blue?"
    }
  ],
  "stream": false
}
```

The response is also a JSON object with the following fields:

```json
{
  "model": "llama3.2",
  "created_at": "2023-12-12T14:13:43.416799Z",
  "message": {
    "role": "assistant",
    "content": "Hello! How are you today?"
  },
  "done": true,
  "total_duration": 5191566416,
  "load_duration": 2154458,
  "prompt_eval_count": 26,
  "prompt_eval_duration": 383809000,
  "eval_count": 298,
  "eval_duration": 4799921000
}
```

We can also provide a list of tools to use in the chat. Tools are defined as a list of dictionaries with name and description fields. For example:

```json
{
  "model": "llama3.2",
  "messages": [
    {
      "role": "user",
      "content": "What is the weather today in Paris?"
    }
  ],
  "stream": false,
  "tools": [
    {
      "type": "function",
      "function": {
        "name": "get_current_weather",
        "description": "Get the current weather for a location",
        "parameters": {
          "type": "object",
          "properties": {
            "location": {
              "type": "string",
              "description": "The location to get the weather for, e.g. San Francisco, CA"
            },
            "format": {
              "type": "string",
              "description": "The format to return the weather in, e.g. 'celsius' or 'fahrenheit'",
              "enum": ["celsius", "fahrenheit"]
            }
          },
          "required": ["location", "format"]
        }
      }
    }
  ]
}
```

If the model wants to use a given function, it will return a message with a function call:

```json
{
  "model": "llama3.2",
  "created_at": "2024-07-22T20:33:28.123648Z",
  "message": {
    "role": "assistant",
    "content": "",
    "tool_calls": [
      {
        "function": {
          "name": "get_current_weather",
          "arguments": {
            "format": "celsius",
            "location": "Paris, FR"
          }
        }
      }
    ]
  },
  "done_reason": "stop",
  "done": true,
  "total_duration": 885095291,
  "load_duration": 3753500,
  "prompt_eval_count": 122,
  "prompt_eval_duration": 328493000,
  "eval_count": 33,
  "eval_duration": 552222000
}
```

We can then call the function and return the result to the model as a message:

```json
{
  "model": "llama3.2",
  "created_at": "2024-07-22T20:33:28.123648Z",
  "message": {
    "role": "tool",
    "name" : "get_current_weather",
    "content": "24, Sunny"
  },
  "done_reason": "stop",
  "done": true,
  "total_duration": 885095291,
  "load_duration": 3753500,
  "prompt_eval_count": 122,
  "prompt_eval_duration": 328493000,
  "eval_count": 33,
  "eval_duration": 552222000
}
```

### Implementing the Godot Script

We'll implement the chat functionality using Godot's HTTPClient to communicate with the Ollama API. Our implementation will maintain conversation context by sending the message history and supporting tool-based interactions.

Here's the chat request handler:

```gdscript
func chat(messages: Array, result_cb: Callable, tools: Array = []):
    var cb = func(body: Dictionary):
        var cb_response : ChatResponse = ChatResponse.new()
        var error = body.error
        var response_code = body.response_code

        cb_response.error = error
        cb_response.response_code = response_code
        
        if response_code != 200 or error != 0:
            _logS("Error: " + str(error) + " response code: " + str(response_code))
        else:            
            fill_properties(cb_response, body)
    
        result_cb.call(cb_response)
        pass

    var msg_list = _prepare_message_list(messages)

    requests.process_request(cb, DEFAULT_API_SITE + "/chat", {
        "data" : {
            "model" : self.model,
            "messages" : msg_list,
            "tools" : tools,
            "stream" : false,
        },
        "method" : HTTPClient.METHOD_POST,
        "debug_log" : self.http_debug_log,
    })
```

Tools enable chat bots to interact with the game environment. For example, we can implement a tool that allows a bot to move forward:

```gdscript
var tool2 = {
        'type': 'function',
        'function': {
            'name': 'move_forward',
            'description': 'Move forward by a certain distance',
            'parameters': {
            'type': 'object',
            'required': ['a'],
            'properties': {
                'a': {'type': 'integer', 'description': 'The distance to move forward'},
            },
            },
        },
    }
self.ollama_tools.append_array([tool1, tool2])
```

The bot processes these predefined functions through this implementation:

```gdscript
# function to call when a player sends a message
func _chat_ollama(nick: String, message: Variant):
    if nick in messages.keys():
        messages[nick].append(message)
    else:
        messages[nick] = [message]

    var handler = func (result):
        var response : OllamaApi.ChatResponse = result
        messages[nick].append(response.message)
        if response.message.has("tool_calls"):
            _process_function_call(nick, response.message.tool_calls)
        else:
            _send_response(response.message.content)
        pass

    ollama.chat(messages[nick], handler, ollama_tools)    

# function to process function calls requested by the model
func _process_function_call(nick: String, calls: Array):
    for f in calls:
        _logS("function " + f.function.name + " args: " + str(f.function.arguments))
        match f.function.name:
            "subtract_two_numbers":
                var result = subtract_two_numbers(f.function.arguments)
                _chat_ollama(nick, {
                    "role": "tool",
                    "name": f.function.name,
                    "content" : result
                })
            "move_forward":
                var result = move_forward(f.function.arguments)
                _chat_ollama(nick, {
                    "role": "tool",
                    "name": f.function.name,
                    "content" : result
                })
            _:
                _logS("Unknown function call: " + f.function.name)
            
    pass

func move_forward(args: Dictionary) -> String:
    if args.has("a"):
        var distance = args["a"]
        self.player.move_forward(float(distance))
        return "ok"
    else:
        return "Invalid arguments"
```

## Deploying the Game Server

For hosting your game server, I recommend using GPU-enabled virtual machines from either <https://www.neuralrack.ai/> or <https://www.cloudrift.ai>. I've tested both platforms, and they work excellently for this purpose.

I previously covered how to deploy a Godot game server using Docker in my article: [Godot Game Server](https://docs.cloudrift.ai/tutorials/dedicated-game-server). This time, we'll focus on setting up a GPU-enabled virtual machine.

The setup process is straightforward:

1. Click **New** to create a virtual machine
2. Configure your hardware requirements

![Hardware Configuration](/img/nr_hardware.png)

3. Select your GPU specifications and add your SSH key
4. Click **Deploy** to confirm

![Deployment Summary](/img/nr_summary.png)

Once deployed, you'll receive an IP address for SSH access:

![Instance Details](/img/nr_instance.png)

### Setting Up Dependencies

First, clone the game server project:

```bash
git clone https://github.com/6erun/godot-3d-chatbots.git
```

Install Ollama:

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

Verify the Ollama service status:

```bash
systemctl status ollama
```

It should display something like:

```shell
     Loaded: loaded (/etc/systemd/system/ollama.service; enabled; preset: enabled)
     Active: active (running) since Wed 2025-04-30 20:56:12 UTC; 1min 35s ago
   Main PID: 2818 (ollama)
      Tasks: 10 (limit: 60189)
     Memory: 88.3M (peak: 100.7M)
        CPU: 1.637s
     CGroup: /system.slice/ollama.service
             └─2818 /usr/local/bin/ollama serve
```

Install Godot:

```bash
sudo apt install unzip
wget https://github.com/godotengine/godot-builds/releases/download/4.3-stable/Godot_v4.3-stable_linux.x86_64.zip
sudo mv Godot_v4.3-stable_linux.x86_64 /usr/local/bin/godot
```

### Building and Running the Game Server

Build the project:

```bash
cd godot-3d-chatbots/project
godot --headless --export-pack "Linux/DedicatedServer" ../game-server.pck
cd ..
```

Launch the server with default settings:

```bash
godot --main-pack game-server.pck
```

You can specify a different model via command line:

```bash
godot --main-pack game-server.pck model=gemma3:12b
```

The model can also be changed in-game through the chat interface:
![Chat Model Selection](/img/game_chat_model.png)

For running the server in the background:

```bash
# Launch with specific model and log output
godot --main-pack game-server.pck model=gemma3:27b >server.log 2>&1 &
# Safely exit the SSH session
exit
```
