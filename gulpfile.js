'use strict';

var GulpConfig = (function () {
    function gulpConfig() {
        this.urlDev           = "http://localhost:8080";
        this.urlProd          = "http://78.234.236.36:8080";
        this.port		      = 3000,
        this.files 		      = ['**/*.html', '**/*.scss', '**/*.js'];
        this.vendor           = ["node_modules/es6-shim/es6-shim.min.js", "node_modules/systemjs/dist/system.js", "node_modules/angular2/bundles/http.dev.js",
                                "node_modules/angular2/bundles/router.dev.js", "node_modules/angular2/bundles/angular2-polyfills.js", "node_modules/rxjs/bundles/Rx.js",
                                "node_modules/angular2/bundles/angular2.dev.js", "node_modules/ng2-material/dist/ng2-material.js", "node_modules/ng2-translate/bundles/ng2-translate.js"];
        this.source           = './app/';
        this.build            = './dist/';
        this.mainScss	      = this.source + '/css/main.scss';
        this.fontsFiles	      = this.source + '/fonts/*.*';
        this.i18nFiles	      = this.source + '/i18n/*.json';
        this.listFilesTS      = this.source + '/**/*.ts';
        this.listFilesSCSS    = this.source + '/**/**/*.scss';
        this.listFilesHTML    = this.source + '/**/*.html';
        this.cssOutputPath    = this.build  + '/css';
        this.tsOutputPath     = this.build  + '/js';
        this.i18nOutputPath   = this.build  + '/i18n';
        this.vendorOutputPath = this.build  + '/js/lib';
        this.typings          =  './tools/typings/';
        this.typingsFiles     = './tools/typings/**/*.ts';
    }
    return gulpConfig;
})();

// Prequisites
var gulp        = require('gulp');
var replace     = require('gulp-replace-path');
var tsc         = require('gulp-typescript');
var tslint      = require('gulp-tslint');
var del         = require('del');
var sass        = require('gulp-sass');
var uglify      = require('gulp-uglify');
var connect     = require('gulp-connect');
var open        = require('gulp-open');
var tsProject   = tsc.createProject('tsconfig.json');

var config = new GulpConfig();

var prod = false;
var forceUrlProd = false;

gulp.task('clean', function (cb) {
    return del("./dist/*", cb);
});

gulp.task('styles', function() {
    gulp.src(config.mainScss).pipe(sass().on('error', sass.logError)).pipe(gulp.dest(config.cssOutputPath)).pipe(connect.reload());
    gulp.src(config.fontsFiles).pipe(gulp.dest(config.cssOutputPath)).pipe(connect.reload());
    gulp.src(config.i18nFiles).pipe(gulp.dest(config.i18nOutputPath)).pipe(connect.reload());
});

gulp.task('views', function() {
    gulp.src([config.listFilesHTML]).pipe(gulp.dest(config.build)).pipe(connect.reload());
});

gulp.task('ts-lint', function () {
    return gulp.src(config.listFilesTS).pipe(tslint()).pipe(tslint.report('prose')).pipe(connect.reload());
});

gulp.task('compile-ts', function () {
    // vendor
    gulp.src(config.vendor).pipe(gulp.dest(config.vendorOutputPath));
    gulp.src(['node_modules/ng2-material/**/*']).pipe(gulp.dest('dist/node_modules/ng2-material'));
    gulp.src(['node_modules/ng2-translate/**/*']).pipe(gulp.dest('dist/node_modules/ng2-translate'));
    var sourceTsFiles = [config.listFilesTS, config.typingsFiles];
    var tsResult = gulp.src(sourceTsFiles).pipe(tsc(tsProject));
    tsResult = prod == 0 ? tsResult.js.pipe(uglify()) : tsResult.js;
    return tsResult.pipe(gulp.dest(config.tsOutputPath)).pipe(connect.reload());
});

gulp.task('build-ts', [ 'compile-ts' ], function () {
    return gulp.src("./dist/js/settings.js")
        .pipe(replace('@URL@', prod || forceUrlProd ? config.urlProd : config.urlDev))
        .pipe(replace('\'@PROD@\'', prod))
        .pipe(gulp.dest("./dist/js/"));
});

gulp.task('watch', function() {
    gulp.watch([config.listFilesTS],   ['ts-lint', 'build-ts']);
    gulp.watch([config.listFilesSCSS], ['styles']);
    gulp.watch([config.i18nFiles],     ['styles']);
    gulp.watch([config.listFilesHTML], ['views']);
});

gulp.task('hackNodeSass', [ 'clean' ], function() {
    return gulp.src("./node_modules/ng2-material/source/core/style/layout.scss")
        .pipe(replace('@media screen \\0', '@media #{"screen\\0"}'))
        .pipe(gulp.dest("./node_modules/ng2-material/source/core/style"));
});

gulp.task('build', [ 'hackNodeSass' ], function() {
    return gulp.start('ts-lint', 'build-ts', 'styles', 'views');
});

gulp.task( 'connect', ['build', 'watch'], function() {
    process.stdout.write('Starting glub-connect...\n');
    connect.server({
        root: 'dist',
        hostname: 'localhost',
        port: config.port,
        fallback: './dist/index.html',
        livereload: true,
    });
    gulp.src('./app/index.html').pipe(open({uri: 'http://localhost:3000/'}));
});

gulp.task( 'serve', ['build', 'watch'], function() {
    gulp.start('connect');
});

gulp.task('serve-urlprod', function() {
    forceUrlProd = true;
    gulp.start('build', 'watch', 'connect');
});
gulp.task('serve-prod', function() {
    prod = true;
    gulp.start('build', 'watch', 'connect');
});

gulp.task('prod', function() {
    prod = true;
    gulp.start('build');
});

gulp.task('default', ['build']);