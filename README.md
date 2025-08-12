# RFP Contract Management System

## Overview
This is a full-stack RFP (Request for Proposal) contract management system built with a Node.js backend and React frontend. It supports role-based user management for Buyers and Suppliers, RFP lifecycle management, file uploads, Algolia-powered search, and real-time notifications via WebSockets.

## Features
- User registration and login with JWT-based authentication (Buyer and Supplier roles)
- Buyer can create, publish, and manage RFPs with document uploads
- Supplier can browse available RFPs, submit responses, and track statuses
- Real-time updates on RFP and response statuses via WebSocket notifications
- Full-text search across RFPs powered by Algolia
- Role-specific dashboards with responsive UI
- Email notifications simulated/logged on status changes
- Status workflow management: Draft → Published → Response Submitted → Under Review → Approved/Rejected

## Bonus Features
- Algolia search integration for fast, filtered RFP search
- WebSocket-based real-time notifications for both buyers and suppliers

## Demo Accounts
| Role     | Email              | Password    |
|----------|--------------------|-------------|
| Buyer    | buyer@test.com     | password123 |
| Supplier | supplier@test.com  | password123 |

## Getting Started

### Prerequisites
- Node.js v14+
- npm or yarn
- MongoDB instance (local or cloud)
- Algolia account (for search)
- (Optional) SMTP service for real email notifications

### Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/ac-mmi/deepRunnerProj.git
   cd deepRunnerProj
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

4. Configure environment variables:
   - Copy `.env.example` to `.env` in both `backend` and `frontend` folders and fill in your own values.

5. Run backend server:
   ```bash
   cd ../backend
   npm run dev
   ```

6. Run frontend app:
   ```bash
   cd ../frontend
   npm start
   ```

The frontend will run at [http://localhost:3000](http://localhost:3000) and the backend at [http://localhost:5000](http://localhost:5000).
