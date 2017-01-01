'use strict';

const convert = require('./convert');

module.exports.handler =
  (event, context, callback) =>
    convert()
      .then(data => callback(null, data))
      .catch(callback);
