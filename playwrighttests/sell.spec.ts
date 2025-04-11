import { test, expect } from '@playwright/test'

test('has title', async ({ page, browserName }) => {
  await page.goto('http://localhost:1234/')

  // Increase timeout for slower browsers
  const timeout =
    browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Haveno-Web/)
})

test('click BITCOIN SELL button', async ({ page }) => {
  // Navigate to the application
  await page.goto('http://localhost:1234/')

  // Wait for the menu button to be visible and click it to open the menu
  const menuButton = await page.waitForSelector('button.menu-btn', {
    state: 'visible'
  })
  expect(menuButton).not.toBeNull()
  await menuButton.click()

  // Wait for the "Sell" link to be visible in the menu
  const sellLink = await page.waitForSelector('a:has-text("Sell")', {
    state: 'visible'
  })
  expect(sellLink).not.toBeNull()

  // Click the "Sell" link
  await sellLink.click()

  await page.waitForSelector('h4:has-text("Manage Sell")', { state: 'visible' });

  // Verify that the "Sell" page content is displayed
  await expect(page.getByRole('heading', { name: 'Manage Sell' })).toBeVisible()

    // Find the "MONERO" button and click it
    const bitcoin_sell_Button = await page.waitForSelector(
      'button.info-button#bitcoin-sell-button',
      { state: 'visible' }
    )
    expect(bitcoin_sell_Button).not.toBeNull()
    await bitcoin_sell_Button.click()
})
