---
sidebar_position: 3
title: Managing Virtual Machines with CloudRift CLI
description: Learn how to manage virtual machine instances using the CloudRift CLI. Start, stop, and control VMs on your clusters.
keywords: [CloudRift CLI, virtual machines, VM management, rift virt, start VM, stop VM, VM lifecycle]
---

# Managing Virtual Machines

CloudRift CLI provides commands for managing the lifecycle of virtual machine instances on your cluster.

## Starting a VM

To start a stopped virtual machine instance:

```shell
rift virt start <instance_id>
```

## Stopping a VM

To stop a running virtual machine instance:

```shell
rift virt stop <instance_id>
```

## Pausing and Resuming a VM

Pausing freezes vCPU execution while keeping the VM's resources allocated. You can address the VM by its id or its human-readable name:

```shell
rift virt pause <id_or_name>
rift virt resume <id_or_name>
```

:::warning

Billing continues while a VM is paused, since its resources stay allocated.

:::

:::info

Providers and admins can start and stop VMs on their nodes. Regular users can manage their own instances.

:::
