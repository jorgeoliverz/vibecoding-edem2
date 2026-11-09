import { test, expect } from '@playwright/test';

test.describe('Flujo de usuario - ¿Qué veo hoy?', () => {
  test('permite abrir la app, pedir una recomendación y cambiar a otra diferente', async ({ page }) => {
    // 1. Abrir la página principal
    await page.goto('/');

    // 2. Verificar estado inicial: título y botón principal sin película
    await expect(page.getByRole('heading', { level: 1, name: /¿Qué veo hoy\?/i })).toBeVisible();
    const mainButton = page.getByRole('button', { name: /dime qué ver/i });
    await expect(mainButton).toBeVisible();
    await expect(page.getByTestId('movie-card')).toHaveCount(0);

    // 3. Pulsar el botón grande para pedir una película
    await mainButton.click();

    // 4. Verificar que aparece la tarjeta de película con título, imagen y sinopsis
    const movieCard = page.getByTestId('movie-card');
    await expect(movieCard).toBeVisible();

    const movieTitleElement = movieCard.getByRole('heading', { level: 2 });
    await expect(movieTitleElement).toBeVisible();
    const firstMovieTitle = (await movieTitleElement.textContent())?.trim();
    expect(firstMovieTitle).toBeTruthy();

    const posterImg = movieCard.getByRole('img');
    await expect(posterImg).toBeVisible();
    await expect(posterImg).toHaveAttribute('src', /^https?:\/\//);

    const synopsis = movieCard.locator('.movie-synopsis');
    await expect(synopsis).toBeVisible();

    // 5. El botón ahora ofrece otra opción
    const nextButton = page.getByRole('button', { name: /dame otra opción/i });
    await expect(nextButton).toBeVisible();

    // 6. Pulsar de nuevo y comprobar que cambia a otra película distinta
    await nextButton.click();

    await expect(movieTitleElement).not.toHaveText(firstMovieTitle);
    const secondMovieTitle = (await movieTitleElement.textContent())?.trim();
    expect(secondMovieTitle).toBeTruthy();
    expect(secondMovieTitle).not.toBe(firstMovieTitle);
  });
});
