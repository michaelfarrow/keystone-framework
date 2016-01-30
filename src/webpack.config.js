
var _                 = require('lodash');
var webpack           = require('webpack');
var path              = require('path');
var autoprefixer      = require('autoprefixer');
var fontmagician      = require('postcss-font-magician');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.argv.indexOf('-p') >= 0;

var config = {
  devtool: '#eval-source-map',
  entry: [
    'webpack-hot-middleware/client?reload=true',
    '/src/public/js/app.js',
  ],
  output: {
    path: __dirname + '/bundle',
    filename: '[name].js',
    publicPath: '/bundle/',
  },
  resolve: {
    root: [
      __dirname,
      path.resolve('public/sass'),
      path.resolve('public/css'),
    ],
  },
  module: {
    loaders: [
      { test: /.(woff(2)?|eot|ttf|svg|otf)(\?[a-z0-9=\.]+)?$/, loader: 'file?name=fonts/[name].[ext]' },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: [
    autoprefixer({
      browsers: ['last 2 versions', '> 5%', 'ie >= 8', 'Firefox > 2', 'Opera > 5']
    }),
    fontmagician({
      formats: 'woff2 woff eot ttf svg otf',
      // hosted: '../fonts/',
      // custom: {
      //   'FontFamily': {
      //     variants: {
      //       400: {
      //         normal: {
      //           url: {
      //             eot:   '../fonts/webfont.eot',
      //             svg:   '../fonts/webfont.svg',
      //             ttf:   '../fonts/webfont.ttf',
      //             woff:  '../fonts/webfont.woff',
      //             woff2: '../fonts/webfont.woff2',
      //           },
      //         },
      //       },
      //     },
      //   },
      // },
    }),
  ],
};

if(isProduction) {
  console.log('Building for production');
  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
    { test: /\.scss$/, loader: ExtractTextPlugin.extract('style', 'css!postcss!sass') },
  ]);
  config.plugins = _.union(config.plugins, [
    new ExtractTextPlugin('[name].css'),
  ])
} else {
  console.log('Building for development');
  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.css$/, loader: 'style!css!postcss' },
    { test: /\.scss$/, loader: 'style!css!postcss!sass' },
  ]);
}

module.exports = config;

process.on('SIGINT', function(){ process.exit(); });
