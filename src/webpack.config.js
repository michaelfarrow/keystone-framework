
var webpack = require('webpack');

module.exports = {
  entry: './public/js/app.js',
  output: {
    path: __dirname + '/public/js',
    filename: 'app.min.js'
  },
};

process.on('SIGINT', function(){ process.exit(); });
