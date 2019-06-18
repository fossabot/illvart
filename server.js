"use strict";

const cfg = require("./src/data/config");
const output = `${cfg.settings.output}`;

const express = require("express");
const app = express();

app.use(express.static(output));

const listener = app.listen(process.env.PORT || 6661, () => {
  const p = listener.address().port;
  console.log("View on the browser:");
  console.log("  " + "http://127.0.0.1:" + p);
  console.log("  " + "or");
  console.log("  " + "http://localhost:" + p);
});
