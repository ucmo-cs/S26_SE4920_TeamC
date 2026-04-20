"use strict";

const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
});

module.exports.handler = async (event) => {
  const requestBody = JSON.parse(event.body);

  const params = {
    TableName: process.env.AUTH_TABLE || "authorization",
    Key: {
      uuid: requestBody.username,
    },
  };

  
  // have a secure access token for auth to access database.
  // Need session token

  console.log("Received login request:", requestBody);
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

    // Get user roles from users table
    const userParams = {
      TableName: process.env.USERS_TABLE || "users",
      Key: {
        uuid: requestBody.username,
      },
    };
    const userData = await dynamoDb.get(userParams).promise();
    const roles = userData.Item ? userData.Item.roles || [] : [];

    // Generate JWT token
    const token = jwt.sign(
      { uuid: requestBody.username, roles: roles },
      process.env.JWT_SECRET || "default-secret-key",
      { expiresIn: "24h" }
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: "Login successful", 
        auth: true,
        sessionToken: token
      }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error", auth: false }),
    };
  }
};
