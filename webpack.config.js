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
    resolve: {
      extensions: [ '.css', '.ts', '.js' ]
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
    },{
      test: /\.ts$/,
      use: 'ts-loader',
      exclude: /node_modules/
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

    // build a commonjs format file for comsption with
    // build tools like webpack, and rollup.
    let nodeConfig = { output: {} };
    nodeConfig.output.libraryTarget = 'commonjs2';
    nodeConfig.entry = {
      'simplepicker.node': './lib/index.js'
    };

    config = [ config, { ...config, ...nodeConfig } ];
  } else {
    config.output.publicPath = '/dist/';
  }

  return config;
};
