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
- **Custom recipes** — Create and manage recipes for virtual machines and containers at the user or team level. `recipes/list` can return each VM image's metadata (`with_image_metadata`) and its rent verdict for a given node or variant selector (`compatibility`).
- **Instance tags** — Attach free-form `tags` at rent time and filter `POST /api/v1/instances/list` with the `ByTags` selector (`all` / `any`).
- **Opt-in instance credentials** — `POST /api/v1/instances/list` omits instance passwords unless you set `mask.with_credentials`. See [v0.61.0](/changelog/2026#v0.61.0).
- **Saved environments**: `POST /api/v1/instances/saved-environments/list` lists the disks of terminated VM rentals that can be re-attached to a new rental on the same node with `reuse_environment_id`. Since v0.63.3 a disk is kept beyond the erase grace period while the node has space, and erased oldest-first when a new rental needs the room or the node is drained; `protected_until` replaces the deprecated `expires_at`. Reuse needs a VM instance with a disk at least as large as the saved one.
- **Released capacity**: `resources_released` in instance info tells you when a terminated instance's capacity is available to rent again.
- **NVIDIA driver compatibility**: `nvidia_kernel_module_support` on GPUs, instance types, reservations and quotas tells you which NVIDIA driver flavor (open or proprietary) a VM image needs for that hardware. Since v0.63.3, rent validation reads the image's own metadata: an incompatible image is rejected with a message naming what to pick instead, and an image with unknown metadata is allowed. See [v0.63.3](/changelog/2026#v0.63.3).
- **Node list queries**: `POST /api/v1/nodes/list` takes an optional `query` for pagination, search, filtering and sorting, and returns a summary with totals, status counts and filter options. Listings include `datacenter_name`, `provider_name` and per-GPU health.
- **Capabilities**: `POST /api/v1/capabilities/list` needs no permission and reports your effective `permissions`, `scope`, operable `providers` and per-provider `provider_permissions`. `features`, `is_admin` and `provider_name` are deprecated.
- **Provider access grants**: provider roots grant users or teams Operator or Viewer access to a provider with `POST /api/v1/providers/access/grant`, `/revoke` and `/list`. Permissions are enforced per provider.
- **Renter-scoped networks**: the `ByRenter` selector on `POST /api/v1/network/list` returns only the networks a rental by a given team or user can use.
- **Unallocated capacity**: node info includes `unallocated`, the free capacity that no allocation holds and that other accounts can rent.
- **Team API key support** — `/api/v1/auth/me` supports team API key authentication in addition to user tokens. Also returns `totp_enabled` to indicate whether 2FA is active on the account.

Refer to the [Swagger UI](https://api.cloudrift.ai/swagger-ui/) for the complete endpoint reference.
