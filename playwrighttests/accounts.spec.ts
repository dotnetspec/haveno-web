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

  // Find the Bitcoin address input field and enter the address
  const bitcoinAddressInput = await page.waitForSelector(
    'input#bitcoin-address-input',
    { state: 'visible' }
  )
  expect(bitcoinAddressInput).not.toBeNull()
  await bitcoinAddressInput.fill('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v')

  // Find the "SAVE NEW BTC ACCOUNT" button and click it
  const saveNewBTCAccountButton = await page.waitForSelector(
    'button.info-button#save-new-BTC-account-button',
    { state: 'visible' }
  )
  expect(saveNewBTCAccountButton).not.toBeNull()
  await saveNewBTCAccountButton.click()

   // Verify that the Bitcoin address appears in the list of accounts
   await expect(
    page.locator('div.btc-account-item.address-label', {
      hasText: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'
    })
  ).toBeVisible();
})
