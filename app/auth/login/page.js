"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundBeams } from "@/components/ui/background-beams";

import {
  auth,
  provider,
  signInWithPopup,
  signInWithEmailAndPassword,
  db,
} from "@/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  // ✅ Prevent Firebase from running on the server
  useEffect(() => {
    if (typeof window !== "undefined") {
      auth.onAuthStateChanged((user) => {
        if (user) {
          router.push("/dashboard");
        }
      });
    }
  }, [router]);

  // ✅ Google Login
  async function googleLogin() {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
        });
      }

      router.push("/dashboard");
    } catch (error) {
      console.log("Error signing in with Google:", error);
    }
  }

  // ✅ Handle Email Login
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password);
      router.push("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gray-950 text-white">
      {/* Background Effect */}
      <BackgroundBeams className="absolute inset-0 -z-10" />

      {/* Login Form */}
      <Card className="w-full max-w-lg p-8 bg-white text-gray-900 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-3xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
            <Button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 text-lg"
            >
              Login
            </Button>
          </form>

          {/* Sign in with Google */}
          <div className="mt-4 text-center">
            <Button
              onClick={googleLogin}
              className="w-full bg-gray-800 text-white py-2 text-lg"
            >
              Sign in with Google
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/auth/signup" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
