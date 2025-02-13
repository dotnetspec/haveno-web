import { test, expect } from '@playwright/test';

test('has title', async ({ page, browserName }) => {
  await page.goto('http://localhost:1234/');

  // Increase timeout for slower browsers
  const timeout = browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000;

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Haveno-Web/);
});

test('get funds link', async ({ page }) => {
  await page.goto('http://localhost:1234/');

  // Open menu if needed
  await page.waitForSelector('button.menu-btn', { state: 'visible' });
  await page.getByTestId('menu-button').click();

  // Ensure "Funds" link is visible before clicking
  await page.waitForSelector('a:has-text("Funds")', { state: 'visible' });
  await page.getByRole('link', { name: /Funds/i }).click();


  console.log("Current URL:", page.url());


  // Verify navigation to "Funds" page
  await expect(page.getByRole('heading', { name: 'Funds' })).toBeVisible();
});


