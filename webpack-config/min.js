const basConfig = require('./base-config');

const config = Object.assign(basConfig, {});
config.entry = {
  'simplepicker': './lib/simplepicker.css',
  'simplepicker.min': './lib/index.js'
};

module.exports = config;
