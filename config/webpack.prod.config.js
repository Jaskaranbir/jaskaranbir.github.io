const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')

const baseWebpackConfig = require('./webpack.base.config');

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    chunkFilename: '[id].[chunkhash].js'
  },

  optimization: {
    mergeDuplicateChunks: true,
    minimize: true,
    namedModules: true,
    removeAvailableModules: true,
    removeEmptyChunks: true
  },

  plugins: [
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
    })
  ]
});
