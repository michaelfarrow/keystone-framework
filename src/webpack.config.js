
var _                 = require('lodash');
var webpack           = require('webpack');
var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var isProduction = process.argv.indexOf('-p') >= 0;

var config = {
  entry: {
    app: './public/js/app.js',
  },
  output: {
    path: __dirname + '/public/bundle',
    filename: '[name].js',
    publicPath: '/bundle/',
  },
  resolve: {
    root: [
      __dirname,
      path.resolve('public/css'),
    ],
  },
  module: {
    loaders: [
      { test: /.(woff(2)?|eot|ttf|svg|otf)(\?[a-z0-9=\.]+)?$/, loader: 'file?name=fonts/[name].[ext]' },
    ],
    preLoaders: [
      {
        test: /\.jsx?$/,
        loaders: ['eslint'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: '[name].js',
    }),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: [
    require('postcss-import')({
      addDependencyTo: webpack
    }),
    require('precss'),
    require('postcss-assets')({
      basePath: 'public/',
      cachebuster: true,
      loadPaths: ['img/'],
    }),
    require('postcss-color-mix'),
    require('postcss-color-function'),
    require('postcss-responsive-type'),
    require('postcss-responsive-images'),
    require('postcss-media-minmax'),
    require('lost'),
    require('autoprefixer')({
      browsers: ['last 2 versions', '> 5%', 'ie >= 8', 'Firefox > 2', 'Opera > 5']
    }),
    require('postcss-font-magician')({
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
  watchOptions: {
    poll: 300,
  },
  devServer: {
    proxy: {
      '*': {
        target: 'http://web:80',
        secure: false,
      },
    },
  },
};

if(isProduction) {
  console.log('Building for production');

  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.(p)?css$/, loader: ExtractTextPlugin.extract('style', 'css!postcss') },
  ]);

  config.plugins = _.union(config.plugins, [
    new ExtractTextPlugin('[name].css'),
  ]);

} else {
  console.log('Building for development');

  config.devtool = 'source-map';

  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.(p)?css$/, loader: 'style!css!postcss' },
  ]);

}

module.exports = config;

process.on('SIGINT', function(){
  console.log('got SIGINT, exiting');
  process.exit();
});
