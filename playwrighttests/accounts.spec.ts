import { test, expect } from '@playwright/test';

test('has title', async ({ page, browserName }) => {
  await page.goto('http://localhost:1234/');

  // Increase timeout for slower browsers
  const timeout = browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000;

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Haveno-Web/);
});

test('get accounts link', async ({ page }) => {
  await page.goto('http://localhost:1234/');

  // Open menu if needed
  await page.waitForSelector('button.menu-btn', { state: 'visible' });
    // Wait for the menu button to be visible and attached
    const menuButton = await page.waitForSelector('button.menu-btn', { state: 'visible', state: 'attached'  });
  
    // Assert that the menu button exists and is visible
    expect(menuButton).not.toBeNull();
    await expect(page.locator('button.menu-btn')).toBeVisible();

  
    await menuButton.click();
    
  

  




  console.log("Current URL:", page.url());

/* 
  // Verify navigation to "Accounts" page
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible(); */
});


