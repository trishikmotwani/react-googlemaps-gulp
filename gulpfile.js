var gulp = require('gulp'); // 1
var browserify = require('browserify'); //2
var babelify = require('babelify'); //3
var source = require('vinyl-source-stream'); //4
var concat = require('gulp-concat');
var gls = require('gulp-live-server');

var paths = {
    main_js : [ 'src/index.js' ],
    css : [ 'src/**/*.*css' ],
    js : [ 'src/**/*.js*' ]
    };
// gulp.task('default', function () {
//  return browserify('./src/index.js')
//  .transform(babelify)
//  .bundle()
//  .pipe(source('app.js'))
//  .pipe(gulp.dest('./build/'));
// });

gulp.task('js', function() {
    //Browserify bundles the JS.
    return browserify(paths.main_js)
        .transform(babelify) //  transpiles es6 to es5
        .bundle()
        .on('error', (err)=>{
        console.log('JS Error', err);
    })
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('static/js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('css', function(callback) {
    return gulp.src('src/**/*.*css')
    .pipe(concat('main.css'))
    .pipe(gulp.dest('static/css/'))
    .pipe(gulp.dest('public/'));
});

gulp.task('dev', gulp.series('css', 'js' , function () {
    // Generic watch tasks for SASS and Browserify
    gulp.watch(paths.css, gulp.series('css'));
    gulp.watch(paths.js, gulp.series('js'));

    // Start the app server.
    var server = gls('src/server/server.js', { stdio : 'inherit' });
    server.start();

    // Reload server when backend files change.
    gulp.watch([ 'src/server/**/*.js' ], function() {
        server.start.bind(server)();
    });

    // Notify server when frontend files change.
    gulp.watch(['src/**/*.{css,js,html}' ], function(file) {
        server.notify(file);
    });
}));