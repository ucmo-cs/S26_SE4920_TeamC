'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);
  const { userId, date, ptoRequest } = requestBody;

  if (!userId || !date || ptoRequest === undefined) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields' })
    };
  }

  const params = {
    TableName: process.env.USERS_TABLE || 'users',
    Key: {
      uuid: userId
    },
    UpdateExpression: 'SET #pto.#date = :val',
    ExpressionAttributeNames: {
      '#pto': 'requestedPTO',
      '#date': date
    },

    ExpressionAttributeValues: {
      ':val': ptoRequest
    },
    ReturnValues: 'UPDATED_NEW'
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes)
    };
  } catch (err) {
    console.error('Error saving to the backend.', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
}