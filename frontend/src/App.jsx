import React, { useState } from 'react';
import { fetchRandomMovie } from './api';
import './App.css';

export function App() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleGetMovie = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchRandomMovie(movie ? movie.id : null);
      setMovie(data);
    } catch (err) {
      setError('No pudimos obtener una película. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="app-container">
      <header>
        <h1>¿Qué veo hoy?</h1>
        <p className="subtitle">Sin menús, sin pensar. Un solo clic para decidir qué película ver.</p>
      </header>

      <section className="action-section">
        <button
          className="main-button"
          type="button"
          onClick={handleGetMovie}
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <span className="spinner-wrapper">
              <span className="spinner" aria-hidden="true"></span>
              Buscando...
            </span>
          ) : movie ? (
            'Dame otra opción'
          ) : (
            'Dime qué ver'
          )}
        </button>
      </section>

      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}

      {movie && (
        <article className="movie-card" data-testid="movie-card">
          <div className="poster-container">
            <img
              className="movie-poster"
              src={movie.poster_url}
              alt={`Póster de ${movie.title}`}
              loading="lazy"
            />
          </div>
          <div className="movie-info">
            <h2 className="movie-title">{movie.title}</h2>
            <p className="movie-synopsis">{movie.synopsis}</p>
          </div>
        </article>
      )}
    </main>
  );
}

export default App;
