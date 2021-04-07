const {src, dest, watch, series, parallel} = require('gulp');
const sass = require('gulp-dart-sass');
const autoprefixer = require('gulp-autoprefixer');
const csso = require('gulp-csso');
const babel = require('gulp-babel');
const rename = require('gulp-rename');
const terser = require('gulp-terser');
const webpack = require('webpack-stream');
const sourcemaps = require('gulp-sourcemaps');
const del = require('del');
const mode = require('gulp-mode')();
const browserSync = require('browser-sync').create();

// Clean tasks
const clean = () => {
  return del(['dist']);
}
  
const cleanImages = () => {
  return del(['dist/assets/images']);
}

const cleanFonts = () => {
  return del(['dist/assets/fonts']);
}

// CSS task 
const css = () => {
  return src('src/scss/main.scss')
    .pipe(mode.development(sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(rename('main.css'))
    .pipe(mode.production( csso() ))
    .pipe(mode.development(sourcemaps.write()))
    .pipe(dest('dist/css'))
    .pipe(mode.development(browserSync.stream()));
}
// JS task
const js = () => {
  return src('src/**/*.js')
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(webpack({
    mode: 'development',
    devtool: '#inline-source-map'
  }))
  .pipe(mode.development(sourcemaps.init({
    loadMaps: true
  })))
  .pipe(rename('main.js'))
  .pipe(mode.production(terser({
    output: {
      comments: false
    }
  })))
  .pipe(mode.development(sourcemaps.write()))
  .pipe(dest('dist/js'))
  .pipe(mode.development(browserSync.stream()));
}

// Copy tasks
const copyImages = () => {
  return src('src/assets/images/**/*.{jpg,jpeg,png,svg,gif}')
  .pipe(dest('dist/assets/images'));
}

const copyFonts = () => {
    return src('src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}')
    .pipe(dest('dist/assets/fonts'));
}

// Watch tast
const watchForChanges = () => {
  browserSync.init({
    server: {
      baseDir: './'
    }
  });
  
  watch('src/scss/**/*.scss', css);
  watch('src/**/*.js', js)
  watch('**/*.html').on('change', browserSync.reload);
  watch('src/assets/images/**/*.{jpg,jpeg,png,svg,gif}', series(cleanImages, copyImages));
  watch('src/assets/fonts/**/*.{svg,eot,ttf,woff,woff2}', series(cleanFonts, copyFonts));
}

// Exports tasks
exports.default = series(clean, parallel(css, js, copyImages, copyFonts), watchForChanges);
exports.build = series(clean, parallel(css, js, copyImages, copyFonts));