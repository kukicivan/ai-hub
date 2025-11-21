# API Documentation v1.0.0

## API Version
- **Current version:** v1.0.0
- **Release date:** July 29, 2025
- **Compatibility:** Stable

## Base URL
```
https://outsource-team.do-my-booking.com/v1
```

## Authentication
API uses Laravel Sanctum SPA authentication with session cookies.

### SPA Setup
1. **CSRF Cookie** - First call `/sanctum/csrf-cookie` to get CSRF token
2. **Session-based Auth** - Uses Laravel session authentication
3. **Required Headers:**
   ```
   X-Requested-With: XMLHttpRequest
   X-CSRF-TOKEN: <csrf_token>
   Accept: application/json
   Content-Type: application/json
   ```

## Versioning
API uses semantic versioning (SemVer). Version is specified in the URL:
- `/v1` - Major version 1
- Future versions: `/v2`, `/v3`, etc.

---

## 3.3 API Endpoints

### 3.3.1 Authentication Endpoints

#### POST `/v1/api/auth/register`
**Description:** Register new user

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required, min 8 chars)",
  "firstName": "string (required)",
  "lastName": "string (required)",
  "termsAccepted": "boolean (required)"
}
```

**Response:**
- `201` - User created successfully
- `400` - Validation error
- `409` - Email already exists

---

#### POST `/v1/api/auth/login`
**Description:** User login

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)",
  "password": "string (required)",
  "rememberMe": "boolean (optional)"
}
```

**Response:**
- `200` - Login successful
- `401` - Invalid credentials
- `423` - Account locked

---

#### POST `/v1/api/auth/logout`
**Description:** User logout

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - Logout successful
- `401` - Unauthorized

---

#### POST `/v1/api/auth/forgot-password`
**Description:** Request password reset

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response:**
- `200` - Reset email sent
- `404` - Email not found

---

#### POST `/v1/api/auth/reset-password`
**Description:** Reset password

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "string (required)",
  "password": "string (required)"
}
```

**Response:**
- `200` - Password reset successful
- `400` - Invalid token

---

#### POST `/v1/api/auth/verify-email`
**Description:** Verify email address

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "token": "string (required)"
}
```

**Response:**
- `200` - Email verified
- `400` - Invalid token

---

#### POST `/v1/api/auth/resend-verification`
**Description:** Resend verification email

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "email": "string (required)"
}
```

**Response:**
- `200` - Verification email sent
- `400` - Email already verified

---

#### POST `/v1/api/auth/2fa/enable`
**Description:** Enable 2FA

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - 2FA enabled
- `400` - 2FA already enabled

---

#### POST `/v1/api/auth/2fa/verify`
**Description:** Verify 2FA code

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "string (required)"
}
```

**Response:**
- `200` - 2FA verified
- `400` - Invalid code

---

#### POST `/v1/api/auth/social/google`
**Description:** Google OAuth login

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "accessToken": "string (required)"
}
```

**Response:**
- `200` - Login successful
- `400` - Invalid token

---

#### POST `/v1/api/auth/social/facebook`
**Description:** Facebook OAuth login

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "accessToken": "string (required)"
}
```

**Response:**
- `200` - Login successful
- `400` - Invalid token

---

#### POST `/v1/api/auth/social/github`
**Description:** GitHub OAuth login

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "string (required)"
}
```

**Response:**
- `200` - Login successful
- `400` - Invalid code

---

### 3.3.2 User Management Endpoints

#### GET `/v1/api/users/profile`
**Description:** Get current user profile

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - User profile
- `401` - Unauthorized

---

#### PUT `/v1/api/users/profile`
**Description:** Update user profile

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "phone": "string (optional)",
  "bio": "string (optional)"
}
```

**Response:**
- `200` - Profile updated
- `400` - Validation error
- `401` - Unauthorized

---

#### POST `/v1/api/users/avatar`
**Description:** Upload user avatar

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Request Body:**
```
Content-Type: multipart/form-data
file: binary (required)
```

**Response:**
- `200` - Avatar uploaded
- `400` - Invalid file
- `401` - Unauthorized

---

#### DELETE `/v1/api/users/avatar`
**Description:** Delete user avatar

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - Avatar deleted
- `401` - Unauthorized

---

#### GET `/v1/api/users/settings`
**Description:** Get user settings

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - User settings
- `401` - Unauthorized

---

#### PUT `/v1/api/users/settings`
**Description:** Update user settings

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "notifications": "object (optional)",
  "privacy": "object (optional)",
  "preferences": "object (optional)"
}
```

**Response:**
- `200` - Settings updated
- `400` - Validation error
- `401` - Unauthorized

---

#### POST `/v1/api/users/change-password`
**Description:** Change user password

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "currentPassword": "string (required)",
  "newPassword": "string (required)"
}
```

**Response:**
- `200` - Password changed
- `400` - Invalid current password
- `401` - Unauthorized

---

