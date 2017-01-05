'use strict';

require('request');
const request = require('request-promise');
const crypto = require('crypto');
const AWS = require('aws-sdk');
const franc = require('franc');
const BbPromise = require('bluebird');
const parseString = BbPromise.promisify(require('xml2js').parseString);
const podcastFeed = require('./podcast-feed');

const s3 = new AWS.S3();

/**
 * Writes blog item to S3 if not yet exists
 * @param item
 * @returns {*}
 */
const writeItem = (item) => {
  const Key = `${item.id}.json`;
  const lang = franc.all(item.title, { whitelist: ['eng', 'fin'] })[0];

  if (lang[0] === 'fin') {
    return 0;
  }

  Object.assign(item, { lang: lang[0] });
  const params = {
    Bucket: process.env.BLOG_BUCKET,
    Key,
  };

  return s3.getObject(params).promise()
    .then(() => item)
    .catch(() =>
      s3.putObject(
        Object.assign(params, {
          Body: JSON.stringify(item),
          ContentType: 'application/json',
        })
      ).promise()
        .then(() => item));
};

/**
 * Loads rss feed, saves items and podcast xml to s3
 */
module.exports = () => new Promise((resolve, reject) => {
  request('https://sc5.io/blog/feed/')
    .then((data) => {
      parseString(data)
        .then((feed) => {
          const items = feed.rss.channel[0].item.map(item =>
            writeItem({
              title: item.title[0],
              creator: item['dc:creator'][0],
              date: (new Date(item.pubDate[0])).toJSON(),
              description: item.description[0],
              content: item['content:encoded'][0],
              guid: item.guid[0]._,
              id: crypto.createHash('md5').update(item.guid[0]._).digest('hex'),
            }));

          Promise.all(items)
            .then(podcastFeed)
            .then('ok')
            .catch(reject);
        });
    });
});
