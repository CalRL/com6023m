# ENDPOINTS
# Auth Endpoints

##POST /api/auth/register
Registers a new user by accepting a username, email, and password, then returns an access token in the response 
and sets a secure HTTP-only refresh token cookie.
### Request Payload
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response Payload
```json
{
  "accessToken": "jwt-access-token"
}
```

## POST /api/auth/login
Logs in a user using their email and password, returning an access token and setting a secure HTTP-only refresh token 
cookie if authentication succeeds.
### Request Payload
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Response Payload
If password matches:
```json
{
  "accessToken": "jwt-access-token"
}
```

## POST /api/auth/logout
Logs the user out by clearing the refresh token cookie.
### Request Payload
None

### Response Payload
```
204 No Content
```

## POST /api/auth/refresh
Generates a new access token using the refresh token (from cookies). Requires the user to have a valid, non-expired 
refresh token already stored in cookies.
### Request Payload
None (relies on the refreshToken cookie)

### Response Payload
```json
{
  "accessToken": "new-jwt-access-token"
}
```

## GET /api/auth/check
Checks whether the user is authenticated. If the access token is valid, returns user info. If expired but a valid 
refresh token exists, returns user info along with a new access token.
### Request Payload
None

### Response Payload
If access token is valid:
```json
{
  "id": 1,
  "email": "john@example.com"
}
```
If access token expired but refreshToken is valid:
```json
{
  "id": 1,
  "email": "john@example.com",
  "accessToken": "new-jwt-access-token"
}
```
Else:
```json
{
  "message": "No refresh token available"
}
```

