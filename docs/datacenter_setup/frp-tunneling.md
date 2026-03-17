---
sidebar_position: 9
title: FRP Port Tunneling
description: Configure FRP tunneling on CloudRift for providers with limited public IPs. Enable dynamic port allocation for user instances.
keywords: [CloudRift FRP, port tunneling, dynamic ports, limited IPs, provider networking, frpc, port forwarding]
---

# FRP Port Tunneling

FRP (Fast Reverse Proxy) tunneling enables providers with limited public IP addresses to serve multiple user instances through dynamically allocated ports. Each user can reach their instance under the same IP address but with unique port mappings.

## How It Works

When a provider has limited public IPs, FRP tunneling allows multiple instances to share the same IP address by assigning dynamic ports:

1. A user starts an instance and requests specific ports (e.g., 443 and 3000).
2. The system allocates unique external ports from the provider's configured range (e.g., `8021 → 443` and `8573 → 3000`).
3. The user connects to the shared IP using the allocated external ports.

This applies to both Docker containers and virtual machines.

## Configuration

FRP tunneling is configured at the provider level. Providers specify a port range that will be used for dynamic allocation. The CloudRift platform handles the mapping automatically when users create instances.

:::info

FRP tunneling requires the frpc client to be running on provider nodes. Rift Desktop includes support for executing FRP commands on nodes running frpc.

:::

FRP tunneling configuration is available through the CloudRift Console and REST API. See the [API documentation](https://api.cloudrift.ai/swagger-ui/) for full details.
