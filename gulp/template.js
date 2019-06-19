/*!
 * Copyright 2019 MNF (illvart). All Rights Reserved.
 *
 * Creative Commons Attribution 4.0 International License
 * https://creativecommons.org/licenses/by/4.0/
 *
 * GitHub: https://github.com/illvart
 */

const { nunjucks } = require("gulp-nunjucks-render");
const nunjucksRender = require("gulp-nunjucks-render");
const sitemap = require("gulp-sitemap");
const { pd } = require("pretty-data");

module.exports = ({ cfg, output, data, browserSync, reload, generateId, gulp, debug, inject }) => {

  // nunjucks manageEnv
  const manageEnvironment = plugin => {
    // global
    plugin.addGlobal("mode", process.env.NODE_ENV);

    // filter
    plugin.addFilter("toTitleCase", str =>
      str
        .match(
          /[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g
        )
        .map(x => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ")
    );
    plugin.addFilter("toEncodeURI", str => encodeURI(str));

    // extension
    // minify Json
    function minifyJsonExtension() {
      this.tags = ["minifyjson"];
      this.parse = (parser, nodes, lexer) => {
        const tok = parser.nextToken();
        parser.advanceAfterBlockEnd(tok.value);
        const body = parser.parseUntilBlocks("endminifyjson");
        parser.advanceAfterBlockEnd();
        return new nunjucks.nodes.CallExtension(this, "run", null, [body]);
      };
      this.run = (context, body) => {
        let minified;
        if (cfg.settings.minifyJson && process.env.NODE_ENV === "production") {
          minified = pd.jsonmin(body());
        } else {
          minified = pd.json(body());
        }
        return new nunjucks.runtime.SafeString(minified);
      };
    }
    plugin.addExtension("minifyJsonExtension", new minifyJsonExtension());
  };

  const paths = {
    src: {
      // watch css path (only filename .njk)
      templates: "./src/templates/**/*.+(njk)",
      // src path (only filename .njk)
      pages: "./src/templates/pages/**/*.+(njk)"
    }
  };

  // nunjucks render
  gulp.task("nunjucks:render", () =>
    gulp
      .src(paths.src.pages)
      .pipe(
        nunjucksRender({
          ext: ".html",
          path: ["src"],
          envOptions: {
            autoescape: true,
            throwOnUndefined: true,
            trimBlocks: true,
            lstripBlocks: true,
            watch: false
          },
          manageEnv: manageEnvironment,
          data: {
            // store string from metadata.json
            metadata: data,
            // dynamic css name
            css_name_dev: `style.${generateId}.css`,
            css_name_prod: `style.${generateId}.min.css`,
            // dynamic js name
            js_name_dev: `app.${generateId}.js`,
            js_name_prod: `app.${generateId}.min.js`
          }
        })
      )
      .pipe(debug({ title: "Rendering nunjucks to HTML:" }))
      .pipe(gulp.dest(output))
      .pipe(browserSync.stream())
  );

  // sitemap generator
  gulp.task("sitemap", () =>
    gulp
      .src(`${output}/**/*.html`, {
        read: false
      })
      .pipe(
        sitemap({
          // get URL from metadata.json
          siteUrl: `${data.url}`
        })
      )
      .pipe(debug({ title: "Generate sitemap:" }))
      .pipe(gulp.dest(output))
  );

  // inject sitemap url to robots.txt
  gulp.task("robots.txt", () =>
    gulp
      .src("./src/robots.txt")
      // inject after Allow: /
      // .pipe(inject.after("Allow: /", `\n\nSitemap: ${data.url}/sitemap.xml`))

      // append
      .pipe(inject.append(`\nSitemap: ${data.url}/sitemap.xml`))
      .pipe(debug({ title: "Inject sitemap url:" }))
      .pipe(gulp.dest(output))
  );

  // watch nunjucks development mode
  gulp.task("watch:nunjucks", () => {
    // first run nunjucks:render then sitemap, reload
    gulp.watch(paths.src.templates, gulp.series("nunjucks:render", "sitemap", reload));
  });

};
