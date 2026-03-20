"use strict";

// not working yet

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async () => {
  // add admin access only
  try {
    const params = {
      TableName: process.env.AUTH_TABLE || "auth",
    };

    const result = await dynamoDb.get(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Items || {}),
    };
  } catch (error) {
    console.error("Error fetching passwords:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to get passwords" }),
    };
  }
};
