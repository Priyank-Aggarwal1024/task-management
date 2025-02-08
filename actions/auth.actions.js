"use server";

import User from "@/models/user.model";
import { connectToDatabase } from "@/utils/connectToDb";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export async function signUpAction({ name, email, password }) {
  try {
    await connectToDatabase();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return { error: "Email is already in use" };
    }

    const newUser = new User({ name, email, password });
    await newUser.save();

    const cookieStore = await cookies();
    await cookieStore.set("auth_token", newUser._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return { success: "Account created successfully!", userId: newUser._id.toString() };
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
    if (!isMatch) {
      return { error: "Invalid credentials" };
    }

    const cookieStore = await cookies();
    await cookieStore.set("auth_token", user._id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
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
    maxAge: 0,
  });

  return { success: "Logged out successfully!" };
}
