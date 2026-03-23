---
sidebar_position: 3
title: CloudRift REST API Documentation
description: CloudRift REST API documentation for direct HTTP access. Complete API reference with generated documentation for cluster management and job execution.
keywords: [CloudRift REST API, HTTP API, API documentation, RapiDoc, API reference, web service, HTTP endpoints, API integration]
---

# REST API

CloudRift provides a full REST API for managing instances, clusters, networks, volumes, reservations, and more. You can explore and test API endpoints using either of the interactive documentation tools below:

- **[Swagger UI](https://api.cloudrift.ai/swagger-ui/)** — recommended, with full OpenAPI 3.1 support.
- **[RapiDoc](https://api.cloudrift.ai/rapidoc)** — alternative interactive API reference.

All API endpoints support authentication via user JWT token, user API key, or team API key.

## Key Capabilities

Beyond standard instance and cluster management, the API includes:

- **MCP integration** — `POST /mcp` endpoint exposes CloudRift operations as MCP tools for LLM integration (Claude Code, Claude Desktop, etc.).
- **Node metrics** — `/api/v1/nodes/metrics/list` for GPU and MIG instance metrics.
- **Instance GPU metrics** — `POST /api/v1/instances/metrics` for per-instance GPU metrics (utilization, temperature, VRAM, power draw) scoped by the instance's allocated GPU mask.
- **Two-factor authentication** — TOTP-based 2FA endpoints for setting up, verifying, and managing two-factor authentication on accounts. See [Two-Factor Authentication](/features/two-factor-authentication).
- **Admin user & team management** — Endpoints for listing, searching, creating users, and managing teams with financial settings. Supports team invite by email for users who don't yet have an account.
- **Custom recipes** — Create and manage recipes for virtual machines and containers at the user or team level.
- **Team API key support** — `/api/v1/auth/me` supports team API key authentication in addition to user tokens.

Refer to the [Swagger UI](https://api.cloudrift.ai/swagger-ui/) for the complete endpoint reference.
