'use strict';

var gulp = require('gulp'),
    $ = require('gulp-load-plugins')({
        pattern: ['gulp-*', 'gulp.*']
    }),
    browserSync = require('browser-sync'),
    autoprefixer = require('autoprefixer-core'),
    csswring = require('csswring'),
    mqpacker = require('css-mqpacker'),
    postcssNested = require('postcss-nested'),
    rimraf = require('rimraf');


/**
 * Configuration
 * @type {{SOURCE: string, DIST: string}}
 */
var CONFIG = {
    SOURCE: './src',
    DIST: './dist',
    TEMP: './.tmp'
};


/**
 * Global error-handler
 * @method handleError
 * @param {Object} err
 */
function handleError(err) {
    console.error(err.toString());
    this.emit('end');
}


/**
 * SCSS TASK
 */
gulp.task('scss', function () {

    var cssFilter = $.filter(['*.css']);

    $.util.log(
        $.util.colors.green('Compiling scss')
    );

    return gulp.src(CONFIG.SOURCE + '/scss/*.scss')
        .pipe($.sourcemaps.init())
        .pipe($.sass({
            errLogToConsole: true,
            outputStyle: 'nested'
        }))
        .on('error', handleError)
        .pipe($.rename({suffix: '.min'}))
        .pipe($.sourcemaps.write('.'))  // Create that map file
        .pipe(cssFilter) // Ignore the map file

        .pipe($.postcss([
            autoprefixer({browsers: ['last 2 versions']}),
            postcssNested,
            mqpacker,
            csswring({
                removeAllComments: true
            })
        ]))
        .pipe(cssFilter.restore()) // Unignore the map file
        .pipe(gulp.dest(CONFIG.DIST + '/css/'))
        .pipe(gulp.dest(CONFIG.TEMP + '/css/'))
        .pipe(browserSync.reload({stream: true}));
});


/**
 * USEMIN TASK
 */
gulp.task('usemin', function () {
    return gulp.src(CONFIG.SOURCE + '/*.html')
        .pipe($.sourcemaps.init())
        .pipe($.usemin(
            {
                html: [
                    $.minifyHtml({empty: true})
                ],
                js: [
                    $.rename({suffix: '.min'}),

                    $.ngAnnotate(),
                    $.uglify(),
                    $.sourcemaps.write('.')
                ]
            }))
        .pipe(gulp.dest(CONFIG.DIST));
});

/**
 * CLEAN TASK
 */
gulp.task('clean', function (cb) {
    rimraf(CONFIG.DIST, cb);
});


/**
 * BUILD TASK
 */
gulp.task('build', ['scss', 'usemin']);


/**
 * WATCH TASK
 */
gulp.task('watch', ['build'], function () {
    gulp.watch(CONFIG.SOURCE + '/scss/**/*.scss', ['scss']);
    gulp.watch(CONFIG.SOURCE + '/**/*.{js,html}').on('change', browserSync.reload);
});


/**
 * SERVE TASK
 */
gulp.task('serve', ['build'], function () {

    browserSync({
        server: {
            baseDir: [CONFIG.SOURCE, CONFIG.TEMP]
        }
    });

    gulp.start('watch');

});


/**
 * DEFAULT TASK
 */
gulp.task('default', ['clean'], function () {
    gulp.start('build');
});
