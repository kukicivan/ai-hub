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
  "message": "User registered successfully."
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

**Response:**
```json
{
  "success": true,
  "data": [],
  "message": "Password changed successfully"
}
```

#### Forgot Password

**Request:**
```http
POST /api/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": [],
  "message": "Password reset link sent"
}
```

#### Reset Password

**Request:**
```http
POST /api/auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_here",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response:**
```json
{
  "success": true,
  "data": [],
  "message": "Password reset successful"
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

### Bulk Operations (Admin Only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/users/bulk-delete` | Delete multiple users |
| POST | `/api/v1/users/bulk-update-type` | Update user type for multiple users |
| GET | `/api/v1/users/stats` | Get user statistics |
| POST | `/api/v1/users/export` | Export users data |
| POST | `/api/v1/users/{id}/avatar` | Upload user avatar (admin) |
| DELETE | `/api/v1/users/{id}/avatar` | Delete user avatar (admin) |

### Lookup Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/user-types` | Get available user types |
| GET | `/api/v1/roles` | Get available roles |

### User Management Response Examples

#### Get Users List

**Request:**
```http
GET /api/v1/users?page=1&per_page=15&search=john&sort_by=created_at&sort_order=desc
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "user_type_id": 2,
        "user_type": { "id": 2, "name": "admin" },
        "roles": [{ "id": 1, "name": "admin" }],
        "email_verified_at": "2024-01-15T10:30:00Z",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "total": 100,
      "per_page": 15,
      "current_page": 1,
      "last_page": 7,
      "from": 1,
      "to": 15
    }
  },
  "message": "Users retrieved successfully"
}
```

#### Create User

**Request:**
```http
POST /api/v1/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "user_type_id": 2,
  "phone": "123-456-7890"
}
```

**Response (201):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "New User",
      "email": "newuser@example.com",
      "user_type_id": 2,
      "roles": [{ "id": 2, "name": "user" }]
    }
  },
  "message": "User created successfully"
}
```

#### Update User

**Request:**
```http
PUT /api/v1/users/5
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "987-654-3210"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 5,
      "name": "Updated Name",
      "phone": "987-654-3210"
    }
  },
  "message": "User updated successfully"
}
```

#### Delete User

**Request:**
```http
DELETE /api/v1/users/5
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": [],
  "message": "User deleted successfully"
}
```

#### Bulk Delete Users

**Request:**
```http
POST /api/v1/users/bulk-delete
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [5, 6, 7]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deleted_count": 3
  },
  "message": "3 user(s) deleted successfully"
}
```

#### Bulk Update User Type

**Request:**
```http
POST /api/v1/users/bulk-update-type
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [5, 6, 7],
  "user_type_id": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated_count": 3
  },
  "message": "3 user(s) updated successfully"
}
```

#### Get User Statistics

**Request:**
```http
GET /api/v1/users/stats
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "stats": {
      "total_users": 150,
      "verified_users": 120,
      "unverified_users": 30,
      "users_this_month": 15,
      "users_last_month": 12,
      "growth_percentage": 25.0,
      "users_by_type": [
        { "user_type_id": 1, "user_type_name": "admin", "count": 5 },
        { "user_type_id": 2, "user_type_name": "user", "count": 145 }
      ]
    }
  },
  "message": "User statistics retrieved successfully"
}
```

#### Export Users

**Request:**
```http
POST /api/v1/users/export
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "users": [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "123-456-7890",
        "user_type": "admin",
        "roles": "admin",
        "email_verified": "Yes",
        "created_at": "2024-01-15 10:30:00"
      }
    ],
    "columns": ["id", "name", "email", "phone", "user_type", "roles", "city", "state", "country", "email_verified", "created_at", "updated_at"]
  },
  "message": "Users exported successfully"
}
```

#### Get User Types

**Response:**
```json
{
  "success": true,
  "data": {
    "userTypes": [
      { "id": 1, "name": "admin", "description": "Administrator" },
      { "id": 2, "name": "user", "description": "Regular user" }
    ]
  },
  "message": "User types retrieved successfully"
}
```

#### Get Roles

**Response:**
```json
{
  "success": true,
  "data": {
    "roles": [
      { "id": 1, "name": "admin", "guard_name": "api", "permissions": [...] },
      { "id": 2, "name": "user", "guard_name": "api", "permissions": [...] }
    ]
  },
  "message": "Roles retrieved successfully"
}
```

---

## User Profile Routes (v1)

### Profile Response Examples

#### Get Profile

**Request:**
```http
GET /api/v1/users/me
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "123-456-7890",
      "bio": "Software developer",
      "avatar": "avatars/user1.jpg",
      "avatar_url": "https://example.com/storage/avatars/user1.jpg",
      "roles": [{ "id": 1, "name": "admin" }],
      "permissions": [...]
    }
  },
  "message": "Profile retrieved successfully"
}
```

#### Update Profile

**Request:**
```http
PUT /api/v1/users/me
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Updated",
  "phone": "987-654-3210",
  "bio": "Updated bio"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Updated",
      "phone": "987-654-3210",
      "bio": "Updated bio"
    }
  },
  "message": "Profile updated successfully"
}
```

#### Upload Avatar

**Request:**
```http
POST /api/v1/users/me/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

