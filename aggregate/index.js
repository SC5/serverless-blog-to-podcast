'use strict';

const aggregate = require('./aggregate');

module.exports.handler =
  (event, context, callback) =>
    aggregate()
      .then(data => callback(null, data))
      .catch(callback);
