# Database Schema

## Collections

### Users
- `_id` (ObjectId)
- `email` (string, unique)
- `passwordHash` (string)
- `role` (enum: 'buyer' | 'supplier')
- `createdAt` (date)
- `updatedAt` (date)

### RFPs
- `_id` (ObjectId)
- `buyerId` (ObjectId, references Users)
- `title` (string)
- `description` (string)
- `status` (enum: 'Draft', 'Published', 'Under Review', 'Approved', 'Rejected')
- `documents` (array of file references)
- `createdAt` (date)
- `updatedAt` (date)

### Responses
- `_id` (ObjectId)
- `rfpId` (ObjectId, references RFPs)
- `supplierId` (ObjectId, references Users)
- `responseText` (string)
- `documents` (array of file references)
- `responseStatus` (enum: 'Submitted', 'Under Review', 'Approved', 'Rejected')
- `submittedAt` (date)
- `updatedAt` (date)

## Relationships

- Each RFP is created by a Buyer (`buyerId`)
- Suppliers submit Responses linked to RFPs (`rfpId`)
- Status transitions follow this workflow:
  - Draft → Published → Response Submitted → Under Review → Approved/Rejected

## Indexes

- Users: unique index on `email`
- RFPs: index on `status` for quick filtering
- Responses: index on `responseStatus`
- Algolia handles text search indexing externally
