var webpack = require('webpack');
var baseWebpackConfig = require('./webpack.base.config');
var merge = require('webpack-merge');
var PurifyCSS = require('purifycss-webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

var webpackConfig = merge(baseWebpackConfig, {
  output: {
    chunkFilename: '[id].[chunkhash].js'
  },

  plugins: [
    new ExtractTextPlugin("[name].[contenthash].css"),

    new OptimizeCSSPlugin(),

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
