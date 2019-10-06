'use strict';

const pkg = require('../../package.json');

const config = {
  name: pkg.name,
  description: pkg.description,
  implementationVersion: pkg.version
};


module.exports = {
  config
};
