---
sidebar_position: 1
---

# SSH Server with Fair

Run an SSH server on a GPU-enabled machine managed by Fair Compute and learn how to:
- Start an Ubuntu container and access its bash shell.
- Install and configure an SSH server within the container.
- Connect to the SSH server remotely.

## Pull and Run the Ubuntu Image

Once you have rented a GPU and connected to the Fair server, run the 
following Docker command to pull and start the Ubuntu container:

```bash
fair docker run --rm -p='2222:22' -it ubuntu /bin/bash
```

The fair docker run command will automatically select the executor (machine)
in your fair cluster and start the Ubuntu container. If you have multiple executors
in your cluster, you can specify the executor using `-x <executor-name>`
command line parameter. Names of the executors in your cluster
can be found by running `fair cluster info`.

Here's what this command does:
- `fair docker run`: Pulls the Docker image and starts the container.
- `--rm`: Automatically removes the container when it exits.
- `-p='2222:22'`: Maps port 2222 on your server to port 22 on the container, allowing SSH access.
- `-it`: Runs the container in interactive mode with a pseudo-TTY.
- `ubuntu`: Specifies the Docker image to be run (latest Ubuntu image).
- `/bin/bash`: Starts a bash shell in the container.

After running this command, you'll be in the container's bash shell.

:::caution

If you need to close the terminal window, but you want your container to keep running, press Ctrl-P followed by Ctrl-Q. This will detach the terminal from the container.

If you press Ctrl-C or Ctrl-D, the container will stop. Also, you can specify -d flag instead of -it to run the container in the background when launching it.



:::

## Set Up the SSH Server

Now that you're in the container's bash shell, set up the SSH server:

1. Update the package list and install OpenSSH server:
   ```bash
   apt-get update && apt-get install -y openssh-server
   ```

2. Set a password for the root user:
   ```bash
   passwd root
   ```

3. Configure SSH to allow root login:
   ```bash
   sed -i 's/#PermitRootLogin prohibit-password/PermitRootLogin yes/' /etc/ssh/sshd_config
   ```

4. Start the SSH service:
   ```bash
   service ssh start
   ```

## Connect to the SSH Server

To connect to your SSH server, you'll need the IP address of the executor. You can find this by running:

```bash
fair cluster info
```

Connect to the SSH server using:

```bash
ssh -p 2222 root@<executor-ip-address>
```

Replace `<executor-ip-address>` with the IP address from the previous step.

Remember to stop the container when you're done to avoid unnecessary charges.
