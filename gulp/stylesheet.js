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

const sass = require("gulp-sass");
const sassGlob = require("gulp-sass-glob");
const cssbeautify = require("gulp-cssbeautify");
const postcss = require("gulp-postcss");
const mqpacker = require("css-mqpacker");
const presetEnv = require("postcss-preset-env");
const cssnano = require("cssnano");
const discardComments = require("postcss-discard-comments");

module.exports = ({ data, browserSync, reload, generateId, gulp, debug, rename, sourcemaps }) => {

  const paths = {
    scss: "./src/assets/scss/**/*.scss",
    input: {
      scss: "./src/assets/scss/style/style.scss"
    },
    output: {
      scss: "./src/assets/css/build/"
    }
  };

  // postcss for development mode
  const postcssDev = [
    presetEnv({
      // disable prefix on development mode
      // because just for production
      autoprefixer: false
    })
  ];
  // postcss for production mode
  const postcssProd = [
    mqpacker,
    presetEnv({ browsers: "last 4 versions" }), // or .browserslistrc
    cssnano({
      // discard comments not working on /*! comments
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      // force remove all comments on production mode (not map)
      removeAll: true
    })
  ];
  // postcss -> cssnano and discardComments
  const postcssNano = [
    cssnano({
      // discard comments not working on /*! comments
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      // force remove all comments on production mode (not map)
      removeAll: true
    })
  ];

  // style development mode
  // include map
  gulp.task("css:dev", () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
      .pipe(postcss(postcssDev))
      // beautify CSS build to faster check view-source
      .pipe(
        cssbeautify({
          indent: "  ",
          autosemicolon: true
        })
      )
      // dynamic css name
      // see template.js
      .pipe(rename(`style.${generateId}.css`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "CSS compiled development:" }))
      .pipe(gulp.dest(paths.output.scss))
      .pipe(browserSync.stream())
  );

  // style production mode
  // always include map on production for faster debugging
  gulp.task("css:prod", () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(postcss(postcssProd))
      // dynamic css name
      // see template.js
      .pipe(rename(`style.${generateId}.min.css`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "CSS compiled production:" }))
      .pipe(gulp.dest(paths.output.scss))
  );

  // Material Design Icons
  // Minify version without map used for both development and production
  gulp.task("mdi", () =>
    gulp
      .src("./src/assets/scss/mdi/materialdesignicons.scss")
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(postcss(postcssNano))
      // get the name from metadata.json
      .pipe(rename(`${data.file_name.mdi}.css`))
      .pipe(debug({ title: "Material Design Icons:" }))
      .pipe(gulp.dest(paths.output.scss))
  );

  // watch css development mode
  gulp.task("watch:scss", () => {
    // first run css:dev then mdi and copy:css build output, reload
    gulp.watch(paths.scss, gulp.series("css:dev", "mdi", "copy:css", reload));
  });

};
