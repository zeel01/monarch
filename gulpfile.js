const { src, dest, watch, series } = require('gulp');
const sass = require("gulp-sass")(require('sass'));
const sourcemaps = require("gulp-sourcemaps");

const sources = "*.{scss,sass}";

function css() {
	return src(sources)
		.pipe(sourcemaps.init())
		.pipe(
			sass(
				{ includePaths: ["./"] }
			).on("error", sass.logError))
		.pipe(sourcemaps.write())
		.pipe(dest("./"))
}

function watcher(cb) {
	return watch(sources, css, cb);
}


exports.css = css;
exports.watch = watcher;
exports.default = series(css, watcher);