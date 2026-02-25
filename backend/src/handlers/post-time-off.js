'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.USERS_TABLE,
    Item: requestBody
  };

  const command = new UpdateCommand({
    TableName: 'users',
    Key: {
      uuid: this.user.uuid
    },
    UpdateExpression: "ADD #attr :value",
    ExpressionAttributeNames: {
      "#attr": "requestedPTO"
    },
    ExpressionAttributeValues: {
      ":value": new Set([this.user.requestedPTO])
    },
    ReturnValues: "UPDATED_NEW"
  });
  try {
    await docClient.send(command);
  } catch (err) {
    console.error('Error saving to the backend.', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}