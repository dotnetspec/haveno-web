import { Elm } from "./elm.js";
import { handleMessageFromElm } from "./handleElmMessages.js";

// WARN: Use Playwright to test. Vitest runs in Node.js, so it cannot execute Elm code directly. 

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

function setupMenuButton() {
  console.log("Elm initialization complete. Setting up menu button.");

  // Add a delay to ensure Elm has rendered the `.menu-btn`
  setTimeout(() => {
    console.log("Before querySelector.");
    const menubtn = document.querySelector(".menu-btn");
    console.log("After - querySelector", menubtn);
    if (menubtn) {
      let menuOpen = false;
      menubtn.addEventListener("click", () => {
        if (!menuOpen) {
          menubtn.classList.add("open");
          menuOpen = true;
        } else {
          menubtn.classList.remove("open");
          menuOpen = false;
        }
        console.log("Set up menu button - Complete.");
      });
    } else {
      console.warn("Menu button not found. Skipping event listener setup.");
    }
  }, 0);
}

function handleElmMessages(eapp) {
  console.log("in handleElmMessages - eapp:", eapp.ports.sendMessageToJs);
  if (eapp.ports && eapp.ports.sendMessageToJs) {
    eapp.ports.sendMessageToJs.subscribe((message) => {
      console.log("Message sent to js:", message);
      handleMessageFromElm(message, eapp);

      if (message === "ElmReady") {
        setupMenuButton();
      } else {
        console.warn("Elm initialization message not recognized:", message);
      }
    });
  } else {
    console.error("sendMessageToJs port is not defined on eapp.ports");
  }
}

function initializeApp() {
  try {
    const environmentInfo = detectEnvironment();
    console.log("Protocol:", environmentInfo.protocol);
    console.log("Hostname:", environmentInfo.hostname);
    console.log("Port:", environmentInfo.port);

    const jsonUrl = JSON.stringify(window.location.origin);
    console.log("jsonUrl:", jsonUrl);

    const eapp = initializeElmApp(jsonUrl);
    handleElmMessages(eapp);
  } catch (error) {
    console.error("Error in setupElm.js:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializeApp);