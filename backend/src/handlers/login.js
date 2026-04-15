"use strict";

const AWS = require("aws-sdk");
// Change to correct endpoint for aws
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: "us-east-1" || "localhost",
  endpoint: process.env.DYNAMODB_ENDPOINT || "http://localhost:8000",
});

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.AUTH_TABLE || "authorization",
    Key: {
      uuid: requestBody.username,
    },
  };

  
  // have a sucure access token for auth to access database.
  // Need session token
  try {
    const data = await dynamoDb.get(params).promise();

    console.log(data.Item);    

    if (!data.Item || data.Item.password !== requestBody.password) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          message: "Invalid username or password",
          auth: false,
          sessionToken: ""
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
