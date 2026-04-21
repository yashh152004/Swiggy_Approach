import { useState, useEffect } from 'react';
import { fetchRestaurants as fetchRestaurantsApi } from '../services/api';

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchRestaurantsApi()
      .then(data => {
        if (isMounted) {
          setRestaurants(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          console.error("Error fetching restaurants:", err);
          setError("Failed to load top restaurants. Please try again later.");
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return { restaurants, loading, error };
}
