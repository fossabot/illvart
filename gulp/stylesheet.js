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

  const postcssDev = [
    presetEnv({
      autoprefixer: false // disable prefix on development mode
    })
  ];
  const postcssProd = [
    mqpacker,
    presetEnv({ browsers: "last 4 versions" }),
    cssnano({
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      removeAll: true // force remove all comments on production mode
    })
  ];

  const postcssNano = [
    cssnano({
      discardComments: {
        removeAll: true
      }
    }),
    discardComments({
      removeAll: true // force remove all comments on production mode
    })
  ];

  // style development mode
  gulp.task("css:dev", () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
      .pipe(postcss(postcssDev))
      .pipe(
        cssbeautify({
          indent: "  ",
          autosemicolon: true
        })
      )
      .pipe(rename(`style.${generateId}.css`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "CSS compiled development:" }))
      .pipe(gulp.dest(paths.output.scss))
      .pipe(browserSync.stream())
  );

  // style production mode
  gulp.task("css:prod", () =>
    gulp
      .src(paths.input.scss)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(postcss(postcssProd))
      .pipe(rename(`style.${generateId}.min.css`))
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "CSS compiled production:" }))
      .pipe(gulp.dest(paths.output.scss))
  );

  // Material Design Icons
  gulp.task("mdi", () =>
    gulp
      .src("./src/assets/scss/mdi/materialdesignicons.scss")
      .pipe(sassGlob())
      .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
      .pipe(postcss(postcssNano))
      .pipe(rename(`${data.file_name.mdi}.css`))
      .pipe(debug({ title: "Material Design Icons:" }))
      .pipe(gulp.dest(paths.output.scss))
  );

  // watch css development mode
  gulp.task("watch:scss", () => {
    gulp.watch(paths.scss, gulp.series("css:dev", "mdi", "copy:css", reload));
  });

};
