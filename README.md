# 🚀 CloudBoard

### Multi-Tenant SaaS Project Management Platform

CloudBoard is a production-ready multi-tenant project management platform built using modern web technologies and deployed on AWS cloud infrastructure.

It supports organization-based authentication, role-based access control, Kanban boards, real-time collaboration, and secure file uploads.

---

## 🧠 Tech Stack

### Frontend

* Vite + React + TypeScript
* Axios
* Socket.io Client

### Backend

* Node.js + Express
* MongoDB (Mongoose)
* JWT + Refresh Tokens
* Socket.io
* AWS SDK

### Cloud Infrastructure

* AWS EC2 (Backend hosting)
* AWS S3 (File storage + Static frontend hosting)
* AWS CloudFront (CDN)
* AWS IAM (Secure role-based access)
* AWS CloudWatch (Logs & Monitoring)

---

## 🏗 Architecture Overview

* Frontend is deployed to **S3**
* CloudFront serves as CDN
* Backend runs on **EC2**
* File uploads are stored in **private S3 buckets**
* Signed URLs are generated via backend
* All API logic lives strictly in backend
* Multi-tenancy enforced via `orgId` isolation

---

## 📂 Project Structure

```
cloudboard/
│
├── frontend/          # Vite + React app
├── backend/           # Node + Express API
│
├── docker-compose.yml # Local development only
├── .env.example
├── .gitignore
└── README.md
```

---

## 🔐 Core Features

* Organization-based multi-tenant authentication
* Role-based access control (Admin, Manager, Member)
* Kanban board management
* Real-time updates (Socket.io)
* Secure file uploads to AWS S3
* JWT authentication + Refresh token rotation
* IAM-based AWS access (no exposed credentials)
* CloudWatch logging

---

## 🖥 Local Development Setup

### 1️⃣ Clone Repository

```
git clone <repo-url>
cd cloudboard
```

---

### 2️⃣ Backend Setup (Port 3000)

```
cd backend
npm install
cp .env.example .env
npm run dev
```

Backend runs at:

```
http://localhost:3000
```

---

### 3️⃣ Frontend Setup (Port 8080)

```
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:8080
```

---

## 🐳 Optional: Run With Docker (Local Only)

From root:

```
docker-compose up --build
```

This spins up:

* MongoDB
* Backend
* Frontend

---

## 🌍 Production Deployment (AWS)

### Frontend

* Build: `npm run build`
* Upload `/dist` to S3
* CloudFront invalidation

### Backend

* Hosted on EC2
* Process managed with PM2
* Reverse proxied via Nginx
* IAM role attached for:

  * S3 access
  * CloudWatch logging

---

## 🔐 Security Considerations

* No AWS secrets stored in frontend
* EC2 uses IAM Role for AWS access
* All S3 buckets are private
* Signed URLs for file uploads
* Helmet, CORS, Rate limiting enabled
* Refresh tokens stored in DB
* Multi-tenant isolation enforced at query level

---

## 🧩 Multi-Tenant Strategy

Every document contains:

```
orgId: ObjectId
```

Middleware extracts:

```
req.orgId
```

All queries scoped by:

```
Model.find({ orgId: req.orgId })
```

This prevents cross-organization data leakage.

---

## 📊 Logging & Monitoring

* Application logs → CloudWatch
* Metrics monitoring → CloudWatch
* Errors centralized via error middleware

---

## 🚀 Future Scaling Plan

* Move backend from EC2 → ECS
* Add Redis for Socket scaling
* Use MongoDB Atlas Cluster
* Implement CI/CD pipelines
* Add API Gateway

---

## 👤 Author

Sudhansu Kumar
Founder & Developer

CloudBoard is designed as a scalable SaaS foundation suitable for startups, enterprise tools, and production deployment.