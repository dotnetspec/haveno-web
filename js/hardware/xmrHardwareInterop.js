import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";

export async function getMoneroAddress(app) {
  try {
    console.log("Attempting to get Monero address now...");

    // Request access to the Ledger device
    const transport = await TransportWebHID.create();

    // Define APDU command parameters
    const cla = 0xE0; // Class byte for Ledger Monero app
    const ins = 0x46; // INS_DERIVE_SUBADDRESS_PUBLIC_KEY
    const p1 = 0x00; // First parameter
    const p2 = 0x00; // Second parameter

    // Derivation path: 44'/128'/0'/0/0
    const derivationPath = [
      0x8000002c, // 44'
      0x80000080, // 128'
      0x80000000, // 0'
      0x00000000, // 0
      0x00000000, // 0
    ];
    const data = serializeDerivationPath(derivationPath);

    console.log("Serialized Derivation Path:", data);

    // Send the APDU command to the Ledger device
    const response = await transport.send(cla, ins, p1, p2, data);

    // Listen to Ledger logs for debugging
    listen((log) => console.log(log));
    //console.log("Monero Address Response:", response);
    if (response.length > 2) {
      const statusCode = response.slice(-2); // Last 2 bytes are the status word
      if (statusCode[0] === 0x90 && statusCode[1] === 0x00) {
        console.log("Success:", response);
      } else {
        console.error("Error with status code:", statusCode);
      }
    }
  } catch (error) {
    console.error("Error getting Monero address:", error);
  }
}

// Helper function to serialize the derivation path
function serializeDerivationPath(path) {
  const buffer = new ArrayBuffer(1 + path.length * 4); // 1 byte for path length + 4 bytes for each path element
  const dataView = new DataView(buffer);
  dataView.setUint8(0, path.length); // First byte: path length

  path.forEach((element, index) => {
    dataView.setUint32(1 + index * 4, element);
  });

  return new Uint8Array(buffer);
}

export function sum(a, b) {
  return a + b;
}

