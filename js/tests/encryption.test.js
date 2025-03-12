import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../encryption.js';
import { handleMessageFromElm } from '../handleElmMessages.js';

describe('Web Crypto API - AES Encryption', () => {
    const password = 'test-password';
    const message = 'Sensitive Data';

    beforeEach(() => {
        localStorage.clear(); // Reset storage before each test
    });

    it('should encrypt and decrypt the message correctly', async () => {
        await encrypt(message, password);
        const decrypted = await decrypt(password);
        expect(decrypted).toBe(message);
    });

    it('should fail to decrypt with a wrong password', async () => {
        await encrypt(message, password);
        const decrypted = await decrypt('wrong-password');
        expect(decrypted).not.toBe(message);
        expect(decrypted).toBeNull();
    });

    it('should generate different encrypted outputs for the same message', async () => {
        await encrypt(message, password);
        const firstEncryption = localStorage.getItem('secureMessage');

        await encrypt(message, password);
        const secondEncryption = localStorage.getItem('secureMessage');

        expect(firstEncryption).not.toBe(secondEncryption);
    });

    it('should store encrypted data with the expected structure', async () => {
        await encrypt(message, password);
        const storedData = localStorage.getItem('secureMessage');
        expect(storedData).not.toBeNull();

        const parsedData = JSON.parse(storedData);
        expect(parsedData).toHaveProperty('iv');
        expect(parsedData).toHaveProperty('salt');
        expect(parsedData).toHaveProperty('data');
        expect(Array.isArray(parsedData.iv)).toBe(true);
        expect(Array.isArray(parsedData.salt)).toBe(true);
        expect(Array.isArray(parsedData.data)).toBe(true);
    });

   /*  it('should handle encryption message from Elm and store encrypted data', async () => {
        const elmMessage = 'encryptionMsg~^&BTC~^&1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v';
        await handleMessageFromElm(elmMessage);

        // Verify that the encrypted data is stored in localStorage
        const storedData = localStorage.getItem('secureMessage');
        expect(storedData).not.toBeNull();
        expect(storedData).not.toBeUndefined();

        const parsedData = JSON.parse(storedData);
        expect(parsedData).toHaveProperty('iv');
        expect(parsedData).toHaveProperty('salt');
        expect(parsedData).toHaveProperty('data');
        expect(Array.isArray(parsedData.iv)).toBe(true);
        expect(Array.isArray(parsedData.salt)).toBe(true);
        expect(Array.isArray(parsedData.data)).toBe(true);
    }); */

   
});