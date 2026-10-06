---
sidebar_position: 2
sidebar_label: CLI
title: Troubleshooting - CLI Issues
description: Solutions for common CloudRift CLI issues including authentication errors, command failures, and Docker command limitations.
keywords: [CloudRift CLI troubleshooting, rift command errors, CLI authentication, Docker commands, CLI issues]
---

# CLI Issues

## Authentication Issues

### All commands fail with authentication error

If every `rift` command fails after a recent update:

1. **Update to the latest CLI** — Run the installation script again:
   ```shell
   curl -L https://cloudrift.ai/install-rift.sh | sh
   ```
2. Re-run `rift configure` with your credentials.

### Commands fail with `unsupported version`

The server rejects requests from outdated CLI builds when the protocol changes (most recently in v0.61.0 and v0.62.0 for `rift instance` commands). Run the installation script again to update:

```shell
curl -L https://cloudrift.ai/install-rift.sh | sh
```

### Google or GitHub sign-in with `rift configure` fails

`rift configure` supports signing in with Google or GitHub through the browser. If browser sign-in doesn't complete:

1. **Update to the latest CLI** — CLI v0.60.4 fixed Google and GitHub sign-in and shows the failure reason in the terminal.
2. Use API keys for programmatic access instead.

## Docker Command Limitations

### `rift docker cp` — copying files out of a container

`rift docker cp` currently only supports copying files **into** a container, not out of it.

**Workarounds for getting files off a remote container:**
- Use `scp` to copy files from the executor: `scp user@<executor_ip>:/path/to/file ./local/path`
- Mount a volume with your output directory
- Push files to a Git repository or cloud storage from within the container

### `rift docker commit` is not supported

Container state cannot be saved with `docker commit` in container rental mode. If you need full Docker functionality including `commit`, use **VM mode** where all native Docker commands work.

## Command Errors

### Renting a VM image fails because of the NVIDIA driver

Since v0.62.1, renting a catalog VM image whose NVIDIA driver the node's GPUs cannot load is rejected with a `400` error before the VM is created. This happens with an open-driver image on pre-Turing GPUs (such as the V100, P100, or GTX 10 series) or with an `nvidia-driver-proprietary` image on Blackwell GPUs (such as the RTX 5090 or RTX PRO 6000). Pick an image that matches the GPU: the `nvidia_kernel_module_support` field on instance types tells you which driver flavor the hardware needs. Custom image URLs are not checked.

### CLI crashes with panic/backtrace

If you see an error like `thread 'main' panicked at ...` with a stack backtrace:

1. This is typically a bug in a specific CLI release.
2. **Update to the latest CLI** to get the fix:
   ```shell
   curl -L https://cloudrift.ai/install-rift.sh | sh
   ```
3. If the issue persists after updating, report it on [Discord](https://discord.gg/u8YZZJXdnr) with the full error output.
