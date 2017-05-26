var baseWebpackConfig = require('./webpack.base.config');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var merge = require('webpack-merge');


var webpackConfig = merge(baseWebpackConfig, {
  watch: true,

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: '../index.html',
      inject: true
    })
  ]
});

module.exports = webpackConfig;
