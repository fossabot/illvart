importScripts("https://storage.googleapis.com/workbox-cdn/releases/4.3.1/workbox-sw.js"),workbox?console.log("Yay! Workbox is loaded \uD83C\uDF89"):console.log("Boo! Workbox didn't load \uD83D\uDE2C"),workbox.precaching.precacheAndRoute([{url:"404.html",revision:"d1bf2f3fe4c4e8f6b6b4a2ab2677cc15"},{url:"assets/css/style.css",revision:"c6a426e414e976009e3a3f9c5e7a9f1d"},{url:"assets/css/style.min.css",revision:"978e50740039e7c1d298f0f9ceab7bdb"},{url:"assets/img/banner.png",revision:"d09844e2d6617c37361778d72304e815"},{url:"assets/img/logo/apple-touch-icon.png",revision:"88fd5dcfb37e399b70dcbadbad87fa5f"},{url:"assets/img/logo/favicon32.png",revision:"9a40b4711351956db775584ce9a13965"},{url:"assets/img/logo/icon-128x128.png",revision:"92e937aabb096c4db1e65df007630a03"},{url:"assets/img/logo/icon-144x144.png",revision:"b7dbf83f545fe5d8a1de677bf9fca471"},{url:"assets/img/logo/icon-152x152.png",revision:"906e71102b98d6edd7b35eb645dccef8"},{url:"assets/img/logo/icon-192x192.png",revision:"740c343c9227832b1ce2e7823512d496"},{url:"assets/img/logo/icon-256x256.png",revision:"98d3759e9ca122c7d25a7cbe3aee5313"},{url:"assets/img/logo/icon-512x512.png",revision:"54ddbbb8286b7647f018dfc1426cb885"},{url:"assets/img/me.png",revision:"49146c72541066789200c0fe6bb1b584"},{url:"index.html",revision:"fdb4bc0e9c74e2f9583d9fec1dd84935"},{url:"index.js",revision:"7ee7706af867b4d2b61e4cfcdc7472ba"},{url:"site.webmanifest",revision:"41010d005d879749dc84dd854459e1b6"}]),workbox.routing.registerRoute(/.*\.gstatic\.com\//,new workbox.strategies.StaleWhileRevalidate({cacheName:"gstatic"})),workbox.routing.registerRoute(/^https:\/\/fonts\.googleapis\.com\//,new workbox.strategies.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets"})),workbox.routing.registerRoute(/^https:\/\/cdn\.jsdelivr\.net\//,new workbox.strategies.StaleWhileRevalidate({cacheName:"jsdelivr"})),workbox.routing.registerRoute(/\.(?:jpg|jpeg|png|gif|webp|ico|svg)$/,new workbox.strategies.CacheFirst({cacheName:"illvart-images",plugins:[new workbox.expiration.Plugin({maxEntries:60,maxAgeSeconds:2592000})]})),workbox.routing.registerRoute(/\.(?:js|mjs|css)$/,new workbox.strategies.StaleWhileRevalidate({cacheName:"illvart-static"})),self.addEventListener("install",function(a){a.waitUntil(self.skipWaiting())}),self.addEventListener("activate",function(){self.clients.claim()});