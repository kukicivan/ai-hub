# API Routes Documentation

## Overview

This document describes all API routes available in the Messaging Gateway application. Routes follow RESTful conventions with versioning for business logic endpoints.

### Route Structure

| Category | Prefix | Versioning | Auth Required |
|----------|--------|------------|---------------|
| Health Check | `/api/health` | No | No |
| Authentication | `/api/auth` | No | Varies |
| User Management | `/api/v1/users` | Yes | Yes |
| Email | `/api/v1/emails` | Yes | Yes |
| Todos | `/api/v1/todos` | Yes | Yes |
| Sync | `/api/v1/sync` | Yes | Yes |
| Communication | `/api/v1/communication` | Yes | Yes |
| AI Monitoring | `/api/v1/ai` | Yes | Yes |

---

## Health Check

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/health` | Health check endpoint | No |

---

## Authentication Routes

Authentication routes are stable and do not include API versioning.

### Public Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT token |
| POST | `/api/auth/forgot-password` | Request password reset link |
| POST | `/api/auth/reset-password` | Reset password with token |
| GET | `/api/auth/email/verify/{id}/{hash}` | Verify email address |

### Protected Routes (Require JWT)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/logout` | Logout and invalidate token |
| POST | `/api/auth/refresh` | Refresh JWT token |
| GET | `/api/auth/me` | Get current authenticated user |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/email/verification-notification` | Resend verification email |

### Request/Response Examples

#### Login

**Request:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "access_token": "eyJ0eXAiOiJKV1...",
    "token_type": "bearer",
    "expires_in": 3600,
    "refresh_token": "eyJ0eXAiOiJKV1...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "user@example.com"
    }
  },
  "message": "User login successfully."
}
```

#### Register

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "c_password": "password123"
}
```

#### Change Password

**Request:**
```http
POST /api/auth/change-password
Authorization: Bearer {token}
Content-Type: application/json

{
  "current_password": "oldpassword",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

---

## User Management Routes (v1)

All user routes require JWT authentication.

### Current User Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users/me` | Get current user profile with roles/permissions |
| PUT | `/api/v1/users/me` | Update current user profile |
| POST | `/api/v1/users/me/avatar` | Upload user avatar |
| DELETE | `/api/v1/users/me/avatar` | Delete user avatar |

### User Administration (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | List all users |
| POST | `/api/v1/users` | Create a new user |
| GET | `/api/v1/users/{id}` | Get specific user details |
| PUT | `/api/v1/users/{id}` | Update specific user |
| DELETE | `/api/v1/users/{id}` | Delete specific user |
| POST | `/api/v1/users/{id}/reset-password` | Reset user's password |

### Lookup Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user-types` | Get available user types |
| GET | `/api/v1/roles` | Get available roles |

---

## Email Routes (v1)

All email routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/emails` | List all emails (with pagination) |
| GET | `/api/v1/emails/messages` | List all email messages |
| GET | `/api/v1/emails/messages/v5` | List emails with enhanced AI analysis (v5) |
| GET | `/api/v1/emails/{id}` | Get specific email details |
| POST | `/api/v1/emails/{id}/analyze` | Analyze email with AI |
| PATCH | `/api/v1/emails/{id}/read` | Mark email as read |
| PATCH | `/api/v1/emails/{id}/unread` | Mark email as unread |
| POST | `/api/v1/emails/bulk-read` | Bulk mark emails as read |
| POST | `/api/v1/emails/bulk-delete` | Bulk delete emails |
| POST | `/api/v1/emails/respond` | Respond to email |

### Query Parameters for Email List

| Parameter | Type | Description |
|-----------|------|-------------|
| `page` | int | Page number for pagination |
| `per_page` | int | Items per page (default: 15) |
| `q` | string | Search term |
| `unread` | boolean | Filter by unread status |
| `priority` | string | Filter by priority (low, normal, high) |
| `channel_id` | int | Filter by channel |
| `sort` | string | Sort field (created_at, message_timestamp, priority) |

---

## Todo Routes (v1)

All todo routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/todos` | List all todos |
| POST | `/api/v1/todos` | Create a new todo |
| GET | `/api/v1/todos/{id}` | Get specific todo |
| PUT | `/api/v1/todos/{id}` | Update specific todo |
| DELETE | `/api/v1/todos/{id}` | Delete specific todo |
| PATCH | `/api/v1/todos/{id}/toggle` | Toggle todo completion |
| POST | `/api/v1/todos/from-email` | Create todo from email |

---

## Sync Orchestrator Routes (v1)

All sync routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/sync/mail` | Trigger mail synchronization |
| POST | `/api/v1/sync/ai` | Trigger AI analysis sync |
| POST | `/api/v1/sync/ai/{id}` | Trigger AI analysis for specific email |
| GET | `/api/v1/sync/status` | Get current sync status |
| POST | `/api/v1/sync/cancel` | Cancel ongoing sync operation |

---

## AI Communication Routes (v1)

All AI communication routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/communication/ai-dashboard` | Get AI dashboard data |
| GET | `/api/v1/communication/ai-message/{message_id}` | Analyze single message |

---

## AI Monitoring Routes (v1)

All AI monitoring routes require JWT authentication.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/ai/usage` | Get AI usage statistics |

---

## Error Responses

All API errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Server Error |

---

## Authentication

All protected routes require a valid JWT token in the Authorization header:

```http
Authorization: Bearer {access_token}
```

### Token Refresh

When the access token expires, use the refresh endpoint:

```http
POST /api/auth/refresh
Authorization: Bearer {refresh_token}
```

---

## Rate Limiting

API requests are rate-limited to prevent abuse:

- **Authentication routes:** 5 requests per minute
- **Other routes:** 60 requests per minute

When rate limited, the API returns:
- Status: `429 Too Many Requests`
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`

---

## CORS

The API supports CORS for the following origins (configurable):
- `http://localhost:3000`
- `http://localhost:5173`
- Production domain

---

## Frontend API Files

The frontend uses RTK Query for API calls. Here are the API files and their endpoints:

### authApi.ts
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

### userApi.ts
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/avatar` - Upload avatar
- `DELETE /api/v1/users/me/avatar` - Delete avatar
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### emailApi.ts
- `GET /api/v1/emails/messages` - Get messages
- `GET /api/v1/emails/messages/v5` - Get messages with AI analysis
- `GET /api/v1/emails/{id}` - Get single message
- `POST /api/v1/emails/{id}/analyze` - Analyze message
- `PATCH /api/v1/emails/{id}/read` - Mark as read
- `PATCH /api/v1/emails/{id}/unread` - Mark as unread
- `POST /api/v1/emails/bulk-read` - Bulk mark as read
- `POST /api/v1/emails/bulk-delete` - Bulk delete
- `POST /api/v1/emails/respond` - Respond to email

### todoApi.ts
- `GET /api/v1/todos` - Get todos
- `POST /api/v1/todos` - Create todo
- `GET /api/v1/todos/{id}` - Get single todo
- `PUT /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo
- `PATCH /api/v1/todos/{id}/toggle` - Toggle completion
- `POST /api/v1/todos/from-email` - Create from email

---

## Changelog

### Version 1.0.0 (Current)

- Initial versioned API release
- Authentication routes at `/api/auth/*`
- User management at `/api/v1/users/*`
- Email routes at `/api/v1/emails/*`
- Todo routes at `/api/v1/todos/*`
- Sync routes at `/api/v1/sync/*`
- AI routes at `/api/v1/ai/*` and `/api/v1/communication/*`
- All business routes require authentication
- No public legacy routes
