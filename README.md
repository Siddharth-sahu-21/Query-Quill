# 🧠 Query Quill

**Query Quill** is a web-based platform that enables users to effortlessly generate **GraphQL queries and schemas** using intuitive forms. Whether you're a beginner or a seasoned developer, Query Quill simplifies the GraphQL experience by eliminating the need for manual query writing.

> 🔗 **Live Demo**: *(Add your deployed link here)*  
> 📦 **Backend**: Hosted on Render  
> 🌐 **Frontend**: Built with Next.js, hosted on Vercel

---

## 🚀 Features

- 🔐 Secure JWT-based user authentication
- 🧾 Form-based GraphQL query & schema generator
- 🧪 Interactive playground for testing queries
- 💾 Save, edit, and download your queries
- 📂 Personalized dashboard to manage queries
- 📚 Documentation & examples for learning GraphQL

---

## 🧩 Tech Stack

| Frontend         | Backend     | Database | Styling       | Authentication |
|------------------|-------------|----------|---------------|----------------|
| Next.js (React)  | Express.js  | MongoDB  | Tailwind CSS  | JWT             |

Other Tools:
- **Formik** & **Yup** – For form handling and validation
- **GraphQL** – Core technology for querying data

---

## 📁 Folder Structure

Query-Quill/
├── client/ # Frontend (Next.js)
│ ├── components/
│ ├── pages/
│ └── utils/
├── server/ # Backend (Express + GraphQL)
│ ├── routes/
│ ├── controllers/
│ └── models/
└── README.md

---

## 🛠️ Setup Instructions

### 🔹 1. Clone the Repository

```bash
git clone https://github.com/Siddharth-sahu-21/Query-Quill.git
cd Query-Quill
🔹 2. Backend Setup
bash
Copy
Edit
cd server
npm install
npm run dev
Create a .env file inside the /server directory with the following:

env
Copy
Edit
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
🔹 3. Frontend Setup
bash
Copy
Edit
cd ../client
npm install
npm run dev
Ensure your frontend is configured to point to the correct backend API URL.

📸 Screenshots
![Screenshot 2025-06-02 160811](https://github.com/user-attachments/assets/d98d9e3a-c8c9-4b68-a702-60fd34cddd0c)


🔐 Login Page
![Screenshot 2025-06-02 160934](https://github.com/user-attachments/assets/f0e9be28-712a-4834-bb1b-0e8403bcfa24)

🏠 Dashboard
![Screenshot 2025-06-02 153453](https://github.com/user-attachments/assets/5b9a9d0f-1572-4fc3-9564-816ebd16e1ca)

🛠️ Query Generator
![Screenshot 2025-06-02 160634](https://github.com/user-attachments/assets/03ba1a6c-0efc-439b-a726-31056911bb14)
![Screenshot 2025-06-02 160655](https://github.com/user-attachments/assets/82d9653f-ed85-4c10-9a3c-d645f7d590ec)

<!-- Add your image here -->
🧪 Testing Methods
✅ Input validation using Yup

✅ Manual testing of all core functionalities

✅ Real-time query execution in GraphQL playground

📅 Project Timeline
Task	Duration
Requirement Analysis	1 week
System Design & Planning	2 weeks
Authentication & Form Setup	2 weeks
Query Generator + Playground	2 weeks
Final Testing & Deployment	1 week

💰 Cost Estimation
🖥️ Domain & Hosting: Free tier (Vercel & Render)

🧰 Tools: Open-source stack, zero licensing cost

👨‍💻 Development: Solo developer (no team cost)

🔮 Future Scope
➕ Add support for mutations and subscriptions

🧠 Integrate AI-based query suggestions

👥 Introduce team collaboration tools

📱 Make the app fully mobile responsive

🌐 Connect to external APIs for live testing

🧾 Project Scope
Query Quill provides a simplified and efficient interface for creating and testing GraphQL queries. It addresses the learning curve of GraphQL by offering tools and guides that make the process accessible for beginners while remaining useful for advanced users.

📚 References
GraphQL Official Documentation

Next.js

Express.js

MongoDB

Tailwind CSS

Formik

JWT (JSON Web Tokens)

Vercel

Render
