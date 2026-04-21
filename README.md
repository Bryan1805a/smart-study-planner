# Smart Study Planner

A modern, full-stack web application designed to help students manage subjects, track tasks, set deadlines, and optimize their focus using built-in productivity tools and smart algorithms.

## Live Demo
* **Frontend:** https://smart-study-planner-rose.vercel.app/
* **Backend API:** https://smart-study-planner-api-k97w.onrender.com

---

## Key Features
* **Secure Authentication:** JWT-based login and registration using HTTP-only cookies and bcrypt password hashing.
* **Subject & Task Management:** Full CRUD operations linking tasks to specific subjects and users via a relational database.
* **Focus Timer:** Built-in Pomodoro timer to manage work and break sessions.
* **Analytics Dashboard:** Visual progress tracking using interactive stacked bar charts.
* **Calendar View:** A full monthly and weekly schedule overview mapping out upcoming deadlines.
* **Smart Study Suggestions:** A heuristic algorithm that analyzes upcoming deadlines and dynamically suggests the most urgent task to tackle next.
* **Automated Reminders:** Background cron jobs that scan the database daily and email users 24 hours before a deadline.
* **Dark Mode:** A sleek, fully integrated dark theme using Tailwind CSS.

---

## Technology Stack

### Frontend
* **Framework:** React + Vite
* **Styling:** Tailwind CSS (v4)
* **Routing:** React Router DOM
* **Data Visualization:** Recharts
* **Calendar UI:** React Big Calendar & Date-fns

### Backend
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** PostgreSQL (Hosted on Neon)
* **ORM:** Prisma (v7) with `@prisma/adapter-pg`
* **Authentication:** JSON Web Tokens (jsonwebtoken) & bcryptjs
* **Background Jobs:** Node-cron
* **Email Service:** Nodemailer

---

## Local Development Setup

To run this project locally on your machine, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- A free PostgreSQL database (e.g., [Neon.tech](https://neon.tech/))

### 1. Clone the Repository
```bash
git clone https://github.com/Bryan1805a/smart-study-planner.git
cd smart-study-planner
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:
```bash
cd backend
npm install
```

Create a .env file in the root of the /backend folder and add the following:
```
DATABASE_URL="your_postgresql_connection_string"
JWT_SECRET="your_jwt_key"
FRONTEND_URL="http://localhost:5173"
```

Initialize the database and generate the Prisma client:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the backend server:
```bash
npm start
```
The server will run on http://localhost:5000

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
The frontend will run on http://localhost:5173

## Database Architecture
The application uses a relational schema defined via Prisma:
- User: Stores authentication credentials and links to personal subjects/tasks.
- Subject: Belongs to a User and contains many Tasks.
- Task: Belongs to a Subject and User; tracks completion status and due dates.

## Deployment
- Database: Hosted serverless on Neon.
- Backend: Hosted on Render with a Node environment.
- Frontend: Hosted on Vercel leveraging Vite build optimization.