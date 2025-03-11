import { describe, it, expect, beforeEach } from 'vitest';
import { encrypt, decrypt } from '../encryption.js';

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

    it('should store encrypted data in localStorage', async () => {
        await encrypt(message, password);
        const storedData = localStorage.getItem('secureMessage');
        expect(storedData).not.toBeNull();
    });

    it('should return null if no message is stored', async () => {
        const decrypted = await decrypt(password);
        expect(decrypted).toBeNull();
    });
});