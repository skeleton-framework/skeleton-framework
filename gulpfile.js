var fs        = require('fs')
var exec      = require('child_process').exec
var gulp      = require('gulp')
var gulpif    = require('gulp-if')
var postcss   = require('gulp-postcss')
var cssmin    = require('gulp-cssmin')
var rename    = require('gulp-rename')

var header    = require('gulp-header')
var moment    = require('moment')
var pkg       = require('./package.json')


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
    dist: './dist',
    dev: './dev/css'
  },
  js: {
    devDir: './dev/js',
    dev: './dev/js/skeleton',
    dist: './dist/skeleton'
  },
  html: {
    src: './src/test.html',
    dev: './dev/'
  },
  images: {
    src: './src/images/favicon.png',
    dev: './dev/images'
  },
  watch: './src/**/*',
}

var processors = [
  require('postcss-import')(),
  require('postcss-custom-properties')(),
  require('postcss-calc')({
    precision: 10
  }),
  require('autoprefixer-core')()
]

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

var buildJS = function buildJS (outPath) {
  // this command line probably shouldn't be hardcoded
  // or at least, we may want to consider ways of creating an ender manifest
  // that the user can write to. ender would pick the manifest up and install
  // packages form that, just like npm
  //
  // or something.  this is a start.
  var proc = exec(`ender build jeesh --output ${outPath}`)
  proc.stdout.pipe(process.stdout)
  proc.stderr.pipe(process.stderr)
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

  try {
    fs.mkdirSync(paths.js.devDir)
  } catch (err) {
    if (err.code === "EEXIST") {
      // we're cool, dir is alreay there
      console.log(`mkdir ${paths.js.devDir} # good to go`)
    } else {
      throw err // something else is wrong
    }
  }

  buildJS(paths.js.dev)
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

  // no need to make a special dir here
  buildJS(paths.js.dist)
})

gulp.task('default', ['dev', 'watch'])
