'use strict';

const convert = require('./convert');

module.exports.handler =
  (event, context, callback) =>
    convert(event)
      .then(data => callback(null, data))
      .catch(callback);
