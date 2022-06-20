// подключаем встроенные методы gulp
const { series, parallel, src, dest, watch } = require('gulp');

// подключаем плагины
const sass = require('gulp-sass')(require('sass'));
const pug = require('gulp-pug');

// декларируем задачи шаблонизатора и препроцессинга
function views() {
    return src('./app/views/*.pug')
        .pipe(pug({pretty:true}))
        .pipe(dest('./dist/'));
}

function preprocessing () {
    return src('./app/sass/*.sass')
      .pipe(sass().on('error', sass.logError))
      .pipe(dest('./dist/css'));
}

// регистрируем задачу по шаблонизации и препроцессингу с отслеживанием файлов
exports.viewsWatch = function() {
        watch('./app/views/*.pug', views);
    };
    
exports.sassWatch = () => {
        watch('./app/sass/*.sass', preprocessing)
    };    