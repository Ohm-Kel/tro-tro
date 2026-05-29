"use client";

import Link from "next/link";
import { motion } from "motion/react";

export default function HomePage() {
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

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col relative overflow-x-hidden font-sans">
      {/* Immersive mesh background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/30 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:32px_32px]"></div>
      </div>

      {/* Navigation Header */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚐</span>
          <span className="font-extrabold text-sm tracking-wider uppercase bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent select-none">
            Tro-Tro Router
          </span>
        </div>
        
        <Link
          href="/map"
          className="glass border border-white/10 hover:border-amber-500/30 hover:bg-white/[0.04] text-white px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-200"
        >
          Launch Map
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-5xl mx-auto px-6 py-12 md:py-24 text-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Tagline Badge */}
          <motion.div variants={itemVariants} className="inline-flex">
            <span className="glass border border-amber-500/20 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-amber-500/5">
              Kumasi&apos;s Transit Network • Mapped
            </span>
          </motion.div>

          {/* Hero Main Header */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] text-white">
              Never get lost finding a{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
                Tro-Tro
              </span>{" "}
              again.
            </h1>
            <p className="text-sm md:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Find routes, fares, and optimal transfer connections instantly. 
              Search using landmarks, GPS coordinates, or simply describe your journey in English, Pidgin, or Twi.
            </p>
          </motion.div>

          {/* Glowing Call-to-Action */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/map"
              className="w-full sm:w-auto min-h-[48px] bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-bold px-8 py-3.5 rounded-2xl text-sm transition-all duration-150 flex items-center justify-center gap-2.5 shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:shadow-[0_0_40px_rgba(245,158,11,0.5)]"
            >
              Find Your Route 🚐
            </Link>
            <a
              href="https://wa.me/#" // Placeholder Twilio Sandbox
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-h-[48px] glass border border-white/10 hover:border-white/20 hover:bg-white/[0.04] text-white px-8 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-150 flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5 text-green-500 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.59 1.978 14.12 1.9 12.003 1.9c-5.439 0-9.865 4.37-9.87 9.8-.002 1.773.475 3.502 1.385 5.03L2.52 21.08l4.127-1.926zm10.741-6.196c-.3-.15-1.774-.875-2.046-.975-.273-.1-.472-.15-.671.15-.199.3-.77 1.002-.944 1.202-.174.2-.348.225-.648.075-.3-.15-1.266-.467-2.41-1.485-.89-.795-1.49-1.777-1.664-2.077-.174-.3-.019-.462.13-.611.135-.134.3-.349.45-.524.15-.175.2-.299.3-.5.1-.2.05-.374-.025-.524-.075-.15-.671-1.62-.92-2.22-.243-.585-.489-.506-.671-.515-.174-.009-.373-.011-.573-.011-.2 0-.523.075-.797.374-.273.3-1.045 1.022-1.045 2.493s1.07 2.892 1.219 3.093c.149.2 2.105 3.214 5.099 4.507.712.308 1.268.493 1.702.631.716.227 1.368.195 1.884.118.575-.085 1.774-.725 2.022-1.424.249-.699.249-1.299.174-1.424-.075-.125-.273-.2-.573-.35z" />
              </svg>
              WhatsApp Bot
            </a>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 text-left"
          >
            {/* Feature 1 */}
            <div className="glass rounded-2xl p-6 border border-white/5 space-y-3 hover:border-white/10 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400 text-lg">
                📍
              </div>
              <h3 className="font-bold text-white text-base">Current Location Routing</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Yield coordinates directly from your device GPS. The engine matches you to the closest boarding point automatically.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass rounded-2xl p-6 border border-white/5 space-y-3 hover:border-white/10 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 text-lg">
                🤖
              </div>
              <h3 className="font-bold text-white text-base">Pidgin & Twi NLU</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Describe journeys naturally. A multi-tier parser resolves nicknames and landmarks locally or via Claude Haiku.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass rounded-2xl p-6 border border-white/5 space-y-3 hover:border-white/10 transition-all duration-200">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 text-lg">
                🔄
              </div>
              <h3 className="font-bold text-white text-base">Optimal Transfers</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Get routes with up to 1 transfer (2 vehicles) ranked by transfer counts, cumulative fares, and travel time.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-8 text-center text-xs text-slate-500 border-t border-white/5 mt-auto">
        &copy; {new Date().getFullYear()} Tro-Tro Router. Built for Kumasi, Ghana.
      </footer>
    </div>
  );
}
