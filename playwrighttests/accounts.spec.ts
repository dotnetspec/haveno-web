import { test, expect } from '@playwright/test'

test('add new crytpo currency account', async ({ page, browserName }) => {
  // Navigate to the application
  await page.goto('http://localhost:1234/')

  // Increase timeout for slower browsers
  const timeout =
    browserName === 'webkit' || browserName === 'chromium' ? 15000 : 10000

  // Wait for the menu button to be visible and click it to open the menu
  const menuButton = await page.waitForSelector('button.menu-btn', {
    state: 'visible'
  })
  expect(menuButton).not.toBeNull()
  await menuButton.click()

  // Wait for the "Accounts" link to be visible in the menu
  const accountsLink = await page.waitForSelector('a:has-text("Accounts")', {
    state: 'visible'
  })
  expect(accountsLink).not.toBeNull()

  // Click the "Accounts" link
  await accountsLink.click()

  // Verify that the "Accounts" page content is displayed
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible()

  // Wait for the "Crypto Currency Accounts" button to be visible
  const cryptoCurrencyAccountsButton = await page.waitForSelector(
    'button.info-button#cryptocurrencyAccountsButton',
    { state: 'visible' }
  )
  expect(cryptoCurrencyAccountsButton).not.toBeNull()

  await cryptoCurrencyAccountsButton.click()
  await expect(
    page.getByRole('heading', { name: 'Cryptocurrency Accounts' })
  ).toBeVisible()

  // Wait for the "Add New Crypto Currency Account" button to be visible
  const addNewCryptoCurrencyAccountsButton = await page.waitForSelector(
    'button.info-button#addnewBTCaccountViewbutton',
    { state: 'visible' }
  )
  expect(addNewCryptoCurrencyAccountsButton).not.toBeNull()

  await addNewCryptoCurrencyAccountsButton.click()
  // Verify that the text "Bitcoin address:" is still visible
  await expect(page.locator('text=Bitcoin address:')).toBeVisible()
})
