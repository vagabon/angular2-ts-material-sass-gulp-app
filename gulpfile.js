'use strict';

var GulpConfig = (function () {
    function gulpConfig() {
        this.urlDev        = "http://localhost:8080";
        this.urlProd       = "http://78.234.236.36:8080";
        this.port		   = 3000,
        this.files 		   = ['**/*.html', '**/*.scss', '**/*.js'];
        this.source        = './app/';
        this.build         = './dist/';
        this.mainScss	   = this.source + '/css/main.scss';
        this.fontsFiles	   = this.source + '/fonts/*.*';
        this.i18nFiles	   = this.source + '/i18n/*.json';
        this.listFilesTS   = this.source + '/**/*.ts';
        this.listFilesSCSS = this.source + '/**/**/*.scss';
        this.listFilesHTML = this.source + '/**/*.html';
        this.cssOutputPath = this.build  + '/css';
        this.tsOutputPath  = this.build  + '/js';
        this.i18nOutputPath= this.build  + '/i18n';
        this.typings       =  './tools/typings/';
        this.typingsFiles  = './tools/typings/**/*.ts';
    }
    return gulpConfig;
})();

// Prequisites
var gulp        = require('gulp');
var debug       = require('gulp-debug');
var replace     = require('gulp-replace-path');
var inject      = require('gulp-inject');
var tsc         = require('gulp-typescript');
var tslint      = require('gulp-tslint');
var sourcemaps  = require('gulp-sourcemaps');
var del         = require('del');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var uglify      = require('gulp-uglify');
var connect     = require('gulp-connect');
var open        = require('gulp-open');
var tsProject   = tsc.createProject('tsconfig.json');

var config = new GulpConfig();

gulp.task('clean', function (cb) {
    return del("./dist/*", cb);
});

gulp.task('styles', function() {
    gulp.src(config.mainScss)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(config.cssOutputPath))
        .pipe(connect.reload());
    gulp.src(config.fontsFiles).pipe(gulp.dest(config.cssOutputPath)).pipe(connect.reload());
    gulp.src(config.i18nFiles).pipe(gulp.dest(config.i18nOutputPath)).pipe(connect.reload());
});

gulp.task('views', function() {
    gulp.src([config.listFilesHTML]).pipe(gulp.dest(config.build)).pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch([config.listFilesTS],   ['ts-lint', 'build-ts-dev-urlprod']);
    gulp.watch([config.listFilesSCSS], ['styles']);
    gulp.watch([config.i18nFiles],     ['styles']);
    gulp.watch([config.listFilesHTML], ['views']);
});

gulp.task('ts-lint', function () {
    return gulp.src(config.listFilesTS).pipe(tslint()).pipe(tslint.report('prose')).pipe(connect.reload());
});

function getTs(prod) {
    var sourceTsFiles = [config.listFilesTS, config.typingsFiles];
    var tsResult = gulp.src(sourceTsFiles).pipe(tsc(tsProject));
    tsResult = prod ? tsResult.js.pipe(uglify()) : tsResult.js;
    return tsResult.pipe(gulp.dest(config.tsOutputPath)).pipe(connect.reload());
}

function injectSettings(prod, forceUrlProd) {
    return gulp.src("./dist/js/settings.js")
        .pipe(replace('@URL@', prod || forceUrlProd ? config.urlProd : config.urlDev))
        .pipe(replace('\'@PROD@\'', prod))
        .pipe(gulp.dest("./dist/js/"));
}

gulp.task('compile-ts', function () {
    return getTs(false);
});

gulp.task('compile-ts-prod', function () {
    //return getTs(true);
    return getTs(false);
});
gulp.task('build-ts-dev', [ 'compile-ts' ], function () {
    return injectSettings(false, false);
});
gulp.task('build-ts-dev-urlprod', [ 'compile-ts' ], function () {
    return injectSettings(false, true);
});
gulp.task('build-ts-prod', [ 'compile-ts-prod' ], function () {
    return injectSettings(true, false);
});


gulp.task('hackNodeSass', [ 'clean' ], function() {
    return gulp.src("./node_modules/ng2-material/source/core/style/layout.scss")
        .pipe(replace('@media screen \\0', '@media #{"screen\\0"}'))
        .pipe(gulp.dest("./node_modules/ng2-material/source/core/style"));
});

gulp.task('build', [ 'hackNodeSass' ], function() {
    return gulp.start('ts-lint', 'build-ts-dev', 'styles', 'views');
});

gulp.task('buildProd', [ 'hackNodeSass' ], function() {
    return gulp.start('ts-lint', 'build-ts-prod', 'styles', 'views');
});

function connectServer() {
    process.stdout.write('Starting glub-connect...\n');
    connect.create;
    connect.server({
        hostname: 'localhost',
        port: config.port,
        fallback: 'index.html',
        livereload: true,
    });
    gulp.src('index.html').pipe(open({uri: 'http://localhost:3000/'}));
}

gulp.task( 'serve', ['build', 'watch'], function() {
    connectServer();
});

gulp.task('serve-urlprod', ['build-ts-dev', 'watch'], function() {
    gulp.start('build-ts-dev-urlprod');
    connectServer();
});
gulp.task('serve-prod', ['build-ts-prod', 'watch'], function() {
    connectServer();
});

gulp.task('prod', ['buildProd']);

gulp.task('default', ['build']);