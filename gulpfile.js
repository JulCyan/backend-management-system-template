var gulp = require('gulp')
var concat = require('gulp-concat')
gulp.task('default', function() {
  return gulp.src(['./src/styles/_variables.scss', './src/styles/element-variables.scss'])
    .pipe(concat('_element-variables.scss'))
    .pipe(gulp.dest('./src/styles/'))
})
