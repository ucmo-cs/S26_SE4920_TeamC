'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { authenticateToken } = require("../middleware/auth");

const handler = async (event) => {
  const userId = event.pathParameters.userId;

  const params = {
    TableName: process.env.USERS_TABLE,
    Key: {
      uuid: userId
    }
  };

  try {
    const result = await dynamoDb.get(params).promise();
    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(result.Item.requestedPTO || [])
    };
  } catch (err) {
    console.error('Error retrieving time off requests.', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' })
    };
  }
};

module.exports.handler = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }
  return handler(event);
};