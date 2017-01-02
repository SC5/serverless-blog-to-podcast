'use strict';

const textToSpeech = require('./text-to-speech');
const AWS = require('aws-sdk');
const striptags = require('striptags');

const s3 = new AWS.S3();

module.exports = (event) => {
  const s3data = event.Records[0].s3;
  return s3.getObject({
    Bucket: s3data.bucket.name,
    Key: s3data.object.key,
  }).promise()
    .then((data) => {
      const json = JSON.parse(data.Body);
      return textToSpeech(`${json.title}. ${striptags(json.description)}`);
    })
    .then(data => s3.putObject({
      Bucket: process.env.PODCAST_BUCKET,
      Key: `${s3data.object.key}.mp3`,
      Body: data.AudioStream,
      ContentType: 'audio/mpeg',
    }).promise())
    .then(() => `${s3data.object.key}.mp3 created`);
}

