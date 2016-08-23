'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminPngquant = require('imagemin-pngquant');
const gulpsync = require('gulp-sync')(gulp);
const del = require('del');
const plugins = require('gulp-load-plugins')();
const webpack = require('webpack-stream');
const named = require('vinyl-named');

// Pug to Html
gulp.task('pug', () => {
  return gulp.src('src/dev/*.pug')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.pug({ pretty: true }))
  .pipe(gulp.dest('src'));
});

// SCSS to CSS
gulp.task('cleanCss', () => {
  return del('src/css');
});

gulp.task('scss', ['cleanCss'], () => {
  return gulp.src('src/dev/style.scss')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.sourcemaps.init())
  .pipe(plugins.scss())
  .pipe(plugins.autoprefixer([
    'last 2 Chrome versions',
    'last 2 Firefox versions',
    'last 2 Opera versions',
    'last 2 Safari versions',
    'Explorer >= 10',
    'last 2 Edge versions',
    ],
    { cascade: false }
  ))
  .pipe(plugins.csscomb('./.csscomb.json'))
  .pipe(gulp.dest('src/css'))
  .pipe(plugins.cssnano())
  .pipe(plugins.rename({ suffix: '.min' }))
  .pipe(plugins.sourcemaps.write())
  .pipe(gulp.dest('src/css'));
});

// ES2016 to common JS
// TODO: need stop this task after its finish
gulp.task('cleanSript', () => {
  return del('src/js');
});

gulp.task('script', ['cleanSript'], () => {
  return gulp.src('src/dev/script.js')
  .pipe(plugins.plumber({
    errorHandler: plugins.notify.onError(err => ({
      title: 'Webpack',
      message: err.message
    }))
  }))
  .pipe(named())
  .pipe(webpack(require('./webpack.config.js')))
  .pipe(plugins.rename({ suffix: '.min' }))
  .pipe(gulp.dest('src/js'));
});

// Html and CSS linters
gulp.task('htmllint', () => {
  gulp.src('src/*.html')
  .pipe(plugins.plumber({ errorHandler: plugins.notify.onError() }))
  .pipe(plugins.htmlhint.reporter('htmlhint-stylish'))
  .pipe(plugins.htmlhint.failReporter({ suppress: true }));
});

gulp.task('csslint', () => {
  gulp.src('src/css/*')
    .pipe(plugins.csslint())
    .pipe(plugins.csslint.reporter())
});

// Images optimization
gulp.task('cleanImg', () => {
  return del('src/img');
});

gulp.task('img', ['cleanImg'], () => {
  return gulp.src(['src/common/img/*', 'src/blocks/*/img/*'])
  .pipe(plugins.imagemin([
    plugins.imagemin.gifsicle({
      interlaced: true,
      optimizationLevel: 3
    }),
    imageminJpegRecompress({
      loops: 4,
      min: 50,
      max: 80,
      quality: 'high',
      strip: true,
      progressive: true
    }),
    imageminPngquant({quality: '50-80'}),
    plugins.imagemin.svgo({ removeViewBox: true })
  ]))
  .pipe(gulp.dest('src/img'));
});

// Create icons sprite
gulp.task('cleanIcon', () => {
  return del('src/icon');
});

// Png-sprite
gulp.task('pngSprite', ['cleanIcon'], () => {
  var spriteData = gulp.src(['src/common/icon/*', 'src/blocks/*/icon/*'],)
    .pipe(plugins.spritesmith({
      imgName: 'sprite.png',
      cssName: '_sprite.scss',
      cssFormat: 'scss',
      algorithm: 'left-right',
      padding: 20,
      cssTemplate: 'src/common/scss/_sprite-template.scss'
    }));

  spriteData.img.pipe(gulp.dest('src/icon'));
  spriteData.css.pipe(gulp.dest('src/common/scss'));
});

// Svg-sprite
gulp.task('svgSprite', ['cleanIcon'], () => {
  return gulp.src(['src/common/icon/*', 'src/blocks/*/icon/*'])
    .pipe(plugins.svgSprites({
      cssFile: 'scss/_sprite.scss',
      preview: false,
      layout: 'horizontal',
      padding: 0,
      svg: { sprite: '../../icon/sprite.svg' },
      templates: {
        css: require('fs').readFileSync('src/common/scss/sprite-template.scss', 'utf-8')
      }
    }))
    .pipe(gulp.dest('src/common'));
});

// Build task
gulp.task('cleanBuild', () => {
  return del('build');
});

gulp.task('build', ['cleanBuild'], () => {
  let html = gulp.src('src/*.html')
  .pipe(gulp.dest('build'));

  let css = gulp.src('src/css/*')
  .pipe(gulp.dest('build'));

  let script = gulp.src(['src/js/*'])
  .pipe(gulp.dest('build'));

  let img = gulp.src(['src/img/**/*'])
  .pipe(gulp.dest('build/img'));

  let icon = gulp.src(['src/icon/*'])
  .pipe(gulp.dest('build/icon'));

  let fonts = gulp.src('src/fonts/**/*')
  .pipe(gulp.dest('build/fonts'));

  let favicon = gulp.src(['src/favicon.*'])
  .pipe(gulp.dest('build'));
});

// Server and watch mode
// TODO: previously need start task 'script'
gulp.task('watch', gulpsync.sync(
  ['pngSprite', 'svgSprite', 'img','pug', 'scss', 'build']
), () => {
  browserSync.init({
    server: {
      baseDir: 'build',
      index: 'index.html'
    },
    notify: false
  });

  browserSync.watch('src/dev').on('change', () => {
    gulp.watch(
      ['src/dev/*.pug', 'src/dev/blocks/**/*.pug'],
      gulpsync.sync(['pug', 'build', browserSync.reload])
    );

    gulp.watch(
      ['src/dev/blocks/**/*.scss', 'src/dev/common/scss'],
      gulpsync.sync(['scss', 'build', browserSync.reload])
    );

    gulp.watch(
      ['src/dev/blocks/**/*.js', 'src/dev/common/js'],
      gulpsync.sync(['script', 'build', browserSync.reload])
    );

    gulp.watch(
      ['src/dev/common/icon/*', 'src/dev/blocks/*/icon/*'],
      ['pngSprite', 'svgSprite', 'scss', 'build', browserSync.reload]
    );

    gulp.watch(
      ['src/dev/common/img/*', 'src/dev/blocks/*/img/*'],
      ['img', 'build', browserSync.reload]
    );
  });
});

// Prepair for GitHub
gulp.task('github', () => {
  return gulp.src('build/**/**/*.*')
  .pipe(gulp.dest('./'));
});
