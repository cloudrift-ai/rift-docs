---
sidebar_position: 7
title: Network Management
description: Manage networks in your CloudRift datacenter. Create, update, and delete networks with team-based access control.
keywords: [CloudRift networks, network management, datacenter networking, team access, network configuration, provider management]
---

# Network Management

CloudRift allows providers and admins to manage networks within their datacenters. Networks can be scoped to specific teams or made public, giving you fine-grained control over access to your infrastructure.

## Key Concepts

- **Team-scoped networks** — Restrict a network to members of a specific team by assigning a team ID. Set `team_id` to null to make a network public.
- **Per-datacenter configuration** — Networks are managed at the datacenter level. Providers and admins see full network details; regular users see only network names.
- **IP management** — Each network includes IP ranges, gateway, netmask, and interface configuration.

## Managing Networks

### Creating a Network

Create networks through the CloudRift Console or REST API. When creating a network, you can specify a team by ID or by name to restrict access.

### Updating Network Access

Update team access on existing networks. You can:

- Assign a network to a team (by ID or name) to restrict access to team members.
- Set the team to null to make a network public.

### Deleting a Network

Remove networks that are no longer needed. Only providers, admins, and the datacenter owner can manage networks.

## Visibility

- **Providers and admins** see full network details: gateway, netmask, interface, server address, team ID, IP ranges, and executor info.
- **Regular users** see network names only.

Network management is available through the CloudRift Console and REST API. See the [API documentation](https://api.cloudrift.ai/swagger-ui/) for the full list of network endpoints.
