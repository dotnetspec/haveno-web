import { Elm } from './elm.js'
import { handleMessageFromElm } from './handleElmMessages.js'


// WARN: Use Playwright to test. Vitest runs in Node.js, so it cannot execute Elm code directly.
// NOTE: Try to use browser debugger if possible.

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

  console.log('Elm app initialized:', eapp);

  if (!eapp.ports) {
    console.error('Error: eapp.ports is undefined.');
    throw new TypeError('eapp.ports is undefined.');
  }

  if (!eapp.ports.receiveMsgsFromJs) {
    console.error('Error: eapp.ports.receiveMsgsFromJs is undefined.');
    throw new TypeError('eapp.ports.receiveMsgsFromJs is undefined.');
  }

  if (typeof eapp.ports.receiveMsgsFromJs.subscribe !== 'function') {
    console.error('Error: eapp.ports.receiveMsgsFromJs.subscribe is not a function.');
    throw new TypeError('eapp.ports.receiveMsgsFromJs.subscribe is not a function.');
  }

  console.log('Elm app ports:', eapp.ports);
  console.log('receiveMsgsFromJs.subscribe is a function:', typeof eapp.ports.receiveMsgsFromJs.subscribe === 'function');

  return eapp;
}

function handleMessagesToMain (eapp) {
  if (eapp.ports && eapp.ports.receiveMsgsFromJs && typeof eapp.ports.receiveMsgsFromJs.subscribe === 'function') {
    eapp.ports.receiveMsgsFromJs.subscribe((message) => {
      handleMessageFromElm(message);
    });
  } else {
    console.error('receiveMsgsFromJs port is not defined or subscribe is not a function on eapp.ports');
  }
}

function handleMessagesFromAccounts (eapp) {
  if (eapp.ports && eapp.ports.msgFromAccounts) {
eapp.ports.msgFromAccounts.subscribe((message, pword) => {
  handleMessageFromElm(message, pword)
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


const eapp = initializeElmApp(Elm, jsonUrl)
handleMessagesToMain(eapp)
handleMessagesFromAccounts(eapp)


// Set window.Elm to the initialized Elm application instance

window.Elm = eapp

  } catch (error) {
console.error('Error in setupElm.js:', error)

  }
}

document.addEventListener('DOMContentLoaded', initializeBrowserEnvironment)
