const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function fetchRandomMovie(excludeId = null) {
  const url = new URL(`${API_URL}/api/movies/random`);
  if (excludeId !== null && excludeId !== undefined) {
    url.searchParams.set('exclude_id', excludeId);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Error al cargar la recomendación');
  }
  return response.json();
}
