---
sidebar_position: 8
title: Node Drain Management
description: Perform maintenance on CloudRift nodes using the drain workflow. Gracefully drain instances before taking a node offline.
keywords: [CloudRift node drain, node maintenance, provider maintenance, drain instances, datacenter management]
---

# Node Drain Management

Node draining allows providers and admins to gracefully take nodes offline for maintenance. When a node is drained, it is hidden from the marketplace and active users are notified, ensuring a smooth transition before the node goes offline.

## Drain Workflow

### 1. Start Draining

Begin the drain process on a node. This hides the node from the marketplace so no new instances are scheduled on it, and notifies current users.

```
POST /api/v1/nodes/drain
```

### 2. Wait for Instances to Terminate

Allow existing instances to finish their work or be migrated. Users are notified and can take action to move their workloads.

### 3. Force Drain (Optional)

If instances do not terminate within an acceptable timeframe, force-drain the node to immediately terminate all remaining instances.

```
POST /api/v1/nodes/force_drain
```

### 4. Perform Maintenance

With all instances cleared, perform your hardware or software maintenance.

### 5. Resume the Node

Bring the node back online and make it available on the marketplace again.

```
POST /api/v1/nodes/resume
```

## Cancelling a Drain

If maintenance is no longer needed, cancel an active drain to restore the node to normal operation without completing the full drain cycle.

```
POST /api/v1/nodes/cancel_drain
```

:::info

Only providers and admins can perform drain operations on nodes in their datacenters.

:::

Node drain management is available through the CloudRift Console and REST API. See the [API documentation](https://api.cloudrift.ai/swagger-ui/) for full details.
