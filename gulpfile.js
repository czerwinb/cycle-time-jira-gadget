let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let babelify = require('babelify');

function streamBrowserify() {
    return browserify({
        'entries': ['src/main/javascript/metrics-calculator.js'],
        'debug': true,
        'transform': [
            babelify.configure({
                'presets': ['es2015']
            })
        ]
    });
}

function build() {
    return streamBrowserify()
        .bundle()
        .on('error', function (e) {
            console.error(e);
            this.emit('end');
        })
        .pipe(source('metrics-calculator-bundle.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('target/classes/js'));
}

gulp.task('build', build);
gulp.task('default', ['build']);
