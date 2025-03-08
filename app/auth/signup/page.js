"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { color } from "framer-motion";

import { auth, createUserWithEmailAndPassword, db } from "@/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: form.name,
        email: form.email,
      });
      console.log("Signup successful:", user);
    } catch (error) {
      console.error("Error signing up:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 text-white">
      {/* Background Effect - Positioned Behind */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Signup Form - Positioned Above the Background */}
      <div className="relative z-10">
        <Card className="w-full max-w-lg p-11 bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <Input

                  type="text"
                  className='bg-white'
                  name="name"
                  placeholder="Enter your name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Email</label>
                <Input
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Password</label>
                <Input
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600">
                Sign Up
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-blue-400 hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
