import { test, expect } from '@playwright/test';

test('la portada carga con su título y encabezado', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Estadística y Probabilidad/);
  await expect(page.locator('h1')).toContainText('Estadística y Probabilidad');
});

test('la portada enlaza al índice de lecciones', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /lecciones/i }).click();
  await expect(page.locator('h1')).toContainText('Lecciones');
});
