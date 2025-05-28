
# Posts API Endpoints

## GET /api/posts/status
Returns the current status of the posts service. Requires `ADMIN` permission.

### Response
```json
{
  "status": "Alive"
}
```

---

## PUT /api/posts/status
Toggles the current status of the posts service (between `Alive` and `Inactive`). Requires `ADMIN` permission.

### Response
```json
{
  "status": "Inactive"
}
```

---

## GET /api/posts
Fetches latest enriched posts. Requires `READ_POST` permission.

### Query Parameters
- `offset`: number (default: 0)
- `limit`: number (default: 10)

### Response
```json
{
  "posts": [ /* enriched posts */ ]
}
```

---

## POST /api/posts
Creates a new post. Requires `CREATE_POST` permission.

### Request
```json
{
  "post": {
    "content": "Post content",
    "mediaUrl": "http://example.com/image.jpg",
    "parentId": null
  }
}
```

### Response
```json
{
  "createdPost": { /* new post */ }
}
```

---

## DELETE /api/posts/:id
Deletes a post by ID. Requires `DELETE_POST`, `DELETE_OTHER_POST`, or `ADMIN` permission depending on the owner.

### Response
```
204 No Content
```

---

## GET /api/posts/:id
Fetches a post by ID along with profile and interaction metadata.

### Response
```json
{
  "post": { /* enriched post */ },
  "profile": { /* profile info */ }
}
```

---

## GET /api/posts/:id/replies
Fetches replies to a post by ID.

### Query Parameters
- `offset`: number (default: 0)
- `limit`: number (default: 10)

### Response
```json
{
  "posts": [
    {
      "profile":  {},
      "post": {}
    }
  ]
}
```

---

## GET /api/posts/profile/:id
Fetches all posts created by a user profile. Requires `READ_OTHER` permission.

### Query Parameters
- `offset`: number (default: 0)
- `limit`: number (default: 10)

### Response
```json
{
  "posts": [ /* enriched posts */ ]
}
```
