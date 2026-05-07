# 💬 Real-Time Chat Application — Frontend

The Angular frontend for a production-grade real-time chat application. Communicates with a **Spring Boot backend** via REST APIs and **WebSocket (STOMP)** for instant, low-latency messaging.

🔗 **Backend Repository:** [chat-app-backend](https://github.com/AkshitdotChaudhary/chat-app-backend)

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Angular 19 |
| Language | TypeScript |
| Real-Time | WebSocket + STOMP Protocol |
| Reactive Programming | RxJS Observables |
| Styling | SCSS |
| Auth | JWT Token handling |
| Build Tool | Angular CLI |

---

## ✨ Features

- **Real-time messaging** — WebSocket (STOMP) integration for instant message delivery without page refresh
- **Reactive UI** — RxJS observables consume live WebSocket events and REST API responses reactively
- **JWT Authentication** — Token stored and attached to every outgoing HTTP request via interceptors
- **Role-Based UI** — Route guards enforce access control based on user roles
- **Component-driven architecture** — Modular Angular components with clean separation of concerns
- **Responsive design** — Works across desktop and mobile screen sizes

---

## 🏗️ Architecture

```
Angular App
├── Auth Module
│   ├── Login Component
│   ├── Register Component
│   └── JWT Interceptor (attaches token to all requests)
│
├── Chat Module
│   ├── Chat Room Component
│   ├── Message List Component
│   └── WebSocket Service (STOMP client)
│
└── Core
    ├── Auth Guard (route protection)
    ├── API Service (REST calls)
    └── RxJS State Management
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js 18+
- Angular CLI 19+
- Backend running at `http://localhost:8080` → [Setup guide](https://github.com/AkshitdotChaudhary/chat-app-backend)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/AkshitdotChaudhary/chat-app-frontend.git
   cd chat-app-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure backend URL** in `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     apiUrl: 'http://localhost:8080/api',
     wsUrl: 'ws://localhost:8080/ws'
   };
   ```

4. **Run the app**
   ```bash
   ng serve
   ```

5. **Open** `http://localhost:4200`

---

## 🔌 Backend Integration

This frontend connects to the Spring Boot backend for:

| Feature | Protocol | Endpoint |
|---|---|---|
| Register / Login | REST (HTTP) | `/api/auth/**` |
| Send Message | WebSocket (STOMP) | `/app/chat.send` |
| Receive Messages | WebSocket (STOMP) | `/topic/messages` |
| Message History | REST (HTTP) | `/api/messages` |

---

## 👨‍💻 Author

**Akshit Chaudhary** — Backend Developer | Java • Spring Boot • Microservices

- 📧 akshitchaudhary640@gmail.com
- 💼 [LinkedIn](https://www.linkedin.com/in/akshit-chaudhary-b34839312)
- 🐙 [GitHub](https://github.com/AkshitdotChaudhary)
