---
sidebar_position: 3
sidebar_label: Datacenter & Infrastructure
title: Troubleshooting - Datacenter & Infrastructure Issues
description: Solutions for common CloudRift datacenter issues including GPU driver problems, networking between VMs, port access, and container mode issues.
keywords: [CloudRift datacenter troubleshooting, GPU issues, nvidia-smi, CUDA errors, VM networking, port access, Docker containers]
---

# Datacenter & Infrastructure Issues

## GPU & Driver Issues

### `nvidia-smi` returns "No devices were found"

After deploying a VM, the GPU hardware is not detected.

**Solutions:**
1. **Reboot the instance** — This resolves most transient GPU detection issues.
2. If the issue persists after reboot, the GPU may have a hardware problem on the host. Try renting from a different provider or datacenter.

### "Failed to initialize NVML: Driver/library version mismatch"

Ubuntu may auto-update GPU drivers, causing a mismatch between the loaded kernel module and the userspace library.

**Solution:** Reboot the instance to load the matching driver version:
```shell
sudo reboot
```

### CUDA initialization errors in PyTorch

If PyTorch shows "CUDA initialization: CUDA unknown error" or cannot detect the GPU:

1. Verify the GPU is visible: `nvidia-smi`
2. If `nvidia-smi` works but PyTorch doesn't detect the GPU, check your CUDA toolkit version matches the driver version.
3. Reboot the instance and try again.
4. If the issue persists, try a different instance — the GPU on the current host may have a hardware issue.

### VM boot hangs on hosts with newer NVIDIA GPUs

On hosts with newer NVIDIA GPUs (e.g. RTX PRO 6000), VMs may hang during boot.

**Cause:** OVMF firmware fails to initialize the GPU Option ROM on these newer GPU models.

**Solution:** Update Rift Desktop to **v0.56.0** or later, which includes a firmware fix for this issue.

### High VRAM usage on a fresh container with no processes

In **container mode**, the GPU is shared between users on the same node. Other users' processes may be consuming VRAM.

**Solution:** Use **VM mode** instead of container mode for dedicated GPU access. In VM mode, the GPU is passed through exclusively to your instance.

---

## Networking Issues

### Cannot access services between VMs

If a service running on one VM (e.g., port 8080) is not reachable from another VM:

1. **Check binding address** — Make sure the service binds to `0.0.0.0`, not `127.0.0.1` or `localhost`.
2. **Same network** — VMs on different subnets may not be able to communicate directly. Contact support to ensure your VMs are deployed on the same network.

### Cannot access a web service from your browser

If you start a web service (e.g., ComfyUI, Jupyter) but can't reach it from your local browser:

1. **Bind to the public IP** — Many services default to `localhost`. Launch with the `--listen` or `--host` flag:
   ```shell
   # Example for ComfyUI
   python main.py --listen 0.0.0.0 --port 8188
   ```
2. Access the service at `http://<vm_public_ip>:<port>`.

### Port availability

All ports are open by default on VMs — there are no firewall restrictions from CloudRift's side. You can configure your own firewall rules using `ufw` or `iptables` on the VM.

---

## Docker Container Mode Issues

### Wrong container spins up

If selecting "No Container" still launches a pre-configured container:

1. Log out and log back into the CloudRift Console.
2. Retry the deployment.

### Cannot connect to container IP

Container mode is less mature than VM mode. If you cannot connect to a container instance:

1. Verify the instance status is "Ready" in the console.
2. Try **VM mode** instead, which provides a full Linux environment with SSH access.

---

## System Service Issues

### Service not starting

Check the service logs:
```shell
sudo journalctl -u rift
sudo systemctl status rift
```

### Docker permission errors

Ensure the rift service is running as root and Docker is accessible:
```shell
sudo systemctl status docker
docker info
```

If Docker is not running:
```shell
sudo systemctl start docker
sudo systemctl enable docker
```

### GPU not detected by the service

1. Verify the GPU is visible to the host: `nvidia-smi`
2. Ensure you rebooted after installing or removing drivers.
3. Check VFIO binding if running in VM mode: `lspci -k | grep -A 2 -i nvidia`
