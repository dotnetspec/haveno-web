import TransportWebHID from "@ledgerhq/hw-transport-webhid";


export async function getMoneroAddress(app) {
    try {
        // Request access to the Ledger device
        const transport = await TransportWebHID.create();

        // Define APDU commands to interact with the Monero app
        // These are placeholders and should be replaced with actual Monero commands
        const command = {
            cla: 0x46, // Class byte (example value)
            ins: 0x00, // Instruction byte (example value)
            p1: 0x00,  // Parameter 1 (example value)
            p2: 0x00,  // Parameter 2 (example value)
            data: new Uint8Array([]) // Data to send (if any)
        };

        // Send the command to the Ledger device
        const response = await transport.send(
            command.cla,
            command.ins,
            command.p1,
            command.p2,
            command.data
        );

        // Process the response to extract the Monero address
        //console.log("Monero Address:", response);

        try {
            console.log("Monero Address:", response);
            /* const message = { operationEventMsg: transport.deviceModel.id };
            console.log("Sending message:", message);
            app.ports.receiveMessageFromJs.send(message); */
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
