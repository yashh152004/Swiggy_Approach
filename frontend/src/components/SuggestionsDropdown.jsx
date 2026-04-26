import React, { useEffect, useRef } from 'react';
import { MapPin, Search, Star } from 'lucide-react';

export function SuggestionsDropdown({ suggestions, query, loading, error, show, activeIndex, onSuggestionClick }) {
  const listRef = useRef(null);

  // Auto-scroll logic so the active item is always visible
  useEffect(() => {
    if (show && listRef.current && activeIndex >= 0) {
      const activeElement = listRef.current.children[activeIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [activeIndex, show]);

  if (!show) return null;

  if (loading && suggestions.length === 0) {
     return (
       <div className="absolute w-full mt-4 sm:mt-6 top-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-6 flex justify-center items-center">
         <div className="w-8 h-8 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
       </div>
     );
  }

  if (error) {
    return (
        <div className="absolute w-full mt-4 sm:mt-6 top-full bg-red-50 rounded-2xl shadow-2xl border border-red-100 z-50 p-6 flex justify-center items-center">
           <span className="text-red-500 font-bold">{error}</span>
        </div>
    );
  }

  if (suggestions.length === 0 && query && !loading && !error) {
    return (
      <div className="absolute w-full mt-4 sm:mt-6 top-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 p-10 text-center animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-5 shadow-sm">
            <Search size={36} className="text-gray-300" />
          </div>
          <div className="text-gray-900 font-black text-xl mb-2">No results found for "{query}"</div>
          <div className="text-gray-500 font-medium">Try searching for something else...</div>
      </div>
    );
  }

  if (suggestions.length > 0) {
    return (
      <div className="absolute w-full mt-4 sm:mt-6 top-full bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
        <ul ref={listRef} className="py-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {suggestions.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={index}
                className={`flex items-center gap-4 sm:gap-6 px-4 sm:px-6 py-3 sm:py-4 cursor-pointer transition-colors border-b border-gray-50 last:border-0 group ${
                  isActive ? 'bg-orange-50/80' : 'hover:bg-orange-50/50'
                }`}
                onClick={() => onSuggestionClick(item)}
                onMouseEnter={() => {}} 
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center transition-all duration-300 flex-shrink-0 border ${
                  isActive ? 'bg-white border-orange-200 text-orange-500 shadow-md scale-105' : 'bg-gray-50 border-gray-100 text-gray-400 group-hover:bg-white group-hover:text-orange-500 group-hover:shadow-md group-hover:scale-105'
                }`}>
                  {item.type === 'restaurant' ? <MapPin size={24} className="sm:w-6 sm:h-6"/> : <Search size={20} className="sm:w-6 sm:h-6"/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`font-extrabold text-base sm:text-lg truncate transition-colors ${
                    isActive ? 'text-orange-600' : 'text-gray-800 group-hover:text-orange-600'
                  }`}>
                    {/* Highlight matched text */}
                    {item.name.toLowerCase().includes(query.toLowerCase()) ? (
                       <span>
                         {item.name.substring(0, item.name.toLowerCase().indexOf(query.toLowerCase()))}
                         <span className="text-orange-500 font-black">{item.name.substring(item.name.toLowerCase().indexOf(query.toLowerCase()), item.name.toLowerCase().indexOf(query.toLowerCase()) + query.length)}</span>
                         {item.name.substring(item.name.toLowerCase().indexOf(query.toLowerCase()) + query.length)}
                       </span>
                    ) : item.name}
                  </div>
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
            );
          })}
        </ul>
      </div>
    );
  }

  return null;
}
