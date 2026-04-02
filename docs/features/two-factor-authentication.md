---
sidebar_position: 6
title: Two-Factor Authentication
description: Secure your CloudRift account with TOTP-based two-factor authentication using Google Authenticator or any compatible app.
keywords: [CloudRift 2FA, two-factor authentication, TOTP, Google Authenticator, account security, MFA]
---

# Two-Factor Authentication

CloudRift supports TOTP-based two-factor authentication (2FA) for account security. Once enabled, logging in requires both your password and a time-based one-time password from an authenticator app such as Google Authenticator, Authy, or 1Password.

## Enabling 2FA

Enabling 2FA is a two-step process:

### 1. Generate a TOTP Secret

```
POST /api/v1/auth/totp/setup
```

Returns a TOTP secret and a provisioning URI. Scan the provisioning URI as a QR code with your authenticator app, or enter the secret manually.

### 2. Confirm Activation

```
POST /api/v1/auth/totp/confirm
```

Submit the six-digit code shown in your authenticator app to verify the setup and activate 2FA on your account. This step ensures your authenticator app is configured correctly before 2FA takes effect.

## Logging In with 2FA

When 2FA is enabled, the login flow changes to a two-step process:

### 1. Authenticate with Credentials

```
POST /api/v1/auth/login
```

Instead of returning a full session token, this now returns a `partial_token` when 2FA is active on the account.

### 2. Complete with OTP

```
POST /api/v1/auth/totp/complete
```

Submit the `partial_token` along with the current six-digit code from your authenticator app. On success, this returns a full session token.

> **Note (v0.57.0):** The `pat` field has been removed from both `/api/v1/auth/login` and `/api/v1/auth/totp/complete` responses. Only the JWT session token is returned.

## Disabling 2FA

```
POST /api/v1/auth/totp/disable
```

Submit a valid TOTP code to disable 2FA on your account. After disabling, login returns a full session token directly.

## API Reference

See the [Swagger UI](https://api.cloudrift.ai/swagger-ui/) for full request and response schemas for all TOTP endpoints.
