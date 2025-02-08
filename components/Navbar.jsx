"use client";

import { signOutAction } from "@/actions/auth.actions";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Navbar = ({ toggleTheme }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    setIsAuthenticated(userId ? true : false);
  }, []);

  const handleLogout = async () => {
    try {
      await signOutAction();
      localStorage.removeItem("userId");
      toast.success("Logged out successfully!");
      router.refresh();
    } catch (error) {
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <nav className="bg-blue-500 text-white p-4 flex justify-between items-center w-full">
      <h1 className="text-xl font-bold">Task Manager</h1>
      <div className="flex gap-3">
        <button onClick={toggleTheme} className="bg-gray-800 text-white px-4 py-2 rounded-md">
          Toggle Theme
        </button>
        {isAuthenticated ? (
          <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-md">
            Logout
          </button>
        ) : (
          <button onClick={() => router.push("/signin")} className="bg-green-600 text-white px-4 py-2 rounded-md">
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
