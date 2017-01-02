'use strict';

const db = require('../lib/db');

module.exports = () =>
  db.getList().then((items) => {
    const sortedItems = items.sort((a, b) => {
      if (a.date < b.date) {
        return -1;
      } else if (a.date > b.date) {
        return 1;
      }
      return 0;
    });
    return sortedItems
      .reverse()
      .map((item) => {
        const url = `https://${process.env.PODCAST_BUCKET}.s3.amazonaws.com/${item.id}.mp3`;
        return Object.assign({}, item, { url });
      });
  });