#### DELETE `/v1/api/users/account`
**Description:** Delete user account

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "password": "string (required)",
  "reason": "string (optional)"
}
```

**Response:**
- `200` - Account deleted
- `400` - Invalid password
- `401` - Unauthorized

---

### 3.3.3 Admin Endpoints

#### GET `/v1/api/admin/users`
**Description:** Get all users (paginated)

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Query Parameters:**
- `page`: number (optional, default: 1)
- `limit`: number (optional, default: 10)
- `search`: string (optional)
- `role`: string (optional)
- `status`: string (optional)

**Response:**
- `200` - Users list
- `401` - Unauthorized
- `403` - Insufficient permissions

---

#### GET `/v1/api/admin/users/:id`
**Description:** Get user by ID

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Path Parameters:**
- `id`: string (required)

**Response:**
- `200` - User details
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - User not found

---

#### PUT `/v1/api/admin/users/:id`
**Description:** Update user

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Path Parameters:**
- `id`: string (required)

**Request Body:**
```json
{
  "firstName": "string (optional)",
  "lastName": "string (optional)",
  "email": "string (optional)",
  "isActive": "boolean (optional)"
}
```

**Response:**
- `200` - User updated
- `400` - Validation error
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - User not found

---

#### DELETE `/v1/api/admin/users/:id`
**Description:** Delete user

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Path Parameters:**
- `id`: string (required)

**Response:**
- `200` - User deleted
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - User not found

---

#### POST `/v1/api/admin/users/:id/roles`
**Description:** Assign role to user

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Path Parameters:**
- `id`: string (required)

**Request Body:**
```json
{
  "roleId": "string (required)"
}
```

**Response:**
- `200` - Role assigned
- `400` - Role already assigned
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - User or role not found

---

#### DELETE `/v1/api/admin/users/:id/roles/:roleId`
**Description:** Remove role from user

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Path Parameters:**
- `id`: string (required)
- `roleId`: string (required)

**Response:**
- `200` - Role removed
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - User or role not found

---

#### GET `/v1/api/admin/roles`
**Description:** Get all roles

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Response:**
- `200` - Roles list
- `401` - Unauthorized
- `403` - Insufficient permissions

---

#### POST `/v1/api/admin/roles`
**Description:** Create new role

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string (required)",
  "description": "string (optional)",
  "permissions": "array (required)"
}
```

**Response:**
- `201` - Role created
- `400` - Validation error
- `401` - Unauthorized
- `403` - Insufficient permissions
- `409` - Role already exists

---

#### PUT `/v1/api/admin/roles/:id`
**Description:** Update role

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
Content-Type: application/json
```

**Path Parameters:**
- `id`: string (required)

**Request Body:**
```json
{
  "name": "string (optional)",
  "description": "string (optional)",
  "permissions": "array (optional)"
}
```

**Response:**
- `200` - Role updated
- `400` - Validation error
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - Role not found

---

#### DELETE `/v1/api/admin/roles/:id`
**Description:** Delete role

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Path Parameters:**
- `id`: string (required)

**Response:**
- `200` - Role deleted
- `401` - Unauthorized
- `403` - Insufficient permissions
- `404` - Role not found
- `409` - Role in use

---

#### GET `/v1/api/admin/analytics`
**Description:** Get system analytics

**Headers:**
```
X-Requested-With: XMLHttpRequest
X-CSRF-TOKEN: <csrf_token>
Accept: application/json
```

**Query Parameters:**
- `period`: string (optional, default: '7d')
- `metric`: string (optional)

**Response:**
- `200` - AIAnalytics data
- `401` - Unauthorized
- `403` - Insufficient permissions

---

## Error Handling

### Standard Error Response Format
```json
{
  "message": "Error description",
  "errors": {
    "field": ["Error message"]
  },
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Unprocessable Entity
- `423` - Locked
- `500` - Internal Server Error

---

## Rate Limiting
- **Limit:** 60 requests per minute per IP address
- **Headers:** Rate limit information is included in response headers:
  ```
  X-RateLimit-Limit: 60
  X-RateLimit-Remaining: 59
  X-RateLimit-Reset: 1627849261
  ```

---

## CORS Configuration
The API supports CORS for browser-based applications:
- **Allowed Origins:** Your frontend domain
- **Allowed Methods:** GET, POST, PUT, DELETE, OPTIONS
- **Allowed Headers:** X-Requested-With, X-CSRF-TOKEN, Accept, Content-Type

---

## Changelog

### v1.0.0 (July 29, 2025)
- Initial API release
- Implemented authentication endpoints with Laravel Sanctum SPA
- Implemented user management endpoints
- Implemented admin endpoints
- Added OAuth support (Google, Facebook, GitHub)
- Implemented 2FA functionality
- Added comprehensive error handling
- Added rate limiting

---

## Future Improvements

### Planned for v1.1.0
- Additional OAuth providers
- Enhanced analytics functionality
- Bulk operations for admin endpoints
- Real-time notifications via WebSocket

### Breaking Changes Policy
- Major versions (v1 → v2) may contain breaking changes
- Minor versions (v1.0 → v1.1) are backward compatible
- Patch versions (v1.0.0 → v1.0.1) contain only bug fixes

---

## Support
For API questions, contact the support team at: api-support@do-my-booking.com

## Documentation
- **API Base URL:** https://outsource-team.do-my-booking.com/v1
- **Frontend URL:** https://outsource-team.do-my-booking.com
- **Documentation URL:** https://docs.do-my-booking.com