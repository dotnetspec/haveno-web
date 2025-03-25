import { describe, it, expect, beforeEach, vi } from "vitest";
import { encrypt, decrypt } from "../encryption.js";
import { handleMessageFromElm } from "../handleElmMessages.js";



describe("Web Crypto API - AES Encryption", () => {
    const password = "test-password";
    const elmENCRYPTMessageAsJson = {
        typeOfMsg: "encryptCryptoAccountMsgRequest",
        currency: "BTC",
        accountsData: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
        storeAs: "BTC_Public_Key_0"
    };

    const elmENCRYPTMessageAsJson2 = {
        typeOfMsg: "encryptCryptoAccountMsgRequest",
        currency: "BTC",
        accountsData: "2GK6XMLmzFVj8ALj6mfBsbifRoD4miY52o",
        storeAs: "BTC_Public_Key_1"
    };

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

    it("should encrypt and decrypt the message correctly", async () => {
        // NOTE: We stringify the message before passing it to ENCRYPT (not other parts of code)
        const encryptedinStorage = await encrypt( JSON.stringify(elmENCRYPTMessageAsJson), password);

        expect(encryptedinStorage).not.toBeNull();
        expect(encryptedinStorage).not.toBeUndefined();
        const decrypted = await decrypt(encryptedinStorage, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        const parsedDecrypted = JSON.parse(decrypted);
        expect(parsedDecrypted.accountsData).toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
    });

    it("should fail to decrypt with a wrong password", async () => {
        await handleMessageFromElm(elmENCRYPTMessageAsJson);
        const encryptedinStorage = localStorage.getItem("BTC_Public_Key_0");
        const decrypted = await decrypt(JSON.parse(encryptedinStorage), "wrong-password");
        expect(decrypted).toBeNull();
    });

    it("should generate different encrypted outputs for the same message", async () => {
        const firstEncryption = await encrypt(elmENCRYPTMessageAsJson, password);
        const secondEncryption = await encrypt(elmENCRYPTMessageAsJson, password);

        expect(firstEncryption).not.toEqual(secondEncryption);
    });

    it("should store encrypted data with the expected structure", async () => {
        // NOTE: We stringify the message before passing it to ENCRYPT (not other parts of code)
        const encryptedinStorage = await encrypt(JSON.stringify(elmENCRYPTMessageAsJson), password);

        expect(encryptedinStorage).not.toBeNull();
        expect(encryptedinStorage).not.toBeUndefined();
        const decrypted = await decrypt(encryptedinStorage, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        const parsedDecrypted = JSON.parse(decrypted);
        expect(parsedDecrypted.typeOfMsg).toBe("encryptCryptoAccountMsgRequest");
        expect(parsedDecrypted.currency).toBe("BTC");
        expect(parsedDecrypted.accountsData).toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
        expect(parsedDecrypted.storeAs).toBe("BTC_Public_Key_0");
    });
});
