# 💬 Mini Chat App (Socket.io)

A lightweight, real-time chat application built using **Node.js**, **Express**, and **Socket.io**.  
Users can join the chat, send instant messages, and see live activity from others — all in a clean, responsive UI.

---

## 🚀 Features

- ⚡ Real-time messaging with Socket.io
- 🙋 User enters a nickname before joining
- 🟢 "User joined" and "User left" status updates
- 🕒 Each message includes a timestamp
- 🎨 Smooth, modern, and responsive UI
- 📱 Works on mobile, tablet, and desktop
- 🔄 Auto-scrolls to the newest message
- ✨ Color-coded message bubbles for better clarity

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **Socket.io**
- **HTML5**
- **CSS3**
- **JavaScript (Vanilla)**

---

## 📁 Project Structure

```folder
mini-chat-app/
│── server.js
│── package.json
│── public/
│ │── index.html(included styles,script)
│── README.md
```

---

## 📦 Installation

Install the project on your machine:

```bash
git clone https://github.com/daniiiiel00/30-Days-Challenge-for-me.git
```

## Navigate into the folder:

```bash
cd mini-chat-app
```

## Install dependencies:

```bash
npm install
```

## ▶️ Running the App

Start the server:

```bash
node server.js
```

Open in your browser:

```brouswer
http://localhost:3000
```

You’re now ready to chat! 💬✨

## 🧠 How It Works

The server runs an Express app that serves static frontend files

Socket.io creates a WebSocket connection between client and server

When a user sends a message, it’s broadcast to everyone instantly

Join/Leave notifications are pushed in real-time

## 🎨 Customization

You can easily customize:

💡 Colors & theme

🔔 Sound notifications

🤖 Add a chatbot

🧑‍🤝‍🧑 Add private rooms

👤 User avatar support

🔐 Add authentication

## 📜 License

This project is open-source under the MIT License.

## 👨‍💻 Author

Daniel Melese
Frontend & Backend Developer
