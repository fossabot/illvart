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

const babelMinify = require("gulp-babel-minify");
const prettier = require("gulp-prettier");
const workbox = require("workbox-build");

module.exports = ({ output, browserSync, reload, fs, generateId, gulp, debug, rename, sourcemaps }) => {

  const paths = {
    input: {
      js: "./src/**/*.js",
      app: "./src/app.js"
    },
    output: {
      js: output
    }
  };
  let sw = `${output}/sw.js`;

  // javascript development mode
  // include map
  gulp.task("js:dev", () =>
    gulp
      .src(paths.input.app)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(prettier())
      // dynamic js name
      // see template.js
      .pipe(rename(`app.${generateId}.js`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "JavaScript compiled development‍:" }))
      .pipe(gulp.dest(paths.output.js))
      .pipe(browserSync.stream())
  );

  // javascript production mode
  // always include map on production for faster debugging
  gulp.task("js:prod", () =>
    gulp
      .src(paths.input.app)
      .pipe(sourcemaps.init({ largeFile: true }))
      // minify js with babelMinify
      .pipe(
        babelMinify({
          mangle: {
            keepClassName: true,
            topLevel: true
          }
        })
      )
      // dynamic js name
      // see template.js
      .pipe(rename(`app.${generateId}.min.js`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "JavaScript compiled production:" }))
      .pipe(gulp.dest(paths.output.js))
  );

  // workbox inject manifest
  gulp.task("workbox", () =>
    workbox
      .injectManifest({
        globDirectory: output,
        globPatterns: [
          // ignore map
          "**/*.{html,css,js,mjs,jpeg,jpg,png,gif,webp,ico,svg,woff2,woff,eot,ttf,otf,json,webmanifest}"
        ],
        // Increase the limit to 4mb
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        swDest: sw,
        swSrc: "./src/precache-manifest.js"
      })
      .then(({ warnings, count, size }) => {
        for (const warning of warnings) {
          console.warn(warning);
        }
        console.info("Service worker generation completed. 🚀");
        console.log(`Generated ${sw}, which will precache ${count} files, totaling ${size} bytes.`);
      })
      .catch(err => {
        console.warn("Service worker generation failed 😵:", err);
      })
  );
  // minify workbox with babelMinify
  // just for development mode
  gulp.task("workbox:minify", () =>
    gulp
      .src(sw, { allowEmpty: true })
      .pipe(
        babelMinify({
          mangle: {
            keepClassName: true,
            topLevel: true
          }
        })
      )
      .pipe(debug({ title: "Minify:" }))
      .pipe(gulp.dest(output))
  );

  // license only production mode
  gulp.task("js:credit", cb => {
    const license = fs.readFileSync("./LICENSE", "UTF-8");
    const injectLicense = [`${output}/app.${generateId}.min.js`, sw];
    injectLicense.forEach(file =>
      fs.appendFileSync(file, `\n/*\n${license}\n*/\n`)
    );
    return cb();
  });

  // watch javascript development mode
  gulp.task("watch:js", () => {
    // first run js:dev then workbox, reload
    gulp.watch(paths.input.js, gulp.series("js:dev", "workbox", reload));
  });

};
