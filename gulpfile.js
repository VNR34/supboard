const {src, dest} = require('gulp');
const browserSync = require('browser-sync').create();
const scss = require('gulp-sass')(require('sass'));
const csso = require('gulp-csso');
const autoprefixer = require('gulp-autoprefixer');
const cleancss = require('gulp-clean-css');
const webpcss = require('gulp-webpcss');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify-es').default;
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const htmlmin = require('gulp-htmlmin');
const webphtml = require('gulp-webp-html');
const del = require('del');
const gulp = require('gulp');



function browsersync() {
    browserSync.init({
        server: 'dist'
    });
}

function html() {
    return src('src/**/*.html')
    .pipe(webphtml())
    .pipe(htmlmin({
        collapseWhitespace: true
    }))
    .pipe(dest('dist/'))
    .pipe(browserSync.stream());
}

function styles() {
    return src('src/scss/style.scss')
        .pipe(scss())
        .pipe(autoprefixer({
            overrideBrowserList: ['last 5 versions'],
            cascade: true
        }))
        .pipe(csso())
        .pipe(webpcss())
        .pipe(cleancss({
            compatibility: 'ie8'
        }))
        .pipe(concat('style.min.css'))
        .pipe(dest('dist/css'))
        .pipe(browserSync.stream());
}

function scripts() {
    return src('src/js/**/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js'))
        .pipe(browserSync.stream());
}

function images() {
    return src('src/images/**/*')
        .pipe(webp({
            quality: 80
        }))
        .pipe((imagemin({
            progressive: true,
            svgoPlugins: [{remiveViewBox: false}],
            optimizationLevel: 3    //0 to 7
        })))    
        .pipe(dest('dist/images'))
        .pipe(browserSync.stream());
}

function icon() {
    return src('src/icons/**/*')
        .pipe(dest('dist/icons'))
        .pipe(browserSync.stream());
}

function fonts() {
    return src('src/fonts/**/*')
        .pipe(dest('dist/fonts'));
}
//функция отслеживания изменений
function watcher() {
    gulp.watch(['src/**/*.html'], html);
    gulp.watch(['src/scss/**/*.scss'], styles);
    gulp.watch(['src/js/**/*.js', '!app/js/main.min.js'], scripts);
    gulp.watch(['src/images/**/*'], images);
    gulp.watch(['src/icons/**/*'], icon);
}

//функция очистки папки dist перед окончательной сборкой
function cleanDist() {
    return del('dist');
}


let dev = gulp.series(gulp.parallel(html, styles, scripts, images, icon, fonts));
let developer = gulp.parallel(browsersync, dev, watcher);

exports.html = html;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.icon = icon;
exports.fonts= fonts;

exports.dev = dev; 
exports.default = developer;

exports.build = gulp.series(cleanDist, dev);


// External: http://192.168.31.236:3000 -прописав этот адрес (нужно смотреть при запуске) на устройстве 
//подключенному к Wi-Fi оно также автоматически будет обновляятся при изменении в проекте
/*
если мы отслеживаем за несколькими файлами JS, то необходимо указать
return src([
    'расположение файла который отслеживаем',
    'app/js/main.js
])
*/

//1* для запуска окончательной сборки пишем gulp build