import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
import { SuggestionsDropdown } from './SuggestionsDropdown';

export function SearchBar({ 
  query, 
  setQuery, 
  suggestions, 
  loading, 
  showDropdown, 
  setShowDropdown, 
  error, 
  onSubmit 
}) {
  const containerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowDropdown]);

  // Reset active index when query changes
  useEffect(() => {
    setActiveIndex(-1);
  }, [query]);

  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        onSubmit(suggestions);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex < suggestions.length - 1 ? prevIndex + 1 : prevIndex));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < suggestions.length) {
        handleSuggestionClick(suggestions[activeIndex]);
      } else {
        onSubmit(suggestions);
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
    // After selecting an item, we can submit it
    onSubmit([item]); 
  };

  const handleInputFocus = () => {
    if (query) setShowDropdown(true);
  };

  return (
    <div className="relative w-full z-50 text-left" ref={containerRef}>
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
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <div className="absolute left-5 sm:left-8 top-1/2 -translate-y-1/2 text-gray-400">
          <Search size={28} className="text-orange-500/80" />
        </div>
        {loading && (
          <div className="absolute right-6 top-1/2 -translate-y-1/2 bg-white pl-2">
            <div className="w-6 h-6 border-[3px] border-gray-200 border-t-orange-500 rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {showDropdown && (
         <div className="absolute top-full left-0 right-0 z-50">
           <SuggestionsDropdown 
             suggestions={suggestions}
             query={query}
             loading={loading}
             error={error}
             show={showDropdown}
             activeIndex={activeIndex}
             onSuggestionClick={handleSuggestionClick}
           />
         </div>
      )}
    </div>
  );
}
