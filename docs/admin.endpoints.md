# Admin Endpoints

## GET /api/admin/metrics
Retrieves admin dashboard metrics including user stats, post counts, like/bookmark statistics, and activity breakdowns by hour.

### Permissions Required
- `ADMIN`

### Response Payload
```json
{
  "userCount": 100,
  "newUsersToday": 5,
  "totalPosts": 320,
  "likesToday": 45,
  "bookmarksToday": 20,
  "likesPerHour": [
    { "hour": "09:00", "count": 5 },
    { "hour": "10:00", "count": 10 }
  ],
  "bookmarksPerHour": [
    { "hour": "09:00", "count": 2 },
    { "hour": "10:00", "count": 4 }
  ],
  "likeTimestamps": [
    "2025-05-28T10:15:00.000Z",
    "2025-05-28T10:30:00.000Z"
  ],
  "bookmarkTimestamps": [
    "2025-05-28T11:05:00.000Z"
  ]
}
```
