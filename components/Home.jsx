"use client";
import React, { Suspense, useEffect, useState } from "react";
import { addTask } from "@/actions/task.actions";
import { toast, Toaster } from "react-hot-toast";
import TaskList from "./TaskList";
import Navbar from "./Navbar";
import Loading from "@/app/loading";

const Home = () => {
  const [task, setTask] = useState({ title: "", description: "", dueDate: "" });
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState("light");
  const [refresh, setRefresh] = useState(true);

  const toggleTheme = () => {
    setDarkMode((prev) => (prev === "dark" ? "light" : "dark"));
    localStorage.setItem("theme", darkMode === "dark" ? "light" : "dark");
  };

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!task.title.trim() || !task.dueDate) {
      toast.error("Title and Due Date are required!");
      return;
    }

    setLoading(true);
    try {
      await addTask(localStorage.getItem("userId"),task.title, task.description, task.dueDate);
      setTask({ title: "", description: "", dueDate: "" }); // Reset form
      toast.success("Task added successfully!");
      setRefresh(!refresh);
    } catch (error) {
      toast.error("Failed to add task.");
      console.error("Add Task Error:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setDarkMode(localStorage.getItem("theme") || "light");
  }, []);

  return (
    <div
      className={`${
        darkMode === "dark" ? "dark bg-gray-900 text-white" : "bg-gray-100"
      } min-h-screen`}
    >
      <Suspense fallback={<Loading />}>
        <Navbar toggleTheme={toggleTheme} />
        <Toaster position="bottom-right" />
        <div className="flex flex-col md:flex-row gap-6 p-6">
          <div className="w-full md:w-1/2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Add Task</h2>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                type="text"
                name="title"
                placeholder="Task Title"
                value={task.title}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-black dark:text-white dark:bg-gray-700"
                required
              />
              <textarea
                name="description"
                placeholder="Task Description"
                value={task.description}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-black dark:text-white dark:bg-gray-700"
              />
              <input
                type="date"
                name="dueDate"
                value={task.dueDate}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg text-black dark:text-white dark:bg-gray-700"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 disabled:opacity-50"
                disabled={loading}
                aria-live="polite"
              >
                {loading ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
          <TaskList refresh={refresh} />
        </div>
      </Suspense>
    </div>
  );
};

export default Home;
