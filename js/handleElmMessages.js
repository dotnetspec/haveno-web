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
                console.log("Encryption message from Elm : ", parsedMessage.type);
                console.log("Message that will be encrypted : ", parsedMessage.address);
                const encryptedData = await encrypt(parsedMessage.encryptionMsg, 'test-password'); // Call the encrypt function
                console.log('Encrypted data in encryptionMsg:', encryptedData);
                localStorage.setItem('secureMessage', JSON.stringify(encryptedData));
            } catch (error) {
                console.error("Error Receiving Encryption Message from Elm: ", error);
            }
            break;
        default:
            console.log(`Sorry, problem:  ${message}.`);
    }
}