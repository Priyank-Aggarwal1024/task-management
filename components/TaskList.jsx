"use client";
import { getTasks, deleteTask, updateTask } from "@/actions/task.actions";
import React, { useEffect, useState } from "react";
import { FaTrash, FaCheckCircle, FaCircle } from "react-icons/fa";
import { toast } from "react-hot-toast";
import Loading from "@/app/loading";

const TaskList = ({ refresh }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [refresh]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await getTasks(localStorage.getItem("userId"),);
      setTasks(data);
    } catch (error) {
      toast.error("Failed to fetch tasks.");
      console.error("Fetch Tasks Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(localStorage.getItem("userId"),taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task.");
      console.error("Delete Task Error:", error);
    }
  };

  const handleToggle = async (taskId, completed) => {
    try {
      await updateTask(localStorage.getItem("userId"),taskId, { completed: !completed });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task._id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
      toast.success(`Task marked as ${completed ? "incomplete" : "complete"}!`);
    } catch (error) {
      toast.error("Failed to update task.");
      console.error("Update Task Error:", error);
    }
  };
  if (loading) return <Loading />; 

  return (
    <div className="mt-6 w-full max-w-lg">
      <h2 className="text-xl font-semibold mb-4 text-center dark:text-white text-black ">
        Task List
      </h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading tasks...</p>
      ) : tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet. Start adding!</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`p-4 rounded-lg shadow-md flex justify-between items-center transition-all ${
                task.completed
                  ? "bg-green-100 dark:bg-green-900 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300"
              }`}
            >
              <div>
                <h3 className="text-lg font-medium">{task.title}</h3>
                <p className="text-sm">{task.description}</p>
                <p className="text-xs text-gray-500">
                  Due: {new Date(task.dueDate).toISOString().split("T")[0]}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleToggle(task._id, task.completed)}
                  className={`${
                    task.completed
                      ? "text-white hover:opacity-75"
                      : "text-blue-500 hover:text-blue-700"
                  }`}
                >
                  {task.completed ? (
                    <FaCheckCircle size={24} />
                  ) : (
                    <FaCircle size={24} />
                  )}
                </button>
                <button
                  onClick={() => handleDelete(task._id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash size={24} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;
