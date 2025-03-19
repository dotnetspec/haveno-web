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
                const encryptedData = await encrypt(parsedMessage, 'test-password'); // Call the encrypt function with the parsed message
                localStorage.setItem(parsedMessage.storeAs, JSON.stringify(encryptedData));
            } catch (error) {
                console.error("Error Receiving Encryption Message from Elm: ", error);
            }
            break;
        case "decrytCrypoAccountsMsgRequest":
            try {
                const keys = Object.keys(localStorage).filter(key => key.startsWith('BTC_Public_Key'));
                if (keys.length === 0) {
                    console.log("No BTC accounts found in localStorage.");
                    return;
                }
                const decryptedData = await Promise.all(keys.map(async key => {
                    const encryptedData = JSON.parse(localStorage.getItem(key));
                    return await decrypt(encryptedData, 'test-password');
                }));
                console.log("Decrypted BTC accounts:", decryptedData);
                console.log("window.Elm receiveMsgsFromJs", window.Elm.ports.receiveMsgsFromJs);
                if (window.Elm && window.Elm.ports && window.Elm.ports.receiveMsgsFromJs) {
                    console.log("inside window.Elm.ports.receiveMsgsFromJs", window.Elm.ports.receiveMsgsFromJs);
                    window.Elm.ports.receiveMsgsFromJs.send(JSON.stringify({
                    type: "decryptedCrypoAccountsResponse",
                    page: parsedMessage.page,
                        data: decryptedData, // Send as a list
                        currency: parsedMessage.currency
                }));
                }
            } catch (error) {
                console.error("Error decrypting BTC accounts:", error);
            }
            break;
        default:
            console.log(`Sorry, problem:  ${message}.`);
    }
}