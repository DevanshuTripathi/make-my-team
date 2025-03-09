"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import useRouter for redirection
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";

import { auth, createUserWithEmailAndPassword, db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const router = useRouter(); // ✅ Initialize useRouter

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;

      // ✅ Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
      });

      console.log("Signup successful:", user);

      // ✅ Redirect to login page after successful signup
      router.push("/auth/login");
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 text-white px-4">
      {/* Background Effect */}
      <BackgroundBeams className="absolute inset-0 -z-10" />

      {/* Signup Form */}
      <Card className="w-full max-w-lg p-10 bg-white text-gray-900 shadow-xl border-2 border-gray-300 rounded-xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center font-bold text-gray-800">
            Register
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700">
                Name
              </label>
              <Input
                type="text"
                name="name"
                className="bg-white border-2 border-gray-400 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700">
                Email
              </label>
              <Input
                type="email"
                name="email"
                className="bg-white border-2 border-gray-400 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-semibold text-gray-700">
                Password
              </label>
              <Input
                type="password"
                name="password"
                className="bg-white border-2 border-gray-400 rounded-lg px-3 py-2 text-gray-900 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 text-lg rounded-lg transition"
            >
              Sign Up
            </Button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-600 font-semibold hover:underline"
            >
              Login
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
