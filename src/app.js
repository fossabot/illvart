"use strict";

// Service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function() {
        console.log("Service Worker registered! \uD83D\uDE0E");
      })
      .catch(function(err) {
        console.log("Service Worker registration failed \uD83D\uDE2B ", err);
      });
  });
}

// Hello, World!
console.log("Hello, World! \ud83c\udf0e");
