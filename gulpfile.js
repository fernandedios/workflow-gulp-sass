var gulp = require('gulp');
var sass = require('gulp-sass');

// SASS task
gulp.task('sass', function() {
  return gulp.src('src/scss/app.scss') // define sass file
    .pipe(sass({ outputStyle: 'expanded' }).on('error', sass.logError)) // define sass output style
    .pipe(gulp.dest('app/css')); // define where to output css file
});

gulp.task('default', ['sass']); // add tasks in an array
