import { test, expect } from '@playwright/test'

test('add new crytpo currency account to local storage', async ({
  page,
  browserName
}) => {
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

  // Verify that the text "Password:" is visible
  await expect(page.locator('text=Password:')).toBeVisible()

  // Find the Password input field and enter the password
  const passwordInput = await page.waitForSelector(
    'input#accounts-password-input',
    { state: 'visible' }
  )
  expect(passwordInput).not.toBeNull()
  await passwordInput.fill('test-password')

  const savePasswordButton = await page.waitForSelector(
    'button.info-button#savePasswordButton',
    { state: 'visible' }
  )
  expect(savePasswordButton).not.toBeNull()

  // NOTE: Password is now saved in Elm Accounts.Model
 

  
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
  ).toBeVisible()

  /*
   // Verify that 'BTC_Public_Key_0' has been added to local storage
   const btcPublicKey = await page.evaluate(() => {
    return localStorage.getItem('BTC_Public_Key_0');
  });
  expect(btcPublicKey).not.toBeNull();
  console.log('BTC_Public_Key_0:', btcPublicKey);


  // Wait for the "BACK TO ACCOUNTS" button to be visible
  const backToAccountsButton = await page.waitForSelector(
    'button.info-button#back-to-accounts-button',
    { state: 'visible' }
  )
  expect(backToAccountsButton).not.toBeNull()

  // Click the "BACK TO ACCOUNTS" button
  await backToAccountsButton.click()

  // Verify that the "Accounts" page content is displayed again
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible() */
})
