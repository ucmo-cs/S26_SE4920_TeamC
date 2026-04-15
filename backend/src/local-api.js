'use strict';

const express = require('express');
const cors = require('cors');
const AWS = require('aws-sdk');

const app = express();
app.use(cors());
app.use(express.json());

const region = process.env.AWS_REGION || 'us-east-1';
AWS.config.update({ region });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE || 'users';
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || 'projects';
const basePath = process.env.LOCAL_API_BASE_PATH || '/dev';

function buildPath(path) {
  return `${basePath}${path}`;
}

app.get(buildPath('/users'), async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: USERS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

app.get(buildPath('/users/:uuid'), async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await dynamoDb.get({
      TableName: USERS_TABLE,
      Key: { uuid }
    }).promise();

    if (!result.Item) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(result.Item);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});

app.put(buildPath('/users/:uuid/roles'), async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const roles = Array.isArray(req.body?.roles) ? req.body.roles : null;

    if (!roles) {
      res.status(400).json({ message: 'Roles must be an array' });
      return;
    }

    const result = await dynamoDb.update({
      TableName: USERS_TABLE,
      Key: { uuid },
      ConditionExpression: 'attribute_exists(#uuid)',
      UpdateExpression: 'SET #roles = :roles',
      ExpressionAttributeNames: {
        '#roles': 'roles',
        '#uuid': 'uuid'
      },
      ExpressionAttributeValues: {
        ':roles': roles
      },
      ReturnValues: 'ALL_NEW'
    }).promise();

    res.json(result.Attributes || {});
  } catch (error) {
    console.error('Error updating user roles:', error);
    if (error && error.code === 'ConditionalCheckFailedException') {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(500).json({
      message: 'Failed to update user roles',
      details: error?.message || 'Unknown error'
    });
  }
});

app.get(buildPath('/projects'), async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: PROJECTS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ message: 'Failed to fetch projects' });
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}${basePath}`);
});
