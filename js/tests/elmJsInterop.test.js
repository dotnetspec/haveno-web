import { vi, describe, it, expect, beforeEach } from 'vitest';
import { elmInterop } from '../elmJsInterop.js';
import { encrypt, decrypt } from '../encryption.js';

// Mock the encryption module
vi.mock('../encryption.js', () => ({
  encrypt: vi.fn(async (data, password) => {
    if (password !== 'test-password') {
      throw new Error('Encryption failed: Incorrect password');
    }
    const salt = Array.from(crypto.getRandomValues(new Uint8Array(16)));
    const iv = Array.from(crypto.getRandomValues(new Uint8Array(12)));
    const encrypted = Array.from(new TextEncoder().encode(data)); // Simulate encrypted data
    return { iv, salt, data: encrypted };
  }),
  decrypt: vi.fn(async (encryptedData, password) => {
    if (password !== 'test-password') {
      throw new Error('Decryption failed: Incorrect password');
    }
    const { iv, salt, data } = encryptedData;
    if (!iv || !salt || !data) {
      throw new Error('Decryption failed: Invalid encrypted data');
    }
    return new TextDecoder().decode(new Uint8Array(data)); // Simulate decryption
  }),
}));

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal('console', { log: vi.fn(), error: vi.fn() });
  vi.stubGlobal('window', {
    Elm: {
      ports: {
        receiveMsgsFromJs: { send: vi.fn() },
      },
    },
  });
  vi.resetAllMocks(); // Reset all mock implementations before each test
  vi.clearAllMocks(); // Clear all mock states before each test
});

describe('elmInterop', async () => {
  const testPassword = 'test-password';
  const elmENCRYPTMessageAsJson = {
    typeOfMsg: 'encryptCryptoAccountMsgRequest',
    currency: 'BTC',
    accountsData: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
    storeAs: 'BTC_Public_Key_0',
    password: testPassword,
  };

  it('logs ElmReady message', async () => {
    await elmInterop({ typeOfMsg: 'ElmReady' });
    expect(console.log).toHaveBeenCalledWith('Message from Elm : ', 'ElmReady');
  });

  it('encrypts and stores data in localStorage', async () => {
    await elmInterop(elmENCRYPTMessageAsJson);

    const encryptedInStorage = JSON.parse(
      localStorage.getItem('BTC_Public_Key_0')
    );

    // Verify the structure of the encrypted data
    expect(encryptedInStorage).toHaveProperty('iv');
    expect(encryptedInStorage).toHaveProperty('salt');
    expect(encryptedInStorage).toHaveProperty('data');

    // Decrypt the data and verify the result
    const decrypted = await decrypt(encryptedInStorage, testPassword);
    expect(decrypted).toBe('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v');
  });

  it('decrypts stored BTC accounts and sends response to Elm', async () => {
    // Set up localStorage with encrypted data
    localStorage.setItem(
      'BTC_Public_Key_0',
      JSON.stringify(
        await encrypt('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v', testPassword)
      )
    );
    localStorage.setItem(
      'BTC_Public_Key_1',
      JSON.stringify(
        await encrypt('2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o', testPassword)
      )
    );

    // Message that triggers decryption
    const message = {
      typeOfMsg: 'decryptCryptoAccountsMsgRequest',
      page: 'AccountsPage',
      currency: 'BTC',
      accountsData: ['', ''],
      password: testPassword,
    };

    await elmInterop(message);

    expect(window.Elm.ports.receiveMsgsFromJs.send).toHaveBeenCalledWith({
      typeOfMsg: 'decryptedCryptoAccountsResponse',
      page: 'AccountsPage',
      accountsData: [
        '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v',
        '2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o',
      ],
      currency: 'BTC',
    });

    // Verify `decrypt` was called with expected arguments
    const encryptedData0 = JSON.parse(
      localStorage.getItem('BTC_Public_Key_0')
    );
    const encryptedData1 = JSON.parse(
      localStorage.getItem('BTC_Public_Key_1')
    );

    expect(decrypt).toHaveBeenCalledTimes(2);
    expect(decrypt).toHaveBeenCalledWith(encryptedData0, testPassword);
    expect(decrypt).toHaveBeenCalledWith(encryptedData1, testPassword);
  });

  it('logs error on decryption failure', async () => {
    decrypt.mockRejectedValueOnce(new Error('Decryption failed'));
    localStorage.setItem(
      'BTC_Public_Key_0',
      '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'
    );

    const message = {
      typeOfMsg: 'decryptCryptoAccountsMsgRequest',
      page: 'AccountsPage',
      currency: 'BTC',
    };
    await elmInterop(message);
    expect(console.error).toHaveBeenCalledWith(
      'Error decrypting BTC accounts:',
      expect.any(Error)
    );
  });

  it('handles unknown message types', async () => {
    await elmInterop({ typeOfMsg: 'UnknownMessage' });
    expect(console.log).toHaveBeenCalledWith(
      expect.stringContaining('Sorry, problem:')
    );
  });

  it('should fail to decrypt with a wrong password', async () => {
    await elmInterop(elmENCRYPTMessageAsJson);

    const encryptedInStorage = JSON.parse(
      localStorage.getItem('BTC_Public_Key_0')
    );

    await expect(
      decrypt(encryptedInStorage, 'wrong-password')
    ).rejects.toThrow('Decryption failed: Incorrect password');
  });
});
