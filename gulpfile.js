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
// const tinypng = require('gulp-tinypng-compress');

// декларируем задачи
function views() {
    return src('./app/views/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(dest('./app/'));
}
function preprocessing () {
    return src('./app/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({cascade: false}))
      .pipe(dest('./app/css'));
}

function imageTreatment () {
    return src('./app/images/**/*.+(jpg|svg|png|gif)')
        .pipe(dest('./dist/images'));    
}

function userefFunction () {
    return src('./app/index.html')
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

function browserInit () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        });

    watch('./app/sass/*.sass', preprocessing);
    watch('./app/views/*.pug', views);
    watch('./app/index.html', userefFunction);
    watch('./app/css/**.css', userefFunction);
    watch('./app/js/**/*.js', userefFunction);
    watch('./app/fonts/**/*', fonts);
    watch('./app/images/**/*.+(jpg|svg|png|gif)', imageTreatment);
}

exports.default = series(cleanDist,
                        views,
                        preprocessing,
                        fonts,
                        imageTreatment,
                        userefFunction, 
                        browserInit);