const path = require('path');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const ROOT_DIR = __dirname;
const config = {
  entry: {
    'simplepicker': './lib/simplepicker.css',
    'simplepicker.min': './lib/index.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(ROOT_DIR, 'dist'),
  },
  context: ROOT_DIR,
  target: 'web',
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new webpack.HashedModuleIdsPlugin(),
    new MiniCSSExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  ]
};

config.module = {};
config.module.rules = [
  {
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: { presets: ['@babel/env'] }
    }
  },
  {
    test: /\.css$/,
    use: [
      MiniCSSExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          sourceMap: true,
          minimize: true
        }
      },
    ]
  }
];

module.exports = config;
