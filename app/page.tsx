"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<"step1" | "step2" | "step3">("step1");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 15,
      },
    },
  };

  // Mock route data for the interactive landing page widget
  const mockRoute = {
    from: "Tech Junction",
    to: "Komfo Anokye Hospital (KATH)",
    fare: 6.50,
    stops: 8,
    time: 32,
    segments: [
      {
        route: "Tech–Kejetia Line",
        color: "#fbbf24",
        vehicle: "Yellow tro-tro, red stripe",
        board: "Tech Junction",
        alight: "Kejetia",
        stops: 5,
        fare: 3.50,
      },
      {
        route: "Kejetia–KATH Ring",
        color: "#f43f5e",
        vehicle: "White Nissan Urvan, blue door",
        board: "Kejetia",
        alight: "KATH",
        stops: 3,
        fare: 3.00,
      }
    ]
  };

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-100 flex flex-col relative overflow-x-hidden font-sans selection:bg-amber-500/30 selection:text-amber-300">
      {/* Premium dark mesh backdrop */}
      <div className="mesh-backdrop opacity-70 pointer-events-none absolute inset-0 z-0"></div>
      
      {/* Decorative orbital line elements for visual depth */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full border border-white/5 pointer-events-none z-0"></div>
      <div className="absolute top-[18%] left-[-10%] w-[540px] h-[540px] rounded-full border border-dashed border-amber-500/5 pointer-events-none z-0"></div>
      <div className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full border border-white/5 pointer-events-none z-0"></div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl drop-shadow-[0_0_10px_rgba(251,191,36,0.3)] animate-pulse">🚐</span>
          <div className="flex flex-col">
            <span className="font-extrabold text-sm md:text-base tracking-wider uppercase bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent select-none">
              Tro-Tro Router
            </span>
            <span className="text-[8px] uppercase tracking-widest text-slate-500 -mt-1 font-bold">Kumasi Transit</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-[9px] uppercase tracking-wider text-emerald-400 font-extrabold">System Live</span>
          </div>
          <Link
            href="/map"
            className="btn-premium-glow bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(251,191,36,0.25)] flex items-center gap-1.5 border border-amber-300/10 cursor-pointer"
          >
            Launch Map ➔
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-start max-w-7xl mx-auto px-6 py-12 md:py-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16 w-full text-center"
        >
          {/* Top Hero Section */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Tagline Badge */}
            <motion.div variants={itemVariants} className="inline-flex">
              <span className="glass border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-4 py-2 rounded-full bg-amber-500/5 shadow-[0_0_15px_rgba(251,191,36,0.05)]">
                Ghana&apos;s Informal Transit Network • Redefined
              </span>
            </motion.div>

            {/* Hero Main Header */}
            <motion.div variants={itemVariants} className="space-y-4">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
                Never get lost finding a{" "}
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-[0_2px_15px_rgba(251,191,36,0.15)]">
                  Tro-Tro
                </span>{" "}
                again.
              </h1>
              <p className="text-sm md:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed font-normal">
                Instantly map your routes, calculate cumulative fares, and discover optimal transfer connections in Kumasi. Type landmarks, share your GPS location, or ask questions naturally in Pidgin, Twi, or English.
              </p>
            </motion.div>

            {/* Glowing CTA Row */}
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/map"
                className="w-full sm:w-auto min-h-[50px] btn-premium-glow bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold px-10 py-4 rounded-2xl text-sm uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2.5 shadow-[0_0_35px_rgba(245,158,11,0.35)] hover:shadow-[0_0_50px_rgba(245,158,11,0.55)] border border-amber-300/10 cursor-pointer"
              >
                Launch Route Finder 🚐
              </Link>
              <a
                href="https://wa.me/#" // Placeholder sandbox link
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto min-h-[50px] glass border border-white/10 hover:border-amber-500/20 hover:bg-white/[0.04] text-white hover:text-amber-400 px-8 py-4 rounded-2xl text-sm font-bold uppercase tracking-wider transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5 text-emerald-500 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.978 14.12 1.9 12.003 1.9c-5.439 0-9.865 4.37-9.87 9.8-.002 1.773.475 3.502 1.385 5.03L2.52 21.08l4.127-1.926zm10.741-6.196c-.3-.15-1.774-.875-2.046-.975-.273-.1-.472-.15-.671.15-.199.3-.77 1.002-.944 1.202-.174.2-.348.225-.648.075-.3-.15-1.266-.467-2.41-1.485-.89-.795-1.49-1.777-1.664-2.077-.174-.3-.019-.462.13-.611.135-.134.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.374-.025-.524-.075-.15-.671-1.62-.92-2.22-.243-.585-.489-.506-.671-.515-.174-.009-.373-.011-.573-.011-.2 0-.523.075-.797.374-.273.3-1.045 1.022-1.045 2.493s1.07 2.892 1.219 3.093c.149.2 2.105 3.214 5.099 4.507.712.308 1.268.493 1.702.631.716.227 1.368.195 1.884.118.575-.085 1.774-.725 2.022-1.424.249-.699.249-1.299.174-1.424-.075-.125-.273-.2-.573-.35z" />
                </svg>
                WhatsApp Webhook Bot
              </a>
            </motion.div>
          </div>

          {/* Interactive UI Mockup Showcase */}
          <motion.div variants={itemVariants} className="max-w-5xl mx-auto w-full pt-6">
            <div className="glass-heavy rounded-3xl p-1 border border-white/10 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-12 bg-slate-950/40 rounded-[22px] overflow-hidden">
                
                {/* Left Side: Mock Search Interface */}
                <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-white/5 flex flex-col justify-between text-left">
                  <div>
                    {/* Mock Header Tabs */}
                    <div className="flex bg-slate-950/60 p-1 rounded-xl gap-1.5 mb-6 border border-white/5">
                      <button
                        onClick={() => setActiveTab("step1")}
                        className={`flex-1 py-2 text-[9px] font-extrabold uppercase tracking-wider text-center rounded-lg transition-all cursor-pointer ${
                          activeTab === "step1"
                            ? "text-amber-400 bg-white/[0.04]"
                            : "text-slate-500 hover:text-white"
                        }`}
                      >
                        1. User Query
                      </button>
                      <button
                        onClick={() => setActiveTab("step2")}
                        className={`flex-1 py-2 text-[9px] font-extrabold uppercase tracking-wider text-center rounded-lg transition-all cursor-pointer ${
                          activeTab === "step2"
                            ? "text-amber-400 bg-white/[0.04]"
                            : "text-slate-500 hover:text-white"
                        }`}
                      >
                        2. AI Parse
                      </button>
                      <button
                        onClick={() => setActiveTab("step3")}
                        className={`flex-1 py-2 text-[9px] font-extrabold uppercase tracking-wider text-center rounded-lg transition-all cursor-pointer ${
                          activeTab === "step3"
                            ? "text-amber-400 bg-white/[0.04]"
                            : "text-slate-500 hover:text-white"
                        }`}
                      >
                        3. Result
                      </button>
                    </div>

                    {/* Interactive Tab Cards */}
                    {activeTab === "step1" && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-base">Ask Anything Naturally</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Say it in Pidgin, Twi, or English. Describe landmarks or share your current GPS location directly.
                        </p>
                        
                        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-xs font-mono text-slate-300 relative overflow-hidden">
                          <div className="absolute top-2 right-2 text-[9px] font-extrabold text-slate-500 tracking-widest uppercase">INPUT</div>
                          <span className="text-amber-400">“</span>I dey Tech Junction, how do I go Komfo Anokye Hospital?<span className="text-amber-400">”</span>
                        </div>

                        <div className="flex justify-end pt-2">
                          <button
                            onClick={() => setActiveTab("step2")}
                            className="text-xs text-amber-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Analyze with NLP ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "step2" && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-base">3-Tier NLU Parsing</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Matches aliases, computes spelling distances, or uses LLM fallbacks to resolve exact stations.
                        </p>

                        <div className="space-y-2">
                          <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-white/5 text-xs">
                            <span className="text-slate-400 font-medium">Text Extraction</span>
                            <span className="text-emerald-400 font-semibold font-mono">Matched ✅</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-white/5 text-xs">
                            <span className="text-slate-400 font-medium">“Tech Junction”</span>
                            <span className="text-white font-semibold font-mono">➡ st-tech-junction</span>
                          </div>
                          <div className="flex justify-between items-center bg-slate-900/50 p-2.5 rounded-lg border border-white/5 text-xs">
                            <span className="text-slate-400 font-medium">“Komfo Anokye Hospital”</span>
                            <span className="text-white font-semibold font-mono">➡ st-kath (Alias)</span>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-2">
                          <span className="text-[10px] uppercase font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                            ✨ AI Resolved
                          </span>
                          <button
                            onClick={() => setActiveTab("step3")}
                            className="text-xs text-amber-400 font-bold uppercase tracking-wider hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            Show Router Output ➔
                          </button>
                        </div>
                      </div>
                    )}

                    {activeTab === "step3" && (
                      <div className="space-y-4">
                        <h4 className="font-bold text-white text-base">Optimal Route Computed</h4>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Graph algorithm ranks routes by transfers, cumulative fares, and real vehicle notes.
                        </p>

                        <div className="bg-slate-900/40 rounded-xl p-3 border border-amber-500/20 shadow-md">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-amber-400 font-extrabold uppercase bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                              ₵ BEST FARE
                            </span>
                            <span className="text-xs font-mono font-bold text-white">₵6.50 Total</span>
                          </div>
                          <div className="text-[11px] text-slate-300 space-y-1 font-sans">
                            <p className="flex items-center gap-1.5 text-white font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Board: Tech Junction
                            </p>
                            <p className="pl-3 border-l border-dashed border-slate-700 py-1 text-slate-400 italic">
                              Take Tech–Kejetia (₵3.50)
                            </p>
                            <p className="flex items-center gap-1.5 text-amber-400 font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Transfer: Kejetia
                            </p>
                            <p className="pl-3 border-l border-dashed border-slate-700 py-1 text-slate-400 italic">
                              Take Kejetia–KATH (₵3.00)
                            </p>
                            <p className="flex items-center gap-1.5 text-white font-semibold">
                              <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Alight: KATH
                            </p>
                          </div>
                        </div>

                        <div className="flex justify-start pt-2">
                          <button
                            onClick={() => setActiveTab("step1")}
                            className="text-xs text-slate-400 hover:text-white font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                          >
                            Reset Demo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                    <span>Kumasi Database</span>
                    <span>100% Client Cache ready</span>
                  </div>
                </div>

                {/* Right Side: Map Simulated Polyline Rendering */}
                <div className="lg:col-span-7 bg-[#0b0f19] p-6 relative flex flex-col justify-between overflow-hidden min-h-[300px]">
                  
                  {/* Grid background for the mock map */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:16px_16px]"></div>
                  
                  {/* Floating Map HUD */}
                  <div className="relative z-10 flex items-center justify-between bg-slate-950/80 border border-white/10 rounded-xl px-4 py-2 backdrop-blur-md">
                    <span className="text-[10px] uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Live Map Overlay
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">6.6885° N, 1.6244° W</span>
                  </div>

                  {/* Simulated nodes and lines */}
                  <div className="absolute inset-0 flex items-center justify-center p-8">
                    <svg className="w-full h-full min-h-[220px]" viewBox="0 0 400 200" fill="none">
                      {/* Grid routes lines */}
                      <path
                        d="M 50 150 Q 150 130 200 100 T 350 50"
                        stroke="rgba(255,255,255,0.03)"
                        strokeWidth="6"
                        strokeLinecap="round"
                      />
                      
                      {/* Segment 1: Yellow Route Line */}
                      <motion.path
                        d="M 50 150 Q 150 130 200 100"
                        stroke="#fbbf24"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                      />

                      {/* Segment 2: Red Route Line */}
                      <motion.path
                        d="M 200 100 T 350 50"
                        stroke="#f43f5e"
                        strokeWidth="4"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, delay: 1, repeat: Infinity, repeatDelay: 1 }}
                      />

                      {/* Board node (Tech) */}
                      <circle cx="50" cy="150" r="8" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                      <text x="50" y="172" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">Tech Junction</text>

                      {/* Transfer node (Kejetia) */}
                      <circle cx="200" cy="100" r="8" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
                      <text x="200" y="84" fill="#fbbf24" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">Kejetia (Transfer)</text>

                      {/* Alight node (KATH) */}
                      <circle cx="350" cy="50" r="8" fill="#f43f5e" stroke="#ffffff" strokeWidth="2" />
                      <text x="350" y="34" fill="#ffffff" fontSize="10" fontFamily="sans-serif" textAnchor="middle" fontWeight="bold">KATH Hospital</text>
                    </svg>
                  </div>

                  {/* Map Controls Mock */}
                  <div className="relative z-10 flex justify-end gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 font-bold select-none text-xs">+</div>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 flex items-center justify-center text-slate-400 font-bold select-none text-xs">-</div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left max-w-6xl mx-auto"
          >
            {/* Feature 1 */}
            <div className="premium-glow-card rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-xl shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                📍
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">GPS Location Matching</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Yield your high-accuracy GPS coordinates in one tap. The routing engine scans the geofence and resolves your closest station automatically.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="premium-glow-card rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-xl shadow-[0_0_15px_rgba(251,191,36,0.1)]">
                🤖
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">Natural Language Core</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Describe journeys exactly as you would to a driver. A custom local parser reads colloquial English, Twi, and Pidgin expressions instantly.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="premium-glow-card rounded-2xl p-6 border border-white/5 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 text-xl shadow-[0_0_15px_rgba(139,92,246,0.1)]">
                🔄
              </div>
              <div className="space-y-2">
                <h3 className="font-bold text-white text-base">Transfer-Aware Routing</h3>
                <p className="text-xs text-slate-400 leading-relaxed font-normal">
                  Computes multi-leg trips mapping transfers at shared terminal hubs. Integrates vehicle notes, cumulative fares, and sequences automatically.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-white/5 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <span>&copy; {new Date().getFullYear()} Tro-Tro Router. Built for Kumasi, Ghana.</span>
          <div className="flex gap-4">
            <Link href="/map" className="hover:text-amber-400 transition-colors">Route Finder</Link>
            <a href="https://github.com/Ohm-Kel/tro-tro" target="_blank" rel="noopener noreferrer" className="hover:text-amber-400 transition-colors">GitHub Repository</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
