# Profile Endpoints

## GET /api/profile
Fetch the profile of the currently authenticated user.

### Request Headers
- Authorization: Bearer {token}

### Response
```json
{
  "profile": {
    "id": 1,
    "displayName": "JohnDoe",
    "bio": "Hello world!",
    "location": "Earth",
    "isPrivate": false
  }
}
```

## GET /api/profile/:id
Fetch the profile of a user by ID. Requires `SELF_READ` or `READ_OTHER` permission depending on whether it's self or another user.

### Request Headers
- Authorization: Bearer {token}

### Response
```json
{
  "profile": {
    "id": 2,
    "displayName": "JaneDoe",
    "bio": "Hi there!",
    "location": "Mars",
    "isPrivate": false
  }
}
```

## GET /api/profile/:id/username
Fetch only the username of a user by ID. Requires appropriate read permissions.

### Response
```json
{
  "username": "JaneDoe"
}
```

## PUT /api/profile
Update the profile of the currently authenticated user.

### Request Body
```json
{
  "bio": "New bio",
  "location": "Saturn",
  "isPrivate": true
}
```

### Response
```json
{
  "updatedProfile": {
    "id": 1,
    "displayName": "JohnDoe",
    "bio": "New bio",
    "location": "Saturn",
    "isPrivate": true
  }
}
```

## POST /api/profile
Should not be used. Included to indicate that profiles are only created when a user is created.

### Response
```json
{
  "message": "Forbidden."
}
```