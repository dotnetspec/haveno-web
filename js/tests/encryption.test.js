import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../encryption.js';
import { handleMessageFromElm } from '../handleElmMessages.js';

describe('Web Crypto API - AES Encryption', () => {
    const password = 'test-password';
    const elmMessageAsJson = JSON.stringify({
        type: "encryptionMsg",
        currency: "BTC",
        address: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"
    });

    beforeEach(() => {
        localStorage.clear(); // Reset storage before each test
    });

    it('should encrypt and decrypt the message correctly', async () => {
        const encrypted = await encrypt(elmMessageAsJson, password);
        expect(encrypted).not.toBeNull();
        const decrypted = await decrypt(elmMessageAsJson, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        expect(decrypted).toContain("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
    });

    it('should fail to decrypt with a wrong password', async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const decrypted = await decrypt(elmMessageAsJson, 'wrong-password');
        expect(decrypted).not.toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
        expect(decrypted).toBeNull();
    });

    it('should generate different encrypted outputs for the same message', async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const firstEncryption = localStorage.getItem('encryptionMsg');

        await handleMessageFromElm(elmMessageAsJson);
        const secondEncryption = localStorage.getItem('encryptionMsg');

        expect(firstEncryption).not.toBe(secondEncryption);
    });

    it('should store encrypted data with the expected structure', async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const storedData = localStorage.getItem('encryptionMsg');
        expect(storedData).not.toBeNull();

        const parsedData = JSON.parse(storedData);
        expect(parsedData).toHaveProperty('iv');
        expect(parsedData).toHaveProperty('salt');
        expect(parsedData).toHaveProperty('data');
        expect(Array.isArray(parsedData.iv)).toBe(true);
        expect(Array.isArray(parsedData.salt)).toBe(true);
        expect(Array.isArray(parsedData.data)).toBe(true);
    });

    it('should handle encryption message from Elm and store encrypted data', async () => {
        await handleMessageFromElm(elmMessageAsJson);

        // Verify that the encrypted data is stored in localStorage
        const storedData = localStorage.getItem('encryptionMsg');
        expect(storedData).not.toBeNull();
        expect(storedData).not.toBeUndefined();

        const parsedData = JSON.parse(storedData);
        expect(parsedData).toHaveProperty('iv');
        expect(parsedData).toHaveProperty('salt');
        expect(parsedData).toHaveProperty('data');
        expect(Array.isArray(parsedData.iv)).toBe(true);
        expect(Array.isArray(parsedData.salt)).toBe(true);
        expect(Array.isArray(parsedData.data)).toBe(true);
    });
});