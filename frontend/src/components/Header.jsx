import React from 'react';
import { Search, User, ShoppingBag, Menu, ChevronDown } from 'lucide-react';

export function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 transition-all border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 sm:gap-8">
            <div className="flex items-center gap-2 cursor-pointer text-orange-500 font-black text-2xl sm:text-3xl tracking-tight hover:scale-105 transition-transform duration-300">
              <span>Foodie</span>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors cursor-pointer group pt-1">
              <span className="font-bold border-b-[3px] border-gray-800 text-gray-800 pb-0.5 group-hover:border-orange-500 group-hover:text-orange-500 transition-colors">Other</span>
              <span className="text-gray-500 truncate max-w-[150px] lg:max-w-[200px] group-hover:text-gray-700 font-medium">Bengaluru, Karnataka, India</span>
              <ChevronDown size={18} className="text-orange-500 group-hover:translate-y-0.5 transition-transform" />
            </div>
          </div>

          <nav className="flex items-center gap-6 sm:gap-8">
            <div className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-orange-500 cursor-pointer font-bold transition-colors group">
               <Search size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
               <span>Search</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-gray-700 hover:text-orange-500 cursor-pointer font-bold transition-colors group">
               <User size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
               <span>Sign In</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700 hover:text-orange-500 cursor-pointer font-bold transition-colors relative group">
               <ShoppingBag size={20} className="text-gray-500 group-hover:text-orange-500 transition-colors" />
               <span className="hidden sm:inline">Cart</span>
               <span className="absolute -top-1.5 -right-2.5 bg-orange-500 text-white text-[10px] font-black rounded-full h-5 w-5 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm shadow-orange-500/50">0</span>
            </div>
            <div className="lg:hidden flex items-center text-gray-800 hover:text-orange-500 cursor-pointer transition-colors">
               <Menu size={28} />
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
