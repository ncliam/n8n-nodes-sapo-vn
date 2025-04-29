const gulp = require('gulp');

gulp.task('build:icons', () => {
    return gulp.src('shared/*.png') // Source path for the shared image
        .pipe(gulp.dest('dist/shared')); // Destination path in the dist folder
});
