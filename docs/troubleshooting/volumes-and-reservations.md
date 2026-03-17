---
sidebar_position: 4
sidebar_label: Volumes & Reservations
title: Troubleshooting - Volumes & Reservations
description: Solutions for common issues with CloudRift persistent volumes and instance reservations.
keywords: [CloudRift troubleshooting, volume issues, reservation issues, persistent storage problems, billing]
---

# Volumes & Reservations Issues

## Persistent Volumes

### Volume prevents instance from starting

If adding a volume to an instance causes it to fail immediately:

1. **Retry with an existing volume** — Newly created volumes may occasionally fail on first attach. Try the deployment again with the same volume.
2. **Try a different provider** — The host may be misconfigured. Select a different provider or datacenter.
3. Contact support if the issue persists.

### Cannot attach a volume to a running instance

Volumes can only be attached at instance creation time. To add a volume:

1. Save any data you need from the current instance.
2. Stop the current instance.
3. Create a new instance with the volume attached.

Your data on the volume persists between instances.

### Volume charges continue after instance is terminated

Persistent volumes are billed independently of instances. Terminating an instance does **not** stop volume billing.

**To stop volume charges:** Go to the **Volumes** tab in the CloudRift Console and explicitly stop or delete any volumes you no longer need.

### Volume not available in my datacenter

Persistent volumes may not be available in all datacenters. If the volume option doesn't appear when creating an instance:

- Try a different datacenter/provider that supports volumes.
- Contact support to check which datacenters have volume support.

**Workaround:** Use cloud storage (S3, Google Drive) for data persistence in datacenters without volume support.

---

## Reservations

### Reservation timer runs even when instance is stopped

This is expected behavior. A reservation is a time commitment — the clock runs continuously regardless of instance state. The discount applies to the entire reserved period.

If you don't need continuous uptime, on-demand (hourly) billing may be more cost-effective.

### Instance disappeared after stopping a reserved instance

Stopping an instance terminates it and all data on the instance's ephemeral storage is lost. To redeploy on the same reservation:

1. Go to your reservations in the CloudRift Console.
2. Use the **Redeploy** option (or "+New instance and reuse reservation") to launch a new instance on your existing reservation.

:::tip

Use persistent volumes to keep your data safe across instance restarts. Volume data is preserved even when instances are terminated.

:::

### Cannot extend a reservation

If the reservation extension option is not appearing or returns an error:

1. Refresh the CloudRift Console page.
2. Try using the three-dot menu on the instance card.
3. Contact support if the option still doesn't appear — this may be a temporary UI issue.
