# Barber Appointment Booking System ✂️

A premium, full-stack **MERN** (MongoDB, Express, React, Node.js) application designed for seamless barber shop appointment management. Customers can browse available slots and book services, while barbers can manage their availability and view upcoming appointments.

## 🚀 Recent Improvements
The project has been refactored for a professional local development experience:
- **Unified Structure**: Manage both Frontend and Backend from a single root directory.
- **Improved Performance**: Switched to **Vite** for the fastest React development experience.
- **Smart Proxying**: Integrated a backend proxy to eliminate hardcoded API URLs.
- **Automatic Reloading**: Added `nodemon` for instant backend updates.

## 🛠️ Tech Stack
- **Frontend**: React 19, Vite, Framer Motion (Animations), Lucide React (Icons)
- **Backend**: Node.js, Express 5.0
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT (JSON Web Tokens) & BcryptJS

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/try/download/community) running locally on port `27017`

### Installation
1. **Clone the repository** (if you haven't already).
2. **Install all dependencies** for the root, client, and server:
   ```bash
   npm run install-all
   ```

### Configuration
The backend is configured via `server/.env`. By default, it uses:
- **Port**: `5001`
- **MongoDB**: `mongodb://localhost:27017/barber-booking`

### Running the App
Start both the Frontend and Backend concurrently with one command:
```bash
npm run dev
```
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **API Server**: [http://localhost:5001](http://localhost:5001)

## 🧪 Database Seeding
To populate the database with a master barber profile and initial slots:
```bash
npm run seed
```
**Barber Login Credentials:**
- **Email**: `john@example.com`
- **Password**: `password123`

## 📖 Key Features
- **Dynamic Booking**: Real-time slot availability checking.
- **Barber Dashboard**: Manage working hours, specialties, and view schedules.
- **Premium UI**: Modern dark-themed design with smooth CSS transitions.
- **Secure Auth**: Role-based access control (Customers vs. Barbers).

---
Built with ❤️ by Antigravity
