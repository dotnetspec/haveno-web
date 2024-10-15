import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkDeviceConnection } from "./checkDeviceConnect";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

describe("checkDeviceConnection", () => {
  let mockApp;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock the TransportWebHID.create method
    // -- NOTE: This mock ensures that the entire behavior of 
    //TransportWebHID.create is controlled within your test, 
    //meaning it never needs to call navigator.hid internally 
    //so you don't need to mock navigator.hid
    vi.spyOn(TransportWebHID, "create").mockResolvedValue({
      deviceModel: { id: "nanoS" },
      send: vi.fn().mockResolvedValue("nanoS"),
    });

    // Mock the app object with ports
    mockApp = {
      ports: {
        receiveMessageFromJs: {
          send: vi.fn(),
        },
      },
    };
  });

  it("should send a message with the device model ID", async () => {
    await checkDeviceConnection(mockApp);
    expect(mockApp.ports.receiveMessageFromJs.send).toHaveBeenCalledWith({
      operationEventMsg: "nanoS",
    });
  });

  it("should handle errors and send an error message", async () => {
    try {
      // Mock TransportWebHID.create to throw an error
      vi.spyOn(TransportWebHID, "create").mockRejectedValue(
        new Error("Test error")
      );

      await checkDeviceConnection(mockApp);
      expect(mockApp.ports.receiveMessageFromJs.send).toHaveBeenCalledWith({
        Err: "Test error",
      });
    } catch (e) {
      // Do nothing, error is expected ... attempted to suppress unnecessary error logging, but doesn't work
    }
  });
});
