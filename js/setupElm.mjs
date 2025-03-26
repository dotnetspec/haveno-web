import { Elm } from './elm.js'
import { elmInterop } from './elmJsInterop.js'


// WARN: Use Playwright to test. Vitest runs in Node.js, so it cannot execute Elm code directly.
// NOTE: Try to use browser debugger if possible.
// NOTE: Distinguish between send (sending to Elm) and subscribe (receiving from Elm) functions.

function detectEnvironment () {
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  const port = window.location.port
  const defaultPort = protocol === 'https:' ? 443 : 80
  const parsedPort = port ? parseInt(port, 10) : defaultPort
  return {
    protocol: protocol,
    hostname: hostname,
    port: parsedPort
  }
}

export function initializeElmApp (Elm, jsonUrl) {
  const eapp = Elm.Main.init({
    node: document.getElementById('elm'),
    flags: jsonUrl
  });

  // Ensure the port exists before subscribing
if (eapp.ports && eapp.ports.msgFromMain) {
  eapp.ports.msgFromMain.subscribe((message) => {
      console.log('Received msg from Elm:', message);
     
  });
} else {
  console.error('Port "msgFromMain" is not defined in Elm.');
}

  console.log('Elm app initialized:', eapp);

  if (!eapp.ports) {
    console.error('Error: eapp.ports is undefined.');
    throw new TypeError('eapp.ports is undefined.');
  }

  if (!eapp.ports.receiveMsgsFromJs) {
    console.error('Error: eapp.ports.receiveMsgsFromJs is undefined.');
    throw new TypeError('eapp.ports.receiveMsgsFromJs is undefined.');
  }

 

  return eapp;
}

function handleMessagesToMain (eapp) {
  if (eapp.ports && eapp.ports.receiveMsgsFromJs && typeof eapp.ports.receiveMsgsFromJs.send === 'function') {
    eapp.ports.receiveMsgsFromJs.send((message) => {
      elmInterop(message);
    });
  } else {
    console.error('receiveMsgsFromJs port is not defined or subscribe is not a function on eapp.ports');
  }
}

function handleMessagesFromAccounts (eapp) {
  if (eapp.ports && eapp.ports.msgFromAccounts) {
eapp.ports.msgFromAccounts.subscribe((message, pword) => {
  elmInterop(message, pword)
})

  } else {
console.error('msgFromAccounts port is not defined on eapp.ports')

  }
}

function initializeBrowserEnvironment () {
  try {
const environmentInfo = detectEnvironment()
console.log('Protocol:', environmentInfo.protocol)
console.log('Hostname:', environmentInfo.hostname)
console.log('Port:', environmentInfo.port)


const jsonUrl = JSON.stringify(window.location.origin)
console.log('jsonUrl:', jsonUrl)


const elmapp = initializeElmApp(Elm, jsonUrl)
handleMessagesToMain(elmapp)
handleMessagesFromAccounts(elmapp)


// Set window.Elm to the initialized Elm application instance

window.Elm = elmapp

  } catch (error) {
console.error('Error in setupElm.js:', error)

  }
}

document.addEventListener('DOMContentLoaded', initializeBrowserEnvironment)
