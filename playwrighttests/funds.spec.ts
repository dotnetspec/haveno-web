import { test, expect } from '@playwright/test';

test('has title', async ({ page, browserName }) => {
  await page.goto('http://localhost:1234/');

  // Increase timeout for slower browsers
  const timeout = browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000;

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Haveno-Web/);
});

test.only('get funds link', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:1234/');

  // Wait for the menu button to be visible and click it to open the menu
  await page.waitForSelector('button.menu-btn', { state: 'visible' });

  // Wait for the menu button to be visible
  const menuButton = await page.waitForSelector('button.menu-btn', { state: 'visible' });

  // Assert that the menu button exists and is visible
  expect(menuButton).not.toBeNull();
  await expect(page.locator('button.menu-btn')).toBeVisible();

/*   await page.getByRole('button', { name: /☰/i }).click();

  // Ensure the "Funds" link is visible before clicking
  await page.waitForSelector('a:has-text("Funds")', { state: 'visible' });
  await page.getByRole('link', { name: /Funds/i }).click();

  // Verify that the "Funds" page content is displayed
  await expect(page.getByRole('heading', { name: 'Funds' })).toBeVisible(); */
  //await expect(page.locator('text=Manage your funds')).toBeVisible();
});


