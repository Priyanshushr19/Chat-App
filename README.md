# ChatConnect 💬

**A Real-Time Chat Application** — Connect with friends and colleagues through instant messaging, profile management, and seamless communication.

---

## 📋 Table of Contents
- [Problem Statement](#-problem-statement)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Installation & Setup](#-installation--setup)
- [Environment Variables](#-environment-variables)
- [License](#-license)

---

## 🎯 Problem Statement

Modern communication is fragmented across multiple platforms with complex setups. ChatConnect provides a **simple, real-time chat solution** with secure authentication and media sharing capabilities.

**Solutions:**
- 💬 **Real-Time Messaging** — Instant message delivery with Socket.io
- 🔐 **Secure Authentication** — JWT-based user authentication
- 📱 **Profile Management** — Custom avatars with Cloudinary
- 🖼️ **Media Sharing** — Image sharing with Cloudinary integration

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| 💬 **Real-Time Chat** | Instant messaging with Socket.io |
| 🔐 **Auth System** | JWT authentication with bcrypt password hashing |
| 👤 **User Profiles** | Custom avatars, bio, and online status |
| 🖼️ **Media Sharing** | Image uploads via Cloudinary |
| 📱 **Responsive UI** | Mobile-friendly design with Tailwind CSS |
| 🟢 **Online Status** | Real-time user presence indicators |

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + Vite — UI & build tool
- **Tailwind CSS** — Styling
- **Socket.io-client** — Real-time communication
- **Axios** — HTTP client
- **React Router DOM** — Routing

### Backend
- **Node.js** + Express.js — Server & API
- **MongoDB** + Mongoose — Database
- **Socket.io** — WebSocket server
- **JWT** + bcryptjs — Authentication
- **Cloudinary** — Media storage
- **Multer** — File upload handling

---

React Frontend (Tailwind CSS, Socket.io-client)
↓ HTTPS + WebSocket
Express.js Backend (JWT Auth, Multer)
↓
┌────┼────┬────────────┐
↓ ↓ ↓ ↓
MongoDB Cloudinary Socket.io JWT
(Data) (Media) (Real-time) (Auth)


**Data Flow:**
1. User authenticates → JWT token issued
2. WebSocket connection established
3. Messages sent/received in real-time
4. Images uploaded to Cloudinary
5. All data persisted in MongoDB

---


---

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (v6+)
- Cloudinary Account

### Steps

# Backend
cd Backend
npm install
# Create .env file
npm start          # http://localhost:5000

# Frontend
cd ../frontEnd
npm install
npm run dev        # http://localhost:5173

##  Environment Variables
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chatconnect
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

VITE_API_BASE_URL=http://localhost:5000/api

#Security Features

JWT Authentication — Token-based auth with expiration

bcrypt Password Hashing — 10 rounds of salting

Protected Routes — Auth middleware for API endpoints

Input Validation — Zod validation schemas

Secure File Uploads — Multer with file type restrictions

CORS Enabled — Controlled cross-origin requests


