import { describe, it, expect, beforeEach, vi } from "vitest";
import { handleMessageFromElm } from "../handleElmMessages.js";
import * as encryption from "../encryption.js";

describe("handleMessageFromElm", () => {
  const password = "test-password";
  const elmMessageAsJson = JSON.stringify({
    type: "encryptionMsg",
    currency: "BTC",
    address: "1HB5XMLmzFVj8ALj6mfBsbifRoD4miY36v",
  });

  beforeEach(() => {
    localStorage.clear(); // Reset storage before each test
    vi.restoreAllMocks(); // Restore all mocks before each test
  });

  it("should encrypt data received from Elm", async () => {
    // Mock the encrypt function
    const encryptSpy = vi
      .spyOn(encryption, "encrypt")
      .mockImplementation(async () => {});

    await handleMessageFromElm(elmMessageAsJson);

    const elmMessageAsJsObj = JSON.parse(elmMessageAsJson);
    expect(elmMessageAsJsObj.type).toEqual("encryptionMsg");

    // Verify that the encrypt function was called with the correct parameters
    expect(encryptSpy).toHaveBeenCalledWith(elmMessageAsJsObj, password);
  });
});
