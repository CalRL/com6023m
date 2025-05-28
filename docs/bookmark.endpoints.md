# Bookmark API Endpoints

## GET /api/bookmarks/:postId/count
Returns the total number of bookmarks for a given post.
### Response
```json
{
  "count": 5
}
```

## GET /api/bookmarks/:postId
Checks if the authenticated user has bookmarked the specified post.
### Response
```json
{
  "bookmarked": true
}
```

## POST /api/bookmarks/:postId
Adds a bookmark for the specified post by the authenticated user.
### Response
```json
{
  "success": true
}
```

## DELETE /api/bookmarks/:postId
Removes a bookmark from the specified post for the authenticated user.
### Response
```json
{
  "success": true
}
```

## GET /api/bookmarks
Returns all bookmarks for the authenticated user, including post and profile details.
### Response
```json
{
  "bookmarks": [
    {
      "post": {
        "id": 1,
        "content": "Example post",
        "mediaUrl": "http://example.com/image.png",
        "createdAt": "2025-05-28T12:00:00.000Z",
        "likeCount": 10,
        "bookmarkCount": 5,
        "liked": true,
        "bookmarked": true
      },
      "profile": {
        "id": 2,
        "displayName": "Jane Doe"
      }
    }
  ]
}
```