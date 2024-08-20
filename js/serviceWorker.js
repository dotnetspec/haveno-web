if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/service-worker.js", { scope: "/" })
      .then((registration) => {
        console.log("Registration successful");
      })
      .catch((error) => {
        console.log("Registration failed");
      });
  }