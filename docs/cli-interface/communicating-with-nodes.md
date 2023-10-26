---
sidebar_position: 2
---

# Communicating with Nodes

Fair provides a more low-level API for communicating with nodes.
It is helpful for debugging, inspection and for implementing more
complex projects that require fine-grained access to the nodes.

This API mimics conventional container tools like Docker and mostly
feels like communicating with Docker engine on a remote machine.

## Launching a Container

To run a task on a container `fair node run` command is used (similar to `docker run`).
It does the following:
1. Start a container on the specified node.
2. Start a process in the container.
3. Optionally attach to `stdin, stdout, stderr` of the process.
   The content of `stdout` and `stderr` will be continuously sent to the server 
   such that you can interactively see process output, `stdin` will be continuously
   polled and can be used to send input to the process.

For example, try the following command:
```shell
$ fair node run -n <node_id> -i python:slim python -c "print('Hello Fair Compute')"
Hello Fair Compute
```

This command a container using a public `python:slim` image containing python interpreter and
starts a python task that prints `Hello Fair Compute` to the console. By default `stdin, stdout`
and `stderr` streams are attached, and thus you can see the output of the command immediately.
If we don't want to block until task is finished - we can supply `-d` argument.

The biggest value of Fair is that it allows you to leverage the powerful GPU
that you have in your computer. We need to use nvidia runtime to make use of the 
NVidia GPU. It can be specified using the `-r` flag. Try the following command
to run `nvidia-smi` tool on your node and get the GPU information.
```shell
$ fair node run -n <node_id> -r nvidia nvidia-smi
```

Another commonly used feature is port mapping. For example, if you're developing
a web service you might need that. To expose port supply `-p <port>`
or `-p <host_port>:<publish_port>` argument. Please refer to [Serving Stable Diffusion](/docs/tutorials/serving-stable-diffusion)
tutorial for a more in-depth overview.

## Listing Containers on the Node

To list all running containers on the node use the following command:
```shell
$ fair node ls -n <node_id>
<ADD SAMPLE OUTPUT>
```

Use `-a` flag to list all containers including the ones that have already been
stopped. Note that Fair periodically cleans up containers on the node.

## Retrieving Container Logs

To retrieve container logs use:
```shell
$ fair node logs -n <node_id> <container_id>
<ADD SAMPLE OUTPUT>
```

## Stopping the Container

To stop (kill) the container on the node use:
```shell
$ fair node kill -n <node_id> <container_id>
<ADD SAMPLE OUTPUT>
```

## End-to-end Example

Here is a more complete example demonstrating aforementioned commands in
action. We're going to start some long-running job, inspect its output
and finally terminate it.

```shell
# check the cluster
$ fair cluster info

# run a task that will be printing countdown to console for two minutes, run in background
$ fair node <ID> run -d -i python:slim python -c "import time; [(print(f'{i} seconds left'), time.sleep(1)) for i in range(120))]"

# inspect running tasks
$ fair node <ID> ps

# check logs of the task we've started
$ fair node <ID> logs <CID>

# stop the task
$ fair node <ID> kill <CID>

# ensure that no tasks are running
$ fair node <ID> ps
```
