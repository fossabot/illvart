const nunjucksRender = require("gulp-nunjucks-render");
const { nunjucks } = require("gulp-nunjucks-render");
const { pd } = require("pretty-data");

module.exports = ({ cfg, output, data, browserSync, reload, gulp, debug }) => {

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
      templates: "./src/templates/**/*.+(njk|html)",
      pages: "./src/templates/pages/**/*.+(njk|html)"
    }
  };

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
            metadata: data
          }
        })
      )
      .pipe(debug({ title: "Rendering nunjucks to HTML:" }))
      .pipe(gulp.dest(output))
      .pipe(browserSync.stream())
  );

  // watch nunjucks development mode
  gulp.task("watch:nunjucks", () => {
    gulp.watch(paths.src.templates, gulp.series("nunjucks:render", reload));
  });

};
