"use strict";

const { src, dest, watch, parallel, series } = require("gulp");
const { doesNotMatch } = require("assert");
const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const sourcemaps = require("gulp-sourcemaps");
const addVersionString = require("gulp-rev-all");
const replace = require("gulp-replace");
const debug = require("gulp-debug");

const versionConfig = {
  value: "%DT%",
  append: {
    key: "v",
    to: ["css", "js"],
  },
  dontRenameFile: [/^\/favicon.ico$/g, ".html"],
};

let LOCDEV;
let URLDEV;

if ("NODE_ENV" in process.env && process.env.NODE_ENV.trim() === "production") {
  LOCDEV = "https//localhost:2020";
} else {
  LOCDEV = ".";
}

function processURLs() {
  return src("./*.html").pipe(replace("%HOME_PATH%", LOCDEV)).pipe(dest("build/"));
}

function buildStyles() {
  return gulp
    .src("./sass/**/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("./css"));
}

function buildCSSDist() {
  return gulp
    .src(["./css/**/*.css", "./css/**/*.map"])
    .pipe(debug({ minimal: false }))
    .pipe(gulp.dest("./build/css/"));
}

function buildJSDist() {
  return gulp
    .src("./js/**/*.js")
    .pipe(debug({ minimal: false }))
    .pipe(gulp.dest("./build/js/"));
}

function buildHTMLDist() {
  return gulp.src("./*.html").pipe(debug()).pipe(replace("%HOME_PATH%", LOCDEV)).pipe(gulp.dest("./build/"));
}

function versionFiles() {
  return gulp.src("./build/**/*").pipe(addVersionString.revision(versionConfig)).pipe(debug()).pipe(gulp.dest("./build/"));
}

exports.buildStyles = gulp.series(buildStyles, buildHTMLDist, buildCSSDist, buildJSDist, versionFiles);
exports.watch = function () {
  gulp.watch("./sass/**/*.scss", series(buildStyles, buildHTMLDist, buildCSSDist, buildJSDist));
  gulp.watch("./*.html", buildHTMLDist);
  gulp.watch("./js/**/*.js", buildJSDist);
};
