# 🐞 Bug Tracker Backend

A production-ready backend for a Bug Tracking System built using Node.js, Express, MongoDB, and JWT authentication, supporting role-based access control, bug lifecycle management, soft deletes, and pagination.

This backend is designed to simulate real-world SaaS systems like Jira / Linear, focusing on clean architecture, scalability, and secure APIs.

## 🚀 Live API

Base URL:
```Bash
https://bug-tracker-backend-jz56.onrender.com

### 🛠 Tech Stack

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Role-Based Access Control (RBAC)

RESTful APIs

Render (Deployment)

### ✨ Features
🔐 Authentication & Authorization

User registration & login

JWT-based authentication

Secure password hashing

Role-based access:

ADMIN

DEV

TESTER

### 🐛 Bug Management

Create bugs (TESTER only)

View all bugs with filters

View single bug details

Update bug status (DEV / TESTER)

Soft delete bugs (ADMIN only)

## 🔄 Bug Lifecycle

Each bug follows a controlled workflow:
```bash
OPEN → IN_PROGRESS → RESOLVED → CLOSED

### 📄 Pagination & Filtering

Pagination using page and limit

Filter bugs by:

status

priority

project

### 🗑 Soft Delete

Bugs are not permanently removed

isDeleted = true marks deleted bugs

Deleted bugs are excluded from fetch queries

### 📊 Audit History

Every bug stores:

status change history

who changed it

timestamp

This ensures traceability and accountability.

## 📁 Project Structure
```bash

backend/
├── controllers/
│   ├── authController.js
│   ├── bugController.js
│   └── projectController.js
├── routes/
│   ├── authRoutes.js
│   ├── bugRoutes.js
│   └── projectRoutes.js
├── models/
│   ├── User.js
│   ├── Bug.js
│   └── Project.js
├── middlewares/
│   ├── authMiddleware.js
│   └── errorMiddleware.js
├── config/
│   └── db.js
├── app.js
├── server.js
└── README.md

## 📦 API Endpoints
###🔑 Auth Routes
```bash
| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |

### 🐞 Bug Routes
```bash
| Method | Endpoint               | Access        |
| ------ | ---------------------- | ------------- |
| POST   | `/api/bugs`            | TESTER        |
| GET    | `/api/bugs`            | Authenticated |
| GET    | `/api/bugs/:id`        | Authenticated |
| PATCH  | `/api/bugs/:id/status` | DEV / TESTER  |
| DELETE | `/api/bugs/:id`        | ADMIN         |

### 📁 Project Routes
```bash

