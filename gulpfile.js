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
// const imagemin = require('gulp-tinypng-compress');

// декларируем задачи
function views() {
    return src('./app/views/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(dest('./app/'));
}
function preprocessing () {
    return src('./app/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('./app/css'));
}

// function imageTreatment () {
//     return src('./app/images/**/*.+(png|jpg|gif|svg)')
//         .pipe(imagemin())
//         .pipe(gulp.dest('dist/images'));
// }

function userefFunction () {
    return src('./app/index.html')
    .pipe(useref())
    .pipe(dest('./dist/'))
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(browserSync.stream());
}

function fonts () {
    return src('./app/fonts/**/*')
    .pipe(dest('./dist/fonts'))
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
    // watch('./app/images/**/*.+(png|jpg|gif|svg)', imageTreatment);
}

exports.default = browserInit; 
exports.test = fonts;