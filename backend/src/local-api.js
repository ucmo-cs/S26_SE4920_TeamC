"use strict";

const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const region = process.env.AWS_REGION || "us-east-1";
AWS.config.update({ region });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE || "users";
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || "projects";
const AUTH_TABLE = process.env.AUTH_TABLE || "authorization";
const basePath = process.env.LOCAL_API_BASE_PATH || "/dev";

function buildPath(path) {
  return `${basePath}${path}`;
}

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || "default-secret-key", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = decoded;
    next();
  });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || !req.user.roles || !req.user.roles.includes('ADMIN')) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// Login route without auth
app.post(buildPath("/login"), async (req, res) => {
  const requestBody = req.body;

  const params = {
    TableName: AUTH_TABLE,
    Key: {
      uuid: requestBody.username,
    },
  };

  console.log("Received login request:", requestBody);
  try {
    const data = await dynamoDb.get(params).promise();

    console.log(data.Item);    

    if (!data.Item || data.Item.password !== requestBody.password) {
      return res.status(401).json({
        message: "Invalid username or password",
        auth: false,
        sessionToken: ""
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { uuid: requestBody.username, roles: data.Item.roles || [] },
      process.env.JWT_SECRET || "default-secret-key",
      { expiresIn: "24h" }
    );

    return res.status(200).json({ 
      message: "Login successful", 
      auth: true,
      sessionToken: token
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error", auth: false });
  }
});

// JWT middleware for protected routes
const jwtMiddleware = jwt({
  secret: process.env.JWT_SECRET || "default-secret-key",
  algorithms: ["HS256"],
  credentialsRequired: true,
  getToken: function fromHeaderOrQuerystring(req) {
    if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
      return req.headers.authorization.split(' ')[1];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  }
});

// Apply JWT middleware to all routes after login
// app.use(buildPath("/"), verifyToken);

app.get(buildPath("/users"), verifyToken, async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: USERS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get(buildPath("/users/:uuid"), verifyToken, async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const result = await dynamoDb
      .get({
        TableName: USERS_TABLE,
        Key: { uuid },
      })
      .promise();

    if (!result.Item) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.json(result.Item);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

app.put(buildPath("/users/:uuid/roles"), verifyToken, requireAdmin, async (req, res) => {
  try {
    const uuid = req.params.uuid;
    const roles = Array.isArray(req.body?.roles) ? req.body.roles : null;

    if (!roles) {
      res.status(400).json({ message: "Roles must be an array" });
      return;
    }

    const result = await dynamoDb
      .update({
        TableName: USERS_TABLE,
        Key: { uuid },
        ConditionExpression: "attribute_exists(#uuid)",
        UpdateExpression: "SET #roles = :roles",
        ExpressionAttributeNames: {
          "#roles": "roles",
          "#uuid": "uuid",
        },
        ExpressionAttributeValues: {
          ":roles": roles,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    res.json(result.Attributes || {});
  } catch (error) {
    console.error("Error updating user roles:", error);
    if (error && error.code === "ConditionalCheckFailedException") {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.status(500).json({
      message: "Failed to update user roles",
      details: error?.message || "Unknown error",
    });
  }
});

app.get(buildPath("/projects"), verifyToken, async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: PROJECTS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

const port = Number(process.env.PORT) || 3000;
app.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}${basePath}`);
});
