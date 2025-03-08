import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from '../encryption.js';

describe('Encryption', () => {
    it('should encrypt and decrypt text correctly', () => {
        const text = 'Sensitive Data';
        const encryptedData = encrypt(text);
        const decryptedText = decrypt(encryptedData);
        expect(decryptedText).toBe(text);
    });

    it('should return different encrypted data for the same text', () => {
        const text = 'Sensitive Data';
        const encryptedData1 = encrypt(text);
        const encryptedData2 = encrypt(text);
        expect(encryptedData1.encrypted).not.toBe(encryptedData2.encrypted);
    });

    it('should throw an error if decryption fails', () => {
        const text = 'Sensitive Data';
        const encryptedData = encrypt(text);
        encryptedData.encrypted = 'corrupted data';
        expect(() => decrypt(encryptedData)).toThrow();
    });
});