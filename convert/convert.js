'use strict';

module.exports = (event) => new Promise((resolve, reject) => {
  console.log(event);
  return resolve('OK!');
});