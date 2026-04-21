import React, { useRef, useEffect } from 'react';
import { Search, MapPin, Star } from 'lucide-react';

export function SearchHero({ 
  query, 
  setQuery, 
  suggestions, 
  loading, 
  isLTR, 
  setIsLTR, 
  showDropdown, 
  setShowDropdown,
  error
}) {
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
  };

  const handleInputFocus = () => {
    if (query) setShowDropdown(true);
  };

  return (
    <div className="bg-gradient-to-b from-orange-50/50 via-white to-gray-50/50 py-16 sm:py-24 border-b border-gray-100 relative overflow-hidden">
      {/* Decorative background blobs for a dynamic look */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 relative flex flex-col items-center z-10" ref={dropdownRef}>
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-8 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full shadow-sm border border-white/50">
           <span className={`text-xs sm:text-sm font-extrabold transition-colors ${!isLTR ? 'text-orange-600' : 'text-gray-400'}`}>Basic Search</span>
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
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-8 text-center tracking-tight leading-[1.1]">
          What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">craving</span> today?
        </h1>
        
        <div className={`relative w-full rounded-2xl transition-all duration-300 bg-white ${showDropdown ? 'shadow-2xl shadow-orange-500/20 ring-4 ring-orange-500/20' : 'shadow-xl hover:shadow-2xl hover:shadow-orange-500/10'}`}>
          <input
            type="text"
            className="w-full h-16 sm:h-20 pl-14 sm:pl-20 pr-12 bg-transparent border-2 border-transparent rounded-2xl text-lg sm:text-xl font-semibold focus:outline-none focus:border-orange-500 transition-all placeholder-gray-400 text-gray-800"
            placeholder="Search for restaurants and food..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={handleInputFocus}
          />
          <div className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={28} className="text-orange-500/80" />
          </div>
          {loading && (
            <div className="absolute right-6 top-1/2 -translate-y-1/2">
              <div className="w-6 h-6 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
            </div>
          )}
        </div>

        {error && (
            <div className="w-full mt-4 bg-red-50 text-red-600 p-4 rounded-xl text-sm font-bold border border-red-100 flex items-center justify-center shadow-sm">
              {error}
            </div>
        )}

        {showDropdown && suggestions.length > 0 && !error && (
          <div className="absolute w-full mt-4 sm:mt-6 top-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
            <ul className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {suggestions.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 hover:bg-orange-50/50 cursor-pointer transition-colors group border-b border-gray-50 last:border-0"
                  onClick={() => handleSuggestionClick(item)}
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gray-50 group-hover:bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-all duration-300 flex-shrink-0 shadow-sm group-hover:shadow-md group-hover:scale-105">
                    {item.type === 'restaurant' ? <MapPin size={24} className="sm:w-6 sm:h-6"/> : <Search size={20} className="sm:w-6 sm:h-6"/>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-extrabold text-gray-800 text-base sm:text-lg truncate group-hover:text-orange-600 transition-colors">{item.name}</div>
                    <div className="text-xs sm:text-sm text-gray-500 font-semibold truncate mt-1">
                      {item.type === 'dish' ? (
                        <span className="flex items-center gap-1.5"><Star size={12} className="sm:w-3.5 sm:h-3.5 text-yellow-500 fill-current"/> Dish by {item.restaurant_name}</span>
                      ) : (
                        <span className="flex items-center gap-1.5">{item.cuisine?.join(', ')}</span>
                      )}
                    </div>
                  </div>
                  {item.score && (
                     <div className="text-[10px] sm:text-xs font-mono font-bold text-orange-600 bg-orange-100/50 px-2.5 py-1.5 rounded-lg self-start mt-2 sm:mt-0 border border-orange-200/50 shadow-sm">
                       Score: {item.score.toFixed(2)}
                     </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {showDropdown && !loading && suggestions.length === 0 && query && !error && (
            <div className="absolute w-full mt-4 sm:mt-6 top-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-10 text-center animate-in fade-in slide-in-from-top-4 duration-200">
                <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
                  <Search size={36} className="text-gray-300" />
                </div>
                <div className="text-gray-900 font-black text-xl mb-2">No results found for "{query}"</div>
                <div className="text-gray-500 font-medium">Try searching for something else...</div>
            </div>
        )}
      </div>
    </div>
  );
}
