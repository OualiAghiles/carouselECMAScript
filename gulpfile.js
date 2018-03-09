var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var csslint = require('gulp-csslint');
var autoPrefixer = require('gulp-autoprefixer');
//if node version is lower than v.0.1.2
require('es6-promise').polyfill();
var cssComb = require('gulp-csscomb');
var cmq = require('gulp-merge-media-queries');
var cleanCss = require('gulp-clean-css');
var uglify = require('gulp-uglify');
gulp.task('sass',function(){
    gulp.src(['./src/assets/styles/**/*.sass'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(sass())
        .pipe(autoPrefixer())
        .pipe(cssComb())
        .pipe(cmq({log:true}))
        .pipe(csslint())
        .pipe(csslint.formatter())
        .pipe(gulp.dest('./dist/assets/styles'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cleanCss())
        .pipe(gulp.dest('./dist/assets/styles/'))
        .pipe(browserSync.stream())
});
gulp.task('js',function(){
    gulp.src(['src/assets/scripts/**/*.js'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./dist/assets/scripts'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('./dist/assets/scripts/'))
        .pipe(browserSync.stream())
});
gulp.task('template',function(){
    gulp.src(['src/template/**/*.html'])
        .pipe(plumber({
            handleError: function (err) {
                console.log(err);
                this.emit('end');
            }
        }))
        .pipe(gulp.dest('./dist/'))
        .pipe(browserSync.stream())
});
gulp.task('default',function(){
    browserSync.init({
        server: "dist/"
    });
    gulp.watch('./src/assets/scripts/**/*.js',['js']);
    gulp.watch('./src/assets/styles/**/*.sass',['sass']);
    gulp.watch('./src/template/**/*.html',['template']);
    gulp.watch('./src/assets/images/**/*',['image']);
});
