import { describe, it, expect, beforeEach, vi } from 'vitest';
import { handleMessageFromElm } from '../handleElmMessages.js';
import * as encryption from '../encryption.js';

describe('handleMessageFromElm', () => {
    const message = 'encryptionMsg~^&Sensitive Data';
    const app = {}; // Mock app object

    beforeEach(() => {
        localStorage.clear(); // Reset storage before each test
        vi.restoreAllMocks(); // Restore all mocks before each test
    });

    it('should encrypt data received from Elm', async () => {
        // Mock the encrypt function
        const encryptSpy = vi.spyOn(encryption, 'encrypt').mockImplementation(async () => {});

        await handleMessageFromElm(message, app);

        // Verify that the encrypt function was called with the correct parameters
        expect(encryptSpy).toHaveBeenCalledWith('Sensitive Data', 'test-password');
    });
});