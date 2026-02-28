# 🚀 CloudBoard

## Multi-Tenant SaaS Project Management Platform (AWS Deployed)

CloudBoard is a production-ready **multi-tenant SaaS project management platform** built with modern full-stack technologies and deployed entirely on AWS cloud infrastructure.

It supports organization-based isolation, role-based access control, real-time Kanban workflows, secure file uploads, and production-grade authentication.

---

# 🌐 Live Demo (7 Days Only)

> ⚠️ Live temporarily for 7 days due to AWS billing & activity management.

Frontend (S3 + CloudFront CDN):
👉 [https://dcdggagutimb3.cloudfront.net/](https://dcdggagutimb3.cloudfront.net/)

Backend API (EC2 behind CloudFront):
👉 [https://dmpfizzawn1nj.cloudfront.net/](https://dmpfizzawn1nj.cloudfront.net/)

Source Code:
👉 [https://github.com/imskumarj/cloudboard](https://github.com/imskumarj/cloudboard)

---

# 🧠 Tech Stack

## Frontend

* Vite
* React + TypeScript
* Axios
* Socket.io Client
* CloudFront CDN
* AWS S3 Static Hosting

## Backend

* Node.js + Express
* MongoDB (Mongoose)
* JWT Authentication (HttpOnly cookies)
* Socket.io (WebSockets)
* AWS SDK (S3 integration)
* PM2 (Process Manager)
* Nginx (Reverse Proxy)

## Cloud Infrastructure

* AWS EC2 (Backend compute)
* AWS S3 (File storage)
* AWS S3 (Frontend static hosting)
* AWS CloudFront (Frontend CDN + Backend HTTPS proxy)
* AWS IAM (Access control)
* AWS CloudWatch (Monitoring)

---

# 🏗 Production Architecture

```
User
  ↓
Frontend CloudFront (HTTPS CDN)
  ↓
S3 Static Hosting

Frontend calls →

Backend CloudFront (HTTPS CDN)
  ↓
EC2 (HTTP, Node + Express)
  ↓
MongoDB

File uploads →
S3 (Private bucket via signed URLs)
```

### Why This Architecture?

* Eliminates mixed-content issues (HTTPS everywhere)
* No raw IP exposure
* Secure cross-domain cookies
* CDN-accelerated frontend & backend
* Real SaaS-ready deployment structure

---

# 🔐 Core Features

* Organization-based multi-tenancy
* Role-based access control (Admin / Manager / Member)
* Drag-and-drop Kanban board
* Real-time updates via WebSockets
* Secure file uploads using pre-signed S3 URLs
* JWT authentication via HttpOnly cookies
* SameSite=None + Secure production cookies
* CloudFront cookie forwarding
* Full AWS production deployment

---

# 📂 Project Structure

```
cloudboard/
│
├── frontend/          # React + Vite app
├── backend/           # Node + Express API
│
├── docker-compose.yml # Local development only
├── .env.example
├── README.md
```

---

# 🖥 Local Development Setup

## 1️⃣ Clone Repository

```
git clone https://github.com/imskumarj/cloudboard.git
cd cloudboard
```

---

## 2️⃣ Backend Setup

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

## 3️⃣ Frontend Setup

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

# 🐳 Optional: Docker (Local Only)

```
docker-compose up --build
```

Spins up:

* MongoDB
* Backend
* Frontend

---

# 🌍 Production Deployment Guide (AWS)

This section reflects the **actual live architecture used.**

---

# 🔵 Frontend Deployment (S3 + CloudFront)

### Step 1 — Build Frontend

```
cd frontend
npm run build
```

---

### Step 2 — Create S3 Bucket

* Disable block public access
* Enable static website hosting
* Upload contents of `/dist`

---

### Step 3 — Create CloudFront Distribution

Origin:

* S3 bucket

Settings:

* Viewer protocol → Redirect HTTP to HTTPS
* Default root object → index.html

---

### Step 4 — Update Environment

In `frontend/.env`:

```
VITE_API_URL=https://your-backend-cloudfront-url
```

Rebuild and upload again.

---

# 🟢 Backend Deployment (EC2 + CloudFront)

---

## Step 1 — Launch EC2 (Ubuntu)

Open inbound ports:

* 22 (SSH)
* 80 (HTTP)

---

## Step 2 — Install Dependencies

```
sudo apt update
sudo apt install nginx -y
sudo apt install nodejs npm -y
sudo npm install -g pm2
```

---

## Step 3 — Clone & Setup Backend

```
git clone https://github.com/imskumarj/cloudboard.git
cd cloudboard/backend
npm install
```

Create `.env` using `.env.example`.

---

## Step 4 — Start Backend

If using TypeScript build:

```
npm run build
pm2 start dist/server.js --name cloudboard
pm2 save
```

---

## Step 5 — Configure Nginx Reverse Proxy

```
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

Restart nginx:

```
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 6 — Create Backend CloudFront

Origin:

* EC2 Public DNS (NOT raw IP)

Important Settings:

* Allowed methods → GET, POST, PUT, PATCH, DELETE
* Cache policy → CachingDisabled
* Origin request policy → AllViewer
* Viewer protocol → Redirect HTTP to HTTPS

This enables:

* Cookie forwarding
* WebSockets
* Full API support
* HTTPS without buying domain

---

# 📦 S3 File Upload Setup

* Create private S3 bucket
* Add IAM user or IAM role
* Add credentials to backend `.env`
* Use pre-signed URLs (already implemented)

---

# 🔐 Security Practices

* No AWS credentials exposed to frontend
* HttpOnly authentication cookies
* SameSite=None; Secure for cross-domain
* Multi-tenant orgId enforcement
* Private S3 bucket
* Signed upload URLs
* Rate limiting + Helmet
* CloudFront HTTPS enforced

---

# 🧩 Multi-Tenant Strategy

Every document contains:

```
orgId: ObjectId
```

Middleware extracts:

```
req.user.orgId
```

All queries scoped by:

```
Model.find({ orgId: req.user.orgId })
```

Prevents cross-organization data leakage.

---

# ⚙️ Real-World Problems Solved

* Mixed content (HTTPS vs HTTP)
* CORS configuration across CDNs
* Cookie forwarding via CloudFront
* SameSite=None auth cookies
* WebSocket proxying through CDN
* Reverse proxy configuration
* Multi-origin deployment
* Production debugging

---

# 📊 Monitoring

* PM2 process management
* Nginx reverse proxy
* CloudWatch (optional extension)

---

# 🚀 Future Improvements

* Move EC2 → ECS / Fargate
* Add Redis for socket scaling
* Custom domain + ACM SSL
* CI/CD pipeline
* MongoDB Atlas cluster
* API Gateway

---

# 👤 Author

Sudhansu Kumar
Full-Stack Developer | Cloud Enthusiast

CloudBoard is designed as a scalable SaaS foundation suitable for startups, enterprise tools, and production-grade deployment.
