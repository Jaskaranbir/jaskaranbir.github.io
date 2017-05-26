var webpack = require('webpack');
var baseWebpackConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var PurifyCSS = require('purifycss-webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var webpackConfig = merge(baseWebpackConfig, {
  output: {
    chunkFilename: '[id].[chunkhash].js'
  },

  plugins: [
    new PurifyCSS({
      "styleExtensions": [
        '.css'
      ],

      verbose: true,
      "paths": [
        __dirname + '/../src/*.html',
        __dirname + '/../src/scripts/*.js'
      ],

      "purifyOptions": {
        "info": true,
        "minify": true,
        "rejected": false
      }
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: false
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      dead_code: true,
      comments: false
    })
  ]
});

module.exports = webpackConfig;
