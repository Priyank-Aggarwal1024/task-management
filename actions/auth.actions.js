"use server"; // Ensures this runs as a server action

import User from "@/models/user.model";
import { connectToDatabase } from "@/utils/connectToDb";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

// Signup Action
export async function signUpAction({ name, email, password }) {
  try {
    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const newUser = new User({ name, email, password });
    await newUser.save();
    const cookieStore = await cookies(); // Await cookies() before using
    await cookieStore.set("auth_token", newUser._id, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure flag for production
      path: "/", // Available site-wide
      maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    });
    return {
      success: "Account created successfully!",
      userId: newUser._id.toString(),
    };
  } catch (error) {
    console.error("Sign-up error:", error);
    return { error: "Failed to create account" };
  }
}

export async function signInAction({ email, password }) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ email });
    if (!user) {
      return { error: "User Not Found" };
    }
    const isMatch = await bcrypt.compare(password, user.password);
    // console.log(isMatch, password, user.password);
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    const cookieStore = await cookies(); // Await cookies() before using
    await cookieStore.set("auth_token", user._id, {
      httpOnly: true, // Prevent JavaScript access
      secure: process.env.NODE_ENV === "production", // Secure flag for production
      path: "/", // Available site-wide
      maxAge: 60 * 60 * 24 * 7, // 7 days expiration
    });
    return { userId: user._id.toString() };
  } catch (error) {
    console.error("Sign-in error:", error);
    return { error: "Something went wrong" };
  }
}
export async function signOutAction() {
  const cookieStore = await cookies();
  await cookieStore.set("auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0, // Expire the cookie immediately
  });

  return { success: "Logged out successfully!" };
}
