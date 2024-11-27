import { Elm } from "../src/Main.elm";
import { handleMessageFromElm } from "./handleElmMessages.js";
import "./scrollTopLinksMenu.js";

document.addEventListener("DOMContentLoaded", () => {
  try {
    // Detect environment
    const detectEnvironment = () => {
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
    };

    const environmentInfo = detectEnvironment();
    console.log("Protocol:", environmentInfo.protocol);
    console.log("Hostname:", environmentInfo.hostname);
    console.log("Port:", environmentInfo.port);

    // Use window.location.origin directly
    const jsonUrl = JSON.stringify(window.location.origin);
    console.log("jsonUrl:", jsonUrl);

    // Initialize Elm application
    const eapp = Elm.Main.init({
      node: document.getElementById("elm"),
      flags: jsonUrl,
    });

    console.log("elm init:", eapp);

    // Handle messages from Elm
    eapp.ports.sendMessageToJs.subscribe((message) => {
      console.log("Message sent to js:", message);
      handleMessageFromElm(message, eapp);

      if (message === "ElmReady") {
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
      } else {
        console.warn("Elm initialization message not recognized:", message);
      }
    });
  } catch (error) {
    console.error("Error in setupElm.js:", error);
  }
});
