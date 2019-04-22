const webpack = require('webpack');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    app: './src/main'
  },
  target: 'web',

  output: {
    path: `${__dirname}/../dist_res`,
    filename: '[name].[hash].js',
    publicPath: './dist_res/'
  },

  module: {
    rules: [
      {
        // For injecting generated hashed image names into HTML
        test: /\.html$/,
        use: [{
          loader: 'html-loader'
        }]
      },

      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './'
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            }
          },
          'postcss-loader'
        ]
      },

      {
        test: /\.(woff2?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader?name=fonts/[name].[hash:7].[ext]'
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
    new WebpackCleanupPlugin(),

    new webpack.ProvidePlugin({
      $: 'jquery'
    }),

    new MiniCssExtractPlugin({
      filename: '[name].[hash].css'
    })
  ]
};
