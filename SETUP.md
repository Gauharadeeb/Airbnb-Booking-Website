# StayFinder Airbnb Booking App

Full-stack booking project with a separated frontend and backend.

## Folder Structure

- `frontend/` - React + Vite + Tailwind user interface
- `backend/` - Express API, MongoDB models, auth, bookings, Cloudinary uploads

## Local Setup

1. Install frontend dependencies:
   `cd frontend && npm install`

2. Install backend dependencies:
   `cd backend && npm install`

3. Create backend environment file:
   copy `backend/.env.example` to `backend/.env` and add your MongoDB Atlas URL, JWT secret, and Cloudinary keys.

4. Optional frontend environment file:
   copy `frontend/.env.example` to `frontend/.env` if your API is not running on `http://localhost:4000`.

5. Run backend:
   `npm run backend:dev`

6. Run frontend:
   `npm run frontend:dev`

## MongoDB Atlas

Use this format in `backend/.env`:

`MONGO_URL=mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/airbnb-booking?retryWrites=true&w=majority`

In MongoDB Atlas, add your current IP address under Network Access and create a database user under Database Access.
