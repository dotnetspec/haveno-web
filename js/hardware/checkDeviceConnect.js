import TransportWebHID from "@ledgerhq/hw-transport-webhid";

export async function checkDeviceConnection(app) {
    try {
        // Request access to the Ledger device
        const transport = await TransportWebHID.create();
        console.log("Device connected:", transport);
        console.log("Device Model:", transport.deviceModel);
        console.log("Device Model ID:", transport.deviceModel ? transport.deviceModel.id : 'Not Available');
        // Define the Get Device Version APDU command
        const cla = 0x00; // Class byte
        const ins = 0x01; // Instruction byte for Get Device Version
        const p1 = 0x00;  // Parameter 1
        const p2 = 0x00;  // Parameter 2
        const data = new Uint8Array([]); // No data needed

        // Send the command to the Ledger device
        /* const response = await transport.send(cla, ins, p1, p2, data);

        // Process the response
        console.log("Device Response:", response.deviceModel.id);
        console.log("Device Model:", response.deviceModel);
        console.log("Device Model ID:", response.deviceModel ? response.deviceModel.id : 'Not Available'); */
        const response = "";

        try {
            const message = { operationEventMsg: transport.deviceModel.id };
            console.log("Sending message:", message);
            app.ports.receiveMessageFromJs.send(message);
        }
        catch(error) {
            const errorMessage = { Err: error.message };
            console.log("Sending error message:", errorMessage);
            app.ports.receiveMessageFromJs.send(errorMessage);
        }
    } catch (error) {
        console.error("Error:", error);
    }
}

//checkDeviceConnection();
