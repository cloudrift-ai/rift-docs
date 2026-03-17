---
sidebar_position: 1
sidebar_label: Setup & General
title: Troubleshooting - Setup & General Issues
description: Solutions for common CloudRift issues including instance deployment problems, SSH connectivity, billing questions, and account setup.
keywords: [CloudRift troubleshooting, SSH issues, instance deployment, billing, account setup, connection problems]
---

# Setup & General Issues

## Instance Deployment Issues

### Instance disappears immediately after creation

Your instance appears briefly then deactivates within seconds.

**Possible causes:**
- The host node's GPUs may have encountered a hardware issue (e.g., GPU falling off the PCIe bus).
- The selected GPU type may be fully rented with no available nodes.

**Solutions:**
1. **Try a different provider** — In the GPU selection dropdown (Step 2 of rental), select a different provider or datacenter.
2. **Try again** — The issue may be transient. Wait a moment and retry.
3. If the problem persists, contact support on [Discord](https://discord.gg/u8YZZJXdnr).

### Instance stuck on "Initializing"

The instance stays in "Initializing" state for an extended period (30+ minutes).

**Solutions:**
1. Wait up to 10 minutes — some configurations take longer to provision.
2. If stuck beyond that, press **Stop** on the instance. You are not charged after pressing stop.
3. Retry creating the instance, potentially with a different provider.
4. Contact support if it keeps happening.

### Instance stuck on "Deactivating"

After pressing stop, the instance remains in "Deactivating" state.

**What to know:**
- Billing stops at the moment you press the stop button, not when deactivation completes.
- If the instance remains stuck, contact support to force-terminate it.

---

## SSH Connection Issues

### Cannot SSH into a new instance

**Common causes and fixes:**

1. **Wrong SSH key type** — Make sure you paste your **public** key (not private key) when adding SSH keys to your account. The public key typically starts with `ssh-rsa`, `ssh-ed25519`, or similar.

2. **PuTTY key format** — PuTTY uses a different key format. Generate keys with `ssh-keygen` instead and paste the public key, or use password-based authentication.

3. **Password-based auth** — If SSH keys aren't working, try deploying without selecting an SSH key. You'll receive password credentials to connect with.

4. **Proxy or VPN interference** — If you see "Connection closed by ... port 22", try disabling any proxy or VPN applications.

5. **Instance not fully provisioned** — Ensure the instance shows "Ready" status before attempting to connect.

### SSH session disconnects after idle period

Sessions may drop after 10-15 minutes of inactivity.

**Solution:** Configure SSH keepalive in your SSH client config (`~/.ssh/config`):

```
Host *
    ServerAliveInterval 60
    ServerAliveCountMax 3
```

This sends a keepalive packet every 60 seconds to maintain the connection.

### VM becomes unreachable during use

If your instance shows "Ready" but SSH and services become unreachable:

1. Try the **Reboot** button in the CloudRift Console.
2. If reboot doesn't respond, stop and recreate the instance.
3. Check if your local network or ISP is having issues.
4. Contact support with your instance ID for investigation.

---

## Billing & Account

### Charged for failed deployments

If an instance fails to initialize and you're charged:

- Billing stops when you press the **Stop** button.
- Contact support on [Discord](https://discord.gg/u8YZZJXdnr) for a refund on failed deployments.

### Negative balance with no active instances

If your balance keeps decreasing with no visible running instances:

- **Check your Volumes** — Persistent volumes continue to be charged even after the associated instance is terminated. Go to the **Volumes** tab and stop any volumes you no longer need.

### Reservation timer doesn't pause when instance is stopped

Reservations are a time commitment — the timer runs continuously regardless of whether the instance is running. This is by design. If you don't need continuous uptime, on-demand (hourly) billing may be a better fit.

### Reservation expired without notification

Currently, there is no automatic notification when a reservation expires. Your instance will automatically switch to on-demand (hourly) pricing. Check your reservations regularly to avoid unexpected charges.

---

## Account Issues

### Google SSO account limitations

If you registered with Google SSO, some CLI features that require email/password authentication may not work. You can:
1. Use the CloudRift Console for management tasks.
2. Use API keys for programmatic access.
3. Contact support to set up password-based credentials for your account.

### Adding team members

Team members must have an existing CloudRift account before they can be added to your team. Ask them to sign up at [cloudrift.ai](https://cloudrift.ai) first, then add them using their registered email.

### UI not loading or timing out

If the CloudRift Console hangs or fails to load:
1. Try opening the page in a private/incognito browser window.
2. Clear your browser cache and re-login.
3. Ensure JavaScript is enabled (required for billing via Stripe).
