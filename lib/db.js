'use strict';

const AWS = require('aws-sdk');

const config = {
  region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1',
};

const baseParams = {
  TableName: process.env.TABLE_NAME,
};

const dynamodb = new AWS.DynamoDB.DocumentClient(config);

const putItem = data =>
  dynamodb.put(Object.assign({}, baseParams, { Item: data })).promise();

// const updateItem = data =>
//   dynamodb.update(Object.assign({}, baseParams, { Item: data })).promise();

const getList = () =>
  dynamodb.scan(Object.assign({}, baseParams, {
    AttributesToGet: [
      'id',
      'title',
      'creator',
      'date',
    ],
  })).promise()
    .then((data => data.Items || []));

module.exports = {
  putItem,
  getList,
};
