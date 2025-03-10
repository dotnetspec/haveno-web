import { encrypt } from './encryption.js';

export async function handleMessageFromElm(message, app) {
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
        await encrypt(messageArr[1], 'test-password'); // Call the encrypt function
      } catch (error) {
        console.error("Error Receiving Encryption Message from Elm: ", error);
      }
      break;
    default:
      console.log(`Sorry, problem:  ${message}.`);
  }
}