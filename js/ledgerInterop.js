import { WalletAPIClient } from '@ledgerhq/wallet-api-client';
//import { WalletAPISimulator } from '@ledgerhq/wallet-api-simulator'; // Correct import for default export
import 'core-js/actual';
import { listen } from "@ledgerhq/logs";
//import AppBtc from "@ledgerhq/hw-app-btc";
 
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the USB protocol and delete the @ledgerhq/hw-transport-webhid import
//import TransportWebUSB from "@ledgerhq/hw-transport-webusb";
// Keep this import if you want to use a Ledger Nano S/X/S Plus with the HID protocol and delete the @ledgerhq/hw-transport-webusb import
//import TransportWebHID from "@ledgerhq/hw-transport-webhid";

//const client = new WalletAPIClient();
/* const simulator = new WalletAPISimulator();

export function initializeLedger() {
    return simulator.init();
} */

/* export function getAccountInfo() {
    return client.getAccount();
} */

export function setupElmPorts(app) {
    console.log("setupElmPorts called");
    /* app.ports.initializeLedger.subscribe(() => {
        initializeLedger().then(() => {
            app.ports.ledgerInitialized.send({ Ok: null });
        }).catch(error => {
            app.ports.ledgerInitialized.send({ Err: error.message });
        });
    }); */

    /* app.ports.getAccountInfo.subscribe(() => {
        getAccountInfo().then(info => {
            app.ports.accountInfoReceived.send({ Ok: info });
        }).catch(error => {
            app.ports.accountInfoReceived.send({ Err: error.message });
        });
    } */
//);



 

}