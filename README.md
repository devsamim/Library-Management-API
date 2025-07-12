📚 Library Management API
Name - Samim Mondal (dev.samim.kolkata@gmail.com)

A robust RESTful API built with **Express**, **TypeScript**, and **MongoDB** for managing books and borrowing operations in a library system.

---

🎯 Objective

Build a backend system for managing books and borrow records with:

- Schema validation using Mongoose
- Business logic enforcement (like stock/availability control on borrowing)
- Aggregation for data summary
- Middleware for side effects (like updating book availability)
- Filtering, sorting, pagination

---

🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB + Mongoose**
- **RESTful API design**
- **Postman (for testing)**

---

🚀 Getting Started

1. Clone the repo

```bash
git clone https://github.com/your-username/library-management-api.git
cd library-management-api
```

2. Install dependencies

```bash
npm install
```

3. Setup environment variables

Create a `.env` file (optional, or hardcode in `main.ts`) and add your MongoDB URI:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/LMS-API?retryWrites=true
PORT=5000
```

4. Run the server

```bash
npm run dev
```

Server will run at:  
`http://localhost:5000`

---

📚 API Endpoints

1.  Create Book

**POST** `/api/books`

```json
{
  "title": "The Theory of Everything",
  "author": "Stephen Hawking",
  "genre": "SCIENCE",
  "isbn": "9780553380163",
  "description": "An overview of cosmology and black holes.",
  "copies": 5,
  "available": true
}
```

---

📖 2. Get All Books (with Filter, Sort, Limit)

**GET** `/api/books?filter=FANTASY&sortBy=createdAt&sort=desc&limit=5`

Query Parameters:

| Name   | Type   | Description                        |
| ------ | ------ | ---------------------------------- |
| filter | string | Filter by genre                    |
| sortBy | string | Field to sort by (e.g., createdAt) |
| sort   | string | asc / desc                         |
| limit  | number | Number of results to return        |

---

🔍 3. Get Book by ID

**GET** `/api/books/:bookId`

---

4.  Update Book

**PUT** `/api/books/:bookId`

```json
{
  "copies": 10
}
```

---

5. Delete Book

**DELETE** `/api/books/:bookId`

---

🔄 6. Borrow Book

**POST** `/api/borrow`

```json
{
  "book": "BOOK_OBJECT_ID",
  "quantity": 2,
  "dueDate": "2025-07-18"
}
```

✅ Automatically decreases stock. If `copies = 0`, book becomes unavailable.

---

📊 7. Get Borrowed Book Summary

**GET** `/api/borrow`

```json
{
  "success": true,
  "message": "Borrowed books summary retrieved successfully",
  "data": [
    {
      "book": {
        "title": "The Theory of Everything",
        "isbn": "9780553380163"
      },
      "totalQuantity": 5
    }
  ]
}
```

✅ Uses **MongoDB Aggregation Pipeline**

---

Business Logic & Features

| Feature                             | Implemented |
| ----------------------------------- | ----------- |
| Mongoose Schema Validation          | ✅          |
| Mongoose Middleware (post `save`)   | ✅          |
| Business Logic: Availability Check  | ✅          |
| Aggregation Pipeline (Borrow Stats) | ✅          |
| Mongoose Static Method              | ✅          |
| Filtering, Sorting, Limit Query     | ✅          |

---

## 📁 Project Structure

```
├── app/
│   ├── controllers/
│   │   ├── books.controller.ts
│   │   └── borrow.controller.ts
│   ├── models/
│   │   ├── books.model.ts
│   │   └── borrow.model.ts
│   └── interfaces/
│       ├── book.interface.ts
│       └── borrow.interface.ts
├── app.ts
├── server.ts
├── package.json
└── README.md
```

---

---

🧪 Test with Postman

Use this base URL:  
`http://localhost:5000/api`

You can create a Postman Collection or import the above endpoints manually.

---

🤝 Contributing

Pull requests welcome! For major changes, open an issue first.

---

📄 License

[MIT](LICENSE)
