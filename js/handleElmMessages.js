//import { setupElmPorts, connectLNS } from "./hardware/ledgerInterop.js";
//import { connectLNS } from "./hardware/ledgerInterop.js";
import { checkDeviceConnection } from "./hardware/checkDeviceConnect.js";
import { getMoneroAddress } from "./hardware/xmrHardwareInterop.js";
// NOTE: This is the main file for communicating with Elm. It receives messages from Elm and
// then calls the relevant function in the relevant .js file to communicate with the hardware device
// NOTE: This file is imported in setupElm.mjs

// NOTE: Messages from the Elm 'sendMessageToJs' port are received and parsed here to determine
// which function (in the relevant .js file) to use to communicate with the hardware device
export async function handleMessageFromElm(message, app) {
  console.log("here in handle : ", message);

  // NOTE: Use FF debugger to view 'message'
  // HACK: This will need to be more robust. It must be something that will never appear in the json:
  const messageArr = message.split("~^&");
  //NOTE: Switch on the message label (element[0]), then handle the , separated params

  switch (messageArr[0]) {
    case "connectLNS":
      

      try {
        //connectLNS(app);
        // Perform further actions with the device
        console.log("about to checkDeviceConnection : ", app);
        await checkDeviceConnection(app);
      } catch (error) {
        console.error("Device connection error:", error);
      }
      break;

    case "getMoneroAddress":
      //connectLNS(app)

      try {
        // Perform further actions with the device
        getMoneroAddress();
      } catch (error) {
        console.error("Device connection error:", error);
      }
      break;

      
      case "initiateXMRToBTCTrans":
        //connectLNS(app)
  
        try {
          // Perform further actions with the device
          hwinterop.initiateXMRToBTCTrans( messageArr[1]);
        } catch (error) {
          console.error("Device connection error:", error);
        }
        break;

    //NOTE: We're going to talk to mongodb via the node application
    // to do searches, so we can do them anonymously
    // We will make http requests from within Elm to the node application

    //NOTE: Adding a new function? Added it to index.html?
    default:
      console.log(`Sorry, problem:  ${message}.`);
  }
}
