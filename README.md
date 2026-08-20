# Posts REST API

A small Express.js project built to practice REST API fundamentals — routing, CRUD operations, and basic request/response handling with an in-memory data store. The backend (`server/index.js`) features a hand-built REST API for managing posts, while the frontend (`frontend/index.html`, `frontend/style.css`, `frontend/script.js`) provides a clean visual interface for testing.

---

## 🚀 Features

- **In-Memory Data Store**: Fast, lightweight storage that resets on server restart.
- **RESTful Endpoints**: Full CRUD support for managing posts.
- **CORS Enabled**: Configured with `cors` middleware for cross-origin frontend communication.
- **Visual Frontend**: Interactive web interface to view, add, edit, and delete posts without needing external API clients.

---

## 📌 API Endpoints

| Method | Endpoint | Description | Request Body (JSON) |
|---|---|---|---|
| `GET` | `/posts` | Fetch all posts | _None_ |
| `GET` | `/posts/:id` | Fetch a single post by ID | _None_ |
| `POST` | `/posts` | Create a new post | `{"username": "string", "content": "string"}` |
| `PATCH` | `/posts/:id` | Update post username and/or content | `{"username"?: "string", "content"?: "string"}` |
| `DELETE` | `/posts/:id` | Remove a post by ID | _None_ |

---

## 📁 Project Structure

```text
RESTAPI/
├── frontend/
│   ├── index.html       # Visual testing interface
│   ├── script.js        # Frontend logic & API calls
│   └── style.css        # Styles for the UI
├── server/
│   └── index.js         # Express server & REST API routes
├── .gitignore
├── package.json
└── README.md
```

---

## 🛠️ Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- npm

### 2. Installation
Clone the repository and install the dependencies:
```bash
git clone https://github.com/bhavikragit-sys/devboard.git
cd devboard
npm install
```

### 3. Running the Server
Start the Express server on port 3000:
```bash
node server/index.js
```
The server will run on `http://localhost:3000`.

### 4. Interacting with the Frontend
Open `frontend/index.html` in your web browser to interact with the API visually.
