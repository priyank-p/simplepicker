const path = require('path');
const webpack = require('webpack');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');

const ROOT_DIR = __dirname;
module.exports = function (env) {
  const production = env === 'production';
  let config = {
    entry: {
      simplepicker: [ 
        './lib/simplepicker.css',
        './lib/index.js'
      ]
    },
    output: {
      filename: '[name].js',
      path: path.resolve(ROOT_DIR, 'dist'),
      library: 'SimplePicker',
      libraryTarget: 'var'
    },
    context: ROOT_DIR,
    target: 'web',
    mode: production ? 'production' : 'development',
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
      test: /\.css$/,
      use: [
        MiniCSSExtractPlugin.loader,
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
            minimize: production
          }
        },
      ]
    }
  ];

  if (production) {
    config.module.rules.push({
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: { presets: ['@babel/env'] }
      }
    });

    let browserConfig = Object.assign(config, {});
    let nodeConfig = Object.assign(config, {});
    nodeConfig.output.libraryTarget = 'commonjs2';
    nodeConfig.entry = {
      'simplepicker.node': './lib/index.js'
    };

    config = [ browserConfig, nodeConfig ]
  } else {
    config.output.publicPath = '/dist/';
  }

  return config;
};
