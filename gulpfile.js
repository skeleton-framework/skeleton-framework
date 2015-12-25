/* Configuration Variables */

// Project Dependencies
var gulp = require('gulp'),
  gulpif = require('gulp-if'),
  postcss = require('gulp-postcss'),
  minifyCss = require('gulp-minify-css'),
  del = require('del'),
  rename = require('gulp-rename'),
  connect = require("gulp-connect"),
  opener = require('opener'),
  header = require('gulp-header'),
  moment = require('moment'),
  pkg = require('./package.json')

// License Header
var banner = ['/*!',
  ' Skeleton Framework',
  ' | <%= pkg.version %>',
  ' | <%= pkg.license %>',
  ' | ' + moment().format("MMM Do, YYYY"),
  ' */',
  '\n\n'
  ].join('')


// Server Config
var server = {
  port: 3000,
  liveReload: true,
}

// Paths
var path = {
  css: "src/skeleton.css",
  html: "src/index.html",
  dev: "dev",
  dist: "dist",
  watch: "src/**/*",
  serve: "dev",
  open: "http://localhost:3000"
}

// PostCSS Plugins
var processors = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')({
    precision: 10
  }),
  require('autoprefixer')()
]

// Clean Old Files
var clean = function (options) {
  return del('options.clean')
}

// Build CSS
var css = function (options) {
  return gulp.src(options.src)
    .pipe(postcss(processors))
    .pipe(gulpif(options.banner, header(banner, {
      pkg: pkg
    })))
    .pipe(gulpif(options.pkgname, rename({
      basename: pkg.name
    })))
    .pipe(gulp.dest(options.dest))
    .pipe(gulpif(options.minify, rename({
      extname: ".min.css"
    })))
    .pipe(gulpif(options.minify, minifyCss(options.minifyCss)))
    .pipe(gulpif(options.minify, gulp.dest(options.dest)))
}

// Build HTML -- We are only copying the test file to the dev dir
var html = function (options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest))
}

/* Build Tasks */
// create development build
gulp.task('dev', function () {
  clean: path.dev,
  css({
    src: path.css,
    banner: false,
    minify: false,
    dest: path.dev,
  })
  html({
    src: path.html,
    dest: path.dev,
  })
})

// create production build
gulp.task('dist', function () {
  clean: path.dist,
  css({
    src: path.css,
    banner: true,
    minify: true,
    pkgname: false,
    minifyCss: {
      advanced: true,
      aggressiveMerging: true,
      benchmark: false,
      compatibility: '*',
      debug: false,
      keepBreaks: false,
      mediaMerging: true,
      roundingPrecision: 10,
      shorthandCompacting: false
    },
    dest: path.dist
  })
})


/* Server Tasks*/

// Serve Development Directory
gulp.task("serve", function () {
  connect.server({
    root: path.serve,
    port: server.port,
    livereload: server.liveReload
  })
})

// Reload Browser On Changes
gulp.task('reload', function () {
  gulp.src(path.serve)
    .pipe(connect.reload())
})

// Watch Development Directory -- Reload Browser If LiveReload Is Enabled
gulp.task('watch', function () {
  gulp.watch(path.watch, ['dev'])
  if (server.liveReload)
    gulp.watch(path.watch, ['reload'])
})

// Open Development Directory In Web Browser
gulp.task('open', function () {
  opener(path.open)
})

/* Default Task */
// Build Development Version, Watch It For Changes, Serve It, Open It In Web Browser
gulp.task('default', ['dev', 'watch', 'serve', 'open'])
