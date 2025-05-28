## User Endpoints

## POST /api/users
Creates a new user with the provided username, email, and password (inaccessible to the user)
### Request Payload
```json
{
  "user": {
    "username": "johndoe",
    "email": "john@example.com",
    "password": "securePassword123"
  }
}
```
### Response Payload
```json
{
  "message": "User created successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
```
## PUT /api/users/:id
Updates the user with the given ID. Requires the user to either be self or have update permissions.
### Request Payload
```json
{
  "id": 1,
  "username": "updateduser",
  "email": "updated@example.com"
}
```
### Response Payload
```json
{
  "message": "User updated successfully",
  "updatedUser": {
    "id": 1,
    "username": "updateduser",
    "email": "updated@example.com"
  }
}
```

## DELETE /api/users/:id
Deletes a user by ID. Requires the user to be self or have deletion permissions.
### Request Payload
None
### Response Payload
```json
{
  "message": "Success"
}
```

## DELETE /api/users
Deletes the currently authenticated user (self-delete).
### Request Payload
None
### Response Payload
```json
{
  "message": "Success"
}
```

## GET /api/users
Returns a list of all users. Requires ADMIN permission.
### Request Payload
None
### Response Payload
```json
[
  {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
]
```
## GET /api/users/:id
Fetches a user by ID. Requires ADMIN permission.
### Request Payload
None
### Response Payload
```json
{
  "message": "User found successfully",
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com"
  }
}
``` 
## 
POST /api/users/:id/fields
Fetches specific fields for the user by ID.
### Request Payload
```json
{
  "fields": ["first_name", "last_name"]
}
```
### Response Payload
```json
{
  "success": true,
  "data": {
    "first_name": "John",
    "last_name": "Doe"
  }
}
```

## PATCH /api/users/:id/fields
Updates specific fields for the user by ID.
### Request Payload
```json
{
  "fields": {
    "first_name": "Updated",
    "phone_number": "123456789"
  }
}
```
### Response Payload
```json
{
  "success": true,
  "message": "User fields updated successfully"
}
```

## GET /api/users/permissions
Returns the permissions associated with the authenticated user.
Will fail if the user doesn't have SELF_READ

### Request Payload
_None_

### Response Payload
```json
{
  "success": true,
  "permissions": [
    "SELF_READ",
    "SELF_UPDATE",
    "READ_OTHER",
    "CREATE_POST",
    "DELETE_SELF",
    "ADMIN"
  ]
}
```
## PATCH /api/user/change-password
Allows an authenticated user to change their password.

### Request Payload
```json
{
  "oldPassword": "currentPassword123",
  "newPassword": "newSecurePassword456"
}
```

### Response Payload (Success)
```json
{
  "message": "Password updated successfully"
}
```

### Response Payload (Failure - Unauthorized)
```json
{
  "message": "Unauthorized"
}
```

### Response Payload (Failure - Invalid Request)
```json
{
  "message": "Missing old or new password"
}
```
