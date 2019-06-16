const htmlmin = require("gulp-htmlmin");
const prettyData = require("gulp-pretty-data");
const imagemin = require("gulp-imagemin");
const mozjpeg = require("imagemin-mozjpeg");
const pngquant = require("imagemin-pngquant");

module.exports = ({ output, gulp, debug }) => {

  // minify html
  gulp.task("min:html", () =>
    gulp
      .src(`${output}/**/*.html`)
      .pipe(
        htmlmin({
          html5: true,
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          decodeEntities: true,
          preventAttributesEscaping: true,
          removeComments: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        })
      )
      .pipe(debug({ title: "Minify HTML:" }))
      .pipe(gulp.dest(output))
  );

  // minify xml, json
  const xml_json_Input = ["./src/sitemap.xml", "./src/site.webmanifest"]; // avoid copying private files
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

  // copy misc files
  gulp.task("copy:misc", () =>
    gulp
      .src(["./src/robots.txt", "./src/_redirects"])
      .pipe(debug({ title: "Copy misc files:" }))
      .pipe(gulp.dest(output))
  );

};
