import { useState, useEffect } from 'react';
import { searchEntities } from '../services/api';

export function useSearch() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLTR, setIsLTR] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    let isMounted = true;

    if (!debouncedQuery.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);

    searchEntities(debouncedQuery, isLTR)
      .then(data => {
        if (isMounted) {
          setSuggestions(data || []);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error('Search error:', err);
          setError('Failed to fetch suggestions');
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, isLTR]);

  return {
    query,
    setQuery,
    suggestions,
    setSuggestions,
    loading,
    isLTR,
    setIsLTR,
    error,
  };
}
