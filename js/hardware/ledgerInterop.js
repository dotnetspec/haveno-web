import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

export async function connectLNS(app) {
  try {

    // Keep if you chose the USB protocol
    const transport = await TransportWebUSB.create();

    //listen to the events which are sent by the Ledger packages in order to debug the app
    listen((log) => console.log(log));

    //When the Ledger device connected it is trying to display the bitcoin address
    const appBtc = new AppBtc({ transport, currency: "bitcoin" });
    const { bitcoinAddress } = await appBtc.getWalletPublicKey(
      "44'/0'/0'/0/0",
      { verify: false, format: "legacy" }
    );

    console.log("Btc address: ", bitcoinAddress);

    //app.ports.receiveMessageFromJs.send({ operationEventMsg: bitcoinAddress });
    try {
      const message = { operationEventMsg: bitcoinAddress };
      console.log("Sending message:", message);
      app.ports.receiveMessageFromJs.send(message);
  }
  catch(error) {
      const errorMessage = { Err: error.message };
      console.log("Sending error message:", errorMessage);
      app.ports.receiveMessageFromJs.send(errorMessage);
  }

    //Display the address on the Ledger device and ask to verify the address
    await appBtc.getWalletPublicKey("44'/0'/0'/0/0", {
      format: "legacy",
      verify: true,
    });
    
    transport.disconnect();
  } catch (e) {
    //Catch any error thrown and displays it on the screen
    const $err = document.createElement("code");
    $err.style.color = "#f66";
    $err.textContent = String(e.message || e);
    console.log("connectLNS errors:", e.message);
  }
}

export function setupElmPorts(app) {

  jsonMsgToElm = {
    operationEventMsg: operationEvent,
    //NOTE: dataFromMongo is what we originally sent to Elm alone
    // Now it is sent with these other fields for added context
    dataFromMongo: userData,
    
    //NOTE: Each 'additionalDataFromJs' will have it's own decoder in Elm 
    // Which decoder will be determined by the 'msg' type above
    additionalDataFromJs: additionalDataObjExtendibleIfRequired,
  }

// NOTE: Send data TO Elm
//app.ports.receiveMessageFromJs.send(jsonMsgToElm)
  
}
