"use client";

import React, { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState(1); 

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4;
      });
    }, 60);

    const fadeOutTimeout = setTimeout(() => {
      setPhase(2);
    }, 2100);

    const finishTimeout = setTimeout(() => {
      onFinish();
    }, 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeOutTimeout);
      clearTimeout(finishTimeout);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between py-12 px-6 transition-all duration-300 ${
        phase === 2
          ? "opacity-0 scale-95 pointer-events-none"
          : "opacity-100 scale-100"
      } bg-gradient-to-b from-zinc-950 via-[#0a0a0c] to-black text-white`}
    >
      {/* Top ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-600/15 rounded-full blur-3xl" />
      <div className="absolute top-1/3 left-1/3 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Header padding */}
      <div className="h-4" />

      {/* Logo & Brand Name */}
      <div className="flex flex-col items-center justify-center text-center z-10">
        {/* Beautiful Animated SVG Logo */}
        <div className="relative mb-6 animate-bounce duration-1000">
          <div className="absolute inset-0 bg-indigo-500 rounded-3xl blur-md opacity-30 animate-pulse" />
          <div className="relative w-24 h-24 bg-gradient-to-tr from-indigo-600 to-indigo-400 rounded-3xl flex items-center justify-center border border-indigo-300/20 shadow-xl shadow-indigo-900/40">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>

            {/* Glowing pencil symbol overlay */}
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-300/30 shadow-lg">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-100 to-indigo-200 drop-shadow-sm font-sans">
          Apptency
        </h1>
        
        {/* Animated tag line in Hindi */}
        <p className="mt-3 text-sm text-zinc-400 font-medium tracking-wide">
          Your ideas, safe and organized✨
        </p>
      </div>

      {/* Bottom Loading Bar and Footer */}
      <div className="w-full max-w-xs flex flex-col items-center gap-6 z-10">
        {/* Progress bar container */}
        <div className="w-full h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/60 p-[1px]">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Loading details */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-xs text-zinc-500 font-semibold uppercase tracking-widest animate-pulse">
            {progress < 40 ? "Initializing Storage..." : progress < 80 ? "Loading Folders..." : "Opening Apptency..."}
          </span>
          <span className="text-[10px] text-zinc-600 font-mono">v1.1.0 • Client Storage</span>
        </div>
      </div>
    </div>
  );
}
