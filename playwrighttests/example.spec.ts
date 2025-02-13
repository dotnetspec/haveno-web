import { test, expect } from '@playwright/test';

test('has title', async ({ page, browserName }) => {
  await page.goto('http://localhost:1234/');

  // Increase timeout for slower browsers
  const timeout = browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000;

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Haveno-Web/);
});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:1234/');

   // Click the menu button.
   await page.getByRole('button', { name: 'menubutton' }).click();

  // Click the get started link.
  await page.getByRole('link', { name: 'Funds' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Funds' })).toBeVisible();
});
