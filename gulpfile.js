/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

"use strict";

const fs = require("fs");
const del = require("del");
const gulp = require("gulp");
const debug = require("gulp-debug");
const rename = require("gulp-rename");
const inject = require("gulp-inject-string");
const sourcemaps = require("gulp-sourcemaps");

const loader = require("./loader");
const cfg = require("./src/data/config");
const output = `${cfg.settings.output}`;
const reports = `${cfg.settings.reports}`;
const data = JSON.parse(fs.readFileSync("./src/data/metadata.json"));

const browserSync = require("browser-sync").create();
const reload = cb => {
  browserSync.reload();
  cb();
};

// generateId for dynamic name
const crypto = require("crypto");
const generateId = crypto.randomBytes(6).toString("hex");

// load gulp task
loader("./gulp/", {
  cfg,
  output,
  reports,
  data,
  browserSync,
  reload,
  generateId,
  fs,
  del,
  gulp,
  debug,
  rename,
  inject,
  sourcemaps
});

// browserSync
const server = cb => {
  browserSync.init({
    server: {
      baseDir: output
    },
    watch: true,
    notify: true,
    port: 6661,
    open: false,
    online: true,
    logLevel: "warn",
    logPrefix: `${data.short_title}`,
    logConnections: false
  });
  cb();
};

// environment mode
const envMode = mode => cb => ((process.env.NODE_ENV = mode), cb());

// development mode: yarn serve
exports.serve = gulp.series(
  envMode("development"),
  "clean",
  // "lint:js",
  // "lint:scss",
  gulp.parallel("css:dev", "mdi", "js:dev"),
  "prettify",
  "nunjucks:render",
  "sitemap",
  "robots.txt",
  "copy:css",
  "copy:fonts",
  "copy:images",
  "copy:misc",
  "workbox",
  gulp.parallel(server, "watch:scss", "watch:js", "watch:nunjucks", () => {
    console.log(`${new Date().toLocaleTimeString()} - Development version build finished!`);
  })
);

// production mode: yarn build
exports.default = gulp.series(
  envMode("production"),
  "clean",
  "lint:js",
  "lint:scss",
  gulp.parallel("css:prod", "mdi", "js:prod"),
  "minify",
  "nunjucks:render",
  "sitemap",
  "robots.txt",
  "copy:css",
  "copy:fonts",
  // "copy:images",
  "imagesCompress", // compress images only for production mode
  "copy:misc",
  "minifyHtml",
  "workbox",
  "workbox:minify",
  "js:credit",
  (cb) => {
    console.log(`${new Date().toLocaleTimeString()} - Production version build finished!`);
    cb();
  }
);
