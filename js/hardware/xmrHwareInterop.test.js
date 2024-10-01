// xmrHardwareInterop.test.js
import { describe, expect, test, vi, beforeEach } from 'vitest';
import { getMoneroAddress } from './xmrHardwareInterop';
import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import { serializeDerivationPath } from './serializeDerivationPath';

// Mock the dependencies
vi.mock('@ledgerhq/hw-transport-webhid');
vi.mock('./serializeDerivationPath');

describe('getMoneroAddress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('should get Monero address from Ledger device', async () => {
    // Mock the TransportWebHID.create method
    const mockTransport = {
      send: vi.fn().mockResolvedValue(new Uint8Array([
        // Mocked response from the Ledger device
        // This should be the bytes that represent the Monero address
        0x34, 0x34, 0x41, 0x46, 0x46, 0x71, 0x35, 0x6b, 0x53, 0x69, 0x47, 0x42, 0x6f, 0x5a, 0x90, 0x00
      ]))
    };
    TransportWebHID.create.mockResolvedValue(mockTransport);

    // Mock the serializeDerivationPath function
    const mockSerializedPath = new Uint8Array([4, 0x80, 0x00, 0x00, 0x2c, 0x80, 0x00, 0x00, 0x80, 0x80, 0x00, 0x00, 0x00]);
    serializeDerivationPath.mockReturnValue(mockSerializedPath);

    // Call the function
    const address = await getMoneroAddress();

    // Verify the address
    const expectedAddress = '44AFFq5kSiGBoZ'; // Replace with the expected Monero address
    expect(address).toBe(expectedAddress);

    // Verify the mocks were called correctly
    expect(TransportWebHID.create).toHaveBeenCalled();
    expect(serializeDerivationPath).toHaveBeenCalledWith([
      0x8000002c, // 44'
      0x80000080, // 128'
      0x80000000, // 0'
      0x00000000, // 0
      0x00000000  // 0
    ]);
    expect(mockTransport.send).toHaveBeenCalledWith(0xE0, 0x46, 0x00, 0x00, mockSerializedPath);
  });

  test('should handle errors', async () => {
    // Mock the TransportWebHID.create method to throw an error
    TransportWebHID.create.mockRejectedValue(new Error('Failed to connect'));

    // Spy on console.error
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Call the function and expect it to throw an error
    await expect(getMoneroAddress()).rejects.toThrow('Failed to connect');

    // Verify that console.error was called with the error
    expect(consoleErrorSpy).toHaveBeenCalledWith('Error getting Monero address:', new Error('Failed to connect'));

    // Restore the original console.error implementation
    consoleErrorSpy.mockRestore();
  });
});