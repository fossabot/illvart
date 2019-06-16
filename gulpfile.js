"use strict";

const fs = require("fs");
const del = require("del");
const gulp = require("gulp");
const debug = require("gulp-debug");
const rename = require("gulp-rename");
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

// load gulp task
loader("./gulp/", {
  cfg,
  output,
  reports,
  data,
  browserSync,
  reload,
  fs,
  del,
  gulp,
  debug,
  rename,
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

// development mode: serve
exports.serve = gulp.series(
  envMode("development"),
  "clean",
  "lint:js",
  "lint:scss",
  gulp.parallel("css:dev", "js:dev"),
  "prettify",
  "nunjucks:render",
  "copy:css",
  "copy:images",
  "copy:misc",
  "workbox",
  gulp.parallel(server, "watch:scss", "watch:js", "watch:nunjucks", () => {
    console.log(`${new Date().toLocaleTimeString()} - Development version build finished!`);
  })
);

// production mode: build
exports.default = gulp.series(
  envMode("production"),
  "clean",
  "lint:js",
  "lint:scss",
  gulp.parallel("css:prod", "js:prod"),
  "minify",
  "nunjucks:render",
  "copy:css",
  // "copy:images",
  "imagesCompress",
  "copy:misc",
  "min:html",
  "workbox",
  "workbox:minify",
  "js:credit",
  (cb) => {
    console.log(`${new Date().toLocaleTimeString()} - Production version build finished!`);
    cb();
  }
);
