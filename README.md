<p align="center">
  <img src="https://img.shields.io/badge/MERN-Stack-green?style=for-the-badge" alt="MERN Stack" />
  <img src="https://img.shields.io/badge/Socket.IO-Real--Time-blue?style=for-the-badge&logo=socketdotio" alt="Socket.IO" />
  <img src="https://img.shields.io/badge/License-ISC-yellow?style=for-the-badge" alt="License" />
</p>

# 💬 Chatty - Real-Time Chat Application

A premium, full-stack real-time chat application built with the **MERN stack** and **Socket.IO**. Chatty features a stunning glassmorphism UI with animated 3D particle backgrounds, multiple color palettes, dark/light themes, a complete friend request system, emoji reactions, typing indicators, read receipts, and much more.

> **Live Demo:** [chat-app-3f6c.vercel.app](https://chat-app-3f6c.vercel.app)

---

## ✨ Features

### 💬 Real-Time Messaging
- **Instant message delivery** via WebSockets (Socket.IO)
- **Typing indicators** - real-time animated bouncing dots when someone is typing
- **Read receipts** - single ✓ (sent) and double ✓✓ (read) checkmarks
- **Emoji reactions** - react to any message with 👍 ❤️ 😂 😮 😢 🙏 (toggle on/off, with counts)
- **Image sharing** - upload and send images with preview before sending (Cloudinary-hosted)
- **Message deletion** - delete your own messages in real-time
- **Persistent chat history** - all messages stored in MongoDB
- **Unread message badges** - per-contact unread counts in the sidebar

### 👥 Friend System
- **User search** - find users by name or email with debounced search
- **Send friend requests** - request to connect with any user
- **Accept / Reject requests** - manage incoming requests with one click
- **Remove friends** - unfriend users directly from the sidebar
- **Friends-only messaging** - messages can only be sent between accepted friends

### 🎨 Premium UI / UX
- **Glassmorphism design** - frosted glass panels, blur effects, and semi-transparent surfaces
- **3D animated background** - Three.js particle wave that dynamically changes color
- **5 color palettes** - Emerald, Blue, Rose, Violet, and Amber — switchable via floating FAB
- **Dark / Light theme** - animated Sun/Moon toggle, persisted to localStorage
- **Framer Motion animations** - page transitions, staggered lists, spring popups, micro-interactions
- **Skeleton loading states** - shimmer animations for messages and sidebar contacts
- **Responsive design** - sidebar collapses to icons on mobile, expands on desktop
- **Reduced motion support** - respects `prefers-reduced-motion` system setting

### 🔐 Authentication & Security
- **JWT authentication** with HTTP-only cookies
- **Password hashing** with bcrypt (salt rounds: 10)
- **Protected API routes** via middleware
- **CORS configuration** with allowed origin whitelist
- **Secure cookie settings** - `httpOnly`, `secure`, `sameSite: "none"` in production

### 👤 User Management
- **User registration** with validation
- **Profile page** - view account info and member-since date
- **Avatar upload** - upload profile pictures via Cloudinary
- **Online/offline status** - real-time presence tracking with green dot indicators

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| **React 18** | UI framework |
| **Vite 7** | Build tool & dev server |
| **Tailwind CSS 4** | Utility-first CSS framework |
| **Zustand** | Lightweight state management (4 stores) |
| **Framer Motion** | Animations & page transitions |
| **Socket.IO Client** | Real-time WebSocket communication |
| **Axios** | HTTP client for API calls |
| **React Router DOM 6** | Client-side routing |
| **Three.js + @react-three/fiber** | 3D animated particle background |
| **Lucide React** | Icon library |
| **emoji-picker-react** | Emoji picker for message input |
| **React Hot Toast** | Toast notifications |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB + Mongoose** | Database & ODM |
| **Socket.IO** | Real-time bidirectional communication |
| **JWT (jsonwebtoken)** | Token-based authentication |
| **bcryptjs** | Password hashing |
| **Cloudinary** | Cloud image hosting |
| **cookie-parser** | Cookie parsing for JWT |
| **CORS** | Cross-origin resource sharing |
| **dotenv** | Environment variable management |
| **nodemon** | Development auto-restart |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────-┐
│                      CLIENT (React)                      │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────-┐ ┌────────────┐  │
│  │ AuthStore│ │ ChatStore│ │FriendStore│ │ ThemeStore │  │
│  │ (Zustand)│ │ (Zustand)│ │ (Zustand) │ │ (Zustand)  │  │
│  └────┬─────┘ └────┬─────┘ └────┬──────┘ └────────────┘  │
│       │             │            │                       │
│       ▼             ▼            ▼                       │
│  ┌─────────────────────────────────────┐                 │
│  │          Axios + Socket.IO          │                 │
│  └────────────────┬────────────────────┘                 │
└───────────────────┼──────────────────────────────────────┘
                    │ HTTP (REST) + WebSocket
┌───────────────────┼──────────────────────────────────────-┐
│                   ▼     SERVER (Express)                  │
│  ┌──────────────────────────────────────┐                 │
│  │     Middleware (CORS, Auth, JSON)    │                 |
│  └────────────────┬─────────────────────┘                 │
│       ┌───────────┼───────────┐                           │
│       ▼           ▼           ▼                           │
│  ┌────────┐ ┌──────────┐ ┌────────┐                       │
│  │  Auth  │ │ Messages │ │Friends │  ← Controllers        │
│  │ Routes │ │  Routes  │ │ Routes │                       │
│  └───┬────┘ └────┬─────┘ └───┬────┘                       │
│      └───────────┼───────────┘                            │
│                  ▼                                        │
│  ┌──────────────────────────────────────┐                 │
│  │    MongoDB (Mongoose)  +  Socket.IO  │                 │
│  │    Cloudinary (Image uploads)        │                 │
│  └──────────────────────────────────────┘                 │
└──────────────────────────────────────────────────────────-┘
```

---

## 📂 Project Structure

```
chat-App/
├── package.json                        # Root scripts (build & start)
├── README.md
│
├── backend/
│   ├── package.json
│   └── src/
│       ├── index.js                    # Entry point — connects DB, starts server
│       ├── controllers/
│       │   ├── auth.controller.js      # Signup, login, logout, profile update
│       │   ├── message.controller.js   # Send, get, delete messages, reactions
│       │   └── friend.controller.js    # Send/accept/reject requests, remove friends
│       ├── models/
│       │   ├── user.model.js           # User schema (email, name, password, friends[])
│       │   ├── message.model.js        # Message schema (text, image, reactions[])
│       │   └── friendRequest.model.js  # Friend request schema (sender, receiver, status)
│       ├── routes/
│       │   ├── auth.route.js
│       │   ├── message.route.js
│       │   └── friend.route.js
│       ├── middleware/
│       │   └── auth.middleware.js      # JWT verification & route protection
│       ├── lib/
│       │   ├── db.js                   # MongoDB connection
│       │   ├── socket.js              # Socket.IO server setup & event handlers
│       │   ├── cloudinary.js          # Cloudinary configuration
│       │   └── utils.js               # JWT token generation helper
│       └── seeds/
│           └── user.seed.js           # 15 sample seed users
│
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx                   # Entry point (BrowserRouter)
        ├── App.jsx                    # Routes, auth guard, layout
        ├── index.css                  # Design system (545 lines)
        ├── palettes.css               # 5 color palettes × 2 themes
        ├── pages/
        │   ├── HomePage.jsx           # Main chat layout
        │   ├── LoginPage.jsx          # Login form
        │   ├── SignUpPage.jsx         # Registration form
        │   ├── SettingsPage.jsx       # Theme toggle + preview
        │   └── ProfilePage.jsx        # Avatar upload + user info
        ├── components/
        │   ├── Sidebar.jsx            # 3-tab sidebar (Chats / Requests / Add)
        │   ├── ChatContainer.jsx      # Messages, reactions, typing indicator
        │   ├── MessageInput.jsx       # Text, emoji picker, image upload
        │   ├── Navbar.jsx             # Navigation + theme toggle
        │   ├── ChatHeader.jsx         # Selected user header
        │   ├── NoChatSelected.jsx     # Welcome placeholder
        │   ├── ThreeBackground.jsx    # 3D animated particle wave
        │   ├── PaletteSelector.jsx    # Color palette FAB
        │   ├── AuthImagePattern.jsx   # Auth page decoration
        │   └── skeletons/
        │       ├── MessageSkeleton.jsx
        │       └── SidebarSkeleton.jsx
        ├── store/
        │   ├── useAuthStore.js        # Auth, socket connection, online users
        │   ├── useChatStore.js        # Messages, typing, reactions, search
        │   ├── useFriendStore.js      # Friends, requests
        │   └── useThemeStore.js       # Theme (dark/light) + palette
        ├── lib/
        │   ├── axios.js               # Axios instance with base URL
        │   └── utils.js               # formatMessageTime helper
        └── constants/
            └── index.js               # Theme constants
```

---

## 🗄️ Database Schemas

### User
| Field | Type | Description |
|-------|------|-------------|
| `email` | String | Unique, required |
| `fullName` | String | Required |
| `password` | String | Hashed, min 6 chars |
| `profilePic` | String | Cloudinary URL |
| `friends` | ObjectId[] | References to User |
| `createdAt` | Date | Auto-generated |

### Message
| Field | Type | Description |
|-------|------|-------------|
| `senderId` | ObjectId | Reference to User |
| `receiverId` | ObjectId | Reference to User |
| `text` | String | Message text (optional) |
| `image` | String | Cloudinary URL (optional) |
| `isRead` | Boolean | Read receipt flag |
| `reactions` | Array | `[{ emoji: String, userId: ObjectId }]` |
| `createdAt` | Date | Auto-generated |

### FriendRequest
| Field | Type | Description |
|-------|------|-------------|
| `sender` | ObjectId | Reference to User |
| `receiver` | ObjectId | Reference to User |
| `status` | String | `"pending"` / `"accepted"` / `"rejected"` |
| Unique index | `{ sender, receiver }` | Prevents duplicate requests |

---

## 🔌 API Endpoints

### Authentication — `/api/auth`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/signup` | ✗ | Register a new user |
| `POST` | `/login` | ✗ | Login with email & password |
| `POST` | `/logout` | ✗ | Clear auth cookie |
| `PUT` | `/update-profile` | ✓ | Upload profile picture |
| `GET` | `/check` | ✓ | Verify auth status |

### Messages — `/api/messages`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/users` | ✓ | Get friends list with unread counts |
| `GET` | `/search?q=` | ✓ | Search users by name or email |
| `GET` | `/:id` | ✓ | Get conversation with a user |
| `POST` | `/send/:id` | ✓ | Send a message (text/image) |
| `POST` | `/:id/react` | ✓ | Toggle emoji reaction on a message |
| `DELETE` | `/:id` | ✓ | Delete a message you sent |

### Friends — `/api/friends`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/` | ✓ | Get friends list |
| `GET` | `/requests` | ✓ | Get pending incoming/outgoing requests |
| `POST` | `/request/:id` | ✓ | Send a friend request |
| `PUT` | `/accept/:requestId` | ✓ | Accept a friend request |
| `PUT` | `/reject/:requestId` | ✓ | Reject a friend request |
| `DELETE` | `/remove/:id` | ✓ | Remove a friend |

---

## 🔄 Real-Time Socket Events

### Server → Client

| Event | Payload | Description |
|-------|---------|-------------|
| `getOnlineUsers` | `string[]` | Broadcasts online user IDs on connect/disconnect |
| `newMessage` | Message object | New message received |
| `messageDeleted` | `{ messageId }` | A message was deleted |
| `messageReaction` | `{ messageId, reactions }` | Reaction added/removed on a message |
| `newFriendRequest` | FriendRequest object | Incoming friend request |
| `friendRequestAccepted` | `{ requestId, newFriendId }` | Your friend request was accepted |
| `friendRemoved` | `{ removedFriendId }` | A friend removed you |
| `userTyping` | `{ senderId }` | Someone is typing to you |
| `userStopTyping` | `{ senderId }` | Someone stopped typing |
| `messagesRead` | `{ receiverId }` | Your messages were read |

### Client → Server

| Event | Payload | Description |
|-------|---------|-------------|
| `typing` | `{ receiverId }` | Notify that you are typing |
| `stopTyping` | `{ receiverId }` | Notify that you stopped typing |
| `markMessagesAsRead` | `{ senderId }` | Mark messages from sender as read |

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
# Server
PORT=5001
NODE_ENV=development

# Database
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>

# Authentication
JWT_SECRET=your_jwt_secret_key

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Deployment (Production only)
VERCEL_URI=https://your-frontend.vercel.app
```

For the **frontend**, create a `.env` in the `frontend/` directory (production only):

```env
VITE_RENDER_URI=https://your-backend.onrender.com
```

> In development, the frontend defaults to `http://localhost:5001`.

---

## 📦 Installation & Setup

### Prerequisites

- **Node.js** v18+ 
- **MongoDB** (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- **Cloudinary** account ([Sign up free](https://cloudinary.com/))

### 1. Clone the repository

```bash
git clone https://github.com/rkverma77/chat-App.git
cd chat-App
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure environment variables

Create a `.env` file in `backend/` with the variables listed above.

### 4. Start the development servers

**Backend** (runs on `http://localhost:5001`):

```bash
cd backend
npm run dev
```

**Frontend** (runs on `http://localhost:5173`):

```bash
cd frontend
npm run dev
```

### 5. Open in browser

Navigate to `http://localhost:5173` and create an account to get started!

---

## 🚀 Production Build & Deployment

### Build

From the project root:

```bash
# Installs all dependencies and builds the frontend
npm run build
```

### Start

```bash
# Starts the backend server
npm start
```

### Deployment

| Service | Role | URL |
|---------|------|-----|
| **Vercel** | Frontend hosting | [chat-app-3f6c.vercel.app](https://chat-app-3f6c.vercel.app) |
| **Render** | Backend API + WebSocket server | [chat-app-rsfg.onrender.com](https://chat-app-rsfg.onrender.com) |
| **MongoDB Atlas** | Database | Cloud-hosted |
| **Cloudinary** | Image CDN | Cloud-hosted |

---

## 🎨 Theming System

Chatty features a powerful CSS custom property-based design system:

- **2 Themes:** Dark (default) and Light — toggled via an animated switch in the navbar
- **5 Color Palettes:** Emerald 🟢, Blue 🔵, Rose 🩷, Violet 🟣, Amber 🟠 — switchable via a floating action button
- **CSS Variable Categories:**
  - Backgrounds (`--bg-primary`, `--bg-secondary`, `--bg-glass`, etc.)
  - Accents (`--accent-primary`, `--accent-glow`, etc.)
  - Text (`--text-primary`, `--text-secondary`, `--text-muted`)
  - Borders, Shadows, Scrollbars, Chat Bubbles
- **Glassmorphism utilities:** `.glass`, `.glass-card`, `.glass-panel`
- **All preferences persist** to `localStorage`

---

## 🔮 Future Roadmap

- [ ] Group chats
- [ ] Voice notes / audio messages
- [ ] Video calling (WebRTC)
- [ ] File & document sharing
- [ ] Message search within conversations
- [ ] Browser push notifications
- [ ] End-to-end encryption
- [ ] Custom chat wallpapers
- [ ] Last seen timestamps

---

## 📄 License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/rkverma77">rkverma77</a>
</p>
