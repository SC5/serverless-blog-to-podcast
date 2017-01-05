'use strict';

const AWS = require('aws-sdk');
const Podcast = require('podcast');

const s3 = new AWS.S3();

const striptags = require('striptags');
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();


/**
 * Creates and saves podcast xml
 * @param items
 * @returns {Promise.<TResult>}
 */
module.exports = (items) => {
  const feed = new Podcast({
    title: 'SC5 Podcast',
    feed_url: `https://${process.env.PODCAST_BUCKET}.s3.amazonaws.com/rss.xml`,
    site_url: 'https://sc5.io/blog/',
    language: 'en',
    ttl: 1,
    itunesOwner: {
      name: 'SC5',
      email: 'blog@sc5.io',
    },
    itunesCategory: [{
      text: 'Technology',
      subcats: [{
        text: 'Tech News',
      }],
    }],
    itunesImage: 'https://logo.sc5.io/images/sc5logo-dark-outline-3399x1440.png',
  });

  items.forEach((item) => {
    if (item) {
      const title = striptags(item.title);
      const description = entities.decode(striptags(item.description));
      const date = item.date;
      const url = `https://${process.env.PODCAST_BUCKET}.s3.amazonaws.com/${item.id}.mp3`;
      feed.item({
        title,
        description,
        url,
        date,
        enclosure: { url },
        author: item.creator,
        itunesSubtitle: title,
        itunesDuration: 1,
        itunesKeywords: ['technology'],
      });
    }
  });

  const xml = feed.xml();

  return s3.putObject({
    Bucket: process.env.PODCAST_BUCKET,
    Key: 'rss.xml',
    Body: xml,
    ContentType: 'application/rss+xml',
  }).promise()
    .then(() => xml);
};
