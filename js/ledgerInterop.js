import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";
import TransportWebUSB from "@ledgerhq/hw-transport-webusb";

export async function connectLNS() {
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
  console.log("setupElmPorts called", app);
  app.ports.sendMessageToJs.subscribe((message) => {
    console.log("message from elm : ", message);
    initializeLedger()
      .then(() => {
        app.ports.receiveMessageFromJs.send({ Ok: null });
      })
      .catch((error) => {
        app.ports.receiveMessageFromJs.send({ Err: error.message });
      });
  });

  app.ports.sendMessageToJs.subscribe((message) => {
    getAccountInfo()
      .then((info) => {
        app.ports.receiveMessageFromJs.send({ Ok: info });
      })
      .catch((error) => {
        app.ports.receiveMessageFromJs.send({ Err: error.message });
      });
  });
}
