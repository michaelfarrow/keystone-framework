
var gulp          = require('gulp'),
    Queue         = require('gulp-queue')(gulp),
    child_process = require('child_process'),
    livereload    = require('gulp-livereload'),
    sequence      = require('run-sequence'),
    _             = require('underscore'),
    cache         = require('gulp-cached'),
    jshint        = require('gulp-jshint'),
    jshint_s      = require('jshint-stylish'),
    modernizr     = require('gulp-modernizr'),
    uglify        = require('gulp-uglify'),
    concat        = require('gulp-concat'),
    favicons      = require('gulp-favicons');

var config = {
  modernizr: {
    options: [
      'setClasses',
      'addTest',
      'html5printshiv',
      'testProp',
      'fnBind'
    ],
    tests: []
  },
  files: {
    js: {
      vendor: [],
      backend: {
        watch: [
          'models/**/*.js',
          'routes/**/*.js',
          'updates/**/*.js',
          'index.js',
          'gulpfile.js',
        ],
        ignore: []
      },
      frontend: {
        watch: [
          'public/js/**/*.js',
        ],
        ignore: [
          'public/js/vendor/**/*.js',
        ]
      },
    },
    assets: {
      watch: [
        'public/sass/**/*.scss',
        'templates/**/*.jade',
      ]
    }
  }
};

var queue = new Queue();

function handleError(err) {
  this.emit('end');
}

function handleErrorWithMessage(err) {
  console.log(err);
  this.emit('end');
}

gulp.task('generate-favicons', function(){
  gulp.src(path.public().append('img/favicon.png').s())
    .pipe(favicons({
      background: '#FFFFFF',
      path: '/img/favicons/',
      display: 'browser',
      orientation: 'portrait',
      logging: false,
      online: false,
      html: path.templates().append('includes/favicons.html').s(),
      replace: true,
      icons: {
        android: true,
        appleIcon: true,
        appleStartup: true,
        coast: true,
        favicons: true,
        firefox: true,
        opengraph: false,
        twitter: false,
        windows: true,
        yandex: true,
        }
    }))
    .pipe(gulp.dest(path.images().append('favicons').s()));
});

gulp.task('concat-vendor-js', function(){

  return gulp.src(_.map(config.files.js.vendor, function(file){
    return path.node_modules(file).s();
  }))
  .pipe(concat('all.js'))
  .pipe(uglify())
  .pipe(gulp.dest(path.js().vendor().s()));
});

gulp.task('custom-modernizr', function() {

  return gulp.src(path.base().append('index.js').s())
  .pipe(modernizr({
    options: config.modernizr.options,
    tests: config.modernizr.tests,
  }))
  .pipe(uglify())
  .pipe(gulp.dest(path.js().vendor().s()));
});

gulp.task('lint-frontend-js', function() {
  return gulp.src(frontendJS)
  .pipe(jshint())
  .pipe(jshint.reporter(jshint_s))
  .pipe(livereload());
});

gulp.task('lint-backend-js', function() {
  return gulp.src(backendJS)
  .pipe(jshint())
  .pipe(jshint.reporter(jshint_s));
});

gulp.task('build', [
  'generate-favicons',
  'concat-vendor-js',
  'custom-modernizr',
  'lint-backend-js',
  'lint-frontend-js',
]);

gulp.task('default', [
  'build',
]);

var child, busy, loaded = false;

var server = function(cb) {
  if (busy) return;

  var exitCallback = function(){
    child = null;
    if(cb) setTimeout(cb, 500);
  };

  function spawn() {
    child = child_process.fork('index.js', {
      cwd: process.cwd(),
      env: process.env
    });

    child.on('exit', exitCallback);

    child.on('message', function(m){
      if(m == 'loaded'){
        loaded = true;
        child.removeListener('exit', exitCallback);

        gulp.src(backendJS)
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

gulp.task('assets', function(callback) {
  return gulp.src(_.map(config.files.assets.watch, function(files){
    return path.base().append(files).s();
  }))
    .pipe(cache('assets'))
    .pipe(livereload());
});

gulp.task('backend', function(callback) {
  sequence('lint-backend-js', 'server', callback);
});

gulp.task('frontend', ['lint-frontend-js']);

gulp.task('watch', function() {

  livereload.listen();

  gulp.watch(backendJS, queue(['backend']));
  gulp.watch(frontendJS, queue(['frontend']));

  gulp.watch(_.map(config.files.assets.watch, function(files){
    return path.base().append(files).s();
  }), queue(['assets']));

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

path.templates = function() {
  return path.base().append('templates');
};

// path.sass = function() {
//     return path.public().append('scss');
// };

// path.css = function() {
//     return path.public().append('css');
// };

path.images = function() {
    return path.public().append('img');
};

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

var backendJS = _.map(config.files.js.backend.watch, function(files){
  return path.base().append(files).s();
}).concat(_.map(config.files.js.backend.ignore, function(files){
  return path.base().append(files).not().s();
}));

var frontendJS = _.map(config.files.js.frontend.watch, function(files){
  return path.base().append(files).s();
}).concat(_.map(config.files.js.frontend.ignore, function(files){
  return path.base().append(files).not().s();
}));
