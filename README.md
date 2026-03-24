สมาชิกกลุ่ม
- 116510905109-4 กฤษนัย บุญนาค
- 116510905110-2 ณภัทร พิทักษ์ธรรม 
- 116510905113-6 ปัณณวัชร สุขเกษม
- 116510905037-7 สมบูรณ์ ข้องหลิม
- 116510905004-7 พลอยวารินทร์ เพ็งอ้น
- 116510905047-6 นิตยา สายราช


# Hotel Booking System

Full-Stack Hotel Booking Application.

---

## 🚀 Tech Stack

### Frontend
- Angular 21
- Bootstrap 5
- SweetAlert2
- Day.js
- FontAwesome
- Lucide Icons

### Backend
- Express 5
- Prisma ORM
- PostgreSQL (Supabase)
- JSON Web Token (JWT)
- CORS
- dotenv
- Cloudinary

### Database
- Supabase PostgreSQL

---

## 🧠 Architecture Pattern

### Frontend Structure

frontend/src/app/

- core/           → Singleton services (AuthService, ApiService)
- shared/         → Shared components, pipes, utilities
- features/       → Feature-based modules (booking, auth, room, etc.)
- layouts/        → Layout components (MainLayout, AuthLayout)
- guards/         → Route Guards (AuthGuard)
- interceptors/   → HTTP interceptors (JWT, Error handler)
- app.routes.ts   → Route definitions

### Backend Structure

backend/src/

- config/         → Environment config, Prisma setup
- modules/        → Feature-based modules (auth, booking, room)
- middlewares/    → Express middlewares
- utils/          → Helper functions
- types/          → Custom TypeScript types
- app.ts          → Express app setup

---

## 🛠 Installation Guide

### 1️⃣ Clone Repository

- git clone <repo-url>
- cd project-root

---

## 🖥 Run Frontend

- cd apps/frontend
- npm install
- npm start

Runs on:
http://localhost:4200

Proxy is configured via:
proxy.conf.json

---

## ⚙ Run Backend

- cd apps/backend
- npm install
- npm run dev

Runs on:
http://localhost:3000

---

## 📚 Documentation

Additional documentation can be found inside:
docs/
