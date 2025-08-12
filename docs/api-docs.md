# API Documentation

## Authentication

### POST /api/auth/register
- Registers a new user (buyer or supplier)
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123",
    "role": "buyer"
  }
  ```
- Response: 201 Created or error message

### POST /api/auth/login
- Logs in user and returns JWT token
- Request Body:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```
- Response:
  ```json
  {
    "token": "jwt_token_here"
  }
  ```

## RFP Endpoints

### POST /api/rfps
- Create new RFP (Buyer only)
- Authentication required
- Request Body:
  ```json
  {
    "title": "Project Title",
    "description": "Detailed description",
    "documents": ["file1.pdf"]
  }
  ```
- Response: created RFP object

### GET /api/rfps
- Get list of published RFPs (Supplier view)
- Supports filtering and pagination
- Response: array of RFPs

### PATCH /api/rfps/:id/status
- Update RFP status (Buyer only)
- Request Body:
  ```json
  {
    "status": "Published"
  }
  ```
- Response: updated RFP object

## Response Endpoints

### POST /api/responses/respond
- Submit response to an RFP (Supplier only)
- Request Body:
  ```json
  {
    "rfpId": "rfp_object_id",
    "responseText": "Our response...",
    "documents": ["response_doc.pdf"]
  }
  ```
- Response: created response object

### PATCH /api/responses/:id
- Update response status (Buyer only)
- Request Body:
  ```json
  {
    "responseStatus": "Approved"
  }
  ```
- Response: updated response object

## Notifications
- Real-time notifications sent via WebSocket events:
  - `newResponse` — when supplier submits response
  - `responseStatusUpdated` — when buyer updates response status
