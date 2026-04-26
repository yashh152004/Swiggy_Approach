import React from 'react';
import { Star } from 'lucide-react';

export function RestaurantList({ items, title, loading, error }) {
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
        <div className="text-gray-500 font-semibold text-center py-10 bg-gray-50 rounded-2xl">
          No items found.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <h2 className="text-[28px] font-black text-gray-900 mb-10 tracking-tight">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.id || Math.random()} className="group cursor-pointer">
            <div className="relative rounded-3xl overflow-hidden aspect-video bg-gray-100 mb-5 shadow-sm group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300">
               <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-orange-50 flex items-center justify-center text-orange-300 font-black text-6xl">
                 {item.name ? item.name.charAt(0) : '?'}
               </div>
               {item.image_url && (
                 <img src={item.image_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover" />
               )}
               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent p-5 pt-12">
                 <span className="text-white font-black text-2xl tracking-tighter opacity-90">₹200 FOR TWO</span>
               </div>
            </div>
            <div className="px-1">
              <div className="flex justify-between items-start gap-2">
                 <h3 className="font-extrabold text-[20px] text-gray-900 truncate tracking-tight group-hover:text-orange-600 transition-colors">{item.name}</h3>
                 {item.type === 'dish' && <span className="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded flex-shrink-0">DISH</span>}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-bold shadow-sm">
                  <Star size={14} className="fill-current" />
                  <span>{item.rating || '4.0'}</span>
                </div>
                <span className="text-gray-400 font-bold">•</span>
                <span className="text-[15px] font-bold text-gray-700 tracking-tight">30-35 mins</span>
              </div>
              <p className="text-gray-500 text-[15px] font-semibold mt-2 truncate">
                {item.type === 'dish' ? `By ${item.restaurant_name}` : item.cuisine?.join(', ')}
              </p>
              <p className="text-gray-400 text-sm font-medium mt-1 truncate flex items-center gap-2">
                <span>Popularity: {item.popularity || 0}</span> 
                {item.score && (
                   <span className="text-orange-500 font-bold bg-orange-50 px-1.5 py-0.5 rounded border border-orange-100">Score: {item.score.toFixed(2)}</span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
