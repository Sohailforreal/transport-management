# 🚛 Transport Management System

A modern, mobile-first logistics management platform built for manufacturing companies to manage their entire transport operations — from vehicles and drivers to live delivery tracking.

> Built with the MERN Stack + Socket.io | Deployed on Vercel + Render

---

##  Live Demo

| | Link |
|--|--|
|  Frontend | https://transport-management-chi.vercel.app |
|  Backend API | https://transport-management-api.onrender.com |
|  GitHub | https://github.com/Sohailforreal/transport-management |

##  Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@test.com | 123456 |

---

##  What does it do?

Think of a manufacturing company that sends goods across cities every day. They have trucks, drivers, clients, and deliveries to manage. This system handles all of it:

- **Admin** sets up vehicles, onboards drivers, and monitors everything from a dashboard
- **Manager** creates delivery orders, assigns trucks and drivers, tracks live shipments
- **Driver** logs in, sees their assigned trip, shares live location, and marks deliveries
- **Client** gets a public tracking link to follow their order in real time — no login needed

---

## ✨ Key Features

** Fleet Management**
Track every vehicle with insurance, PUC, and maintenance records. Get automatic alerts before documents expire.

** Driver Onboarding**
Add drivers with auto-generated credentials. Upload and verify Aadhaar and license documents.

** Smart Delivery Orders**
Create orders, assign routes with checkpoints, track status from Pending → Dispatched → In Transit → Delivered.

** Live Location Tracking**
Driver shares real-time GPS location via browser. Manager watches a live animated route tracker powered by Socket.io.

** Supply Chain Timeline**
Every order has a full event timeline — ordered, packed, dispatched, checkpoint reached, delivered. Like Amazon tracking but for B2B logistics.

** Rich Dashboards**
Admin sees delivery charts, failure breakdowns, vehicle utilization, and expiry alerts all in one place.

** Failure Handling**
Drivers or managers can mark failed deliveries with a reason, internal notes, and optionally schedule a re-attempt — all tracked.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Real-time | Socket.io |
| Auth | JWT, bcryptjs |
| Charts | Recharts |
| Icons | Lucide React |
| Deploy | Vercel + Render |

---

## ⚙️ Local Setup

**1. Clone the repo**
```bash
git clone https://github.com/Sohailforreal/transport-management.git
cd transport-management

**2. Backend**
cd server
npm install

Create server/.env

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

npm run dev


**3. Frontend**

cd client
npm install

Create client/.env

VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000


npm run dev 

---

## 👥 Role Access Summary

| Feature | Admin | Manager | Driver | Public |
|---------|-------|---------|--------|--------|
| Vehicle Management | ✅ | ✅ | ❌ | ❌ |
| Driver Management | ✅ | ✅ | ❌ | ❌ |
| Create Orders | ✅ | ✅ | ❌ | ❌ |
| Assign Orders | ✅ | ✅ | ❌ | ❌ |
| Update Status | ✅ | ✅ | ✅ | ❌ |
| Live Tracking | ✅ | ✅ | ✅ | ✅ |
| Dashboard | ✅ | ✅ | ✅ | ❌ |
| Reports | ✅ | ❌ | ❌ | ❌ |
| Track Order | ❌ | ❌ | ❌ | ✅ |

---

## ⚡ Socket.io Events

| Event | Who | What |
|-------|-----|------|
| driver:join | Driver | Joins trip room |
| driver:location | Driver | Sends GPS coordinates |
| driver:stop | Driver | Stops sharing |
| location:update | Server | Broadcasts to manager |
| trip:started | Server | Trip began |
| trip:ended | Server | Trip ended |

---

*Built from scratch in under 24 hours for a MERN Stack internship assessment.*




