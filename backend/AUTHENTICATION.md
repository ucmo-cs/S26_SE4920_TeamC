# Authentication & Session Token System

This document describes how the backend handles user authentication and identifies users based on session tokens.

## Overview

The backend implements **JWT (JSON Web Token)** based authentication. Users login with credentials to receive a session token, which they then include in subsequent requests to identify themselves.

## Authentication Flow

```
Client Login Request
    ↓
Login Handler Verifies Credentials
    ↓
JWT Token Generated & Returned
    ↓
Client Stores Token Locally
    ↓
Client Includes Token in Authorization Header (Bearer Token)
    ↓
Auth Middleware Validates Token
    ↓
User Info Attached to Request
    ↓
Handler Accesses User Data via event.user
```

## Components

### 1. Login Handler (`src/handlers/login.js`)
- **Path:** `POST /dev/login`
- **Purpose:** Authenticates user with username and password
- **Returns:** JWT token (sessionToken) if credentials are valid

**Example Request:**
```bash
curl -X POST http://localhost:3000/dev/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john-doe-uuid",
    "password": "password123"
  }'
```

**Example Response:**
```json
{
  "message": "Login successful",
  "auth": true,
  "sessionToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. JWT Token Structure
The JWT token contains:
- **uuid**: User's unique identifier
- **roles**: Array of user roles (e.g., ["ADMIN", "LEAD", "EMPLOYEE"])
- **exp**: Token expiration time (24 hours from creation)

### 3. Auth Middleware (`src/middleware/auth.js`)
Provides authentication and authorization utilities:

#### `authenticateToken(event)`
Main middleware function that:
- Extracts Bearer token from Authorization header
- Verifies token signature and expiration
- Attaches decoded user info to `event.user`
- Returns error if token is invalid or missing

```javascript
module.exports.handler = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }
  // Token is valid, event.user contains user info
  return handler(event);
};
```

#### Helper Functions

**`getAuthenticatedUserId(event)`**
Returns the UUID of the authenticated user.
```javascript
const userId = getAuthenticatedUserId(event);
```

**`getAuthenticatedUser(event)`**
Returns the full user object with uuid and roles.
```javascript
const user = getAuthenticatedUser(event);
console.log(user.uuid, user.roles);
```

**`hasRole(event, role)`**
Checks if user has a specific role.
```javascript
if (hasRole(event, 'ADMIN')) {
  // Admin operations
}
```

**`requireRole(event, requiredRoles)`**
Enforces role-based access. Returns error response if user lacks required role.
```javascript
const authError = requireRole(event, 'ADMIN');
if (authError) {
  return authError;
}
// User has ADMIN role, proceed
```

Multiple roles can be checked (user needs one of them):
```javascript
const authError = requireRole(event, ['ADMIN', 'LEAD']);
if (authError) {
  return authError;
}
```

## Using in Handlers

### Basic Pattern
```javascript
const { authenticateToken } = require("../middleware/auth");

const handler = async (event) => {
  // Handler logic here
  const userId = event.user.uuid;
  // Access database for this user...
};

module.exports.handler = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }
  return handler(event);
};
```

### With Role Check
```javascript
const { authenticateToken, requireRole } = require("../middleware/auth");

const handler = async (event) => {
  // Handler logic - only ADMIN users reach here
};

module.exports.handler = async (event) => {
  const authError = authenticateToken(event);
  if (authError) return authError;
  
  const roleError = requireRole(event, 'ADMIN');
  if (roleError) return roleError;
  
  return handler(event);
};
```

### Getting User Information
```javascript
const { authenticateToken, getAuthenticatedUser, getAuthenticatedUserId } = require("../middleware/auth");

const handler = async (event) => {
  const userId = getAuthenticatedUserId(event); // Just the UUID
  const user = getAuthenticatedUser(event);      // Full object with uuid and roles
  
  // Use to restrict access to own resources
  if (event.pathParameters.userId !== userId) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Cannot access other users' data" })
    };
  }
};

module.exports.handler = async (event) => {
  const authError = authenticateToken(event);
  if (authError) return authError;
  return handler(event);
};
```

## Client Usage (Frontend)

### 1. Login & Store Token
```typescript
// auth.service.ts
login(username: string, password: string) {
  return this.http.post('/dev/login', { username, password })
    .pipe(
      tap(response => {
        if (response.sessionToken) {
          localStorage.setItem('sessionToken', response.sessionToken);
        }
      })
    );
}
```

### 2. Include Token in Requests
Create an HTTP interceptor to automatically include the token:
```typescript
// auth.interceptor.ts
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('sessionToken');
    
    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    
    return next.handle(req);
  }
}
```

### 3. Handle Token Expiration
```typescript
// If backend returns 403, token expired
if (error.status === 403) {
  localStorage.removeItem('sessionToken');
  // Redirect to login
  this.router.navigate(['/login']);
}
```

## Environment Variables

Set these in your environment or `.env` file:

| Variable | Default | Purpose |
|----------|---------|---------|
| `JWT_SECRET` | `dev-secret-key-change-in-production` | Secret key for signing/verifying JWT tokens |
| `AUTH_TABLE` | `authorization` | DynamoDB table storing user credentials |
| `USERS_TABLE` | `users` | DynamoDB table storing user data |

**Important:** In production, set `JWT_SECRET` to a strong, unique value:
```bash
export JWT_SECRET="your-super-secret-key-at-least-32-characters"
```

## Security Best Practices

1. **Never hardcode JWT_SECRET** - Always use environment variables
2. **Use HTTPS in production** - Tokens should only be sent over encrypted connections
3. **Token expiration** - Tokens expire after 24 hours; user must login again
4. **Secure storage** - Store tokens in localStorage/sessionStorage only, never in plain text
5. **Role validation** - Always validate user roles server-side, never trust client claims
6. **User isolation** - Verify users can only access their own data using `getAuthenticatedUserId(event)`

## Troubleshooting

### "Access token required" Error
- Client didn't include Authorization header
- Fix: Ensure interceptor/middleware adds `Authorization: Bearer <token>` header

### "Invalid or expired token" Error
- Token is malformed or signature doesn't match
- Token has expired (older than 24 hours)
- Junior secret was changed (old tokens invalid)
- Fix: User needs to login again to get new token

### User ID Mismatch
- `event.user.uuid` doesn't match expected user
- Ensure token was generated for correct user
- Check that client is using correct token

## Token Validation Example

Test token validation locally:
```bash
# 1. Login to get token
TOKEN=$(curl -s -X POST http://localhost:3000/dev/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john-doe-uuid","password":"password123"}' | jq -r '.sessionToken')

# 2. Use token in authenticated request
curl -X GET http://localhost:3000/dev/users/john-doe-uuid \
  -H "Authorization: Bearer $TOKEN"
```

## Additional Resources

- JWT Learning: https://jwt.io/
- jsonwebtoken npm: https://www.npmjs.com/package/jsonwebtoken
- Token best practices: https://owasp.org/www-community/attacks/JSON_Web_Token_(JWT)_Attacks
