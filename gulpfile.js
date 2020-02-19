const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("gulp-csso");
const server = require("browser-sync").create();
const del = require("del");

gulp.task("css", () => {
  return gulp.src("markup/sass/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("markup/css"))
    .pipe(gulp.dest("public/css"))
    .pipe(server.stream());
});

gulp.task("server", () => {
  server.init({
    server: "public",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("markup/sass/**/*.scss", gulp.series("css"));
  gulp.watch(("markup/*.html"), gulp.series("copy", "refresh"));
});

gulp.task("copy", () => {
  return gulp.src([
    "markup/img/**",
    "markup/*.html",
    "markup/fonts/**",
    "markup/css/*.css"
  ], {
    base: "markup"
  })
    .pipe(gulp.dest("public"));
});

gulp.task("clean", () => {
  return del("public");
});

gulp.task("build", gulp.series(
  "clean",
  "copy",
  "css"
));

gulp.task("refresh", done => {
  server.reload();
  done();
});

gulp.task("start", gulp.series(
  "clean",
  "copy",
  "css",
  "server"
));
