import { encrypt, decrypt } from './encryption.js';

export async function handleMessageFromElm(message) {
    if (!message) {
        console.log("Null or undefined. No message yet", message);
        return;
    }
    const parsedMessage = JSON.parse(message);

    switch (parsedMessage.type) {
        case "ElmReady":
            try {
                console.log("Message from Elm : ", parsedMessage.type);
            } catch (error) {
                console.error("Error Receiving Message from Elm: ", error);
            }
            break;
        case "encryptCrypoAccountMsgRequest":
            try {
                const encryptedData = await encrypt(parsedMessage.address, 'test-password'); // Call the encrypt function
                localStorage.setItem(parsedMessage.type, JSON.stringify(encryptedData));
            } catch (error) {
                console.error("Error Receiving Encryption Message from Elm: ", error);
            }
            break;
        case "decrytCrypoAccountsMsgRequest":
            try {
                const encryptedData = localStorage.getItem('BTC_Public_Key');
                if (encryptedData) {
                    const decryptedData = await decrypt(encryptedData, 'test-password');
                    console.log("Decrypted BTC accounts:", decryptedData);
                    if (window.Elm && window.Elm.Main && window.Elm.Main.ports && window.Elm.Main.ports.jsInterop) {
                        window.Elm.Main.ports.jsInterop.send(JSON.stringify({
                            type: "decryptedCrypoAccountsResponse",
                            data: decryptedData
                        }));
                    }
                } else {
                    console.log("No BTC accounts found in localStorage.");
                }
            } catch (error) {
                console.error("Error decrypting BTC accounts:", error);
            }
            break;
        default:
            console.log(`Sorry, problem:  ${message}.`);
    }
}