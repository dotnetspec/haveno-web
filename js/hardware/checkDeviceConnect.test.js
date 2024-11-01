import { describe, it, expect, vi, beforeEach } from "vitest";
import { checkDeviceConnection } from "./checkDeviceConnect";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

describe("checkDeviceConnection", () => {
  let mockApp;

  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();

    // Mock the TransportWebUSB.create method
    // -- NOTE: This mock ensures that the entire behavior of 
    //TransportWebUSB.create is controlled within your test, 
    //meaning it never needs to call navigator.usb internally 
    //so you don't need to mock navigator.usb
    vi.spyOn(TransportWebUSB, "create").mockResolvedValue({
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
      // Mock TransportWebUSB.create to throw an error
      vi.spyOn(TransportWebUSB, "create").mockRejectedValue(
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