import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleMessageFromElm } from "../handleElmMessages.js";
import * as encryption from "../encryption.js";

describe("handleMessageFromElm", () => {
  const password = "test-password";
  const elmEncryptionMsgAsJson = JSON.stringify({
    type: "encryptCrypoAccountMsgRequest",
    currency: "BTC",
    address: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
  });

  const elmDecrytCrypoAccountsMsgRequestAsJson = JSON.stringify({
    type: "decrytCrypoAccountsMsgRequest",
    currency: "BTC",
    page: "AccountsPage",
  });

  beforeEach(() => {
    localStorage.clear(); // Reset storage before each test
    vi.restoreAllMocks(); // Restore all mocks before each test
  });

  it("should encrypt data received from Elm", async () => {
    // Mock the encrypt function
    const encryptSpy = vi
      .spyOn(encryption, "encrypt")
      .mockImplementation(async () => ({
        iv: [137, 207, 2, 37, 221, 129, 21, 250, 104, 2, 40, 57],
        salt: [30, 153, 206, 172, 41, 34, 30, 191, 171, 58, 92, 117, 52, 165, 71, 114],
        data: [228, 54, 0, 193, 31, 200, 89, 155, 184, 95, 38, 67, 180, 78, 31, 211, 6, 109, 204, 75, 60, 175, 137, 33, 41, 59, 73, 96, 235, 49, 20, 28, 176, 158, 78, 91, 34, 3]
      }));

    await handleMessageFromElm(elmEncryptionMsgAsJson);

    const elmMessageAsJsObj = JSON.parse(elmEncryptionMsgAsJson);
    expect(elmMessageAsJsObj.type).toEqual("encryptCrypoAccountMsgRequest");

    // Verify that the encrypt function was called with the correct parameters
    expect(encryptSpy).toHaveBeenCalledWith(elmMessageAsJsObj.address, password);
  });

  it("should decrypt BTC accounts stored in localStorage and send the data back to Elm", async () => {
    // Mock the decrypt function
    const decryptSpy = vi
      .spyOn(encryption, "decrypt")
      .mockImplementation(async () => "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v");

    // Mock the encrypted data in localStorage
    const encryptedData = JSON.stringify({
      iv: [137, 207, 2, 37, 221, 129, 21, 250, 104, 2, 40, 57],
      salt: [30, 153, 206, 172, 41, 34, 30, 191, 171, 58, 92, 117, 52, 165, 71, 114],
      data: [228, 54, 0, 193, 31, 200, 89, 155, 184, 95, 38, 67, 180, 78, 31, 211, 6, 109, 204, 75, 60, 175, 137, 33, 41, 59, 73, 96, 235, 49, 20, 28, 176, 158, 78, 91, 34, 3]
    });
    localStorage.setItem("BTC_Public_Key", encryptedData);

    // Mock the Elm ports
    global.window.Elm = {
      Main: {
        ports: {
          jsInterop: {
            send: vi.fn(),
          },
        },
      },
    };

    await handleMessageFromElm(elmDecrytCrypoAccountsMsgRequestAsJson);

    // Verify that the decrypt function was called with the correct parameters
    expect(decryptSpy).toHaveBeenCalledWith(encryptedData, password);

    // Verify that the decrypted data was sent back to Elm
    expect(window.Elm.Main.ports.jsInterop.send).toHaveBeenCalledWith(JSON.stringify({
      type: "decryptedCrypoAccountsResponse",
      page: "AccountsPage",
      data: ["1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v"], // Send as a list
      currency: "BTC",
    }));
  });

  it("should log a message if no BTC accounts are found in localStorage", async () => {
    // Mock console.log to capture the output
    const consoleLogSpy = vi.spyOn(console, "log");

    await handleMessageFromElm(elmDecrytCrypoAccountsMsgRequestAsJson);

    // Verify that the correct message was logged to the console
    expect(consoleLogSpy).toHaveBeenCalledWith("No BTC accounts found in localStorage.");
  });
});