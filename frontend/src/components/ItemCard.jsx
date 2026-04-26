import React from 'react';
import { Star } from 'lucide-react';

export function ItemCard({ item }) {
  // Extracting first letter for avatar if no image
  const firstLetter = item.name ? item.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="group cursor-pointer flex flex-col h-full bg-white rounded-3xl shadow-sm hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* Image container */}
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        {item.image_url ? (
          <img src={item.image_url} alt={item.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-orange-50 flex items-center justify-center text-orange-300 font-black text-6xl">
            {firstLetter}
          </div>
        )}
        
        {/* Price/Offer Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 pt-12">
          <span className="text-white font-black text-xl tracking-tight opacity-95">₹200 FOR TWO</span>
        </div>
      </div>
      
      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start gap-2 mb-1">
            <h3 className="font-extrabold text-[18px] text-gray-900 truncate tracking-tight group-hover:text-orange-600 transition-colors" title={item.name}>
              {item.name}
            </h3>
            {item.type === 'dish' && (
              <span className="text-[10px] font-bold bg-purple-100 text-purple-700 px-2 py-0.5 rounded flex-shrink-0">
                DISH
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-1.5 bg-green-600 text-white px-2 py-0.5 rounded-md text-[13px] font-bold shadow-sm">
              <Star size={12} className="fill-current" />
              <span>{item.rating ? Number(item.rating).toFixed(1) : '4.0'}</span>
            </div>
            <span className="text-gray-300 font-bold">•</span>
            <span className="text-[14px] font-bold text-gray-700 tracking-tight">30-35 mins</span>
          </div>

          <p className="text-gray-500 text-[14px] font-medium truncate mb-2" title={item.type === 'dish' ? `By ${item.restaurant_name}` : item.cuisine?.join(', ')}>
            {item.type === 'dish' ? `By ${item.restaurant_name}` : item.cuisine?.join(', ')}
          </p>
        </div>

        {/* Footer info - Popularity & Score */}
        <div className="pt-3 border-t border-gray-100 flex items-center justify-between mt-auto">
          <p className="text-gray-400 text-xs font-semibold">
            Popularity: <span className="text-gray-600">{item.popularity || 0}</span>
          </p>
          {item.score !== undefined && item.score !== null && (
            <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded text-xs border border-orange-100/50">
              Score: {item.score.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
