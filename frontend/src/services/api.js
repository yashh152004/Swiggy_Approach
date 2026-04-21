const API_BASE_URL = 'http://localhost:5000/api';

export const fetchRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`);
  if (!response.ok) {
    throw new Error('Failed to fetch restaurants');
  }
  return response.json();
};

export const searchEntities = async (query, isLTR = false) => {
  const modeParam = isLTR ? 'ltr' : 'baseline';
  const response = await fetch(`${API_BASE_URL}/search?q=${encodeURIComponent(query)}&mode=${modeParam}`);
  if (!response.ok) {
    throw new Error('Search request failed');
  }
  return response.json();
};
