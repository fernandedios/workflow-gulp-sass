var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var reload = browserSync.reload; // enable reload

// files on src folder
var SOURCEPATHS = {
  sassSource: 'src/scss/*.scss' // all scss files
}

// files in the app folder
var APPPATH = {
  root: 'app/',
  css: 'app/css',
  js: 'app/js'
}

// SASS task
gulp.task('sass', function() {
  return gulp.src(SOURCEPATHS.sassSource) // define sass files
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) // define sass output style
    .pipe(gulp.dest(APPPATH.css)); // define where to output css file
});

// browser-sync server config
gulp.task('serve', ['sass'], function() { // start tasks in the array first before running server

  browserSync.init(
    // init using all css, html, js files
    [ APPPATH.css + '/*.css', APPPATH.root + '/*.html', APPPATH.js + '/*.js' ],
    {
      server: {
        baseDir: APPPATH.root // start server on this folder
      }
    });
});

// unified watch task
gulp.task('watch', ['serve', 'sass'], function() { // add tasks in an array
  gulp.watch([SOURCEPATHS.sassSource], ['sass']); // watch scss files for changes. run sass task if detected
});

gulp.task('default', ['watch']); // launch watch task as default
