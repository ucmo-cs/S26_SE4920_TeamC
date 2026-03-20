"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const uuid = event?.pathParameters?.uuid;

    if (!uuid) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing user id" }),
      };
    }

    const params = {
      TableName: process.env.USERS_TABLE || "users",
      Key: { uuid },
    };

    const result = await dynamoDb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to fetch user" }),
    };
  }
};
