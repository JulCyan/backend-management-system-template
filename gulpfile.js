import { task, src, dest } from 'gulp'
import concat from 'gulp-concat'
task('default', function() {
  return src(['./src/styles/_variables.scss', './src/styles/element-variables.scss'])
    .pipe(concat('_element-variables.scss'))
    .pipe(dest('./src/styles/'))
})
