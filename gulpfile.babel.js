import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import rename from 'gulp-rename';
import imagemin from 'gulp-imagemin';
import cleanCSS from 'gulp-clean-css';
import pug from 'gulp-pug';
import plumber from 'gulp-plumber';
import browserSync from 'browser-sync';
import postcss from 'gulp-postcss'
import del from 'del';
import sourcemaps from 'gulp-sourcemaps'
import purgecss from 'gulp-purgecss';
const atImport = require("postcss-import");


const server = browserSync.create();


// paths
const paths = {
    styles: {
        src: 'src/assets/styles/**/*.{sass, scss, css}',
        dest: 'dist/assets/styles/'
    },
    scripts: {
        src: 'src/assets/scripts/**/*.js',
        dest: 'dist/assets/scripts/'
    },
    images: {
        src: 'src/assets/images/**/*.{jpg,jpeg,png,svg}',
        dest: 'dist/assets/img/'
    },
    views: {
        src: 'src/template/**/*.pug',
        dest: 'dist'
    }
};



function reload(done) {
    server.reload();
    done();
}

function serve(done) {
    server.init({
        server: './dist'

    });
    watchFiles()
    done();
}
/*
 * For small tasks you can export arrow functions
 */
export const clean = () => del(['dist']);

/*
 * You can also declare named functions and export them as tasks
 */
export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(sourcemaps.write('./maps'))

        .pipe(gulp.dest(paths.styles.dest))
        .pipe(cleanCSS())
        // pass in options to the stream
        .pipe(rename({
            basename: 'main',
            suffix: '.min'
        }))
        .pipe(gulp.dest(paths.styles.dest))
        .pipe(server.stream());

}

export function scripts() {
    return gulp.src(paths.scripts.src, {
            sourcemaps: true
        })
        //.pipe(babel())
        //.pipe(uglify())
        //.pipe(concat('main.min.js'))
        .pipe(server.stream())

        .pipe(gulp.dest(paths.scripts.dest));
}

function views() {
    return gulp.src(paths.views.src)
        .pipe(plumber())
        .pipe(pug({
            pretty: true
        }))
        .pipe(server.stream())

        .pipe(gulp.dest(paths.views.dest))

}


function images() {
    return gulp.src(paths.images.src, {
            since: gulp.lastRun(images)
        })
        .pipe(imagemin({
            optimizationLevel: 5
        }))
        .pipe(gulp.dest(paths.images.dest));
}
/*
 * You could even use `export as` to rename exported tasks
 */
function watchFiles() {
    gulp.watch(paths.scripts.src, gulp.series(scripts, reload));
    gulp.watch(paths.views.src, gulp.series(views, reload));
    gulp.watch(paths.styles.src, gulp.series(styles, reload));
    gulp.watch(paths.images.src, gulp.series(images, reload));
}
export {
    watchFiles as watch
};

const build = gulp.series(clean, views, gulp.parallel(styles, scripts), images, serve);
/*
 * Export a default task
 */
export default build;
