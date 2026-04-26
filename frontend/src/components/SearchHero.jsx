import React from 'react';
import { SearchBar } from './SearchBar';
import { ToggleSwitch } from './ToggleSwitch';

export function SearchHero({ 
  query, 
  setQuery, 
  suggestions, 
  loading, 
  isLTR, 
  setIsLTR, 
  showDropdown, 
  setShowDropdown,
  error,
  onSubmit
}) {
  return (
    <div className="bg-gradient-to-b from-orange-50/50 via-white to-gray-50/50 py-16 sm:py-24 border-b border-gray-100 relative">
      {/* Decorative background blobs for a dynamic look */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob pointer-events-none"></div>
      <div className="absolute top-0 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-2000 pointer-events-none"></div>
      <div className="absolute -bottom-10 left-1/3 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-[80px] opacity-30 animate-blob animation-delay-4000 pointer-events-none"></div>

      <div className="max-w-3xl mx-auto px-4 relative flex flex-col items-center z-10">
        <ToggleSwitch isLTR={isLTR} setIsLTR={setIsLTR} />
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 mb-8 text-center tracking-tight leading-[1.1]">
          What are you <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-500">craving</span> today?
        </h1>
        
        <SearchBar 
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          loading={loading}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          error={error}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}
