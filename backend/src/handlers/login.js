"use strict";

const AWS = require("aws-sdk");
// Change to correct endpoint for aws
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1" || "localhost",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  console.log(requestBody);

  const params = {
    TableName: process.env.AUTH_TABLE || "authorization",
    Key: {
      uuid: requestBody.username,
    },
  };

  try {
    const data = await dynamoDb.get(params).promise();

    if (!data.Item || data.Item.password !== requestBody.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid username or password",
          auth: false,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Login successful", auth: true }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", auth: false }),
    };
  }
};
