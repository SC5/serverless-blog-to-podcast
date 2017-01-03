'use strict';

const list = require('./list');

const response = (error, data) => {
  if (error) {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        error,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    body: JSON.stringify(data),
  };
};

module.exports.handler =
  (event, context, callback) =>
    list()
      .then(data => callback(null, response(null, data)))
      .catch(error => callback(null, response(error)));
