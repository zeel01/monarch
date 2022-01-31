const { src, dest, watch, series, parallel } = require('gulp');
const sass = require("gulp-sass")(require('sass'));
const sourcemaps = require("gulp-sourcemaps");
const ts = require("gulp-typescript");

const sources = "sass/*.{scss,sass}";
const tssources = "./**/*.js";

function css() {
	return src(sources)
		.pipe(sourcemaps.init())
		.pipe(
			sass(
				{ includePaths: ["./sass"] }
			).on("error", sass.logError))
		.pipe(sourcemaps.write())
		.pipe(dest("./"))
}

function typescript() {
	const project = ts.createProject("tsconfig.json");
	return project.src()
		.pipe(project(ts.reporter.defaultReporter()))
		.pipe(dest("."));
}

function watchCss(cb) {
	return watch(sources, css, cb);
}

function watchTs(cb) {
	return watch(tssources, typescript, cb);
}

const watchers = parallel(watchCss, watchTs);

exports.css = css;
exports.typescript = typescript;
exports.watch = watchers;
exports.default = series(css, typescript, watchers);