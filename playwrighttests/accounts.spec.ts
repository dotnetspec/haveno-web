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

 await savePasswordButton.click()

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

  await page.waitForTimeout(500) // Wait for 500ms to ensure the key is stored

  // Verify that 'BTC_Public_Key_0' has been added to local storage
  const btcPublicKey = await page.evaluate(() => {
    const value = localStorage.getItem('BTC_Public_Key_0')
    console.log('Retrieved value from localStorage:', value)
    return value
  })

  expect(btcPublicKey).toBeDefined()
  expect(btcPublicKey).not.toBeUndefined()
  expect(btcPublicKey).not.toBeNull()
  //console.log('BTC_Public_Key_0:', btcPublicKey)

  // Verify that the Bitcoin address appears in the list of accounts
  await expect(
    page.locator('div.btc-account-item.address-label', {
      hasText: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'
    })
  ).toBeVisible()

  // Wait for the "BACK TO ACCOUNTS" button to be visible
  const backToAccountsButton = await page.waitForSelector(
    'button.info-button#back-to-accounts-button',
    { state: 'visible' }
  )
  expect(backToAccountsButton).not.toBeNull()

  // Click the "BACK TO ACCOUNTS" button
  await backToAccountsButton.click()

  // Verify that the "Accounts" page content is displayed again
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible()

   // RELOAD and verify persistence
  await page.reload();

  //RETURN to the Accounts page - list BTC accounts section

  await page.waitForTimeout(1000)
   // Wait for the menu button to be visible and click it to open the menu
  const menuButtonAfterReload = await page.waitForSelector('button.menu-btn', {
    state: 'visible'
  })
  expect(menuButtonAfterReload).not.toBeNull()
  await page.waitForTimeout(500)
  await menuButtonAfterReload.click()

  // Wait for the "Accounts" link to be visible in the menu
  const accountsLinkAfterReload = await page.waitForSelector('a:has-text("Accounts")', {
    state: 'visible'
  })
  expect(accountsLinkAfterReload).not.toBeNull()

  // Click the "Accounts" link
  await accountsLinkAfterReload.click()

  // Verify that the "Accounts" page content is displayed
  await expect(page.getByRole('heading', { name: 'Accounts' })).toBeVisible()

  // Verify that the text "Password:" is visible
  await expect(page.locator('text=Password:')).toBeVisible()

  // Find the Password input field and enter the password
  const passwordInputAfterReload = await page.waitForSelector(
    'input#accounts-password-input',
    { state: 'visible' }
  )
  expect(passwordInputAfterReload).not.toBeNull()
  await passwordInputAfterReload.fill('test-password')

  await page.waitForTimeout(500) 

  const savePasswordButtonAfterReload = await page.waitForSelector(
    'button.info-button#savePasswordButton',
    { state: 'visible' }
  )
  expect(savePasswordButtonAfterReload).not.toBeNull()

  await savePasswordButtonAfterReload.click()

  await page.waitForTimeout(500) // Wait for 500ms to ensure page rendered

  // Wait for the "Crypto Currency Accounts" button to be visible
  const cryptoCurrencyAccountsButtonAfterReload = await page.waitForSelector(
    'button.info-button#cryptocurrencyAccountsButton',
    { state: 'visible' }
  )
  expect(cryptoCurrencyAccountsButtonAfterReload).not.toBeNull()

  await cryptoCurrencyAccountsButtonAfterReload.click()

  await expect(
    page.getByRole('heading', { name: 'Cryptocurrency Accounts' })
  ).toBeVisible()

   // Verify that 'BTC_Public_Key_0' is still in local storage
   const btcPublicKeyAfterReload = await page.evaluate(() => {
    const value = localStorage.getItem('BTC_Public_Key_0')
    console.log('Retrieved value from localStorage:', value)
    return value
  })

  await expect(btcPublicKeyAfterReload).toBeDefined()
  await expect(btcPublicKeyAfterReload).not.toBeNull()


  await page.waitForTimeout(500) // Wait for 500ms to ensure page rendered
  const btcAccountsButtonAfterReload = await page.waitForSelector(
    'button.info-button#btcAccountsButton',
    { state: 'visible' }
  )
  expect(btcAccountsButtonAfterReload).not.toBeNull()

  await btcAccountsButtonAfterReload.click()

  const btcAddressDiv = await page.locator('#BTCAddress');
  // Verify that the element exists
await expect(btcAddressDiv).toBeDefined();
await expect(btcAddressDiv).not.toBeNull();

// Verify that the element is visible
await expect(btcAddressDiv).toBeVisible();

// Verify that the element contains the expected Bitcoin address
await expect(btcAddressDiv).toHaveText('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v');

 
})
