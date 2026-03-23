---
sidebar_position: 1
title: Persistent Volumes
description: Use CloudRift persistent volumes to store data independently of instance lifecycle. Preserve data across instance terminations and reuse storage across multiple instances.
keywords: [CloudRift volumes, persistent storage, data persistence, instance storage, volume management, cloud storage]
---

# Persistent Volumes

Persistent volumes provide storage that exists independently of your instance lifecycle. Unlike the ephemeral storage that comes with an instance, data stored on a persistent volume is preserved when instances are terminated and can be reattached to new instances.

## Key Concepts

- **Independent lifecycle** — Volumes are not tied to a specific instance. You can create, attach, detach, and delete volumes separately from your instances.
- **Reusable storage** — Attach the same volume to different instances over time. This is useful for datasets, model weights, or any data you want to persist between sessions.
- **Works with VMs and Docker** — Volumes can be attached to both virtual machine and Docker container instances.

## Use Cases

- **Machine learning** — Store large model weights or training datasets on a volume so they persist between training runs.
- **Development environments** — Keep your development environment and project files on a volume that survives instance restarts.
- **Databases** — Run databases with data stored on persistent volumes to ensure data durability.

## Multi-Datacenter Access

Volumes can be accessible from multiple datacenters when the underlying storage cluster is shared. The volume API endpoints (`/public/volumes/list`, `/public/volumes/create`, and `/public/team-volumes/*`) return a `datacenters` field — an array of all datacenter names where the volume is available. The existing `datacenter_name` field remains for backward compatibility.

:::warning

Volumes are deleted when your account balance is depleted. Ensure you maintain a positive balance to avoid data loss.

:::

## Step-by-Step Guide

### Step 1: Choose a Supported Data Center

Persistent volumes are currently available only with certain data center partners. When launching a rental, look for GPU cards labeled **"Persistent storage support"** (e.g., RTX PRO 6000).

If the selected GPU doesn't show this label, you won't be able to create a persistent volume with that instance.

### Step 2: Create a Volume During Instance Setup

In the instance creation flow:

1. Choose a GPU that supports persistent storage.
2. When prompted, select **"Create a Volume"** and choose a size.

The volume will be automatically attached to your instance and appear under the **Volumes** tab.

### Step 3: Mount the Volume in Your VM

Once your instance is running, connect to it and list available block devices:

```shell
lsblk
```

Your volume will appear as a block device — usually `vdb`. You can identify it by the size you chose during setup.

To prepare and mount it:

```shell
# Format the disk (do this only once, on first use)
sudo mkfs.ext4 /dev/vdb

# Create a mount point
sudo mkdir -p /mnt/my-volume

# Mount the volume
sudo mount /dev/vdb /mnt/my-volume

# Give your user ownership
sudo chown -R riftuser:riftuser /mnt/my-volume
```

Replace `my-volume` with the name you chose for your volume.

:::caution

Only format the disk (`mkfs.ext4`) on first use. Formatting an existing volume will erase all data on it.

:::

### Step 4: Verify Persistence

To confirm your data persists across instances:

1. Write a test file:

   ```shell
   echo "volume test $(date)" > /mnt/my-volume/test.txt
   ```

2. **Stop** your instance.

3. Launch a new instance and select **"Use Existing Volume"** to attach the same volume.

4. Mount the volume again:

   ```shell
   sudo mount /dev/vdb /mnt/my-volume
   ```

5. Check that the file is still there:

   ```shell
   cat /mnt/my-volume/test.txt
   ```

If the file contents appear, your data is persisting correctly.

## API Reference

Volumes can also be managed through the CLI and REST API. See the [API documentation](https://api.cloudrift.ai/swagger-ui/) for the full list of volume operations.
