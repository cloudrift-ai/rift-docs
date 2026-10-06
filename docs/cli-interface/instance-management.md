---
sidebar_position: 4
title: Instance Management with CloudRift CLI
description: List available instance types and rent VM or Docker instances using the CloudRift CLI public API commands.
keywords: [CloudRift CLI, instance types, rent instance, rift instance, VM rental, Docker rental, instance management]
---

# Instance Management

CloudRift CLI provides commands for discovering available instance types and renting instances through the public API. These commands work with the CloudRift marketplace — unlike `rift docker run` which targets your own cluster, these commands rent instances from available providers.

## Listing Instance Types

To see what instance types are available on the marketplace:

```shell
rift instance-type list
```

This displays available instance types along with availability information.

### Filtering Results

Use `--service` to filter by instance service type:

```shell
rift instance-type list --service docker
rift instance-type list --service vm
```

Use `--datacenter` to filter by datacenter location:

```shell
rift instance-type list --datacenter us-east
```

Filters can be combined:

```shell
rift instance-type list --service vm --datacenter us-east
```

## Renting an Instance

### Renting a VM Instance

To rent a virtual machine instance, use the `--image` flag to specify the VM image:

```shell
rift instance rent --image ubuntu-22.04
```

### Renting a Docker Instance

To rent a Docker container instance, use the `--docker-image` flag:

```shell
rift instance rent --docker-image pytorch/pytorch:latest
```

### Tagging Instances

Use the `--tag` flag to attach free-form labels to an instance at rent time. The flag can be repeated:

```shell
rift instance rent --image ubuntu-22.04 --tag training --tag team-a
```

Tags appear on instance listings and can be used to filter instances through the [REST API](../extras/rest-api.md).

## Listing Instances

To list your instances:

```shell
rift instance list
```

By default the list covers every account you can rent from: your personal account and each team you belong to. Narrow it with a scope filter:

```shell
rift instance list --personal
rift instance list --team <TEAM_UUID>
```

`--team` can be repeated to include several teams, and `--cluster` selects the cluster to list within each account (`default` if omitted). Add `--json` to print the API response as JSON, without credentials, for scripts and tools.

Other display options: `-l` / `--show-limits` shows allocated memory and disk limits, `-c` / `--show-config` shows the instance configuration, `-g` / `--gpu-list` shows the allocated GPU PCI slots, and `-t` / `--truncate-id` shortens UUIDs.

### Failure Reasons

Rentals that fail before becoming active are shown with the `Failed` status, and `rift instance list` displays the failure reason under the affected rental (for example a bad Docker image, a broken container command, or a VM boot failure). Terminating a `Failed` rental dismisses it: the status moves to `Inactive` and it disappears from the default listing. Its resources were already released when the failure was recorded.

## Inspecting an Instance

To see the hardware and connection details of one rental:

```shell
rift instance inspect <INSTANCE>
```

`<INSTANCE>` is the instance name, its UUID, or an unambiguous UUID prefix. The output includes the instance's hardware and the SSH command to reach it. It accepts the same `--personal`, `--team`, and `--cluster` filters as `rift instance list`, and `--json` prints the API response as JSON without credentials.

## Connecting with SSH

To open an SSH session to a rental:

```shell
rift instance ssh <INSTANCE>
```

As with `inspect`, `<INSTANCE>` can be a name, a UUID, or an unambiguous UUID prefix, and the scope filters apply. Options:

- `-u` / `--user` overrides the login user. It is required for Docker containers.
- `-i` / `--identity-file` sets the SSH private key to use.
- Anything after `--` runs as a remote command instead of opening a shell:

```shell
rift instance ssh my-vm -- nvidia-smi
```

:::note

Since v0.62.0, the server only accepts `rift instance rent`, `rift instance list`, and `rift instance terminate` from an up-to-date CLI. If these commands fail with an `unsupported version` error, [update the CLI](../setup/cli.mdx).

:::

:::info

These commands interact with the CloudRift public API to rent instances from marketplace providers. For managing containers on your own cluster, see [Launching Jobs](./launching-jobs.md). For managing VM lifecycle (start/stop), see [VM Management](./vm-management.md). To let a coding agent use these commands, see [AI Agent Skills](./agent-skills.md).

:::
