# ⚡ Simple REST API with Express.js

A lightweight and beginner-friendly **REST API** built using **Node.js** and **Express.js**.  
This API supports full **CRUD operations** for managing simple **tasks/notes** stored in an in-memory array.

Perfect for learning backend basics, practicing REST API development, or using as a starter template.

---

## 🚀 Features

- Full CRUD operations (Create, Read, Update, Delete)
- Simple and clean Express.js setup
- JSON-based API responses
- In-memory data storage (no database required)
- Easy to understand and extend

---

## 📁 Project Structure

📁 simple-rest-api
│
├── server.js
├── package.json
│
├── controllers
│ └── itemController.js
│
└── routes
└── itemRoutes.js

---

## 🛠️ Installation

1. **Clone the repository**

```bash
git clone https://github.com/daniiiiel00/30-Days-Challenge-for-me.git


```

## Open the project folder

```bash
cd simple Rest API
```

## Install dependencies

```bash
npm install
```

## Start the server

```bash
node server.js
```

## Server runs at:

```bash
http://localhost:5000

```

## 📘 API Documentation & Usage

Below is the complete documentation for using your API.

📌 Base URL
http://localhost:5000/items

## 🔹 1. Get All Items

GET /items

Returns a list of all tasks/notes.

Example Request

```bash
curl http://localhost:5000/items
```

Example Response

```json
[
  {
    "id": "1",
    "title": "First Task"
  }
]
```

## 🔹 2. Get Item by ID

GET /items/:id
Example

```bash
curl http://localhost:5000/items/1
```

## 🔹 3. Create New Item

POST /items
Required JSON Body

```bash
{
"title": "New Note"
}
```

Example cURL

```bash
curl -X POST http://localhost:5000/items \
-H "Content-Type: application/json" \
-d '{"title": "New Note"}'
```

## 🔹 4. Update Item

PUT /items/:id
Required JSON Body

```bash
{
"title": "Updated Title"
}
```

Example

```bash
curl -X PUT http://localhost:5000/items/1 \
-H "Content-Type: application/json" \
-d '{"title": "Updated Title"}'
```

## 🔹 5. Delete Item

DELETE /items/:id
Example

```bash
curl -X DELETE http://localhost:5000/items/1

```

## 🧪 Testing Tools

You can test the API using:

Postman

Insomnia

Thunder Client (VS Code extension)

curl in terminal

## 🪄 Future Enhancements

File-based or database storage (MongoDB, MySQL)

Authentication (JWT)

Input validation

Pagination

Deploy to Render / Railway / Vercel

## 👨‍💻 Author

Daniel Melese
Web Development & Database Administration Student
