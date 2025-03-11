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

function initializeElmApp(jsonUrl) {
  const eapp = Elm.Main.init({
    node: document.getElementById("elm"),
    flags: jsonUrl,
  });
  console.log("elm init:", eapp);
  return eapp;
}

function handleElmMessages(eapp) {
  if (eapp.ports && eapp.ports.sendMessageToJs) {
    eapp.ports.sendMessageToJs.subscribe((message) => {
      handleMessageFromElm(message, eapp);
    });
  } else {
    console.error("sendMessageToJs port is not defined on eapp.ports");
  }
}

function handleMessagesForEncryption(eapp) {
  if (eapp.ports && eapp.ports.encryptedMsg) {
    eapp.ports.encryptedMsg.subscribe((message) => {
      handleMessageFromElm(message, eapp);
    });
  } else {
    console.error("encryptedMsg port is not defined on eapp.ports");
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

    const eapp = initializeElmApp(jsonUrl);
    handleElmMessages(eapp);
    handleMessagesForEncryption(eapp);
  } catch (error) {
    console.error("Error in setupElm.js:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeBrowserEnvironment);