avatar: [binary file]
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "avatar": "avatars/1699012345.jpg",
      "avatar_url": "https://example.com/storage/avatars/1699012345.jpg"
    }
  },
  "message": "Avatar uploaded successfully"
}
```

#### Delete Avatar

**Request:**
```http
DELETE /api/v1/users/me/avatar
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "avatar": null,
      "avatar_url": null
    }
  },
  "message": "Avatar deleted successfully"
}
```

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
| `per_page` | int | Items per page (default: 15, max: 200) |
| `q` | string | Search term |
| `unread` | boolean | Filter by unread status |
| `priority` | string | Filter by priority (low, normal, high) |
| `channel_id` | int | Filter by channel |
| `sort` | string | Sort field (created_at, message_timestamp, priority) |

### Email Response Examples

#### Get Messages (v5 with AI Analysis)

**Request:**
```http
GET /api/v1/emails/messages/v5?page=1&per_page=25&unread=true
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "msg_abc123",
        "sender": "client@example.com",
        "subject": "Project Inquiry",
        "summary": "Client inquiring about project timeline and pricing",
        "sentiment": {
          "tone": "professional",
          "urgency_score": 7,
          "business_potential": 8
        },
        "gmail_link": "https://mail.google.com/mail/u/0/#inbox/msg_abc123",
        "action_steps": [
          {
            "type": "REPLY",
            "deadline": "2024-01-20",
            "timeline": "within_24h",
            "description": "Respond with project proposal",
            "estimated_time": 30,
            "template_suggestion": "project_proposal"
          }
        ],
        "html_analysis": {
          "cleaned_text": "Hello, I am interested in your services...",
          "is_newsletter": false,
          "urgency_markers": ["urgent", "asap"],
          "structure_detected": "business_inquiry"
        },
        "classification": {
          "primary_category": "business",
          "subcategory": "inquiry",
          "confidence_score": 0.92,
          "matched_keywords": ["project", "pricing", "timeline"]
        },
        "recommendation": {
          "text": "High priority - respond within 24 hours",
          "reasoning": "Potential high-value client with specific requirements",
          "priority_level": "high",
          "roi_estimate": "$$$$"
        },
        "unread": true,
        "starred": false,
        "important": true,
        "priority": "high",
        "received_at": "2024-01-15T10:30:00Z",
        "synced_at": "2024-01-15T10:35:00Z",
        "ai_processed_at": "2024-01-15T10:36:00Z",
        "ai_status": "completed"
      }
    ],
    "meta": {
      "page": 1,
      "per_page": 25,
      "total": 150,
      "total_pages": 6
    }
  },
  "message": "Messages retrieved successfully"
}
```

#### Get Single Message

**Request:**
```http
GET /api/v1/emails/5
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": "msg_abc123",
      "sender": "client@example.com",
      "subject": "Project Inquiry",
      "summary": "...",
      "sentiment": { "..." },
      "action_steps": ["..."],
      "classification": { "..." }
    }
  },
  "message": "Message retrieved successfully"
}
```

#### Mark as Read

**Request:**
```http
PATCH /api/v1/emails/5/read
Authorization: Bearer {token}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "message": {
      "id": 5,
      "is_unread": false
    }
  },
  "message": "Message marked as read"
}
```

#### Bulk Mark as Read

**Request:**
```http
POST /api/v1/emails/bulk-read
Authorization: Bearer {token}
Content-Type: application/json

{
  "ids": [5, 6, 7]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "updated": 3
  },
  "message": "Messages marked as read"
}
```

#### Respond to Email

**Request:**
```http
POST /api/v1/emails/respond
Authorization: Bearer {token}
Content-Type: application/json

{
  "from": "me@example.com",
  "to": "client@example.com",
  "subject": "Re: Project Inquiry",
  "body": "Thank you for your inquiry..."
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sent": true,
    "message_id": "sent_xyz789"
  },
  "message": "Email sent successfully"
}
```

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

## API Response Format (SRS 12.2)

All API responses follow a standardized format for consistency across the application.

### Success Response

```json
{
  "success": true,
  "data": {
    // Response payload - varies by endpoint
  },
  "message": "Operation successful"
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error description",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

**Notes:**
- `success` - Boolean indicating operation result
- `data` - Contains the actual response data (object, array, or empty)
- `message` - Human-readable message describing the result
- `errors` - Optional field containing validation errors (key-value pairs where key is field name and value is array of error messages)

### Response Examples by Category

#### User List Response
```json
{
  "success": true,
  "data": {
    "users": [...],
    "pagination": {
      "total": 100,
      "per_page": 15,
      "current_page": 1,
      "last_page": 7,
      "from": 1,
      "to": 15
    }
  },
  "message": "Users retrieved successfully"
}
```

#### Single Resource Response
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com"
    }
  },
  "message": "User retrieved successfully"
}
```

#### Validation Error Response
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

---

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

The frontend uses RTK Query for API calls. All API files are located in `frontend/src/redux/features/`.

### authApi.ts (`redux/features/auth/authApi.ts`)
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/register` - Register
- `GET /api/auth/me` - Get current user

**Response handling:** Uses `unwrapAuthResponse()` to extract `data` from SRS 12.2 format.

### userApi.ts (`redux/features/user/userApi.ts`)
- `GET /api/v1/users/me` - Get profile
- `PUT /api/v1/users/me` - Update profile
- `POST /api/v1/users/me/avatar` - Upload avatar
- `DELETE /api/v1/users/me/avatar` - Delete avatar
- `POST /api/auth/change-password` - Change password
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password
- `DELETE /api/v1/users/me` - Delete account

**Response handling:** Uses `isWrapped()` for profile operations, `extractMessage()` for password operations.

### userManagementApi.ts (`redux/features/userManagement/userManagementApi.ts`)
- `GET /api/v1/users` - Get users list with pagination/filters
- `GET /api/v1/users/{id}` - Get single user
- `POST /api/v1/users` - Create user
- `PUT /api/v1/users/{id}` - Update user
- `DELETE /api/v1/users/{id}` - Delete user
- `POST /api/v1/users/{id}/reset-password` - Reset user password (admin)
- `POST /api/v1/users/{id}/avatar` - Upload user avatar (admin)
- `DELETE /api/v1/users/{id}/avatar` - Delete user avatar (admin)
- `POST /api/v1/users/bulk-delete` - Bulk delete users
- `POST /api/v1/users/bulk-update-type` - Bulk update user types
- `GET /api/v1/users/stats` - Get user statistics
- `POST /api/v1/users/export` - Export users
- `GET /api/v1/user-types` - Get user types
- `GET /api/v1/roles` - Get roles

**Response handling:** Uses `isWrapped()` for standard responses, custom `transformResponse` for bulk operations and exports.

### emailApi.ts (`redux/features/email/emailApi.ts`)
- `GET /api/v1/emails/messages` - Get messages
- `GET /api/v1/emails/messages/v5` - Get messages with AI analysis
- `GET /api/v1/emails/{id}` - Get single message
- `POST /api/v1/emails/{id}/analyze` - Analyze message
- `PATCH /api/v1/emails/{id}/read` - Mark as read
- `PATCH /api/v1/emails/{id}/unread` - Mark as unread
- `POST /api/v1/emails/bulk-read` - Bulk mark as read
- `POST /api/v1/emails/bulk-delete` - Bulk delete
- `POST /api/v1/emails/respond` - Respond to email

**Response handling:** Uses `unwrapResponse()` to handle both legacy and SRS 12.2 formats.

### todoApi.ts (`redux/features/todo/todoApi.ts`)
- `GET /api/v1/todos` - Get todos
- `POST /api/v1/todos` - Create todo
- `GET /api/v1/todos/{id}` - Get single todo
- `PUT /api/v1/todos/{id}` - Update todo
- `DELETE /api/v1/todos/{id}` - Delete todo
- `PATCH /api/v1/todos/{id}/toggle` - Toggle completion
- `POST /api/v1/todos/from-email` - Create from email

**Response handling:** Uses `isWrapped()` for standard responses.

---

## Changelog

### Version 1.2.0 (Current)

- **Complete API Documentation Update**
  - Added detailed request/response examples for all endpoints
  - Added User Management bulk operations documentation
  - Added User Profile endpoints documentation
  - Added Email v5 response structure with AI analysis fields
  - Added userManagementApi.ts to Frontend API Files
  - Documented response handling functions for each API file

### Version 1.1.0

- **Standardized API Response Format (SRS 12.2)**
  - All responses now follow consistent format: `{ success, data, message }`
  - Error responses include `errors` field for validation errors
  - All messages are now in English
  - Updated frontend API handlers to support new format
  - Added `extractMessage()` helper for password operations
  - Migrated EmailResponder to RTK Query

### Version 1.0.0

- Initial versioned API release
- Authentication routes at `/api/auth/*`
- User management at `/api/v1/users/*`
- Email routes at `/api/v1/emails/*`
- Todo routes at `/api/v1/todos/*`
- Sync routes at `/api/v1/sync/*`
- AI routes at `/api/v1/ai/*` and `/api/v1/communication/*`
- All business routes require authentication
- No public legacy routes
