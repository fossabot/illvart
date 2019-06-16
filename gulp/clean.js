module.exports = ({ output, del, gulp }) => {
  gulp.task("clean", () =>
    del([
      output,
      "./src/assets/css/build/"
    ]), { force: true }
  );
};
