---
sidebar_position: 2
---

# Jupyter Lab Notebook Tutorial


In this tutorial we will show how to open Jupyter Lab notebook
on your computer using executor rented from fair. This way
you can leverage your GPU to run inference and avoid paying for expensive
cloud compute.

## Pulling the Jupyter Docker Image

Once you have rented a gpu and connected to the fair server, pull 
the Jupyter Docker image. This image includes a Jupyter Notebook 
server and various pre-installed data science packages. 
Run the following command:

```bash
docker pull jupyter/datascience-notebook
```

This command downloads the Jupyter Docker image to your server. Depending
on your internet connection, this may take a few minutes.

## Running the Jupyter Docker Container

After pulling the image, run the Docker container to start the Jupyter
Notebook server. Use the following command:

```bash
fair docker run -p 8888:8888 jupyter/datascience-notebook
```

Here's what this command does:
1. fair docker run: Runs the existing container.
2. -p 8888:8888: Maps port 8888 on your server to port 8888 on the container,
allowing you to access the Jupyter Notebook server.
3. jupyter/datascience-notebook: Specifies the Docker image to use.

After running this command, you'll see output similar to the following:

```shell
Executing the command: jupyter lab
[I 2024-07-31 16:28:49.290 ServerApp] Package jupyterlab took 0.0000s to import
[I 2024-07-31 16:28:49.302 ServerApp] Package jupyter_lsp took 0.0114s to import
To access the server, open this file in a browser:
        file:///home/jovyan/.local/share/jupyter/runtime/jpserver-7-open.html
    Or copy and paste one of these URLs:
        http://6f12f7253df0:8888/lab?token=15013bca83794483997a502d64e233dd615491608f9b383c
        http://127.0.0.1:8888/lab?token=15013bca83794483997a502d64e233dd615491608f9b383c
```

Copy paste one of these urls in your browser to access jupyter lab using the
GPU rented using Fair. 