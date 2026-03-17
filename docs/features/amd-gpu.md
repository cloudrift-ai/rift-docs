---
sidebar_position: 5
title: AMD GPU Support
description: CloudRift support for AMD Instinct GPUs including MI300X and MI350X. Docker runtime integration, ROCm verification, and SR-IOV GPU passthrough for VMs.
keywords: [CloudRift AMD GPU, MI300X, MI350X, ROCm, AMD Instinct, SR-IOV, GIM, GPU passthrough, AMD Docker]
---

# AMD GPU Support

CloudRift supports AMD Instinct GPUs (MI300X/MI350X) for both Docker containers and virtual machines.

## Docker Containers

AMD GPUs are automatically detected via PCI scanning on nodes. The ROCm runtime is integrated for Docker container workloads, allowing containers to access AMD GPU resources without additional configuration.

For datacenter setup details, see the [Docker setup guide](../datacenter_setup/docker.mdx).

## Virtual Machines

AMD SR-IOV (GIM) GPU passthrough enables multi-GPU virtual function (VF) assignment, allowing AMD Instinct GPUs to be shared across multiple VMs.

For datacenter setup details, see the [VM setup guide](../datacenter_setup/vm.mdx).

## ROCm VM Images

Pre-built ROCm VM images are available with the following configuration:

- **OS:** Ubuntu Noble
- **ROCm version:** 7.2
- **Kernel:** HWE kernel

These images are automatically distributed to nodes with AMD GPUs during image synchronization.
