import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, ChevronDown, User, ShoppingBag, Star, Clock } from 'lucide-react';

function App() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef(null);

  const [isLTR, setIsLTR] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetch('http://localhost:5000/api/restaurants')
      .then(res => res.json())
      .then(data => setRestaurants(data))
      .catch(err => console.error("Error fetching restaurants:", err));
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(() => {
      setLoading(true);
      const modeParam = isLTR ? 'ltr' : 'baseline';
      fetch(`http://localhost:5000/api/search?q=${encodeURIComponent(query)}&mode=${modeParam}`)
        .then(res => res.json())
        .then(data => {
          setSuggestions(data);
          setShowDropdown(true);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSuggestionClick = (item) => {
    setQuery(item.name);
    setShowDropdown(false);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2 cursor-pointer text-orange-500 font-extrabold text-3xl tracking-tight">
                <span>Foodie</span>
              </div>
              <div className="hidden md:flex items-center gap-2 text-sm text-gray-600 hover:text-orange-500 transition-colors cursor-pointer">
                <span className="font-bold border-b-2 border-gray-800 text-gray-800 pb-0.5">Other</span>
                <span className="text-gray-500 truncate max-w-[200px]">Bengaluru, Karnataka, India</span>
                <ChevronDown size={18} className="text-orange-500" />
              </div>
            </div>

            <nav className="flex items-center gap-8">
              <div className="hidden lg:flex items-center gap-3 text-gray-800 hover:text-orange-500 cursor-pointer font-semibold transition-colors">
                 <Search size={22} className="text-gray-600" />
                 <span>Search</span>
              </div>
              <div className="hidden lg:flex items-center gap-3 text-gray-800 hover:text-orange-500 cursor-pointer font-semibold transition-colors">
                 <User size={22} className="text-gray-600" />
                 <span>Sign In</span>
              </div>
              <div className="flex items-center gap-3 text-gray-800 hover:text-orange-500 cursor-pointer font-semibold transition-colors relative">
                 <ShoppingBag size={22} className="text-gray-600" />
                 <span>Cart</span>
                 <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </div>
            </nav>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        <div className="bg-gradient-to-b from-gray-50 to-white py-16 border-b border-gray-100">
          <div className="max-w-3xl mx-auto px-4 relative flex flex-col items-center" ref={dropdownRef}>
            <div className="flex items-center justify-center gap-4 mb-6">
               <span className={`text-sm font-bold ${!isLTR ? 'text-orange-600' : 'text-gray-400'}`}>Basic Search</span>
               <button 
                 onClick={() => setIsLTR(!isLTR)}
                 className={`w-14 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isLTR ? 'bg-orange-500' : 'bg-gray-300'}`}
               >
                 <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${isLTR ? 'translate-x-7' : 'translate-x-0'}`}></div>
               </button>
               <span className={`text-sm font-bold flex items-center gap-1 ${isLTR ? 'text-orange-600' : 'text-gray-400'}`}>ML Ranking (LTR) <Star size={12} className={isLTR ? "fill-orange-500" : ""}/></span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center tracking-tight">What are you craving today?</h1>
            <div className="relative w-full shadow-2xl rounded-2xl hover:shadow-orange-100/50 transition-shadow">
              <input
                type="text"
                className="w-full h-[72px] pl-16 pr-8 bg-white border border-gray-200 rounded-2xl text-xl font-medium focus:outline-none focus:ring-4 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder-gray-400 text-gray-800"
                placeholder="Search for restaurants and food..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={28} className="text-gray-400" />
              </div>
              {loading && (
                <div className="absolute right-6 top-1/2 -translate-y-1/2">
                  <div className="w-6 h-6 border-[3px] border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>

            {showDropdown && suggestions.length > 0 && (
              <div className="absolute w-full mt-24 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all duration-200 origin-top">
                <ul className="py-2">
                  {suggestions.map((item, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-5 px-6 py-4 hover:bg-orange-50 cursor-pointer transition-colors group"
                      onClick={() => handleSuggestionClick(item)}
                    >
                      <div className="w-14 h-14 rounded-xl bg-gray-50 group-hover:bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover:text-orange-500 transition-colors flex-shrink-0 shadow-sm">
                        {item.type === 'restaurant' ? <MapPin size={26}/> : <Search size={24}/>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-gray-800 text-lg truncate group-hover:text-orange-600 transition-colors">{item.name}</div>
                        <div className="text-sm text-gray-500 font-medium truncate mt-0.5">
                          {item.type === 'dish' ? (
                            <span className="flex items-center gap-1.5"><Star size={14} className="text-yellow-500 fill-current"/> Dish by {item.restaurant_name}</span>
                          ) : (
                            <span className="flex items-center gap-1.5">{item.cuisine?.join(', ')}</span>
                          )}
                        </div>
                      </div>
                      {item.score && (
                         <div className="text-xs font-mono font-medium text-gray-500 bg-gray-100 group-hover:bg-white px-2.5 py-1 rounded-md border border-gray-200">
                           Score: {item.score.toFixed(2)}
                         </div>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {showDropdown && !loading && suggestions.length === 0 && (
                <div className="absolute w-full mt-24 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 p-8 text-center">
                    <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Search size={32} className="text-gray-300" />
                    </div>
                    <div className="text-gray-800 font-semibold text-lg">No results found for "{query}"</div>
                    <div className="text-gray-500 mt-1">Try searching for something else...</div>
                </div>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-[28px] font-extrabold text-gray-900 mb-10 tracking-tight">Top restaurant chains in Bengaluru</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {restaurants.map((restaurant) => (
              <div key={restaurant.id} className="group cursor-pointer">
                <div className="relative rounded-3xl overflow-hidden aspect-video bg-gray-100 mb-5 shadow-sm group-hover:shadow-2xl group-hover:scale-[1.02] transition-all duration-300">
                   <div className="absolute inset-0 bg-gradient-to-tr from-rose-100 to-orange-50 flex items-center justify-center text-orange-300 font-black text-6xl">
                     {restaurant.name.charAt(0)}
                   </div>
                   <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent p-5 pt-12">
                     <span className="text-white font-black text-2xl tracking-tighter opacity-90">₹200 FOR TWO</span>
                   </div>
                </div>
                <div className="px-1">
                  <h3 className="font-bold text-[20px] text-gray-900 truncate tracking-tight">{restaurant.name}</h3>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center gap-1.5 bg-green-600 text-white px-2 py-0.5 rounded-md text-sm font-bold shadow-sm">
                      <Star size={14} className="fill-current" />
                      <span>{restaurant.rating}</span>
                    </div>
                    <span className="text-gray-400 font-bold">•</span>
                    <span className="text-[15px] font-bold text-gray-700 tracking-tight">30-35 mins</span>
                  </div>
                  <p className="text-gray-500 text-[15px] font-medium mt-1.5 truncate">{restaurant.cuisine?.join(', ')}</p>
                  <p className="text-gray-400 text-sm font-medium mt-0.5 truncate">Popularity: {restaurant.popularity} • Ratings: {restaurant.popularity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
