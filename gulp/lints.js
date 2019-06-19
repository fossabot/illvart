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
