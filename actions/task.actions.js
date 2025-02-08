'use server';

import { connectToDatabase } from '@/utils/connectToDb';
import { revalidatePath } from 'next/cache';
import Task from '@/models/task.model';

export async function getTasks(userId) {
  try {
    await connectToDatabase();
    const tasks = await Task.find({ user: userId });
    return JSON.parse(JSON.stringify(tasks.map(task => ({
      _id: task._id.toString(),
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      completed: task.completed,
      user: task.user?.toString()
    }))));
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Failed to fetch tasks");
  }
}

export async function addTask(userId, title, description, dueDate) {
  try {
    await connectToDatabase();
    const newTask = new Task({ user: userId, title, description, dueDate, completed: false });
    await newTask.save();
    revalidatePath("/");
    return JSON.parse(JSON.stringify(newTask));
  } catch (err) {
    console.error("Error adding task:", err);
    throw new Error("Failed to add task");
  }
}

export async function updateTask(userId, id, updates) {
  try {
    await connectToDatabase();
    const updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      updates,
      { new: true }
    );
    if (!updatedTask) throw new Error("Task not found or unauthorized");
    revalidatePath("/");
    return JSON.parse(JSON.stringify(updatedTask));
  } catch (err) {
    console.error("Error updating task:", err);
    throw new Error("Failed to update task");
  }
}

export async function deleteTask(userId, id) {
  try {
    await connectToDatabase();
    const deletedTask = await Task.findOneAndDelete({ _id: id, user: userId });
    if (!deletedTask) throw new Error("Task not found or unauthorized");
    revalidatePath("/");
    return JSON.parse(JSON.stringify(deletedTask));
  } catch (err) {
    console.error("Error deleting task:", err);
    throw new Error("Failed to delete task");
  }
}
