let gulp = require('gulp');
let sourcemaps = require('gulp-sourcemaps');
let source = require('vinyl-source-stream');
let buffer = require('vinyl-buffer');
let browserify = require('browserify');
let babelify = require('babelify');

function streamBrowserify(moduleName, moduleFilename) {
    return browserify({
        'entries': ['src/main/javascript/' + moduleFilename],
        'debug': true,
        'standalone': moduleName,
        'transform': [
            babelify.configure({
                'presets': ['es2015']
            })
        ]
    });
}

function bundleJSModule(moduleName, moduleFilename) {
    return () => {
        streamBrowserify(moduleName, moduleFilename)
            .bundle()
            .on('error', function (e) {
                console.error(e);
                this.emit('end');
            })
            .pipe(source(moduleFilename.replace('.js', '.bundle.js')))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('target/classes/js'));
    };
}

gulp.task('bundle-MetricsCalculator', bundleJSModule('MetricsCalculator', 'metrics-calculator.js'));
gulp.task('bundle-JiraStatusResolver', bundleJSModule('JiraStatusResolver', 'jira-status-resolver.js'));

gulp.task('default', ['bundle-MetricsCalculator', 'bundle-JiraStatusResolver']);
