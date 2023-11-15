---
sidebar_position: 2
---

# Communicating with Nodes

Fair provides a more low-level API for communicating with nodes.
It is helpful for debugging, inspection and for implementing more
complex projects that require fine-grained access to the nodes.

This API mimics conventional container tools like Docker and mostly
feels like communicating with Docker engine on a remote machine.

## Listing Nodes in the Cluster

To inspect the Fair cluster run 
```shell
fair cluster info
```

Throughout this tutorial we'll be supplying node id into various commands.
It is convenient to memorize one. For that we can launch a job on an arbitrary
node and print node id (`FAIR_NODE_ID` environment variable is set for each node).
```shell
NODE_ID=`fair job -i alpine printenv FAIR_NODE_ID`
```

## Launching a Container

To run a task on a container `fair node <node_id> run` command is used (similar to `docker run`).
It does the following:
1. Start a container on the specified node.
2. Start a process in the container.
3. Optionally attach to `stdin, stdout, stderr` of the process.
   The content of `stdout` and `stderr` will be continuously sent to the server 
   such that you can interactively see process output, `stdin` will be continuously
   polled and can be used to send input to the process.

For example, try the following command (to get ids of the nodes in your cluster
use `fair cluster info` command)
```shell
fair node $NODE_ID run -i python:slim -- python -c "print('Hello Fair Compute')"
```

This command creates a container using public `python:slim` image containing python interpreter and
starts a python task that prints `Hello Fair Compute` to the console. By default `stdin, stdout`
and `stderr` streams are attached, and thus you can see the output of the command immediately.
If we don't want to block until task is finished - supply `-d` argument.

The biggest value of Fair is that it allows you to leverage the powerful GPU
that you have in your computer. We need to use nvidia runtime to make use of the 
NVidia GPU. It can be specified using the `-r` flag. Try the following command
to run `nvidia-smi` tool on your node and get the GPU information.
```shell
fair node $NODE_ID run -r nvidia -i ubuntu nvidia-smi -L
```

Another commonly used feature is port mapping. For example, if you're developing
a web service you might need that. To expose port supply `-p <port>`
or `-p <host_port>:<publish_port>` argument. Please refer to [Serving Stable Diffusion](/docs/tutorials/serving-stable-diffusion)
tutorial for a more in-depth overview.

## Listing Containers on the Node

To list all running containers on the node use the following command:
```shell
fair node $NODE_ID list
```

Use `-a` flag to list all containers including the ones that have already been
stopped. Note that Fair periodically cleans up containers on the node.

## Retrieving Container Logs

To retrieve container logs use `fair node <node_id> logs <container_id>`. Here is an example
of how to start a job and retrieve logs from it afterward.
```shell
CONTAINER_ID=`fair node $NODE_ID run -d -i alpine -- echo "Hello World"
fair node $NODE_ID logs $CONTAINER_ID
```

You can retrieve logs even if the task has finished. However, task containers and all the associated
information is removed after a few minutes.

## Stopping the Container

To stop (kill) the container on the node use `fair node <node_id> kill <container_id>`. Here is an example
of starting some long-running command and terminating it.
```shell
CONTAINER_ID=`fair node $NODE_ID run -d -i alpine -- sleep 30`
fair node $NODE_ID kill $CONTAINER_ID
```

## End-to-end Example

Here is a more complete example demonstrating aforementioned commands in
action. We're going to start some long-running job, inspect its output
and finally terminate it.

```shell
# check the cluster
fair cluster info

# get id of some node in the cluster
NODE_ID=`fair job -i alpine printenv FAIR_NODE_ID`

# run a task that will be printing countdown to console for two minutes, run in background
fair node $NODE_ID run -d -i python:slim \
  -- python -uc "import time; [(print(f'{120-i} seconds left'), time.sleep(1)) for i in range(120)]"

# inspect running tasks
fair node $NODE_ID list

# get container name of the task (assuming just a single task is running)
CONTAINER_ID=`fair node $NODE_ID list --id-only`

# check logs of the task we've started
fair node $NODE_ID logs $CONTAINER_ID

# stop the task
fair node $NODE_ID kill $CONTAINER_ID

# ensure that no tasks are running
fair node $NODE_ID list
```
