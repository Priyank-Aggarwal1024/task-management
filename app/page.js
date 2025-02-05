"use client"
import React, { useEffect, useState } from 'react';
import TaskList from './components/TaskList';
import { deleteTask, getTasks, updateTask } from '@/actions/task.actions';

const Home = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const data = await getTasks();
      setTasks(data);
    }
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    await deleteTask(id);
    setTasks(tasks.filter(task => task._id !== id));
  };

  const handleToggle = async (id) => {
    const task = tasks.find(t => t._id === id);
    await updateTask(id, { completed: !task.completed });
    setTasks(tasks.map(t => t._id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <TaskList tasks={tasks} onDelete={handleDelete} onToggle={handleToggle} />
    </div>
  );
};

export default Home;