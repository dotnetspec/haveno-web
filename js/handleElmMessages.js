// handleElmMessages.js
import { encrypt } from './encryption.js';

export async function handleMessageFromElm(message) {
    const messageArr = message.split("~^&");

    switch (messageArr[0]) {
        case "ElmReady":
            try {
                console.log("Message from Elm : ", messageArr[0]);
            } catch (error) {
                console.error("Error Receiving Message from Elm: ", error);
            }
            break;
        case "encryptionMsg":
            try {
                console.log("Encryption message from Elm : ", messageArr[0]);
                console.log("Message that will be encrypted : ", messageArr[1]);
                const encryptedData = await encrypt(messageArr[1], 'test-password'); // Call the encrypt function
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