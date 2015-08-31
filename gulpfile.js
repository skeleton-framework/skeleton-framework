var gulp = require('gulp')
var gulpif = require('gulp-if')
var postcss = require('gulp-postcss')
var cssmin = require('gulp-cssmin')
var rename = require('gulp-rename')

var header = require('gulp-header')
var moment = require('moment')
var pkg = require('./package.json')

var banner = ['/*!',
  ' Skeleton Framework',
  ' | v<%= pkg.version %>',
  ' | <%= pkg.license %>',
  ' | '+ moment().format("MMM Do, YYYY"),
  ' */',
  '\n \n'
].join('')

var paths = {
  css: {
    src: './src/skeleton.css',
    dest: './dist',
    examples: './examples/css',
    watch: './src/*.css'
  }
}

var processors = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')(),
  require('autoprefixer-core')()
]

var buildTask = function(options) {
  return gulp.src(options.src)
    .pipe(postcss(processors))
    .pipe(gulpif(options.banner, header(banner, { pkg : pkg } )))
    .pipe(gulp.dest(options.dest))
    .pipe(gulp.dest(options.examples))
    .pipe(gulpif(options.minify, rename({
      extname: ".min.css"
    })))
    .pipe(gulpif(options.minify, cssmin(options.cssmin)))
    .pipe(gulpif(options.minify, gulp.dest(options.dest)))
    .pipe(gulpif(options.minify, gulp.dest(options.examples)))
}

gulp.task('dev', function() {
  buildTask({
    src: paths.css.src,
    banner: false,
    minify: false,
    dest: paths.css.dest,
    examples: paths.css.examples
  })
})

gulp.task('watch', function() {
  gulp.watch(paths.css.watch, ['dev'])
})

gulp.task('prod', function() {
  buildTask({
    src: paths.css.src,
    banner: true,
    minify: true,
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
    dest: paths.css.dest,
    examples: paths.css.examples
  })
})
