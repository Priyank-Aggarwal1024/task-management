import React from 'react';

const TaskList = ({ tasks, onDelete, onToggle }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Task List</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className={`p-4 rounded-lg shadow-md flex justify-between items-center ${task.completed ? 'bg-green-200' : 'bg-gray-100'}`}
          >
            <div>
              <h3 className="text-lg font-medium">{task.title}</h3>
              <p className="text-sm text-gray-600">{task.description}</p>
              <p className="text-xs text-gray-500">Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onToggle(task._id)}
                className="px-3 py-1 bg-blue-500 text-white rounded-md"
              >
                {task.completed ? 'Undo' : 'Complete'}
              </button>
              <button
                onClick={() => onDelete(task._id)}
                className="px-3 py-1 bg-red-500 text-white rounded-md"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;