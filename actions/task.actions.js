"use server";

import Task from "@/models/task.model";
import { connectToDatabase } from "@/utils/connectToDb";

export async function getTasks() {
  try {
    await connectToDatabase();
    const tasks = await Task.find({});
    return tasks;
  } catch (err) {
    console.error("Error fetching tasks:", err);
    throw new Error("Failed to fetch tasks");
  }
}

export async function addTask(title, description, dueDate) {
  const db = await connectToDatabase();
  return db.collection("tasks").insertOne({
    title,
    description,
    dueDate,
    completed: false,
  });
}

export async function updateTask(id, updates) {
  const db = await connectToDatabase();
  return db
    .collection("tasks")
    .updateOne({ _id: new ObjectId(id) }, { $set: updates });
}

export async function deleteTask(id) {
  const db = await connectToDatabase();
  return db.collection("tasks").deleteOne({ _id: new ObjectId(id) });
}
