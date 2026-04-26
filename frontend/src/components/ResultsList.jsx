import React from 'react';
import { ResultCard } from './ResultCard';

export function ResultsList({ items, title, loading, error }) {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-[28px] font-black text-gray-900 mb-10 tracking-tight">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="rounded-3xl bg-gray-200 aspect-video mb-4"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-bold text-center shadow-sm">
          {error}
        </div>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-[28px] font-black text-gray-900 mb-10 tracking-tight">{title}</h2>
        <div className="text-gray-500 font-semibold text-center py-10 bg-gray-50 rounded-2xl flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
             <span className="text-2xl text-gray-400">?</span>
          </div>
          <span>No items found.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-[28px] font-black text-gray-900 mb-10 tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {items.map((item) => (
          <ResultCard key={item.id || Math.random().toString()} item={item} />
        ))}
      </div>
    </div>
  );
}
