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

### Google SSO accounts cannot use `rift configure`

The CLI currently requires email/password authentication. If you registered with Google SSO:

1. Use API keys for programmatic access instead.
2. Contact support to set up password-based credentials for your account.

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

### CLI crashes with panic/backtrace

If you see an error like `thread 'main' panicked at ...` with a stack backtrace:

1. This is typically a bug in a specific CLI release.
2. **Update to the latest CLI** to get the fix:
   ```shell
   curl -L https://cloudrift.ai/install-rift.sh | sh
   ```
3. If the issue persists after updating, report it on [Discord](https://discord.gg/u8YZZJXdnr) with the full error output.
