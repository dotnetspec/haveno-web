import { Elm } from "../src/Main.elm";
import { handleMessageFromElm } from "./handleElmMessages.js";
import "./scrollTopLinksMenu.js";

document.addEventListener("DOMContentLoaded", () => {
  const eapp = Elm.Main.init({
    node: document.getElementById("elm"),
    flags: "flags", // Pass any required flags here
  });

  var detectEnvironment = function () {
    var protocol = window.location.protocol;
    var hostname = window.location.hostname;
    var port = window.location.port;
    var defaultPort = protocol === "https:" ? 443 : 80;
    var parsedPort = port ? parseInt(port, 10) : defaultPort;
    return {
      protocol: protocol,
      hostname: hostname,
      port: parsedPort,
    };
  };

  var environmentInfo = detectEnvironment();
  console.log("Protocol:", environmentInfo.protocol);
  console.log("Hostname:", environmentInfo.hostname);
  console.log("Port:", environmentInfo.port);

  const protocol = environmentInfo.protocol;
  const hostnm = environmentInfo.hostname;
  const prt = environmentInfo.port;

  var jsonUrl = JSON.stringify(protocol + "//" + hostnm + ":" + prt);
  console.log("jsonUrl:", jsonUrl);

  eapp.ports.sendMessageToJs.subscribe(function (message) {
    console.log("Message sent to js ", message);
    handleMessageFromElm(message, eapp);
  });

  //burger animation
  const menubtn = document.querySelector(".menu-btn");
  let menuOpen = false;

  menubtn.addEventListener("click", () => {
    if (!menuOpen) {
      menubtn.classList.add("open");
      menuOpen = true;
    } else {
      menubtn.classList.remove("open");
      menuOpen = false;
    }
  });
});
