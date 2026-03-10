"use strict";

const AWS = require("aws-sdk");
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.handler = async (event) => {
  try {
    const body = event?.body ? JSON.parse(event.body) : {};

    const params = {
      TableName: process.env.USERS_TABLE || "users",
      Item: {
        uuid: body.uuid,
        email: body.email,
        name: body.name,
      },
    };

    const result = await dynamoDb.put(params).promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(result.Attributes || {}),
    };
  } catch (error) {
    console.error("Error adding new user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to create user" }),
    };
  }
};
