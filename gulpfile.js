var gulp = require('gulp');
var sass = require('gulp-sass');

var browserSync = require('browser-sync');
var reload = browserSync.reload; // enable reload

var autoprefixer = require('gulp-autoprefixer');
var browserify = require('gulp-browserify');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var merge = require('merge-stream');
var newer = require('gulp-newer');
var imagemin = require('gulp-imagemin');

// files on src folder
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss', // all scss files
  htmlSource: 'src/*.html', // all html files
  jsSource: 'src/js/**', // all files in js folder
  imgSource: 'src/img/**' // all files in img folder
};

// files in the app folder
var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js',
  fonts: 'app/fonts',
  img: 'app/img'
};

// garbage collection task for html files
gulp.task('clean-html', function() {
  // check APPPATH.root for unused html files (no src counterpart)
  // no need to read file contents, just reference filename
  return gulp.src(APPPATH.root + '/*.html', { read: false, force: true })
    .pipe(clean());
});

// garbage collection task for js files
gulp.task('clean-scripts', function() {
  // check APPPATH.root for unused js files (no src counterpart)
  // no need to read file contents, just reference filename
  return gulp.src(APPPATH.js + '/*.js', { read: false, force: true })
    .pipe(clean());
});

// SASS task, take special care of the pipe order
gulp.task('sass', function() {
  var bootsrapCSS = gulp.src('./node_modules/bootstrap/dist/css/bootstrap.css') // reference bootstrap stylesheet css directly
  var sassFiles;

  sassFiles = gulp.src(SOURCEPATHS.sassSource) // define sass files
    .pipe(autoprefixer()) // enable autoprefixer
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)); // define sass output style

  return merge(bootsrapCSS, sassFiles) // define css files to merge, take special care of ordering, custom styles should be last
    .pipe(concat('app.css')) // do concat on the files, define output file
    .pipe(gulp.dest(APPPATH.css)); // define where to output css file
});

// images task
gulp.task('images', function() {
  return gulp.src(SOURCEPATHS.imgSource)
    .pipe(newer(APPPATH.img)) // check for newer image files
    .pipe(imagemin()) // minify images returned from newer
    .pipe(gulp.dest(APPPATH.img)); // transfer minified images to destination folder
});

// fonts task
gulp.task('moveFonts', function() {
  // reference bootstrap font files directly
  gulp.src('./node_modules/bootstrap/dist/fonts/*.{eot,svg,ttf,woff,woff2}') // file extensions separated by comma, NO spaces
    .pipe(gulp.dest(APPPATH.fonts)); // destination folder
});

// javascript copy task
// do clean-scripts task as well for unused js files
gulp.task('scripts', ['clean-scripts'], function() {
  gulp.src(SOURCEPATHS.jsSource) // define javascript src
    .pipe(concat('main.js')) // define output filename
    .pipe(browserify()) // enable browserify
    .pipe(gulp.dest(APPPATH.js)); // define where to copy final js file
});

// task to copy html files from src to app folder
// do clean-html task as well for unused html files
gulp.task('copy', ['clean-html'], function() {
  gulp.src(SOURCEPATHS.htmlSource)
    .pipe(gulp.dest(APPPATH.root))
});

// browser-sync server task
gulp.task('serve', ['sass'], function() { // start tasks in the array first before running server

  // browser-sync config
  browserSync.init(
    // init using all css, html, js files
    [ APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js' ],
    { server: { baseDir: APPPATH.root } } // start server on this folder
  );
});

// unified watch task
gulp.task('watch', ['serve', 'sass', 'clean-html', 'clean-scripts', 'scripts', 'copy', 'moveFonts', 'images'], function() { // add tasks in an array
  gulp.watch([SOURCEPATHS.sassSource], ['sass']); // watch scss files for changes. run sass task if detected
  gulp.watch([SOURCEPATHS.htmlSource], ['copy']); // watch html files for changes. run copy task if detected
  gulp.watch([SOURCEPATHS.jsSource], ['scripts']); // watch js files for changes. run scripts task if detected
  gulp.watch([SOURCEPATHS.imgSource], ['images']); // watch files for changes. run images task if detected
});

gulp.task('default', ['watch']); // launch watch task as default
