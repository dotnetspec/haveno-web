import "core-js/actual";
import { listen } from "@ledgerhq/logs";
import AppBtc from "@ledgerhq/hw-app-btc";
import { WalletAPIClient, WindowMessageTransport } from "@ledgerhq/wallet-api-client";
import TransportWebUSB  from "@ledgerhq/hw-transport-webusb";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import



//import { WalletAPISimulator } from "@ledgerhq/wallet-api-simulator"; // Correct import for default export

//window.Buffer = window.Buffer || require("buffer").Buffer;

/* const simulator = new WalletAPISimulator();

export function initializeLedger() {
    return simulator.init();
} */

    const windowMessageTransport = new WindowMessageTransport();
    windowMessageTransport.connect();

    // Step 2: Initialize Wallet API Client with the Window Message Transport
    const client = new WalletAPIClient(windowMessageTransport);


export function getAccountInfo() {
  return client.getAccount();
}

/* const initial =
  "<h1>Connect your Nano and open the Bitcoin app. Click anywhere to start...</h1>";
const $main = document.getElementById("main");
$main.innerHTML = initial; */

document.body.addEventListener("click", async () => {
  //$main.innerHTML = initial; */
  //export function setupElmPorts(app) {
//export function connectLNS(){
  try {
    
    console.log('hello there');
    // Keep if you chose the USB protocol
    const transport =  TransportWebUSB.create();

 

    //listen to the events which are sent by the Ledger packages in order to debug the app
    listen((log) => console.log(log));

    //When the Ledger device connected it is trying to display the bitcoin address
    const appBtc = new AppBtc({ transport, currency: "bitcoin" });
    const { bitcoinAddress } =  appBtc.getWalletPublicKey(
      "44'/0'/0'/0/0",
      { verify: false, format: "legacy" }
    );

    //Display your bitcoin address on the screen
    /* const h2 = document.createElement("h2");
    h2.textContent = bitcoinAddress;
    $main.innerHTML = "<h1>Your first Bitcoin address:</h1>";
    $main.appendChild(h2); */

    //Display the address on the Ledger device and ask to verify the address
    appBtc.getWalletPublicKey("44'/0'/0'/0/0", {
      format: "legacy",
      verify: true,
    });
    windowMessageTransport.disconnect();

  } catch (e) {
    //Catch any error thrown and displays it on the screen
    const $err = document.createElement("code");
    $err.style.color = "#f66";
    $err.textContent = String(e.message || e);
    //$main.appendChild($err);
    console.log('connectLNS errors:', e.message);
  }
});

export function setupElmPorts(app) {
  console.log("setupElmPorts called", app);
  app.ports.sendMessageToJs.subscribe((message) => {
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
