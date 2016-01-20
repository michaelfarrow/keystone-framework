
var gulp          = require('gulp'),
    nodedev       = require('node-dev'),
    child_process = require('child_process'),
    livereload    = require('gulp-livereload'),
    sequence      = require('run-sequence'),
    _             = require('underscore'),
    cache         = require('gulp-cached'),
    jshint        = require('gulp-jshint'),
    jshint_s      = require('jshint-stylish'),
    modernizr     = require('gulp-modernizr'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat');

var modernizrTests = [];

var vendorJs = [];
var projectJs = [
  'models/**/*.js',
  'routes/**/*.js',
  'updates/**/*.js',
  'index.js',
  'gulpfile.js',
];
var frontEndFiles = [
  'public/**/*.*',
  'templates/**/*.*',
];

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
  return gulp.src(_.map(projectJs, function(files){
    return path.base().append(files).s();
  }))
  .pipe(jshint())
  .pipe(jshint.reporter(jshint_s))
  .pipe(jshint.reporter('fail'));
});

//
// gulp.task('build', [
//   'concat-vendor-js',
//   'custom-modernizr',
//   'lint-js',
// ]);
//
// gulp.task('default', [
//   'build',
// ]);

var child, busy, loaded = false;

var server = function(cb) {
  if (busy) return;

  var errorCallback = function(){
    child = null;
    if(cb) cb();
  };

  function spawn() {
    child = child_process.fork('index.js', {
      cwd: process.cwd(),
      env: process.env
    });

    child.on('exit', errorCallback);

    child.on('message', function(m){
      if(m == 'loaded'){
        loaded = true;
        child.removeListener('exit', errorCallback);

        gulp.src(_.map(projectJs, function(files){
          return path.base().append(files).s();
        }))
          .pipe(cache('server'))
          .pipe(livereload());

        // wait for half a second while keystone handles the request,
        // otherwise if a change is made in this time and the task is
        // restarted, the connection will be dropped and livereload
        // will turn off in the browser
        if(cb) setTimeout(cb, 500);
      }
    });

    busy = false;
  }

  if (child) {
    busy = true;
    child.once('exit', spawn);
    if(loaded) {
      child.send('exit');
    } else {
      child.kill();
    }
  } else {
    spawn();
  }
};

gulp.task('server', server);

gulp.task('frontend', function(callback) {
  return gulp.src(_.map(frontEndFiles, function(files){
    return path.base().append(files).s();
  }))
    .pipe(cache('frontend'))
    .pipe(livereload());
});

gulp.task('build', function(callback) {
  sequence('lint-js', 'server', callback);
});

gulp.task('watch', function() {

  livereload.listen();

  gulp.watch(_.map(projectJs, function(files){
    return path.base().append(files).s();
  }), ['build']);

  gulp.watch(_.map(frontEndFiles, function(files){
    return path.base().append(files).s();
  }), ['frontend']);

  server();

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
  },

  not: function() {
    if (this.path[0] != '!')
    this.path = '!' + this.path;

    return this;
  }

};
