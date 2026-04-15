'use strict';

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const uuid = event?.pathParameters?.uuid;

    if (!uuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing user id' })
      };
    }

    const body = event?.body ? JSON.parse(event.body) : {};
    const roles = Array.isArray(body.roles) ? body.roles : null;

    if (!roles) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Roles must be an array' })
      };
    }

    const params = {
      TableName: process.env.USERS_TABLE || 'users',
      Key: { uuid },
      UpdateExpression: 'SET roles = :roles',
      ExpressionAttributeValues: {
        ':roles': roles
      },
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamoDb.update(params).promise();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(result.Attributes || {})
    };
  } catch (error) {
    console.error('Error updating user roles:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to update user roles' })
    };
  }
};
