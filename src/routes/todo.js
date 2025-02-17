import express from "express";
import Todo from "../models/todo.js";
import mongoose from "mongoose";

const router = express.Router();

// Create a new todo
router.post('/', async (req, res) => {
    const { title, description, status, user } = req.body;

    try {
        const newTodo = new Todo({
            title,
            description,
            completed :status,
            user:new mongoose.Types.ObjectId(user),
        });

        const savedTodo = await newTodo.save();
        res.status(201).json({ message: "Todo created successfully", todo: savedTodo });
    } catch (err) {
        res.status(500).json({ message: "Error creating todo", error: err.message });
    }
});

// Get all todos
router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.status(200).json({ message: "Todos fetched successfully", todos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error: error.message });
    }
});

// Update a todo
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { title, description, completed:status },
            { new: true } // Return the updated document
        );
        if (!updatedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo updated successfully", todo: updatedTodo });
    } catch (error) {
        res.status(500).json({ message: "Error updating todo", error: error.message });
    }
});

// Delete a todo
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedTodo = await Todo.findByIdAndDelete(id);

        if (!deletedTodo) {
            return res.status(404).json({ message: "Todo not found" });
        }

        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error: error.message });
    }
});

export default router;
