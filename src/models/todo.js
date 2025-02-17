//todo.js in models folder in src folder
import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    description: {
        type : String,
        required : true,
    },
    completed: {
        type : Boolean,
        default : false,//default is the task is not yet completed
    },
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
    },
});

const Todo = mongoose.model('Todo', todoSchema);

export default Todo;