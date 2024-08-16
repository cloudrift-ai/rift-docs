---
sidebar_position: 1
---

# Jupyter Lab Notebook Tutorial


In this tutorial we will see how to open Jupyter Lab notebook
using Fair Compute platform

Once you have rented a gpu and connected to the fair server, 
run the following Docker command to start the Jupyter
Notebook server. 

```bash
fair docker run -p=8888:8888 jupyter/datascience-notebook

```

The fair docker command will automatically select the rented machine available
without the need to specify the specific machine ID.

Here's what this command does:
1. fair docker run: Pulls image and starts the container.
2. -it -p 8888:8888: Maps port 8888 on your server to port 8888 on the container,
allowing you to access the Jupyter Notebook server.
3. jupyter/datascience-notebook: Specifies the Docker image to use.

After running this command, you'll see output similar to the following:

```shell
Executing the command: jupyter lab
[I 2024-07-31 16:28:49.290 ServerApp] Package jupyterlab took 0.0000s to import
[I 2024-07-31 16:28:49.302 ServerApp] Package jupyter_lsp took 0.0114s to import
[I 2024-08-02 09:49:50.063 ServerApp] Kernel started: 1acc847a-7cca-40d6-87ab-cbb78fe00e79
```

You can get the IP address for your jupyter notebook on your instructions window
or you can also run the following command to get the IP address of the machine.

```shell
fair cluster info
```

You can use other variants available for running the jupyter notebook
from the [link](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/selecting.html#jupyter-pytorch-notebook).