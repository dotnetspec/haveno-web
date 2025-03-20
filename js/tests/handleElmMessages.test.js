import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handleMessageFromElm } from '../handleElmMessages.js';
import { encrypt, decrypt } from '../encryption.js';

vi.mock('../encryption.js', () => ({
    encrypt: vi.fn(async (data, password) => `encrypted-${JSON.stringify(data)}`),
    decrypt: vi.fn(async (data, password) => `decrypted-${data}`)
}));

beforeEach(() => {
    localStorage.clear();
    vi.stubGlobal('console', { log: vi.fn(), error: vi.fn() });
    vi.stubGlobal('window', {
        Elm: {
            ports: {
                receiveMsgsFromJs: { send: vi.fn() }
            }
        }
    });
});

describe('handleMessageFromElm', () => {
    it('logs ElmReady message', async () => {
        await handleMessageFromElm(JSON.stringify({ typeOfMsg: 'ElmReady' }));
        expect(console.log).toHaveBeenCalledWith("Message from Elm : ", 'ElmReady');
    });

    it('encrypts and stores data in localStorage', async () => {
        const message = JSON.stringify({ typeOfMsg: 'encryptCrypoAccountMsgRequest', storeAs: 'BTC_Public_Key_0', data: 'test' });
        await handleMessageFromElm(message);
        expect(localStorage.getItem('BTC_Public_Key_0')).toContain('encrypted-');
    });

    it('decrypts stored BTC accounts and sends response to Elm', async () => {
        localStorage.setItem('BTC_Public_Key_0', JSON.stringify('encrypted-test'));
        localStorage.setItem('BTC_Public_Key_1', JSON.stringify('encrypted-test2'));
        
        const message = JSON.stringify({ typeOfMsg: 'decrytCrypoAccountsMsgRequest', page: 'dashboard', currency: 'BTC' });
        await handleMessageFromElm(message);

        expect(window.Elm.ports.receiveMsgsFromJs.send).toHaveBeenCalledWith(
            JSON.stringify({
                typeOfMsg: "decryptedCrypoAccountsResponse",
                page: "dashboard",
                data: ["decrypted-encrypted-test", "decrypted-encrypted-test2"],
                currency: "BTC"
            })
        );
    });

    it('logs error on decryption failure', async () => {
        decrypt.mockRejectedValueOnce(new Error('Decryption failed'));
        localStorage.setItem('BTC_Public_Key_0', JSON.stringify('encrypted-test'));
        
        const message = JSON.stringify({ typeOfMsg: 'decrytCrypoAccountsMsgRequest', page: 'dashboard', currency: 'BTC' });
        await handleMessageFromElm(message);
        expect(console.error).toHaveBeenCalledWith("Error decrypting BTC accounts:", expect.any(Error));
    });

    it('handles unknown message types', async () => {
        await handleMessageFromElm(JSON.stringify({ typeOfMsg: 'UnknownMessage' }));
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Sorry, problem:'));
    });
});
