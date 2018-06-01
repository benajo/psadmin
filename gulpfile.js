"use strict";

var gulp = require('gulp');
var connect = require('gulp-connect'); // runs local dev server
var open = require('gulp-open'); // open a url in a web browser
var browserify = require('browserify'); // bundles js
var reactify = require('reactify'); // transforms react jsx to js
var source = require('vinyl-source-stream');  // use conventional text streams with gulp
var concat = require('gulp-concat'); // concats files
var eslint = require('gulp-eslint'); // lint js and jsx files

var config = {
    port: 9005,
    devBaseUrl: 'http://localhost',
    paths: {
        html: 'src/*.html',
        js: 'src/**/*.js',
        images: 'src/images/*',
        css: [
            'node_modules/bootstrap/dist/css/bootstrap.min.css',
            'node_modules/bootstrap/dist/css/bootstrap-theme.min.css',
            'node_modules/toastr/toastr.css',
        ],
        dist: 'dist',
        mainJs: 'src/main.js'
    }
}

// start a local dev server
gulp.task('connect', () => {
    connect.server({
        root: ['dist'],
        port: config.port,
        base: config.devBaseUrl,
        livereload: true
    });
});

gulp.task('open', ['connect'], () => {
    gulp.src('dist/index.html')
        .pipe(open({ uri: `${config.devBaseUrl}:${config.port}/` }));
});

gulp.task('html', () => {
    gulp.src(config.paths.html)
        .pipe(gulp.dest(config.paths.dist))
        .pipe(connect.reload());
});

gulp.task('js', () => {
    browserify(config.paths.mainJs)
        .transform(reactify)
        .bundle()
        .on('error', console.error.bind(console))
        .pipe(source('bundle.js'))
        .pipe(gulp.dest(`${config.paths.dist}/scripts`))
        .pipe(connect.reload());
});

gulp.task('css', () => {
    gulp.src(config.paths.css)
        .pipe(concat('bundle.css'))
        .pipe(gulp.dest(`${config.paths.dist}/css`));
});

gulp.task('lint', () => {
    return gulp.src(config.paths.js)
        .pipe(eslint({ config: '.eslint.config.json' }))
        .pipe(eslint.format());
});

// Migrates images to dist folder
// Note that I could even optimize my images here
gulp.task('images', () => {
    gulp.src(config.paths.images)
        .pipe(gulp.dest(config.paths.dist + '/images'))
        .pipe(connect.reload());

    //publish favicon
    gulp.src('src/favicon.ico')
        .pipe(gulp.dest(config.paths.dist));
});

gulp.task('watch', () => {
    gulp.watch(config.paths.html, ['html']);
    gulp.watch(config.paths.js, ['js', 'lint']);
});

gulp.task('default', ['html', 'js', 'css', 'images', 'lint', 'open', 'watch']);
