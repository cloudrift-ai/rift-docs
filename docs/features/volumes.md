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

## Getting Started

Volumes can be managed through the CloudRift Console, CLI, and REST API. See the [API documentation](https://api.cloudrift.ai/swagger-ui/) for the full list of volume operations.
