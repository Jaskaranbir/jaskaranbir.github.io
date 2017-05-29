var baseWebpackConfig = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var PurifyCSS = require('purifycss-webpack');

var webpackConfig = merge(baseWebpackConfig, {
  watch: true,

  plugins: [
    new ExtractTextPlugin("[name].[hash].css"),

    new PurifyCSS({
      "styleExtensions": [
        '.css'
      ],

      verbose: true,
      "paths": [
        __dirname + '/../src/*.html',
        __dirname + '/../src/scripts/*.js'
      ],
    }),

    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html',
      inject: true
    })
  ]
});

module.exports = webpackConfig;
