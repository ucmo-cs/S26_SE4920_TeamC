"use strict";

const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  region: 'us-east-1',
  endpoint: process.env.DYNAMODB_ENDPOINT,
});
const { authenticateToken } = require("../middleware/auth");

const handler = async (event) => {
  // Skip this check for now to allow database initialization. Remove in prod.
  // Check if user has ADMIN role
  /*
  if (!event.user || !event.user.roles || !event.user.roles.includes('ADMIN')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Admin access required" }),
    };
  }
  */

  try {
    // Load data from import-data.json
    const dataPath = path.join(__dirname, '../../import-data.json');
    const rawData = fs.readFileSync(dataPath, 'utf8');
    const { users, projects, dailyReports, authorization } = JSON.parse(rawData);

    // Import users
    for (const user of users) {
      const params = {
        TableName: process.env.USERS_TABLE || "users",
        Item: user,
      };
      await dynamoDb.put(params).promise();
    }

    // Import projects
    for (const project of projects) {
      const params = {
        TableName: process.env.PROJECTS_TABLE || "projects",
        Item: project,
      };
      await dynamoDb.put(params).promise();
    }

    // Import daily reports
    for (const report of dailyReports) {
      const params = {
        TableName: process.env.DAILY_STATUS_TABLE || "daily-status",
        Item: report,
      };
      await dynamoDb.put(params).promise();
    }
    
    // Import authorization data
    for (const auth of authorization) {
      const params = {
        TableName: process.env.AUTH_TABLE || "authorization",
        Item: auth,
      };
      await dynamoDb.put(params).promise();
    }


    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Data imported successfully",
        usersImported: users.length,
        projectsImported: projects.length,
        dailyReportsImported: dailyReports.length,
      }),
    };
  } catch (error) {
    console.error("Error importing data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to import data" }),
    };
  }
};

module.exports.handler = async (event) => {
  //const authError = authenticateToken(event);
  // To avoid being able to log in, skip authentication so that the database can be initiated. Remove this function in prod.
  const authError = false
  if (authError) {
    return authError;
  }
  return handler(event);
};
