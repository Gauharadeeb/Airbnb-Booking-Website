# StayFinder Airbnb Booking App

Full-stack booking project with a separated frontend and backend.

## Folder Structure

- `frontend/` - React + Vite + Tailwind user interface
- `backend/` - Express API, MongoDB database layer, auth, bookings, Cloudinary uploads

## Local Setup

1. Install frontend dependencies:
   `cd frontend && npm install`

2. Install backend dependencies:
   `cd backend && npm install`

3. Create backend environment file:
   copy `backend/.env.example` to `backend/.env` and add your MongoDB connection string, JWT secret, and Cloudinary keys.

4. Optional frontend environment file:
   copy `frontend/.env.example` to `frontend/.env` if your API is not running on `http://localhost:4000`.

5. Run backend:
   `npm run backend:dev`

6. Run frontend:
   `npm run frontend:dev`

## MongoDB

Use `MONGO_URL`:

`MONGO_URL=mongodb://127.0.0.1:27017/airbnb_booking`

For MongoDB Atlas, use your Atlas connection string:

`MONGO_URL=mongodb+srv://user:password@cluster.example.mongodb.net/airbnb_booking`

If your connection string does not include a database name, set `MONGO_DATABASE=airbnb_booking`.

The backend creates collections and indexes automatically when MongoDB is reachable.
