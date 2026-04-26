import React from 'react';
import { Star } from 'lucide-react';

export function ToggleSwitch({ isLTR, setIsLTR }) {
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/50 w-max mx-auto">
      <span className={`text-xs sm:text-sm font-extrabold transition-colors ${!isLTR ? 'text-orange-600' : 'text-gray-400'}`}>
        Basic Search
      </span>
      <button 
        onClick={() => setIsLTR(!isLTR)}
        className={`w-14 h-7 sm:w-16 sm:h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${isLTR ? 'bg-orange-500' : 'bg-gray-300'}`}
        aria-label="Toggle Ranking Mode"
      >
        <div className={`bg-white w-5 h-5 sm:w-6 sm:h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${isLTR ? 'translate-x-7 sm:translate-x-8' : 'translate-x-0'}`}>
          {isLTR && <Star size={12} className="text-orange-500 fill-current" />}
        </div>
      </button>
      <span className={`text-xs sm:text-sm font-extrabold flex items-center gap-1.5 transition-colors ${isLTR ? 'text-orange-600' : 'text-gray-400'}`}>
        ML Ranking (LTR) 
        {!isLTR && <Star size={12} className="text-gray-400"/>}
      </span>
    </div>
  );
}
