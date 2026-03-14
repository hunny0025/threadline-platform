# Threadline API Standards

## 1. API Versioning
All endpoints must be prefixed with the API version:
```
/api/v1/products
/api/v1/users
/api/v1/orders
```

## 2. Success Response Format
All successful responses must follow this structure:
```json
{
  "success": true,
  "status": 200,
  "message": "Success",
  "data": {}
}
```

## 3. Error Response Format
All error responses must follow this structure:
```json
{
  "success": false,
  "status": 404,
  "message": "Product not found",
  "data": null
}
```

## 4. Pagination Structure
All endpoints returning lists must follow this structure:
```json
{
  "data": [],
  "pagination": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

## 5. HTTP Status Codes
| Code | Meaning |
|------|---------|
| 200  | Success |
| 201  | Created |
| 400  | Bad Request |
| 401  | Unauthorized |
| 404  | Not Found |
| 500  | Server Error |