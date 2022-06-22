// подключаем встроенные методы gulp
const { series, parallel, src, dest, watch } = require('gulp');

// подключаем плагины
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();

// декларируем задачи
function views() {
    return src('./app/views/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(dest('./app/'));
        // .pipe(browserSync.stream());
}
function preprocessing () {
    return src('./app/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('./app/css'));
      // .pipe(browserSync.stream());
      /* выражение аналогично pipe(browserSync.stream())
      .pipe(browserSync.reload({
        stream: true
      }));
      */
}
function htmlTransfer () {
    return src('./app/index.html')
    .pipe(dest('./dist/'))
    .pipe(browserSync.stream());
}

function cssTransfer () {
    return src('./app/css/*.css')
    .pipe(dest('./dist/css/'))
    .pipe(browserSync.stream());
}

function browserInit () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        });

    watch('./app/sass/*.sass', preprocessing);
    watch('./app/views/*.pug', views);
    watch('./app/index.html', htmlTransfer);
    watch('./app/css/*.css', cssTransfer);        
}

exports.default = browserInit; 