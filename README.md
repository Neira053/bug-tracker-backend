# 🐞 Bug Tracker Backend

A role-based bug tracking system backend designed to mirror real-world software engineering workflows.
Built with scalability, security, and clean API design in mind.

## 🚀 Tech Stack

Node.js – Runtime

Express.js – REST API framework

MongoDB – Database

Mongoose – ODM

JWT – Authentication & Authorization

# 🎯 Core Features
## 🔐 Authentication & Authorization

JWT-based authentication

Secure protected routes

Role-based access control (RBAC)

## 👥 Role-Based System

The system supports three roles, each with clear responsibilities:

### 🔴 Admin

Create & manage projects

Update project lifecycle status
(ACTIVE, ON_HOLD, COMPLETED, ARCHIVED)

Assign bugs to developers

View all bugs and projects

Delete bugs (soft delete)

### 🔵 Developer

View all projects and bugs

Assign bugs to self

Update bug status (IN_PROGRESS, CLOSED)

### 🟡 Tester

View all projects and bugs

Create new bugs

Verify fixes and close bugs (CLOSED)

## 🧩 Bug Management

Create, view, update, and delete bugs

PATCH-based status updates (partial updates)

Strict role-based status transitions

Bug history tracking for auditability

Soft delete using isDeleted flag

## 📊 Project Health Tracking

Each project dynamically exposes a bugState:

EMPTY – No bugs

OPEN – Open bugs exist

IN_PROGRESS – Bugs are being worked on

COMPLETED – All bugs resolved

This state is derived dynamically (not stored), ensuring data consistency.

## 📦 API Design Highlights

RESTful routes

Clear separation of concerns (routes, controllers, models)

Centralized error handling

Pagination support for bug listings

Clean and predictable responses

## 🧪 Example API Endpoints
Authentication
```bash
POST /api/auth/register
POST /api/auth/login

Projects
POST   /api/project            (Admin)
GET    /api/project            (All users)
PATCH  /api/project/:id/status (Admin)

Bugs
POST   /api/bugs                     (Tester)
GET    /api/bugs                     (All users)
GET    /api/bugs/:id                 (All users)
PATCH  /api/bugs/:id/status          (Role-based)
DELETE /api/bugs/:id                 (Admin – soft delete)

## 🛡️ Security & Best Practices

No sensitive data exposed

Passwords hashed

Tokens verified on every protected request

Role checks enforced at controller level

No hard deletes for critical data

## 🧠 Design Philosophy

This project focuses on:

Realistic engineering workflows

Clear role separation

Maintainable backend architecture

Production-style API behavior

It goes beyond basic CRUD to emphasize system design and backend reasoning.

## ▶️ Running Locally
git clone <repo-url>
cd backend
npm install
npm start


Create a .env file:
```bash
PORT=5000
MONGODB_URI=your_mongo_uri
JWT_SECRET=your_secret

## 🌐 Deployment

The backend is deployed and tested on a cloud platform, with proper CORS configuration for frontend integration.

## 📌 Status

✔ Backend complete
✔ APIs tested via Postman
✔ Frontend integration in progress

🙌 Author

Built with focus on learning by building, clean backend practices, and real-world applicability.
