// подключаем встроенные методы gulp
const { series, parallel, src, dest, watch } = require('gulp');

// подключаем плагины
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const uglify = require('gulp-uglify');
const gulpIf = require('gulp-if');
const cssnano = require('gulp-cssnano');
const del = require('del');
const autoprefixer = require('gulp-autoprefixer');
const htmlmin = require('gulp-htmlmin');
const changed = require('gulp-changed');
const tinypng = require('gulp-tinypng-compress');
const cache = require('gulp-cache');

// декларируем задачи
function views() {
    return src('./app/views/*.pug')
        .pipe(changed('./dist/', {extension: '.pug'}))
        .pipe(pug({pretty:true}))
        .pipe(dest('./app/'));
}
function preprocessing () {
    return src('./app/sass/*.sass')
      .pipe(changed('./app/', {extension: '.sass'}))  
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .pipe(dest('./app/css'));
}

function imageTreatment () {
    return src('./app/images/**/*.+(svg|gif)')
        .pipe(dest('./dist/images'));    
}

function imageCompress () {
    return src('./app/images/**/*.+(jpg|png|jpeg)')
        .pipe(cache(tinypng({
            key: 'vf9y2BXWjtrR4q9KYClwYp1hnMHYtqJj',
            sigFile: './app/images/.tinypng-sigs',
            log: true
        })))
        .pipe(dest('./dist/images'));    
}

function userefFunction () {
    return src('./app/index.html')
        .pipe(changed('./dist/', {extension: '.js'}))
        .pipe(changed('./dist/', {extension: '.css'}))
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(htmlmin({ collapseWhitespace: true, removeComments: true }))
        .pipe(dest('./dist/'))
        .pipe(browserSync.stream());
}

function fonts () {
    return src('./app/fonts/**/*')
        .pipe(dest('./dist/fonts'));
}

async function cleanDist () {
    await del('dist');
}

async function cacheClear () {
    await cache.clearAll();
}

function browserInit () {
    browserSync.init({
        server: { baseDir: 'dist' },
        });

    watch('./app/sass/*.sass', preprocessing);
    watch('./app/views/*.pug', views);
    watch('./app/index.html', userefFunction);
    watch('./app/css/**.css', userefFunction);
    watch('./app/js/**/*.js', userefFunction);
    watch('./app/fonts/**/*', fonts);
    watch('./app/images/**/*.+(svg|gif)', imageTreatment);
    watch('./app/images/**/*.+(jpg|png|jpeg)', imageCompress);
}

exports.default = series(cleanDist,
                        views,
                        preprocessing,
                        fonts,
                        imageTreatment,
                        imageCompress,
                        userefFunction, 
                        browserInit);

exports.clear = cacheClear;                        