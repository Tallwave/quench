
var gulp         = require('gulp');
var del          = require('del');
var browsersync  = require('browser-sync').create();
var imagemin     = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var cleancss     = require('gulp-clean-css');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var childprocess = require('child_process');
var argv         = require('yargs').argv;
var gulpif       = require('gulp-if');
var runsequence  = require('run-sequence');

var paths = {
  source: {
    css: 'scss/**/*.scss',
    html: 'html/**/*.html',
    js: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/affix.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/alert.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/button.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/carousel.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/collapse.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/dropdown.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/modal.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/popover.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/scrollspy.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/tab.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/tooltip.js',
      'node_modules/bootstrap-sass/assets/javascripts/bootstrap/transition.js',
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

gulp.task('html', function(done) {
  browsersync.notify('Running: jekyll build');
  return childprocess.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('css', function() {
  return gulp.src(paths.source.css)
    .pipe(gulpif(!argv.production, sourcemaps.init()))
    .pipe(sass({ precision: 10 }).on('error', sass.logError))
    // See https://github.com/postcss/autoprefixer
    // and https://github.com/ai/browserslist
    // and http://caniuse.com/usage-table
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleancss())
    .pipe(gulpif(!argv.production, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.deploy.css));
});

gulp.task('js', ['lint'], function() {
  return gulp.src(paths.source.js)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify())
    .pipe(gulpif(!argv.production, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.deploy.js));
});

gulp.task('lint', function() {
  return gulp.src('js/app.js')
    .pipe(jshint({ lookup: false }))
    .pipe(jshint.reporter('default'));
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

gulp.task('build', ['clean'], function(callback) {
  runsequence(['html', 'css', 'js', 'img'], callback);
});

gulp.task('default', ['build'], function() {
  runsequence('serve', 'watch');
});
