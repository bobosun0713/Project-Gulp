var gulp = require("gulp"),
    sass = require("gulp-sass"),
    cleanCSS = require("gulp-clean-css"),
    jshint = require("gulp-jshint"),
    fileinclude = require("gulp-file-include"),
    sourcemaps = require("gulp-sourcemaps"),
    browserSync = require("browser-sync").create(),
    autoprefixer = require('autoprefixer');
    postcss = require('gulp-postcss');
    reload = browserSync.reload;

// path 路徑
var web = {
    html: ["dev/*.html", "dev/**/*.html"],
    sass: ["dev/sass/*.scss", "dev/sass/**/*.scss"],
    css: ["dev/css/*.css", "dev/css/**/*.css"],
    js: ["dev/js/*.js", "dev/js/**/*.js"],
    img: ["dev/image/*.*", "dev/image/**/*.*"],
    font: ["dev/font/*.*"],
};

// 任務流程
gulp.task("concatjs", function () {
    gulp.src(web.js).pipe(gulp.dest("dest/js"));
});

gulp.task("css", function () {
    gulp.src(web.css).pipe(gulp.dest("dest/css"));
});

gulp.task("img", function () {
    gulp.src(web.img).pipe(gulp.dest("dest/image"));
});

gulp.task("font", function () {
    gulp.src(web.font).pipe(gulp.dest("dest/font"));
});

gulp.task("sass", function () {
    var processors = [                                 // 定義 postCSS 所需要的元件
        autoprefixer({browsers: ['last 5 version']})   // 使用 autoprefixer，這邊定義最新的五個版本瀏覽器
    ]; 
    return (
        gulp
            .src("dev/sass/*.scss")
            .pipe(sourcemaps.init())
            .pipe(sass().on("error", sass.logError))
            // .pipe(cleanCSS({compatibility: 'ie9'}))
            .pipe(sourcemaps.write())
            .pipe(postcss(processors))          
            .pipe(gulp.dest("dest/css/"))
    );
});

gulp.task("fileinclude", function () {
    gulp.src(["dev/*.html"])
        .pipe(
            fileinclude({
                prefix: "@@",
                basepath: "@file",
            })
        )
        .pipe(gulp.dest("./dest"));
});

gulp.task("all", function () {
    gulp.src(web.js).pipe(gulp.dest("dest/js"));
    gulp.src(web.css).pipe(gulp.dest("dest/css"));
    gulp.src(web.img).pipe(gulp.dest("dest/image"));
    gulp.src(web.font).pipe(gulp.dest("dest/font"));
});

// 監看項目
gulp.task("default", function () {
    browserSync.init({
        server: {
            baseDir: "./dest",
            index: "index.html",
        },
    });
    gulp.watch(web.html, ["fileinclude"]).on("change", reload);
    gulp.watch(web.sass, ["sass"]).on("change", reload);
    gulp.watch(web.js, ["concatjs"]).on("change", reload);
    // gulp.watch(web.js, ['lint']).on('change', reload);
    gulp.watch(web.img, ["img"]).on("change", reload);
    gulp.watch(web.css, ["css"]).on("change", reload);
    gulp.watch(web.font, ["font"]).on("change", reload);
});
