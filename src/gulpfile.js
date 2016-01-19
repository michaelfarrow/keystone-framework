
var gulp       = require('gulp'),
    livereload = require('gulp-livereload'),
    _          = require('underscore'),
    jshint     = require('gulp-jshint'),
    jshint_s   = require('jshint-stylish'),
    modernizr  = require('gulp-modernizr'),
    uglify     = require('gulp-uglify'),
    concat     = require('gulp-concat');

var modernizrTests = [];

var vendorJs = [];

function handleError(err) {
    this.emit('end');
}

function handleErrorWithMessage(err) {
    console.log(err);
    this.emit('end');
}

gulp.task('concat-vendor-js', function(){

    return gulp.src(_.map(vendorJs, function(file){
        return path.node_modules(file).s();
    }))
        .pipe(concat('all.js'))
        .pipe(uglify())
        .pipe(gulp.dest(path.js().vendor().s()));
});

gulp.task('custom-modernizr', function() {

    return gulp.src(path.base().append('index.js').s())
        .pipe(modernizr({
            options: [
                'setClasses',
                'addTest',
                'html5printshiv',
                'testProp',
                'fnBind'
            ],
            tests: modernizrTests
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.js().vendor().s()));
});

gulp.task('lint-js', function() {
    // return gulp.src([
 //            path.js().append('/**/*.js').s(),
 //            '!' + path.js().vendor().append('*.js').s()
 //        ])

    return gulp.src([
            path.base().append('*.js').s()
        ])
        .pipe(jshint())
        .pipe(jshint.reporter(jshint_s))
        .pipe(jshint.reporter('fail'));
});


gulp.task('build', [
    'concat-vendor-js',
    'custom-modernizr',
    'lint-js',
]);

gulp.task('default', [
    'build',
]);

gulp.task('test', function(){
    return gulp.src(path.base().append('gulpfile.js').s())
        .pipe(livereload());
});

gulp.task('watch', function() {

    livereload.listen();

    // .pipe(plugins.livereload())

 //    gulp.watch(path.sass().append('*.scss').s(), ['compile-compass']);

    gulp.watch([
        path.base().append('gulpfile.js').s()
    ], ['test']);

//    gulp.watch([
//        path.base().append('*.js').s()
//    ], ['lint-js']);
});

process.on('SIGINT', function(){ process.exit(); });

function path(p, f){
    if(f) f = '/' + f;
    this.path = p + path.format(f);
}

path.base = function() {
    return new path('.');
};

path.public = function() {
    return path.base().append('public');
};

path.node_modules = function(p) {
    return path.base().append('node_modules').append(p);
};

// path.sass = function() {
//     return path.public().append('scss');
// };

// path.css = function() {
//     return path.public().append('css');
// };

// path.images = function() {
//     return path.public().append('img');
// };

// path.fonts = function() {
//     return path.public().append('fonts');
// };

path.js = function() {
    return path.public().append('js');
};

path.format = function(p) {
    if(!p) return '';
    return p;
};

path.prototype = {

    path: '',

    toString: function(){
        return this.path;
    },

    s: function(){
        return this.toString();
    },

    append: function(p) {
        return new path(this.path, p);
    },

    vendor: function() {
        return this.append('vendor');
    }

};
