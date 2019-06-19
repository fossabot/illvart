/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

"use strict";

const { readdirSync } = require("fs");
const { join } = require("path");

module.exports = (dirname, obj = {}) => {
  readdirSync(dirname)
    // .filter(path => path.endsWith(".js"))
    .forEach(module => {
      require(`./${join(dirname, module)}`)(obj);
    });
};
