import { test, expect } from '@playwright/test';

test('laboratorio muestra tabla y medidas', async ({ page }) => {
  await page.goto('/laboratorio/');
  await expect(page.locator('h1')).toContainText('Laboratorio');
  await expect(page.locator('.lab-medidas')).toContainText('Media');
});

test('práctica corrige una probabilidad correcta', async ({ page }) => {
  await page.goto('/practica/prb-01/');
  await expect(page.locator('h1')).toContainText('Probabilidad de un número par');
  await page.locator('input[type="text"]').fill('1/2');
  await page.getByRole('button', { name: 'Comprobar' }).click();
  await expect(page.locator('.feedback.ok').first()).toBeVisible();
});
