"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const { authenticateToken } = require("../middleware/auth");

const handler = async (event) => {
  try {
    const params = {
      TableName: process.env.USERS_TABLE || "users",
    };

    const result = await dynamoDb.scan(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Items || []),
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch users" }),
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
