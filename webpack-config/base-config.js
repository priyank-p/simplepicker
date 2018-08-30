const path = require('path');
const webpack = require('webpack');

const ROOT_DIR = path.resolve(__dirname, '..');
const config = {
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
  }
];

module.exports = config;
