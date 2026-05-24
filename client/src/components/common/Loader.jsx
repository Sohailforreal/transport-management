const Loader = () => {
  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">

        {/* Animated Truck SVG */}
        <div className="relative w-72 h-20 flex items-end">
          
          {/* Road */}
          <div className="absolute bottom-0 w-full h-3 bg-gray-700 rounded-full"></div>
          
          {/* Road dashes */}
          <div className="absolute bottom-[4px] w-full flex gap-3 px-4">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-[2px] w-5 bg-yellow-500 opacity-50"></div>
            ))}
          </div>

          {/* Truck */}
          <div className="absolute bottom-3 truck-animate">
            <svg width="80" height="44" viewBox="0 0 80 44" fill="none">
              {/* Truck body */}
              <rect x="2" y="10" width="48" height="28" rx="3" fill="#2563eb"/>
              {/* Cabin */}
              <rect x="50" y="16" width="26" height="22" rx="3" fill="#1d4ed8"/>
              {/* Cabin window */}
              <rect x="54" y="19" width="14" height="10" rx="2" fill="#93c5fd"/>
              {/* Cabin detail */}
              <rect x="70" y="19" width="4" height="10" rx="1" fill="#1e40af"/>
              {/* Truck stripe */}
              <rect x="2" y="28" width="48" height="4" fill="#1d4ed8"/>
              {/* Front light */}
              <rect x="74" y="24" width="4" height="4" rx="1" fill="#fbbf24"/>
              {/* Exhaust */}
              <rect x="10" y="6" width="4" height="6" rx="1" fill="#374151"/>
              {/* Smoke puffs */}
              <circle cx="12" cy="4" r="2" fill="#6b7280" className="smoke1"/>
              <circle cx="10" cy="1" r="1.5" fill="#9ca3af" className="smoke2"/>
              {/* Wheel 1 */}
              <circle cx="18" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
              <circle cx="18" cy="40" r="2.5" fill="#374151"/>
              {/* Wheel 2 */}
              <circle cx="40" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
              <circle cx="40" cy="40" r="2.5" fill="#374151"/>
              {/* Wheel 3 */}
              <circle cx="62" cy="40" r="6" fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
              <circle cx="62" cy="40" r="2.5" fill="#374151"/>
            </svg>
          </div>

        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-white font-semibold text-lg tracking-wide">
            Transport MS
          </p>
          <p className="text-gray-500 text-sm mt-1 animate-pulse">
            Loading your dashboard...
          </p>
        </div>

      </div>

      <style>{`
        .truck-animate {
          animation: truckDrive 2.5s linear infinite;
        }
        @keyframes truckDrive {
          0%   { left: -90px; }
          100% { left: 290px; }
        }
        .smoke1 {
          animation: smokePuff 0.8s ease-out infinite;
        }
        .smoke2 {
          animation: smokePuff 0.8s ease-out infinite 0.3s;
        }
        @keyframes smokePuff {
          0%   { opacity: 0.8; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-8px) scale(1.5); }
        }
      `}</style>
    </div>
  )
}

export default Loader