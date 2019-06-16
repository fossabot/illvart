const babelMinify = require("gulp-babel-minify");
const prettier = require("gulp-prettier");
const workbox = require("workbox-build");

module.exports = ({ output, browserSync, reload, fs, gulp, debug, rename, sourcemaps }) => {

  const paths = {
    input: {
      js: "./src/**/*.js",
      app: "./src/app.js"
    },
    output: {
      js: output,
      app: `${output}/app.min.js`
    }
  };
  let sw = `${output}/sw.js`;

  // javascript development mode
  gulp.task("js:dev", () =>
    gulp
      .src(paths.input.app)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(prettier())
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "JavaScript compiled development‍:" }))
      .pipe(gulp.dest(paths.output.js))
      .pipe(browserSync.stream())
  );

  // javascript production mode
  gulp.task("js:prod", () =>
    gulp
      .src(paths.input.app)
      .pipe(sourcemaps.init({ largeFile: true }))
      .pipe(
        babelMinify({
          mangle: {
            keepClassName: true,
            topLevel: true
          }
        })
      )
      .pipe(
        rename({
          suffix: ".min"
        })
      )
      .pipe(sourcemaps.write("."))
      .pipe(debug({ title: "JavaScript compiled production:" }))
      .pipe(gulp.dest(paths.output.js))
  );

  // workbox inject
  gulp.task("workbox", () =>
    workbox
      .injectManifest({
        globDirectory: output,
        globPatterns: [
          "**/*.{html,css,js,mjs,map,jpeg,jpg,png,gif,webp,ico,svg,woff2,woff,eot,ttf,otf,json,webmanifest}"
        ],
        swDest: sw,
        swSrc: "./src/precache-manifest.js"
      })
      .then(({ warnings }) => {
        for (const warning of warnings) {
          console.warn(warning);
        }
        console.info("Service worker generation completed. 🚀");
      })
      .catch(err => {
        console.warn("Service worker generation failed 😵:", err);
      })
  );
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
    const injectLicense = [paths.output.app, sw];
    injectLicense.forEach(file =>
      fs.appendFileSync(file, `\n/*\n${license}\n*/\n`)
    );
    return cb();
  });

  // watch javascript development mode
  gulp.task("watch:js", () => {
    gulp.watch(paths.input.js, gulp.series("js:dev", reload));
  });

};
