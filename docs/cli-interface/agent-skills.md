---
sidebar_position: 5
title: AI Agent Skills for the CloudRift CLI
description: Install the CloudRift skill for coding agents such as Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, and OpenCode, so they can find rentals, inspect hardware, and connect over SSH with the rift CLI.
keywords: [CloudRift CLI, rift agent, AI agent skill, Claude Code, Codex, Cursor, GitHub Copilot, Gemini CLI, OpenCode, coding agents]
---

# AI Agent Skills

Since v0.62.1, the CloudRift CLI ships a skill that teaches coding agents how to use `rift`: finding your rentals, inspecting their hardware, and connecting over SSH. Both commands below work offline.

## Reading the Guide

To print the instructions and command reference for the CLI version you have installed:

```shell
rift agent guide
```

Agents without a skill can read the same guide from this command.

## Installing the Skill

To install or refresh the CloudRift skill for the agents found on your machine:

```shell
rift agent install
```

Without options, the command detects installed agents and installs the skill for your user account (`--global`, the default). Use `--agent` to pick agents yourself; the flag can be repeated:

```shell
rift agent install --agent claude --agent codex
```

Supported values are `codex`, `claude`, `cursor`, `copilot`, `gemini`, and `opencode`.

To install the skill into a single project instead of your user account, pass the project directory:

```shell
rift agent install --project ./my-project
```

Running the command again refreshes the skills it manages and preserves local edits you made to them.

### Where the Skill Is Installed

| Agent | User install | Project install |
|---|---|---|
| Claude Code | `~/.claude/skills/cloudrift` | `.claude/skills/cloudrift` |
| Codex | `~/.agents/skills/cloudrift` | `.agents/skills/cloudrift` |
| Cursor | `~/.cursor/skills/cloudrift` | `.cursor/skills/cloudrift` |
| GitHub Copilot | `~/.copilot/skills/cloudrift` | `.github/skills/cloudrift` |
| Gemini CLI | `~/.gemini/skills/cloudrift` | `.gemini/skills/cloudrift` |
| OpenCode | `~/.config/opencode/skills/cloudrift` | `.opencode/skills/cloudrift` |

After installing, load the skill: run `/reload-skills` in Claude Code, `/skills reload` in Gemini CLI or GitHub Copilot, or start a new session in the other agents.

## Installer Behavior

The Linux and Mac installation script runs `rift agent install --global` after installing the CLI, so detected agents get the skill automatically. To skip that step:

```shell
curl -L https://cloudrift.ai/install-rift.sh | sh -s -- --agent-skills=skip
```

You can install the skill later with `rift agent install`.
