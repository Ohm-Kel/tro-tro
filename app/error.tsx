"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Global Error Boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-red-500/20 shadow-2xl flex flex-col items-center">
        {/* Error Tro-Tro Icon / SVG */}
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-500 mb-6 animate-pulse">
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <h2 className="text-xl font-bold text-white mb-2">Something went wrong!</h2>
        
        <p className="text-xs text-slate-400 mb-6 leading-relaxed">
          The Kumasi transit route search engine encountered an unexpected issue. 
          {error.message && <span className="block mt-2 font-mono text-red-400 bg-red-950/20 p-2 rounded-lg">{error.message}</span>}
        </p>

        <div className="flex gap-4 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 min-h-[44px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-sm transition-all duration-150 active:scale-95 shadow-lg"
          >
            Try Again
          </button>
          <a
            href="/"
            className="flex-1 min-h-[44px] flex items-center justify-center bg-slate-900 border border-white/10 hover:bg-slate-800 text-white font-bold py-2.5 px-5 rounded-xl text-sm transition-all duration-150"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}
