"use client";
import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Form Submitted:", form);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 text-white">
      {/* Background Effect - Positioned Behind */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Login Form - Positioned Above the Background */}
      <div className="relative z-10">
        <Card className="w-full max-w-lg p-11 bg-white shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
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
              <div className="mb-4 text-right">
                <Link href="/auth/forgot-password" className="text-blue-400 text-sm hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <Button type="submit" className="w-full bg-blue-600 py-2 text-lg">
                Login
              </Button>
            </form>
            <p className="mt-4 text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <Link href="/auth/signup" className="text-blue-400 hover:underline">
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
