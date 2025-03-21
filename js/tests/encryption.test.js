import { describe, it, expect, beforeEach } from "vitest";
import { encrypt, decrypt } from "../encryption.js";
import { handleMessageFromElm } from "../handleElmMessages.js";

describe("Web Crypto API - AES Encryption", () => {
    const password = "test-password";
    const elmMessageAsJson = JSON.stringify({
        typeOfMsg: "encryptCrypoAccountMsgRequest",
        currency: "BTC",
        accountsData: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
        storeAs: "BTC_Public_Key_0"
    });

    beforeEach(() => {
        localStorage.clear(); // Reset storage before each test
    });

    it("should encrypt and decrypt the message correctly", async () => {
        const encryptedinStorage = await encrypt(elmMessageAsJson, password);

        expect(encryptedinStorage).not.toBeNull();
        expect(encryptedinStorage).not.toBeUndefined();
        const decrypted = await decrypt(encryptedinStorage, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        const parsedDecrypted = JSON.parse(decrypted);
        expect(parsedDecrypted.accountsData).toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
    });

    it("should fail to decrypt with a wrong password", async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const encryptedinStorage = localStorage.getItem("BTC_Public_Key_0");
        const decrypted = await decrypt(JSON.parse(encryptedinStorage), "wrong-password");
        expect(decrypted).toBeNull();
    });

    it("should generate different encrypted outputs for the same message", async () => {
        const firstEncryption = await encrypt(elmMessageAsJson, password);
        const secondEncryption = await encrypt(elmMessageAsJson, password);

        expect(firstEncryption).not.toEqual(secondEncryption);
    });

    it("should store encrypted data with the expected structure", async () => {
        const encryptedinStorage = await encrypt(elmMessageAsJson, password);

        expect(encryptedinStorage).not.toBeNull();
        expect(encryptedinStorage).not.toBeUndefined();
        const decrypted = await decrypt(encryptedinStorage, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        const parsedDecrypted = JSON.parse(decrypted);
        expect(parsedDecrypted.typeOfMsg).toBe("encryptCrypoAccountMsgRequest");
        expect(parsedDecrypted.currency).toBe("BTC");
        expect(parsedDecrypted.accountsData).toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
        expect(parsedDecrypted.storeAs).toBe("BTC_Public_Key_0");
    });
});
