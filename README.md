# AnonMes 🔒✉️

**AnonMes** is a web-based anonymous messaging platform that allows users to receive secret messages through a unique, shareable URL — without revealing the sender’s identity. It is designed to be simple, secure, and real-time.

---

## 🚀 Features

- 🔗 **Unique Shareable URL**  
  Each user gets a unique link that anyone can use to send anonymous messages.

- 🔐 **Authentication**
  - Normal Email & Password Authentication
  - Google OAuth Authentication

- 🕒 **Expiry Control**
  - Set an expiry date for message links
  - Messages stop accepting submissions after expiry

- 🧩 **Custom URLs**
  - Users can set a custom URL
  - Option to regenerate a new URL anytime

- ⚡ **Real-Time Messaging**
  - Messages are delivered instantly using **WebSockets (Socket.IO)**

- 📋 **Copy & Share**
  - One-click copy of the anonymous message link
  - Easily share across platforms

- 🌗 **UI/UX**
  - Personalized UI experience

- 📱 **Responsive Design**
  - Works smoothly on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend
- React
- Tailwind CSS
- Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- Socket.IO (WebSockets)
- JWT Authentication
- Google OAuth

---

## 🧠 How It Works

1. User signs up or logs in (Email/Password or Google).
2. A **unique anonymous URL** is generated for the user.
3. Anyone with the link can send a secret message.
4. Messages are delivered **in real-time** using WebSockets.
5. User can:
   - Set expiry date
   - Customize or regenerate the URL
   - View received anonymous messages securely

---

## 📌 Use Cases

- Receiving anonymous feedback
- Fun secret messages among friends
- Honest opinions without identity pressure
- Personal or professional feedback collection

---

## 🔐 Security

- JWT-based authentication
- Secure OAuth login
- No sender identity stored or exposed
- Optional expiry to prevent misuse

---
