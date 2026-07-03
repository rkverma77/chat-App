# 💬 Chat-App — Full Stack Real-Time Chat Application

A modern full-stack real-time chat application built using the MERN stack. The application provides secure authentication, instant messaging using Socket.IO, online user presence, profile management, and image sharing with a clean and responsive user interface.

---

# 🚀 Features

### 🔐 Authentication & Authorization
- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing using bcrypt
- Cookie-based authentication
- Protected API Routes
- Logout functionality

---

### 💬 Real-Time Messaging
- One-to-one real-time messaging
- Instant message delivery using Socket.IO
- Real-time typing communication
- Online/Offline user status
- Automatic message synchronization
- Persistent chat history

---

### 👤 User Management
- User Profile
- Update Profile Picture
- View Contacts
- Online Users Indicator
- User Presence Detection

---

### 🖼️ Image Sharing
- Send images inside conversations
- Cloudinary integration for image storage
- Optimized image delivery
- Image preview support

---

### 🎨 Modern UI
- Responsive Design
- Mobile Friendly
- Clean Chat Interface
- Sidebar Navigation
- Multiple DaisyUI Themes
- Toast Notifications
- Loading Skeletons

---

### ⚡ Backend Features
- RESTful APIs
- JWT Authentication Middleware
- MongoDB Database
- Mongoose ODM
- Express.js Server
- Socket.IO Server
- Centralized Error Handling
- Environment Variable Configuration

---

# 🛠️ Tech Stack

## Frontend

- React
- Vite
- Tailwind CSS
- DaisyUI
- Zustand
- Axios
- React Router DOM
- React Hot Toast
- Socket.IO Client
- Lucide React Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- Cookie Parser
- CORS
- Socket.IO
- Cloudinary
- dotenv

---

# 📂 Project Structure

```
chat-App/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── lib/
│   │   ├── constants/
│   │   └── App.jsx
│   │
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── lib/
│   ├── utils/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Environment Variables

Create a `.env` file inside the backend folder.

```env
PORT=5001

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

NODE_ENV=development
```

---

# 📦 Installation

## Clone Repository

```bash
git clone https://github.com/rkverma77/chat-App.git

cd chat-App
```

---

## Install Backend Dependencies

```bash
cd backend

npm install
```

---

## Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

---

# ▶️ Run Development Server

## Backend

```bash
cd backend

npm run dev
```

Runs on

```
http://localhost:5001
```

---

## Frontend

```bash
cd frontend

npm run dev
```

Runs on

```
http://localhost:5173
```

---

# 🏗️ Production Build

Frontend

```bash
npm run build
```

Backend

```bash
npm start
```

---

# 🔌 REST APIs

## Authentication

- POST `/api/auth/signup`
- POST `/api/auth/login`
- POST `/api/auth/logout`
- GET `/api/auth/check`

---

## Messages

- GET `/api/messages/users`
- GET `/api/messages/:id`
- POST `/api/messages/send/:id`

---

# 🔒 Security

- JWT Authentication
- HTTP-only Cookies
- Password Hashing using bcrypt
- Protected Routes
- CORS Configuration
- Environment Variables
- Input Validation

---

# 🌟 Highlights

- Real-time communication with Socket.IO
- Secure authentication system
- Persistent chat history
- Online user tracking
- Cloudinary image uploads
- Responsive UI
- Global state management with Zustand
- Modern React architecture
- Clean and scalable folder structure

---

# 📸 Screenshots

Add screenshots here.

```
Login Page

Home Page

Chat Window

Profile Page
```

---

# 🚀 Future Improvements

- Group Chats
- Voice Messages
- Video Calling
- Message Reactions
- Read Receipts
- Typing Indicator
- Message Search
- File Sharing
- Notifications
- Dark/Light Theme Toggle
- End-to-End Encryption

