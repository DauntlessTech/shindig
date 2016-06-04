var gulp = require('gulp'),
  react = require('react'),
  react_dom = require('react-dom'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
  uglify = require('gulp-uglify'),
  autoprefixer = require('gulp-autoprefixer'),
  babel = require('gulp-babel'),
  browserSync = require('browser-sync').create(),
  eslint = require('gulp-eslint'),
  filter = require('gulp-filter'),
  newer = require('gulp-newer'),
  notify = require('gulp-notify'),
  plumber = require('gulp-plumber'),
  reload = browserSync.reload,
  sass = require('gulp-sass'),
  watch = require('gulp-watch'),
  cleanCSS = require('gulp-clean-css'),
  sourcemaps = require('gulp-sourcemaps');

var onError = function(err) {
  notify.onError({
    title: "Error",
    message: "<%= error %>",
  })(err);
  this.emit('end');
};

var plumberOptions = {
  errorHandler: onError,
};

var jsFiles = {
  vendor: [

  ],
  source: [
    'assets/js/src/jquery.min.js',
    'assets/js/src/main.js',
    'assets/js/src/locationpicker.min.js',
    'assets/js/src/components/index.jsx'
  ]
};

// Lint JS/JSX files
gulp.task('eslint', function() {
  return gulp.src(jsFiles.source)
    .pipe(eslint({
      "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "jsx": true,
            "js": true
        },
        "ignore": '*.min.js'
      },
      "rules": {
          "semi": 2
      }
    }))
    .pipe(eslint.format())
    .on('data', function(file) {
      if(file.eslint.messages && file.eslint.messages.length){
        gulp.fail = true;
      }
    });
});
process.on('exit', function() {
  if (gulp.fail) {
    process.exit(1);
  }
});

// Copy react.js and react-dom.js to assets/js/src/vendor
// only if the copy in node_modules is "newer"
gulp.task('copy-react', function() {
  return gulp.src('node_modules/react/dist/react.min.js')
    .pipe(newer('assets/js/src/vendor/react.js'))
    .pipe(gulp.dest('assets/js/src/vendor'));
});
gulp.task('copy-react-dom', function() {
  return gulp.src('node_modules/react-dom/dist/react-dom.min.js')
    .pipe(newer('assets/js/src/vendor/react-dom.js'))
    .pipe(gulp.dest('assets/js/src/vendor'));
});

// Copy assets/js/vendor/* to assets/js
gulp.task('copy-js-vendor', function() {
  return gulp
    .src([
      'assets/js/src/vendor/react.js',
      'assets/js/src/vendor/react-dom.js'
    ])
    .pipe(gulp.dest('assets/js'));
});

// Concatenate jsFiles.vendor and jsFiles.source into one JS file.
// Run copy-react and eslint before concatenating
gulp.task('concat', ['copy-react', 'copy-react-dom', 'eslint'], function() {
  return gulp.src(jsFiles.vendor.concat(jsFiles.source))
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(babel({
      presets: ['react'],
      only: [
        'assets/js/src/components',
      ],
      compact: false
    }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/js'));
});

// Compile Sass to CSS
gulp.task('sass', function() {
  var autoprefixerOptions = {
    browsers: ['last 2 versions'],
  };

  var filterOptions = '**/*.css';

  var reloadOptions = {
    stream: true,
  };

  var sassOptions = {
    includePaths: [

    ]
  };

  return gulp.src('assets/sass/**/*.scss')
    .pipe(plumber(plumberOptions))
    .pipe(sourcemaps.init())
    .pipe(sass(sassOptions))
    .pipe(autoprefixer(autoprefixerOptions))
    .pipe(concat('styles.css'))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('assets/css'))
    .pipe(filter(filterOptions))
    .pipe(reload(reloadOptions));
});


// Watch JS/JSX and Sass files
gulp.task('watch', function() {
  gulp.watch('assets/js/src/**/*.{js,jsx}', ['concat']);
  gulp.watch('assets/sass/**/*.scss', ['sass']);
});

// gulp.task('clean-css', function() {
//   return gulp.src('src/css/*.css')
//     .pipe(gp_concat('styles.css'))
//     .pipe(cleanCSS({
//       compatibility: 'ie8'
//     }))
//     .pipe(gulp.dest('dist/css/'));
// });

// BrowserSync
gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
      baseDir: './'
    },
    open: false,
    online: false,
    notify: false,
  });
});

gulp.task('build', ['sass', 'copy-js-vendor', 'concat']);
gulp.task('default', ['build', 'browser-sync', 'watch']);
