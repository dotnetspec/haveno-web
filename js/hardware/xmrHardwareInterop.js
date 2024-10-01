import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { serializeDerivationPath } from "./serializeDerivationPath";

/* export async function getMoneroAddress() {
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
      //0x00000000, // 0
      //0x00000000, // 0
    ];
    const data = serializeDerivationPath(derivationPath);

    console.log("Serialized Derivation Path:", data);

    // Send the APDU command to the Ledger device
    const response = await transport.send(cla, ins, p1, p2, data);

    // Listen to Ledger logs for debugging
    listen((log) => console.log(log));
    //console.log("Monero Address Response:", response);
    if (response.length > 2) {
      const statusCode = response.slice(0,-2); // Last 2 bytes are the status word
      if (statusCode[0] === 0x90 && statusCode[1] === 0x00) {
        console.log("Success:", response);
      } else {
        console.error("Error with status code:", statusCode);
      }
    }
  } catch (error) {
    console.error("Error getting Monero address:", error);
  }
} */

  export async function getMoneroAddress() {
    try {
      const transport = await TransportWebHID.create();
      const path = [0x8000002c, 0x80000080, 0x80000000, 0x00000000, 0x00000000]; // 44'/128'/0'/0/0
      const serializedPath = serializeDerivationPath(path);
      const response = await transport.send(0xE0, 0x46, 0x00, 0x00, serializedPath);
      
      // Assuming the address is in the response and converting it to a string
      const address = new TextDecoder().decode(response.subarray(0, response.length - 2)); // Remove status bytes
      return address;
    } catch (error) {
      console.error("Error getting Monero address:", error);
      throw error;
    }
  }




