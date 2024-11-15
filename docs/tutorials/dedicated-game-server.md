---
sidebar_position: 2
---

# Godot Game Server

In this tutorial, we'll use a modified version of the Godot Multiplayer Template to show how to run a dedicated game server using Rift. This guide is designed for developers looking to make their Godot multiplayer games easily deployable with a dedicated server. By the end, you’ll have a fully functional server running in a Docker container, ready to serve your game!

We will use modified version of [Godot Multiplayer Template](https://github.com/6erun/godot-3d-multiplayer-template) to show how to run a dedicated game server using Rift.

Repository structure:
- **project** folder with Godot game project. 
- **docker** folder with Dockerfile.

## Prepare export preset

First we have to preper dedicated server build. We choose `x86_64` architecture and `Export as dedicated server` option. 
This option will automatically add `dedicated_server` feature tag, so we can detect it and start hosting the game immediately.

<div>
    <div style={{ "justify-content": "center", "width": "100%", "text-align": "center" }}>
        <table style={{ "border-collapse": "collapse" }} >
            <tr style={{ "border": "none" }}>
                <td style={{ "border": "none" }}><img src={require("/static/img/godot-export1.png").default} alt="Girl Knight"/></td>
                <td style={{ "border": "none" }}><img src={require("/static/img/godot-export2.png").default} alt="Mecha"/></td>
            </tr>
        </table>
    </div>
</div>

## Prepare Dockerfile

You can use ready to use  or adjust it to your needs.
Next, let’s set up our Dockerfile. Below is an example Dockerfile (you can find it [here](https://github.com/6erun/godot-3d-multiplayer-template/blob/main/docker/Dockerfile)) you can use or adjust to fit your needs:
```dockerfile
# syntax=docker/dockerfile:1
FROM fedora:latest

# Environment variables and parameters
ARG GODOT_VERSION="4.3"
ARG SERVER_PORT=8080
ENV GODOT_FILE_NAME="Godot_v${GODOT_VERSION}-stable_linux.x86_64"

# Name of the PCK file you want to run on the server
ENV GODOT_GAME_NAME="Godot3DMultiplayer.linux" 

# System dependencies we will need
RUN dnf update -y
RUN dnf install -y wget
RUN dnf install -y unzip
RUN dnf install -y wayland-devel
RUN dnf install -y fontconfig

# Download Godot, version is set from environment variables
ADD https://github.com/godotengine/godot/releases/download/${GODOT_VERSION}-stable//${GODOT_FILE_NAME}.zip ./
RUN mkdir -p ~/.cache \
    && mkdir -p ~/.config/godot \
    && unzip ${GODOT_FILE_NAME}.zip \
    && mv ${GODOT_FILE_NAME} /usr/local/bin/godot \
    && rm -f ${GODOT_FILE_NAME}.zip

# Make directory to run the app from and then run the app
WORKDIR /godotapp
# Copy project folder from the context folder
COPY project project/

# Export pck file to be used by Godot
WORKDIR /godotapp/project
RUN godot --headless --export-pack "Linux/DedicatedServer" /godotapp/${GODOT_GAME_NAME}.pck

WORKDIR /godotapp

# Expose ports to be used by the server
EXPOSE ${SERVER_PORT}/udp

# Start server
SHELL ["/bin/bash", "-c"]
ENTRYPOINT godot --main-pack ${GODOT_GAME_NAME}.pck
```

## Building the Docker Image

Assuming you have cloned [Godot Multiplayer Template](https://github.com/6erun/godot-3d-multiplayer-template) and we are in **godot-3d-multiplayer-template** folder, you can build your game server image by running:

```bash
docker build --platform linux/x86_64 -t godot-server-demo:latest -f docker/Dockerfile .
```

## Pushing the Docker Image to Docker Hub

To push the image to Docker Hub, first log in using:
```bash
docker login
```
Then tag your image for your repository. Assuming your repository is named **godot-server-demo**:
```bash
docker tag godot-server-demo:latest my-namespace/godot-server-demo:latest
docker push my-namespace/godot-server-demo:latest
```
You can find more information how to create repository on [Docker Hub](https://docs.docker.com/get-started/introduction/build-and-push-first-image/).

At this point we have a Docker image with a dedicate game server! You can find it also [here](https://hub.docker.com/r/eses2020/godot-server-demo).

## Use Rift CLI to run the container

Once you have rented a gpu (rent at [https://neuralrack.ai](https://neuralrack.ai)) and connected to the rift server, you need to login once to GitHub repository.

```bash
rift docker login --username <your_username> --password <your_password>
```

You launch your container with similar syntax to docker command. You can bypass host port to use the same port as container (8080:8080 equals 8080).

```bash
rift docker run -d -p 8080/udp my-namespace/godot-server-demo:latest
```

You can list running containers with `rift docker ps` command. It will also display ip address that can be used to connect to the server.

![Godot](/img/godot_robot_on_cloud.png)
