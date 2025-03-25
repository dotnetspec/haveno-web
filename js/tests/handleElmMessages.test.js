import { vi, describe, it, expect, beforeEach } from 'vitest';
import { handleMessageFromElm } from '../handleElmMessages.js';
import { encrypt, decrypt } from '../encryption.js';

vi.mock('../encryption.js', () => ({
    encrypt: vi.fn(async (data, password) => `${JSON.stringify(data)}`),
    decrypt: vi.fn(async (data, password) => `${data}`)
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
        await handleMessageFromElm({ typeOfMsg: 'ElmReady' });
        expect(console.log).toHaveBeenCalledWith("Message from Elm : ", 'ElmReady');
    });

    it('encrypts and stores data in localStorage', async () => {
        const message = { typeOfMsg: 'encryptCryptoAccountMsgRequest', storeAs: 'BTC_Public_Key_0', address: '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v' };
        await handleMessageFromElm(message);
        expect(localStorage.getItem('BTC_Public_Key_0')).toContain('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v');
    });

    it('decrypts stored BTC accounts and sends response to Elm', async () => {
        localStorage.setItem('BTC_Public_Key_0', JSON.stringify('1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v'));
        localStorage.setItem('BTC_Public_Key_1', JSON.stringify('2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o'));
        
        const message = { typeOfMsg: 'decryptCryptoAccountsMsgRequest', page: 'AccountsPage', currency: 'BTC' };
        await handleMessageFromElm(message);

        expect(window.Elm.ports.receiveMsgsFromJs.send).toHaveBeenCalledWith(
            
                {
                typeOfMsg: "decryptedCryptoAccountsResponse",
                page: "AccountsPage",
                accountsData: ["1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v", "2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o"],
                currency: "BTC"
            }
        
        );
    });

    it('logs error on decryption failure', async () => {
        decrypt.mockRejectedValueOnce(new Error('Decryption failed'));
        localStorage.setItem('BTC_Public_Key_0', '1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v');
        
        const message = { typeOfMsg: 'decryptCryptoAccountsMsgRequest', page: 'AccountsPage', currency: 'BTC' };
        await handleMessageFromElm(message);
        expect(console.error).toHaveBeenCalledWith("Error decrypting BTC accounts:", expect.any(Error));
    });

    it('handles unknown message types', async () => {
        await handleMessageFromElm({ typeOfMsg: 'UnknownMessage' });
        expect(console.log).toHaveBeenCalledWith(expect.stringContaining('Sorry, problem:'));
    });
});
