import { test, expect } from '@playwright/test';

test('barras: construir, comprobar y justificar', async ({ page }) => {
  await page.goto('/actividades/barras/');
  await expect(page.locator('h1')).toContainText('gráfico de barras');

  // Cuatro barras con las frecuencias correctas + el total.
  const entradas = page.locator('input[type="number"]');
  const alturas = ['5', '6', '3', '1'];
  for (let i = 0; i < 4; i++) {
    await entradas.nth(i).fill(alturas[i]);
  }
  await entradas.nth(4).fill('15');
  await page.locator('select').selectOption('mayor');
  await page.getByRole('button', { name: 'Comprobar' }).click();

  await expect(page.locator('.resultado.ok')).toBeVisible();
});

test('arbol: marcar resultados favorables y calcular la probabilidad', async ({ page }) => {
  await page.goto('/actividades/arbol/');
  await expect(page.locator('h1')).toContainText('árbol de probabilidad');

  await page.getByRole('button', { name: 'CC' }).click();
  await page.getByRole('button', { name: 'CS' }).click();
  await page.getByRole('button', { name: 'SC' }).click();

  await page.locator('input[type="number"]').nth(0).fill('4');
  await page.locator('input[type="number"]').nth(1).fill('3');
  await page.locator('input[type="text"]').fill('3/4');
  await page.getByRole('button', { name: 'Comprobar' }).click();

  await expect(page.locator('.resultado.ok')).toBeVisible();
});
