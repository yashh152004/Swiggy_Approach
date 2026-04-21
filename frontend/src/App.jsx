import React, { useState } from 'react';
import { Header } from './components/Header';
import { SearchHero } from './components/SearchHero';
import { RestaurantList } from './components/RestaurantList';
import { useSearch } from './hooks/useSearch';
import { useRestaurants } from './hooks/useRestaurants';

function App() {
  const { 
    query, 
    setQuery, 
    suggestions, 
    loading: searchLoading, 
    isLTR, 
    setIsLTR, 
    error: searchError 
  } = useSearch();

  const { 
    restaurants, 
    loading: restaurantsLoading, 
    error: restaurantsError 
  } = useRestaurants();

  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <SearchHero 
          query={query}
          setQuery={setQuery}
          suggestions={suggestions}
          loading={searchLoading}
          isLTR={isLTR}
          setIsLTR={setIsLTR}
          showDropdown={showDropdown}
          setShowDropdown={setShowDropdown}
          error={searchError}
        />
        <RestaurantList 
          restaurants={restaurants}
          loading={restaurantsLoading}
          error={restaurantsError}
        />
      </main>
    </div>
  );
}

export default App;
