const eslint = require("gulp-eslint");
const stylelint = require("gulp-stylelint");

module.exports = ({ reports, gulp }) => {

  // lint javascript
  gulp.task("lint:js", () =>
    gulp
      .src("./src/**/*.js")
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );

  // lint css/scss
  gulp.task("lint:scss", () =>
    gulp.src(["./src/assets/scss/**/*.scss"]).pipe(
      stylelint({
        failAfterError: true,
        reportOutputDir: `${reports}/lint/`, // reports linting
        reporters: [
          {
            formatter: "verbose",
            console: true
          },
          {
            formatter: "json",
            save: "stylelint-report.json"
          }
        ],
        debug: true
      })
    )
  );

};
