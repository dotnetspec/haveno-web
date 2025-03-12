import { encrypt } from './encryption.js';

export async function handleMessageFromElm(message) {
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
        case "ElmReady":
            try {
                console.log("Message from Elm : ", parsedMessage.type);
            } catch (error) {
                console.error("Error Receiving Message from Elm: ", error);
            }
            break;
        case "encryptionMsg":
            try {
                const encryptedData = await encrypt(parsedMessage, 'test-password'); // Call the encrypt function
                
            } catch (error) {
                console.error("Error Receiving Encryption Message from Elm: ", error);
            }
            break;
        default:
            console.log(`Sorry, problem:  ${message}.`);
    }
}