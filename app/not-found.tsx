import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center font-sans">
      <div className="max-w-md w-full glass p-8 rounded-2xl border border-white/[0.08] shadow-2xl flex flex-col items-center">
        {/* 404 Tro-Tro Pin Icon */}
        <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <circle cx={12} cy={10} r={2} />
          </svg>
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2">404</h2>
        <h3 className="text-lg font-semibold text-slate-200 mb-4">Route Not Found!</h3>
        
        <p className="text-sm text-slate-400 mb-8 leading-relaxed">
          Looks like the tro-tro you are trying to catch has changed its route. 
          The page you are looking for doesn&apos;t exist.
        </p>

        <Link
          href="/"
          className="w-full min-h-[44px] flex items-center justify-center bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-2.5 px-5 rounded-xl text-sm transition-all duration-150 active:scale-95 shadow-lg"
        >
          Back to Route Search
        </Link>
      </div>
    </div>
  );
}
