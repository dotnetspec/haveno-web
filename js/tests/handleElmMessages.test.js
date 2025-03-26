import { vi, describe, it, expect, beforeEach } from 'vitest'
import { handleMessageFromElm } from '../handleElmMessages.js'
import { encrypt, decrypt } from '../encryption.js'

// -- NOTE: We are mocking the encryption module here. The 'real' functions are not used in this test.
// -- This is because the encryption module is already tested in encryption.test.js


vi.mock('../encryption.js', () => ({
  encrypt: vi.fn(async (data, password) => {
    if (password !== 'test-password') {
      throw new Error('Encryption failed: Incorrect password')
    }
    return JSON.stringify({ data, password })
  }),
  decrypt: vi.fn(async (encryptedData, password) => {
      if (password !== 'test-password') {
        throw new Error('Decryption failed: Incorrect password')
      }
      try {
        const parsedData = JSON.parse(encryptedData);
        return parsedData.data;
      } catch (e) {
        throw new Error('Decryption failed: Invalid encrypted data');
      }
    })
}))

beforeEach(() => {
  localStorage.clear()
  vi.stubGlobal('console', { log: vi.fn(), error: vi.fn() })
  vi.stubGlobal('window', {
    Elm: {
      ports: {
        receiveMsgsFromJs: { send: vi.fn() }
      }
    }
  })
  vi.resetAllMocks() // Reset all mock implementations before each test
  vi.clearAllMocks() // Clear all mock states before each test
})

describe('handleMessageFromElm', async () => {
const password = 'test-password'
const elmENCRYPTMessageAsJson = {
  typeOfMsg: 'encryptCryptoAccountMsgRequest',
  currency: 'BTC',
  accountsData: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
  storeAs: 'BTC_Public_Key_0',
  pword: password
}

  it('logs ElmReady message', async () => {
    await handleMessageFromElm({ typeOfMsg: 'ElmReady' })
    expect(console.log).toHaveBeenCalledWith('Message from Elm : ', 'ElmReady')
  })

  it('encrypts and stores data in localStorage', async () => {
    await handleMessageFromElm(elmENCRYPTMessageAsJson)
    const encryptedinStorage = localStorage.getItem('BTC_Public_Key_0')
    const decrypted = await decrypt(
      encryptedinStorage,
      elmENCRYPTMessageAsJson.pword
    )
    expect(decrypted).not.toBeNull()
    expect(decrypted).not.toBeUndefined()
    expect(decrypted).not.toBe('undefined')
    expect(decrypted).toBe('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v')
  })
  

it('decrypts stored BTC accounts and sends response to Elm', async () => {
  // Mock the decrypt function
  decrypt.mockImplementation(async (encryptedData, password) => {
    if (password !== 'test-password') {
      throw new Error('Decryption failed: Incorrect password');
    }
    const parsedData = JSON.parse(encryptedData);
    return parsedData.data;
  });

  // Set up localStorage with encrypted data
  localStorage.setItem(
    'BTC_Public_Key_0',
    JSON.stringify(await encrypt('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', password))
  );
  localStorage.setItem(
    'BTC_Public_Key_1',
    JSON.stringify(await encrypt('2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o', password))
  );

  // Message that triggers decryption
  const message = {
    typeOfMsg: 'decryptCryptoAccountsMsgRequest',
    page: 'AccountsPage',
    currency: 'BTC',
    accountsData: ['', ''],
    pword: password
  };

  await handleMessageFromElm(message);

  expect(window.Elm.ports.receiveMsgsFromJs.send).toHaveBeenCalledWith({
    typeOfMsg: 'decryptedCryptoAccountsResponse',
    page: 'AccountsPage',
    accountsData: [
      '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
      '2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o'
    ],
    currency: 'BTC'
  });

  // Verify `decrypt` was called with expected arguments
  expect(decrypt).toHaveBeenCalledTimes(2);
  expect(decrypt).toHaveBeenCalledWith(
    await encrypt('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', password),
    password
  );
  expect(decrypt).toHaveBeenCalledWith(
    await encrypt('2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o', password),
    password
  );
});

  it('logs error on decryption failure', async () => {
decrypt.mockRejectedValueOnce(new Error('Decryption failed'))
localStorage.setItem('BTC_Public_Key_0', '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v')

    const message = {
      typeOfMsg: 'decryptCryptoAccountsMsgRequest',
      page: 'AccountsPage',
      currency: 'BTC'
    }
    await handleMessageFromElm(message)
    expect(console.error).toHaveBeenCalledWith(
      'Error decrypting BTC accounts:',
      expect.any(Error)
    )
  })

  it('handles unknown message types', async () => {
    await handleMessageFromElm({ typeOfMsg: 'UnknownMessage' })
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Sorry, problem:')
    )
  })

  it('should fail to decrypt with a wrong password', async () => {
    await handleMessageFromElm(elmENCRYPTMessageAsJson)

    const encryptedinStorage = localStorage.getItem('BTC_Public_Key_0')

    console.log('Raw stored value:', encryptedinStorage)

    await expect(decrypt(encryptedinStorage, 'wrong-password')).rejects.toThrow(
      'Decryption failed: Incorrect password'
    )
  })
})
