"use client";
import React from "react";
import { BackgroundLines } from "@/components/ui/background-lines";
import { BackgroundBeams } from "@/components/ui/background-beams";

export default function Home() {
  return (
    <div className="h-screen w-full bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="relative z-10 text-lg md:text-7xl  bg-clip-text text-transparent bg-gradient-to-b from-neutral-200 to-neutral-600  text-center font-sans font-bold">
          Find your Team
        </h1>
        <p></p>
        <p className="text-neutral-500 max-w-lg mx-auto my-2 text-xl text-center relative z-10">
          Welcome to Team Me Up, the best platform for finding teamates.
        </p>
      </div>
      <BackgroundBeams />
    </div>
  );
}
