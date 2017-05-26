var webpack = require('webpack');
var WebpackCleanupPlugin = require('webpack-cleanup-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  entry: {
    app: './src/main'
  },
  output: {
    path: __dirname + '/../dist_res',
    filename: '[name].[hash].js',
    publicPath: './dist_res/'
  },

  module: {
    loaders: [
      {
        // For injecting generated hashed image names into HTML
        test: /\.html$/,
        use: [{
          loader: "html-loader"
        }]
      },

      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: "css-loader!postcss-loader",
          publicPath: ''
        })
      },

      {
        test: /\.(woff2?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader?name=fonts/[name].[hash:7].[ext]"
      },

      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'file-loader?name=images/[name].[hash:7].[ext]'
      }
    ]
  },

  stats: {
    colors: true
  },

  plugins: [
    new ExtractTextPlugin("[name].[contenthash].css"),

    new webpack.ProvidePlugin({
      $: 'jquery',
    }),

    new WebpackCleanupPlugin()
  ]
};

module.exports = config;
