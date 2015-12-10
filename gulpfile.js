var gulp = require('gulp'),
    gulpif = require('gulp-if'),
    postcss = require('gulp-postcss'),
    cssmin = require('gulp-cssmin'),
    rename = require('gulp-rename'),
    gConn = require("gulp-connect"),
    bump = require('gulp-bump'),
    header = require('gulp-header'),
    moment = require('moment'),
    pkg = require('./package.json')

var banner = ['/*!',
  ' Skeleton Framework',
  ' | <%= pkg.version %>',
  ' | <%= pkg.license %>',
  ' | '+ moment().format("MMM Do, YYYY"),
  ' */',
  '\n \n'
].join('')

var paths = {
  css: {
    src: './src/skeleton.css',
    dist: './dist',
    dev: './dev/css'
  },
  html: {
    src: './src/test.html',
    dev: './dev/'
  },
  images: {
    src: './src/images/favicon.png',
    dev: './dev/images'
  },
  serve: {
    root: 'dev'
  },
  watch: ['src/**/*', 'dev/**/*']
}

var processors = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')({
    precision: 10
  }),
  require('autoprefixer-core')()
]



function release(options) {
  return gulp.src('./package.json')
    .pipe(bump({type: options}))
    .pipe(gulp.dest('./'))
}

gulp.task('patch', function() { return release('patch'); })
gulp.task('feature', function() { return release('minor'); })
gulp.task('release', function() { return release('major'); })

var buildTask = function(options) {
  return gulp.src(options.src)
    .pipe(postcss(processors))
    .pipe(gulpif(options.banner, header(banner, { pkg : pkg } )))
    .pipe(gulpif(options.pkgname, rename({ basename: pkg.name })))
    .pipe(gulp.dest(options.dest))
    .pipe(gulpif(options.minify, rename({
      extname: ".min.css"
    })))
    .pipe(gulpif(options.minify, cssmin(options.cssmin)))
    .pipe(gulpif(options.minify, gulp.dest(options.dest)))
}

var copyHTML = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest))
}

var copyImages = function(options) {
  return gulp.src(options.src)
    .pipe(gulp.dest(options.dest))
}

gulp.task('dev', function() {
  buildTask({
    src: paths.css.src,
    banner: false,
    minify: false,
    dest: paths.css.dev,
  })
  copyHTML({
    src: paths.html.src,
    dest: paths.html.dev
  })
  copyImages({
    src: paths.images.src,
    dest: paths.images.dev
  })
})

function setLiveReload() {
  // if we have a RELOAD thing set, use that
  // otherwise default to false
  if (process.env.RELOAD) {
    return process.env.RELOAD === "true" ? true : false
  } else {
    return false
  }
}

var useLiveReload = setLiveReload()

gulp.task("serve", function () {
  gConn.server({
    root: paths.serve.root,
    port: process.env.PORT || 3000,
    livereload: useLiveReload
  })
})

gulp.task('reload', function () {
  gulp.src(paths.serve.root) // this just watches the dev dir for changes and hits the reload button
    .pipe(gConn.reload())
})


gulp.task('watch', function() {
  gulp.watch(paths.watch, ['dev'])
})

gulp.task('prod', function() {
  buildTask({
    src: paths.css.src,
    banner: true,
    minify: true,
    pkgname: false,
    cssmin: {
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
    dest: paths.css.dist,
  })
})

gulp.task('default', ['dev', 'watch', 'serve'])
