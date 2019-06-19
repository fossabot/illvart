/*!
 * Copyright 2019 MNF (illvart)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

"use strict";

import cfg from "./src/data/config";
const output = `${cfg.settings.output}`;

import express from "express";
const app = express();

app.use(express.static(output));

// default port 6661
const PORT = process.env.PORT || 6661;

const listener = app.listen(PORT, () => {
  const PA = listener.address().port;
  console.log("View on the browser:");
  console.log(`  http://127.0.0.1:${PA}`);
  console.log("  " + "or");
  console.log(`  http://localhost:${PA}`);
  console.log("Press Ctrl+C to quit.");
});
