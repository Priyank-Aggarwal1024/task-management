import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    user: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: "User",
        required: true
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt

const Task = mongoose.models.Task || mongoose.model("Task", TaskSchema);
export default Task;
