/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

const htmlmin = require("gulp-htmlmin");
const prettyData = require("gulp-pretty-data");
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");

module.exports = ({ output, gulp, debug }) => {

  // minify html
  gulp.task("minifyHtml", () =>
    gulp
      .src(`${output}/**/*.html`)
      .pipe(
        htmlmin({
          html5: true,
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: false, // avoid decode email address
          preventAttributesEscaping: true,
          removeAttributeQuotes: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          removeTagWhitespace: false
        })
      )
      .pipe(debug({ title: "Minify HTML:" }))
      .pipe(gulp.dest(output))
  );

  // avoid copying private files
  const xml_json_Input = ["./src/site.webmanifest"];
  // minify xml, json
  gulp.task("minify", () =>
    gulp
      .src(xml_json_Input)
      .pipe(
        prettyData({
          type: "minify",
          preserveComments: true,
          extensions: {
            xlf: "xml",
            webmanifest: "json"
          }
        })
      )
      .pipe(debug({ title: "Minify:" }))
      .pipe(gulp.dest(output))
  );
  // prettify xml, json
  gulp.task("prettify", () =>
    gulp
      .src(xml_json_Input)
      .pipe(
        prettyData({
          type: "prettify",
          extensions: {
            xlf: "xml",
            webmanifest: "json"
          }
        })
      )
      .pipe(debug({ title: "Prettify:" }))
      .pipe(gulp.dest(output))
  );

  // images compress
  gulp.task("imagesCompress", () =>
    gulp
      .src(["./src/assets/img/**/*.{jpg,jpeg,png,svg}"])
      /*.pipe(
        imagemin([
          imagemin.jpegtran({ progressive: true }),
          imagemin.optipng({ optimizationLevel: 5 })
        ])
      )*/
      .pipe(imagemin([
        pngquant({ quality: [0.5, 0.5] }),
        mozjpeg({ quality: 50 })
      ]))
      .pipe(gulp.dest(`${output}/assets/img/`))
  );

  // copy images
  gulp.task("copy:images", () =>
    gulp
      .src(["./src/assets/img/**"])
      .pipe(debug({ title: "Copy images files:" }))
      .pipe(gulp.dest(`${output}/assets/img/`))
  );
  // copy css
  gulp.task("copy:css", () =>
    gulp
      .src(["./src/assets/css/build/**"])
      .pipe(debug({ title: "Copy CSS files:" }))
      .pipe(gulp.dest(`${output}/assets/css/`))
  );

  // copy fonts
  gulp.task("copy:fonts", () =>
    gulp
      .src(["./src/assets/fonts/**"])
      .pipe(debug({ title: "Copy fonts files:" }))
      .pipe(gulp.dest(`${output}/assets/fonts/`))
  );

  // copy misc files
  gulp.task("copy:misc", () =>
    gulp
      .src(["./src/_redirects"])
      .pipe(debug({ title: "Copy misc files:" }))
      .pipe(gulp.dest(output))
  );

};
