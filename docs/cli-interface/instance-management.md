---
sidebar_position: 4
title: Instance Management with CloudRift CLI
description: List available instance types and rent VM or Docker instances using the CloudRift CLI public API commands.
keywords: [CloudRift CLI, instance types, rent instance, rift instance, VM rental, Docker rental, instance management]
---

# Instance Management

CloudRift CLI provides commands for discovering available instance types and renting instances through the public API. These commands work with the CloudRift marketplace — unlike `rift docker run` which targets your own cluster, these commands rent instances from available providers.

## Listing Instance Types

To see what instance types are available on the marketplace:

```shell
rift instance-type list
```

This displays available instance types along with availability information.

### Filtering Results

Use `--service` to filter by instance service type:

```shell
rift instance-type list --service docker
rift instance-type list --service vm
```

Use `--datacenter` to filter by datacenter location:

```shell
rift instance-type list --datacenter us-east
```

Filters can be combined:

```shell
rift instance-type list --service vm --datacenter us-east
```

## Renting an Instance

### Renting a VM Instance

To rent a virtual machine instance, use the `--image` flag to specify the VM image:

```shell
rift instance rent --image ubuntu-22.04
```

### Renting a Docker Instance

To rent a Docker container instance, use the `--docker-image` flag:

```shell
rift instance rent --docker-image pytorch/pytorch:latest
```

:::info

These commands interact with the CloudRift public API to rent instances from marketplace providers. For managing containers on your own cluster, see [Launching Jobs](./launching-jobs.md). For managing VM lifecycle (start/stop), see [VM Management](./vm-management.md).

:::
