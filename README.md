# E-Commerce Application

This is a full-stack e-commerce application built with Node.js/Express/TypeScript/Prisma for the backend and React/Vite/TypeScript/Tailwind for the frontend.

## Project Structure

- `/backend`: Node.js, Express, TypeScript, Prisma, SQLite
- `/frontend`: Vite, React, TypeScript, Tailwind CSS

## Setup Instructions

### Backend

```bash
cd backend
npm install
npx prisma generate
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

The backend server will start on http://localhost:5000.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server will start on http://localhost:3000.

## Features

- User authentication with JWT
- Product listing with filters and pagination
- Shopping cart functionality
- Admin panel for product management

## Technologies Used

### Backend
- Node.js
- Express
- TypeScript
- Prisma ORM
- SQLite (for portability)
- JWT for authentication
- bcrypt for password hashing

### Frontend
- React
- Vite
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Context API for state management