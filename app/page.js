"use client";
import React from "react";
import { BackgroundBeams } from "@/components/ui/background-beams";
import Link from "next/link";

export default function Home() {
  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <h1 className="relative z-10 text-3xl md:text-7xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600 font-sans font-bold">
          Find Your Team
        </h1>
        <p className="text-neutral-400 text-lg md:text-xl my-4">
          Welcome to <strong className="text-white">CrewConnect</strong>, the best platform for finding teammates.
        </p>
        <Link href="/auth/signup">
          <button  className="bg-white text-black font-semibold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition">
            Get Started
          </button>
        </Link>
      </div>
      <BackgroundBeams />
    </div>
  );
}

