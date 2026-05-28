export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative overflow-hidden font-sans">
      {/* 1. Map Placeholder (Grey Gradient / Shimmer) */}
      <div className="absolute inset-0 z-0 bg-slate-950 flex items-center justify-center">
        {/* Pulsing grid lines to simulate a map loading */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="w-32 h-32 rounded-full bg-amber-500/5 animate-ping flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/10"></div>
        </div>
      </div>

      {/* 2. Loading Overlay Search Panel */}
      <div className="fixed bottom-0 left-0 right-0 p-4 safe-bottom z-10 sm:absolute sm:top-4 sm:left-4 sm:bottom-auto sm:right-auto sm:w-[420px] sm:p-0">
        <div className="glass rounded-2xl p-4 space-y-4 border border-white/[0.08] shadow-2xl backdrop-blur-2xl">
          {/* Tabs skeleton */}
          <div className="flex gap-2 border-b border-white/5 pb-2">
            <div className="h-6 w-24 bg-white/5 rounded-md animate-pulse"></div>
            <div className="h-6 w-24 bg-white/5 rounded-md animate-pulse opacity-55"></div>
          </div>

          {/* Form inputs skeleton */}
          <div className="space-y-3">
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse flex items-center px-4">
              <div className="h-4 w-4 rounded-full bg-white/10 mr-3"></div>
              <div className="h-3 w-32 bg-white/10 rounded-md"></div>
            </div>
            <div className="h-12 w-full bg-white/5 rounded-xl animate-pulse flex items-center px-4">
              <div className="h-4 w-4 rounded-full bg-white/10 mr-3"></div>
              <div className="h-3 w-40 bg-white/10 rounded-md"></div>
            </div>
          </div>

          {/* Button row skeleton */}
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 w-28 bg-white/5 rounded-md animate-pulse"></div>
            <div className="h-11 w-32 bg-amber-500/20 border border-amber-500/30 rounded-xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
