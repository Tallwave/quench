
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

// Add or remove build assets here as needed
// TODO: Add a manifest.json and use wiredep to inject assets dynamically
var paths = {
  source: {
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
    html:   'html/**/*.html',
    styles: 'assets/styles/**/*.scss',
    images: 'assets/images/**/*.{svg,png,gif,jpg,jpeg}',
    fonts:  'assets/fonts/**/*.{ttf,otf,eot,woff,woff2}',
  },
  deploy: {
    html:    'deploy/',
    styles:  'deploy/assets/styles/',
    images:  'deploy/assets/images/',
    fonts:   'deploy/assets/fonts/',
    scripts: 'deploy/assets/scripts/'
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
    .pipe(cleancss({ advanced: false }))
    .pipe(gulpif(!argv.production, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.deploy.css));
});

gulp.task('js', ['lint'], function() {
  return gulp.src(paths.source.js)
    .pipe(gulpif(!argv.production, sourcemaps.init()))
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
      'deploy/**/*.html',
      'deploy/assets/images/*',
      'deploy/assets/fonts/*',
      'deploy/assets/scripts/*',
      'deploy/assets/styles/main.css'
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
