var gulp = require('gulp'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  include = require('gulp-include'),
  eslint = require('gulp-eslint'),
  jasmine = require('gulp-jasmine'),
  notify = require('gulp-notify'),
  modernizr = require('gulp-modernizr'),
  minify = require('gulp-minify'),
  image = require('gulp-image');


gulp.task("pages", function() {
  console.log('-- gulp is running task "pages"');
  gulp.src('src/*.html')
    .pipe(include())
    .on('error', console.log)
    .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function() {
  console.log('-- gulp is running task "styles"');
  gulp.src('src/sass/**/*.scss')
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(autoprefixer({
      browsers: ['last 2 versions']
    }))
    .pipe(gulp.dest('dist/css'));
});

gulp.task('compress', function() {
  gulp.src('src/js/**/*.js')
    .pipe(minify({
      ext: {
        min: '-min.js'
      },
      ignoreFiles: ['-min.js']
    }))
    .pipe(gulp.dest('dist/js'));
});

gulp.task('modernizr', function() {
  gulp.src('src/js/**/*.js')
    .pipe(modernizr())
    .pipe(gulp.dest("dist/js"));
});

gulp.task("images", function() {
  console.log('-- gulp is running task "images"');
  gulp.src('src/images/**')
    .pipe(image())
    .on('error', console.log)
    .pipe(gulp.dest('dist/images'));
});

gulp.task('lint', function() {
  return gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('live', function() {
  gulp.watch('src/js/**/*.js', ['lint', 'compress', 'modernizr']);
  gulp.watch('src/sass/**/*.scss', ['styles']);
  gulp.watch('src/*.html', ['pages']);
  gulp.watch('src/images/**', ['images']);
});

gulp.task('default', ['lint', 'modernizr', 'pages', 'styles', 'images', 'compress', 'live']);
