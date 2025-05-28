# Likes API Endpoints

## POST /api/likes/:id
Adds a like to a post. Requires authentication.

### Request
- **URL Parameter**: `id` – ID of the post to like
- **Headers**: Bearer token

### Response
```json
{
  "success": true
}
```

---

## DELETE /api/likes/:id
Removes a like from a post. Requires authentication.

### Request
- **URL Parameter**: `id` – ID of the post to unlike
- **Headers**: Bearer token

### Response
```json
{
  "success": true
}
```

---

## GET /api/likes/:id
Checks if the authenticated user has liked the post. Requires authentication.

### Request
- **URL Parameter**: `id` – ID of the post to check
- **Headers**: Bearer token

### Response
```json
{
  "liked": true // or false
}
```

---

## GET /api/likes/:id/count
Gets the like count for a specific post.

### Request
- **URL Parameter**: `id` – ID of the post

### Response
```json
{
  "count": 5
}
```
