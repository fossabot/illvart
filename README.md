# [illvart](https://github.com/illvart/illvart)

> My personal website running on Node.js

[![Netlify Status](https://api.netlify.com/api/v1/badges/0392af17-3c20-4278-8139-7dbabd347d5c/deploy-status)](https://app.netlify.com/sites/illvart/deploys)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PWA: yes](https://img.shields.io/badge/PWA-yes-%235A0FC8.svg)](https://developers.google.com/web/progressive-web-apps)
[![Front‑End_Checklist followed](https://img.shields.io/badge/Front‑End_Checklist-followed-brightgreen.svg)](https://github.com/thedaviddias/Front-End-Checklist)

This is my first open source project. Basically, this doesn't use ~~JavaScript~~, only CSS! But support **Progressive Web Apps (PWA)** with [Workbox](https://github.com/GoogleChrome/workbox).

![Screenshot](https://cdn.staticaly.com/screenshot/illvart.com?fullPage=true?v=1.0.0)

## Note
This project work in progress. The next version I will include **Node.js** packages like a **Gulp** to optimize development and production. Soon! 🙇‍♂️

### Clone
Clone this repository and customization it:

```
$ git clone https://github.com/illvart/illvart.git
```

### Install Packages
Install the packages required:

```
$ yarn install
```

### Development
Running on localhost by using [http-server](https://github.com/indexzero/http-server):

```
$ yarn dev
```

### PWA
After editing the code and adding something, then inject manifest:

```
$ yarn inject-manifest
```

### Deploy
Default deploy command for **GitHub Pages**. You can also use **Netlify**, and this automatically pointing to the **static** directory.

```
$ yarn deploy
```

Note: Create a new branch with the name **gh-pages**, then deploy static directory to the gh-pages branch.

### Testing
You can test netlify headers including security, cache, etc:

- [Security Headers](https://securityheaders.com/?q=https://illvart.com&followRedirects=on)
- [webhint](https://webhint.io/scanner/cbb70839-c022-44d5-91a2-7d5273b708cd)

## License
This code is available under the [MIT License](LICENSE)
