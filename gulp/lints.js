/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

const eslint = require("gulp-eslint");
const stylelint = require("gulp-stylelint");

module.exports = ({ reports, gulp }) => {

  // linting javascript
  gulp.task("lint:js", () =>
    gulp
      .src("./src/**/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );

  // linting css/scss
  gulp.task("lint:scss", () =>
    gulp.src(["./src/assets/scss/**/*.scss"]).pipe(
      stylelint({
        failAfterError: true,
        // reports linting
        reportOutputDir: `${reports}/lint/`,
        reporters: [
          {
            formatter: "verbose",
            console: true
          },
          {
            formatter: "json",
            // check our reports
            save: "stylelint-report.json"
          }
        ],
        debug: true
      })
    )
  );

};
