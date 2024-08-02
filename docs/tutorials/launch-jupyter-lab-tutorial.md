---
sidebar_position: 1
---

# Jupyter Lab Notebook Tutorial


In this tutorial we will show how to open Jupyter Lab notebook
using Fair Compute platform

Once you have rented a gpu and connected to the fair server, 
run the Docker command to start the Jupyter
Notebook server. Use the following command:

```bash
fair docker run -p 8888:8888 jupyter/datascience-notebook

# Entered start.sh with args: jupyter lab

# ...

#     To access the server, open this file in a browser:
#         file:///home/jovyan/.local/share/jupyter/runtime/jpserver-7-open.html
#     Or copy and paste one of these URLs:
#         http://eca4aa01751c:8888/lab?token=d4ac9278f5f5388e88097a3a8ebbe9401be206cfa0b83099
#         http://127.0.0.1:8888/lab?token=d4ac9278f5f5388e88097a3a8ebbe9401be206cfa0b83099
```

The fair docker command will automatically select the rented machine available
without the need to specify the specific node ID.

Here's what this command does:
1. fair docker run: Runs the existing container.
2. -it -p 8888:8888: Maps port 8888 on your server to port 8888 on the container,
allowing you to access the Jupyter Notebook server.
3. quay.io/jupyter/scipy-notebook:2024-05-27: Specifies the Docker image to use.

After running this command, you'll see output similar to the following:

You can use other variants available for running the jupyter notebook
from the [link](https://jupyter-docker-stacks.readthedocs.io/en/latest/using/selecting.html#jupyter-pytorch-notebook).

```shell
Executing the command: jupyter lab
[I 2024-07-31 16:28:49.290 ServerApp] Package jupyterlab took 0.0000s to import
[I 2024-07-31 16:28:49.302 ServerApp] Package jupyter_lsp took 0.0114s to import
[I 2024-08-02 09:49:50.063 ServerApp] Kernel started: 1acc847a-7cca-40d6-87ab-cbb78fe00e79
```

You can get the link to the jupyter notebook onn your instructions window
or you can also run the following command to get the IP address of the machine.

```shell
fair cluster info
```

