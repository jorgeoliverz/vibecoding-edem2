import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App.jsx';
import * as api from './api';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza el título y el botón inicial sin película', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1, name: /¿Qué veo hoy\?/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /dime qué ver/i })).toBeInTheDocument();
    expect(screen.queryByTestId('movie-card')).not.toBeInTheDocument();
  });

  it('muestra la película al pulsar el botón', async () => {
    const fakeMovie = {
      id: 1,
      title: 'Inception',
      synopsis: 'Un ladrón que roba secretos dentro de sueños.',
      poster_url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    };

    vi.spyOn(api, 'fetchRandomMovie').mockResolvedValueOnce(fakeMovie);

    render(<App />);

    const button = screen.getByRole('button', { name: /dime qué ver/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('movie-card')).toBeInTheDocument();
    });

    expect(screen.getByRole('heading', { level: 2, name: /inception/i })).toBeInTheDocument();
    expect(screen.getByText(/un ladrón que roba secretos dentro de sueños/i)).toBeInTheDocument();
    const poster = screen.getByRole('img', { name: /póster de inception/i });
    expect(poster).toHaveAttribute('src', fakeMovie.poster_url);
    expect(screen.getByRole('button', { name: /dame otra opción/i })).toBeInTheDocument();
  });

  it('al pulsar de nuevo excluye la película actual y muestra otra diferente', async () => {
    const movie1 = {
      id: 1,
      title: 'Inception',
      synopsis: 'Un ladrón que roba secretos dentro de sueños.',
      poster_url: 'https://image.tmdb.org/t/p/w500/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
    };
    const movie2 = {
      id: 2,
      title: 'Interstellar',
      synopsis: 'Viaje a través de un agujero de gusano.',
      poster_url: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    };

    const spy = vi
      .spyOn(api, 'fetchRandomMovie')
      .mockResolvedValueOnce(movie1)
      .mockResolvedValueOnce(movie2);

    render(<App />);

    const button = screen.getByRole('button', { name: /dime qué ver/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /inception/i })).toBeInTheDocument();
    });
    expect(spy).toHaveBeenNthCalledWith(1, null);

    // Segundo clic para otra opción
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 2, name: /interstellar/i })).toBeInTheDocument();
    });
    expect(spy).toHaveBeenNthCalledWith(2, 1);
  });

  it('muestra un mensaje de error si la petición falla', async () => {
    vi.spyOn(api, 'fetchRandomMovie').mockRejectedValueOnce(new Error('Network error'));

    render(<App />);

    const button = screen.getByRole('button', { name: /dime qué ver/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });
    expect(screen.getByText(/no pudimos obtener una película/i)).toBeInTheDocument();
  });
});
