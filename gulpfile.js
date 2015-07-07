var gulp = require('gulp'),
    lazypipe = require('lazypipe'),
    args = require('yargs').argv,
    env = (args.env === 'prod' ? 'prod' : 'dev'),
    isProd = (env === 'prod'),
    isDev = (env === 'dev'),
    paths = {
        src: 'app',
        dest: '.' + env + '_srv'
      },
    plugins;

plugins = require('gulp-load-plugins')({
  scope: ['devDependencies'],
  rename: {}
});


gulp.task('build-js', function() {
  var checks,
      prodTasks;

  checks = lazyPipe()
    .pipe(plugins.jshint())
    .pipe(plugins.jshint.reporter(require('reporter-plus/jshint')))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter(require('reporter-plus/jscs').path));

  prodTasks = lazyPipe()
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.uglify())
    .pipe(plugins.add('_header.js', '/* HEYYYYY */\n', true))
    .pipe(plugins.concat('app.js', {newLine: ''}))
    .pipe(plugins.rename({extname: '.min.js'}))
    .pipe(plugins.rev())
    .pipe(plugins.sourcemaps.write());

  return gulp.src(paths.src + '/scripts/**/*.js')
    .pipe(checks())
    .pipe(plugins.if(isProd, prodTasks()))
    .pipe(gulp.dest(paths.dest + '/scripts'));
});

gulp.task('build-css', function() {
  var checks,
      prodTasks;

  checks = lazyPipe()
    .pipe(plugins.csshint())
    .pipe(plugins.csshint.reporter(require('reporter-plus/csshint')));

  prodTasks = lazyPipe()
    .pipe(plugins.postcss([
        require('cssnano')()
      ])
    .pipe(plugins.add('_header.css', cfg.banner, true))
    .pipe(plugins.concat('app.css', {newLine: ''}))
    .pipe(plugins.rename({extname: '.min.css'}))
    .pipe(plugins.rev())

  return gulp.src(paths.src + '/styles/**/*.css')
    .pipe(checks())
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.postcss([
        require('postcss-import')(),
        require('postcss-each')(),
        require('postcss-for')(),
        require('postcss-nested')(),
        require('postcss-easings')(),
        require('postcss-clearfix')(),
        require('postcss-fakeid')(),
        require('cssnext')()
      ]))
    .pipe(plugins.if(isProd, prodTasks()))
    .pipe(plugins.sourcemaps.write())
    .pipe(gulp.dest(paths.dest + '/styles'));
});

gulp.task('build-images', function() {
  return gulp.src(paths.src + '/images/**/*.{jpg,jpeg,gif,png}')
    .pipe(plugins.if(isProd, plugins.imagemin()))
    .pipe(gulp.dest(paths.dest + '/images'));
});

gulp.task('build-svg', function() {
  return gulp.src(paths.src + '/svg/**/*.svg')
    .pipe(plugins.svgstore(cfg.taskOptions.svgstore))
    .pipe(plugins.if(isProd, plugins.svgmin()))
    .pipe(gulp.dest(paths.dest + '/svg'));
});

gulp.task('build-html', function() {
  var prodTasks;

  prodTasks = lazyPipe()
    .pipe(plugins.htmlmin({
        removeComments: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        preserveLineBreaks: true,
        removeAttributeQuotes: true,
        collapseBooleanAttributes: true,
        removeRedundantAttributes: true,
      }))

  return gulp.src(paths.src + '/*.html')
    .pipe(plugins.htmlReplace())
    .pipe(plugins.processhtml(cfg.taskOptions.processhtml))
    .pipe(plugins.if(isProd, prodTasks()))
    .pipe(gulp.dest(paths.dest));
});

gulp.task('build-misc', function() {
  return gulp.src([
      '**/**',
      '!scripts/**/*.js',
      '!styles/**/*.css',
      '!images/**/*.{jpg,jpeg,gif,png}',
      '!svg/**/*.svg',
      '!**/*.html'
    ])
  .pipe(gulp.dest(paths.dest));
});

