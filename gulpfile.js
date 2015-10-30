
var gulp         = require('gulp');
var del          = require('del');
var browsersync  = require('browser-sync').create();
var imagemin     = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-ruby-sass');
var minifycss    = require('gulp-minify-css');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var childprocess = require('child_process');
// var wiredep      = require('wiredep').stream;

var paths = {
  source: {
    css: 'scss/**/*.scss',
    html: 'html/**/*.html',
    js: [
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/button.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
      'bower_components/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
      'js/app.js'
    ],
    img: 'img/**/*.{svg,png,gif,jpg,jpeg}'
  },
  deploy: {
    css: 'deploy/css/',
    html: 'deploy/',
    js: 'deploy/js/',
    img: 'deploy/img/'
  }
};

var messages = {
  jekyllbuild: 'Running: jekyll build'
};

// See https://github.com/austinpray/asset-builder
// var manifest = require('asset-builder')('./manifest.json');

gulp.task('html', function(done) {
  browsersync.notify(messages.jekyllbuild);
  return childprocess.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('css', function() {
  return sass(paths.source.css, {
      precision: 10,
      stopOnError: true,
      style: 'expanded',
      sourcemap: true
      // lineNumbers: true
    })
    .on('error', sass.logError)
    // See https://github.com/postcss/autoprefixer
    // and https://github.com/ai/browserslist
    // and http://caniuse.com/usage-table
    .pipe(autoprefixer({
      browsers: [
        'last 2 versions'
      ]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.deploy.css));
});

gulp.task('js', function() {
  return gulp.src(paths.source.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.deploy.js));
});

gulp.task('img', function() {
  return gulp.src(paths.source.img)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.deploy.img));
});

gulp.task('serve', function() {
  browsersync.init({
    ui: {
      port: 1337
    },
    open: false,
    notify: true,
    files: [
      'deploy/**/*'
    ],
    server: {
      baseDir: 'deploy/'
    }
  });
});

gulp.task('clean', function() {
  return del('deploy');
});

gulp.task('watch', function() {
  gulp.watch(paths.source.css, ['css']);
  gulp.watch(paths.source.html, ['html']);
  gulp.watch(paths.source.js, ['js']);
  gulp.watch(paths.source.img, ['img']);
});

gulp.task('default', ['img', 'html', 'css', 'js', 'watch', 'serve']);

// gulp.task('wiredep', function() {
//   return gulp.src('')
//     .pipe(wiredep({
//
//     }))
//     .pipe(gulp.dest(''));
// });
