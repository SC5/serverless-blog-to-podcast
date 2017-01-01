'use strict';

const list = require('./list');

module.exports.handler =
  (event, context, callback) =>
    list()
      .then(data => callback(null, data))
      .catch(callback);
