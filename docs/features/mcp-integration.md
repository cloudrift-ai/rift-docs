---
sidebar_position: 4
title: MCP Integration
description: Use the CloudRift MCP endpoint to manage instances through LLM tools like Claude Code and Claude Desktop.
keywords: [CloudRift MCP, Model Context Protocol, Claude Code, Claude Desktop, LLM integration, AI cloud management]
---

# MCP Integration

CloudRift exposes its REST API as [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) tools, enabling LLM-powered applications to manage cloud instances directly.

## Endpoint

```
POST https://api.cloudrift.ai/mcp
```

The MCP endpoint accepts standard MCP protocol messages and is compatible with any MCP client, including Claude Code, Claude Desktop, and other MCP-compatible tools.

## Supported Tools

The following CloudRift operations are available as MCP tools:

| Tool | Description |
|------|-------------|
| `list_instance_types` | List available instance types with pricing and availability |
| `rent_instance` | Rent a new VM or Docker instance |
| `list_instances` | List your active instances |
| `terminate_instances` | Terminate running instances |
| `stop_instances` | Stop running instances |
| `start_instances` | Start stopped instances |
| `get_account_info` | Get account balance and details |

## Authentication

The MCP endpoint uses the same authentication as the REST API — provide your API key or JWT token in the request headers.
