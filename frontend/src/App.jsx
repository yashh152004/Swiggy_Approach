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
  const [activeResults, setActiveResults] = useState(null);

  // When a user selects a suggestion or submits, we display the results below
  const handleSearchSubmit = (resultsList) => {
    setActiveResults(resultsList);
    setShowDropdown(false);
  };

  const isShowingSearchResults = query.length > 0 && activeResults !== null;
  const displayedItems = isShowingSearchResults ? activeResults : restaurants;
  const listTitle = isShowingSearchResults 
    ? `Search Results for "${query}"` 
    : "Top restaurant chains in Bengaluru";
  const listLoading = isShowingSearchResults ? searchLoading : restaurantsLoading;

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
          onSubmit={() => handleSearchSubmit(suggestions)}
        />
        <RestaurantList 
          items={displayedItems}
          title={listTitle}
          loading={listLoading}
          error={restaurantsError}
        />
      </main>
    </div>
  );
}

export default App;
