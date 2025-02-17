//app.js in src folder
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import authRoutes from './routes/auth.js'; // Import auth routes
import todoRoutes from './routes/todo.js'; // Import todo routes

dotenv.config(); // Use environment variables

// Initializing the app
const app = express();

// Middleware to parse incoming JSON
app.use(express.json());

// Use the auth routes for authentication
app.use('/api/auth', authRoutes);

// Use the todo routes for managing todos
app.use('/api/todos', todoRoutes);

// Test route to ensure server is running
app.get('/', (req, res) => {
    res.send("Server is running");
});

// Start the server and connect to the database
const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log(`Connected to MongoDB`);
        app.listen(PORT, () => console.log(`Server running at port ${PORT}`));
    })
    .catch((err) => console.log(`Failed to connect to MongoDB`, err));
