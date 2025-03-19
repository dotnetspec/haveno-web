import { Elm } from "./elm.js";
import { handleMessageFromElm } from "./handleElmMessages.js";

// WARN: Use Playwright to test. Vitest runs in Node.js, so it cannot execute Elm code directly.
// NOTE: Try to use browser debugger if possible.



function detectEnvironment() {
  const protocol = window.location.protocol;
  const hostname = window.location.hostname;
  const port = window.location.port;
  const defaultPort = protocol === "https:" ? 443 : 80;
  const parsedPort = port ? parseInt(port, 10) : defaultPort;
  return {
    protocol: protocol,
    hostname: hostname,
    port: parsedPort,
  };
}

export function initializeElmApp(Elm, jsonUrl) {
  const eapp = Elm.Main.init({
    node: document.getElementById("elm"),
    flags: jsonUrl,
  });
  console.log("elm init:", eapp);
  return eapp;
}

function handleMessagesToAndFromMain(eapp) {
  if (eapp.ports && eapp.ports.msgFromElm) {
    eapp.ports.msgFromElm.subscribe((message) => {
      handleMessageFromElm(message);
    });
  } else {
    console.error("msgFromElm port is not defined on eapp.ports");
  }
}

function handleMessagesFromAccounts(eapp) {
  if (eapp.ports && eapp.ports.msgFromAccounts) {
    eapp.ports.msgFromAccounts.subscribe((message) => {
      handleMessageFromElm(message);
    });
  } else {
    console.error("msgFromAccounts port is not defined on eapp.ports");
  }
}

function initializeBrowserEnvironment() {
  try {
    const environmentInfo = detectEnvironment();
    console.log("Protocol:", environmentInfo.protocol);
    console.log("Hostname:", environmentInfo.hostname);
    console.log("Port:", environmentInfo.port);

    const jsonUrl = JSON.stringify(window.location.origin);
    console.log("jsonUrl:", jsonUrl);

    const eapp = initializeElmApp(Elm, jsonUrl);
    handleMessagesToAndFromMain(eapp);
    handleMessagesFromAccounts(eapp);

     // Set window.Elm to the initialized Elm application instance
     window.Elm = eapp;
  
  } catch (error) {
    console.error("Error in setupElm.js:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeBrowserEnvironment);