/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

module.exports = ({ output, del, gulp }) => {
  gulp.task("clean", () =>
    del([
      // clean build output
      output,
      // clean build css (scss output)
      "./src/assets/css/build/"
    ]), { force: true }
  );
};
