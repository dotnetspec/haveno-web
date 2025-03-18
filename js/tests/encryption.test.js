import { describe, it, expect, beforeEach } from "vitest";
import { encrypt, decrypt } from "../encryption.js";
import { handleMessageFromElm } from "../handleElmMessages.js";

describe("Web Crypto API - AES Encryption", () => {
    const password = "test-password";
    const elmMessageAsJson = JSON.stringify({
        type: "encryptCrypoAccountMsgRequest",
        currency: "BTC",
        address: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
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
        expect(decrypted).toContain("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
    });

    it("should fail to decrypt with a wrong password", async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const encryptedinStorage = localStorage.getItem("BTC_Public_Key_0");
        const decrypted = await decrypt(encryptedinStorage, "wrong-password");
        expect(decrypted).not.toBe("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
        expect(decrypted).toBeNull();
    });

    it("should generate different encrypted outputs for the same message", async () => {
        await handleMessageFromElm(elmMessageAsJson);
        const firstEncryption = await encrypt(elmMessageAsJson, password);

        await handleMessageFromElm(elmMessageAsJson);
        const secondEncryption = await encrypt(elmMessageAsJson, password);

        expect(firstEncryption).not.toBe(secondEncryption);
    });

    it("should store encrypted data with the expected structure", async () => {
        const encryptedinStorage = await encrypt(elmMessageAsJson, password);

        expect(encryptedinStorage).not.toBeNull();
        expect(encryptedinStorage).not.toBeUndefined();
        const decrypted = await decrypt(encryptedinStorage, password);
        expect(decrypted).not.toBeNull();
        expect(decrypted).not.toBeUndefined();
        expect(decrypted).toContain("type");
        expect(decrypted).toContain("encryptCrypoAccountMsgRequest");
        expect(decrypted).toContain("currency");
        expect(decrypted).toContain("BTC");
        expect(decrypted).toContain("address");
        expect(decrypted).toContain("1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");
        expect(decrypted).not.toContain('Sorry, problem');
    });
});
