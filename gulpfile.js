
var gulp         = require('gulp');
var del          = require('del');
var browsersync  = require('browser-sync').create();
var imagemin     = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var sass         = require('gulp-sass');
var cleancss     = require('gulp-clean-css');
var sasslint     = require('gulp-sass-lint');
var sourcemaps   = require('gulp-sourcemaps');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var jshint       = require('gulp-jshint');
var babel        = require("gulp-babel");
var childprocess = require('child_process');
var argv         = require('yargs').argv;
var gulpif       = require('gulp-if');
var runsequence  = require('run-sequence');
var fs           = require('fs');
var scriptfiles  = JSON.parse(fs.readFileSync('./scriptfiles.json'));

// Uncomment the framework you are using
// var framework = 'bootstrap';
// var framework = 'foundation';

// NOTE: remove unused scripts from scriptmanifest.json
if ( framework === 'bootstrap'  ) var frameworkjs = scriptfiles.bootstrap;
if ( framework === 'foundation' ) var frameworkjs = scriptfiles.foundation;
var vendorjs = scriptfiles.vendor;
var mainjs = scriptfiles.main;
var alljs = vendorjs.concat(frameworkjs, mainjs);

var paths = {
  source: {
    html:   'html/**/*.html',
    styles: 'assets/styles/**/*.scss',
    images: 'assets/images/**/*.{svg,png,gif,jpg,jpeg}',
    fonts:  'assets/fonts/**/*.{ttf,otf,eot,woff,woff2}',
    scripts: {
      main: mainjs,
      all: alljs
    }
  },
  deploy: {
    html:    'deploy/',
    styles:  'deploy/assets/styles/',
    images:  'deploy/assets/images/',
    fonts:   'deploy/assets/fonts/',
    scripts: 'deploy/assets/scripts/'
  }
};

// NOTE: Jekyll will delete the entire deploy directory when it builds
// If you add files to the build process outside of the assets folder,
// be sure to add them to the keep_files setting in _config.yml
gulp.task('html', function(done) {
  browsersync.notify('Running: jekyll build');
  return childprocess.spawn('jekyll', ['build'], {stdio: 'inherit'})
    .on('close', done);
});

gulp.task('styles', ['lint-css'], function() {
  return gulp.src(paths.source.styles)
    .pipe(gulpif(!argv.production, sourcemaps.init()))
    .pipe(sass({ precision: 10 }).on('error', sass.logError))
    // See https://github.com/postcss/autoprefixer
    // and https://github.com/ai/browserslist
    // and http://caniuse.com/usage-table
    .pipe(autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(cleancss({ advanced: false }))
    .pipe(gulpif(!argv.production, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.deploy.styles));
});

gulp.task('lint-css', function() {
  return gulp.src(paths.source.styles)
    // See https://github.com/sasstools/sass-lint/tree/master/docs/rules
    .pipe(sasslint({
      options: {
        configFile: '_sass-lint.yml',
        'merge-default-rules': false
      }
    }))
    .pipe(sasslint.format())
    .pipe(sasslint.failOnError());
});

gulp.task('scripts', ['lint-js'], function() {
  return gulp.src(paths.source.scripts.all)
    .pipe(sourcemaps.init())
    // Comment the following line if you do not want scripts to be concatenated
    // You will need to add separate script tags in default.html Jekyll template
    .pipe(concat('main.js'))
    .pipe(gulpif(( framework === 'foundation' ), babel()))
    // Comment the following line if you do not want scripts to be minified
    // .pipe(uglify())
    .pipe(gulpif(!argv.production, sourcemaps.write('./')))
    .pipe(gulp.dest(paths.deploy.scripts));
});

gulp.task('lint-js', function() {
  return gulp.src(paths.source.scripts.main)
    .pipe(jshint({ lookup: false }))
    .pipe(jshint.reporter('default'));
});

gulp.task('images', function() {
  return gulp.src(paths.source.images)
    .pipe(imagemin())
    .pipe(gulp.dest(paths.deploy.images));
});

gulp.task('fonts', function() {
  return gulp.src(paths.source.fonts)
    .pipe(gulp.dest(paths.deploy.fonts));
});

gulp.task('lint', function() {
  runsequence('lint-css', 'lint-js');
});

gulp.task('serve', function() {
  browsersync.init({
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
  return del(['deploy']);
});

gulp.task('watch', function() {
  gulp.watch(paths.source.html, ['html']);
  gulp.watch(paths.source.styles, ['styles']);
  gulp.watch(paths.source.images, ['images']);
  gulp.watch(paths.source.fonts, ['fonts']);
  gulp.watch(paths.source.scripts.main, ['scripts']);
  gulp.watch('scriptfiles.json', ['scripts']);
});

gulp.task('build', ['clean'], function(callback) {
  runsequence(['html', 'styles', 'images', 'fonts', 'scripts'], callback);
});

gulp.task('default', function() {
  runsequence('build', 'serve', 'watch');
});
