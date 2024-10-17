---
sidebar_position: 2
---

# Remote Desktop with Fair

Run a Remote Desktop server on a GPU-enabled machine managed by CloudRift and learn how to:
- Start a container with an RDP server and XFCE desktop environment.
- Connect to the remote desktop using an RDP client.
- Access a full graphical desktop environment remotely.

## Pull and Run the RDP Server Container

Once you have rented a GPU and connected to the CloudRift server, run the 
following Docker command to pull and start the RDP server container:

```bash
rift docker run -p 3389 --name remote-desktop scottyhardy/docker-remote-desktop:latest
```

The rift docker run command will automatically select the executor (machine)
in your rift cluster and start the RDP server container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `rift cluster info`.

Here's what this command does:
- `rift docker run`: Pulls the Docker image and starts the container.
- `-p 3389`: Maps port 3389 on your server to port 3389 on the container, allowing RDP access.
- `--name remote-desktop`: Assigns the name "remote-desktop" to the container for easy reference.
- `scottyhardy/docker-remote-desktop:latest`: Specifies the Docker image to be run. This image can be found on [Docker Hub](https://hub.docker.com/r/scottyhardy/docker-remote-desktop).

:::caution

If you need to close the terminal window, but you want your container to keep running,
press Ctrl-P followed by Ctrl-Q. This will detach the terminal from the container.

If you press Ctrl-C or Ctrl-D, the container will stop. Also, you can specify `-d` flag
to run the container in the background when launching it.

:::

## Connect to the Remote Desktop

To connect to your RDP server, you'll need the IP address of the executor running the container:

```bash
rift cluster info
```

Now you can connect to your RDP server using any RDP client:


1. Open your RDP client:
   - Windows: Remote Desktop Connection (built-in, press Win+R and type mstsc)
   - macOS: [Microsoft Remote Desktop](https://apps.apple.com/us/app/microsoft-remote-desktop/id1295203466?mt=12) 
   - Linux: [Remmina](https://remmina.org/how-to-install-remmina/)
2. Enter the IP address of your executor as the hostname.
3. Use the default port 3389.
4. When prompted for credentials, use:
   - Username: `ubuntu`
   - Password: `ubuntu`

You should now see the XFCE desktop environment running in your RDP client.

![XFCE Desktop](/img/xfce-desktop.png)


Remember to stop the container when you're done to avoid unnecessary charges.

