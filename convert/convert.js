'use strict';

const textToSpeech = require('./text-to-speech');
const AWS = require('aws-sdk');
const striptags = require('striptags');
const path = require('path');
const Entities = require('html-entities').XmlEntities;

const entities = new Entities();

const s3 = new AWS.S3();

/**
 * Converts blog text to mp3 and saves to S3 bucket
 * @param event
 * @returns {Promise.<string>}
 */
module.exports = (event) => {
  const s3data = event.Records[0].s3;
  const id = path.basename(s3data.object.key, '.json');

  let json;

  return s3.getObject({
    Bucket: s3data.bucket.name,
    Key: s3data.object.key,
  }).promise()
    .then((data) => {
      json = JSON.parse(data.Body);
      const text = entities.decode(striptags(json.description));
      return textToSpeech(`${json.title}. ${text}`);
    })
    .then(data => s3.putObject({
      Bucket: process.env.PODCAST_BUCKET,
      Key: `${id}.mp3`,
      Body: data.AudioStream,
      ContentType: 'audio/mpeg',
    }).promise())
    .then(() => `${id}.mp3 created`);
};