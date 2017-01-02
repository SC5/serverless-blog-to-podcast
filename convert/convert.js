'use strict';

const textToSpeech = require('./text-to-speech');
const AWS = require('aws-sdk');
const striptags = require('striptags');
const path = require('path');
const db = require('../lib/db');

const s3 = new AWS.S3();

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
      return textToSpeech(`${json.title}. ${striptags(json.description)}`);
    })
    .then(data => s3.putObject({
      Bucket: process.env.PODCAST_BUCKET,
      Key: `${id}.mp3`,
      Body: data.AudioStream,
      ContentType: 'audio/mpeg',
    }).promise())
    .then(() => db.putItem({
      id,
      title: json.title,
      date: json.date,
      creator: json.creator,
    }))
    .then(() => `${id}.mp3 created`);
};
