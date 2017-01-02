'use strict';

const db = require('../lib/db');

module.exports = () =>
  db.getList().then((items) => {
    return items.map((item) => {
      const url = `https://${process.env.PODCAST_BUCKET}.s3.amazonaws.com/${item.id}.mp3`;
      return Object.assign({}, item, { url });
    });
  });
