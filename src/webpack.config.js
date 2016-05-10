
var _                 = require('lodash');
var webpack           = require('webpack');
var path              = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var ManifestPlugin    = require('webpack-manifest-plugin');

var isProduction = process.argv.indexOf('-p') >= 0;

var config = {
  entry: {
    app: './public/js/app.js',
  },
  output: {
    path: __dirname + '/public/bundle',
    filename: isProduction ? '[name]_[hash].js' : '[name].js',
    publicPath: '/bundle/',
  },
  resolve: {
    root: [
      __dirname,
      path.resolve('public/css'),
    ],
  },
  module: {
    loaders: [],
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
      filename: isProduction ? '[name]_[hash].js' : '[name].js',
    }),
    new webpack.NoErrorsPlugin(),
  ],
  postcss: function (webpack) {
    return [
      require('postcss-import')({
        addDependencyTo: webpack
      }),
      require('precss'),
      require('postcss-assets')({
        basePath: 'public/',
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
      require('postcss-cachebuster')({
        imagesPath: '/public',
        cssPath: '/public/css',
      }),
    ];
  },
  watchOptions: {
    poll: 300,
  },
  devServer: {
    proxy: {
      '*': {
        target: 'http://localhost:' + (process.env.PORT || 8080),
        secure: false,
      },
    },
  },
};

if(isProduction) {
  console.log('Building for production');

  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.(p)?css$/, loader: ExtractTextPlugin.extract('style', 'css?-url!postcss') },
  ]);

  config.plugins = _.union(config.plugins, [
    new ExtractTextPlugin('[name]_[hash].css'),
    new ManifestPlugin({
      basePath: '/bundle/',
    }),
  ]);

} else {
  console.log('Building for development');

  config.devtool = 'source-map';

  config.module.loaders = _.union(config.module.loaders, [
    { test: /\.(p)?css$/, loader: 'style!css?-url!postcss' },
  ]);

}

module.exports = config;

process.on('SIGINT', function(){
  console.log('got SIGINT, exiting');
  process.exit();
});
