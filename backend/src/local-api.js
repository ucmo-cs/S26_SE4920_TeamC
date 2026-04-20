"use strict";

const express = require("express");
const cors = require("cors");
const AWS = require("aws-sdk");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

const region = process.env.AWS_REGION || "us-east-1";
AWS.config.update({ region });

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const USERS_TABLE = process.env.USERS_TABLE || "users";
const PROJECTS_TABLE = process.env.PROJECTS_TABLE || "projects";
const basePath = process.env.LOCAL_API_BASE_PATH || "/dev";
const LEADERBOARD_LIMIT = Number(process.env.LEADERBOARD_LIMIT) || 25;
const leaderboardFilePath = path.join(__dirname, "..", "data", "leaderboard.json");

function buildPath(path) {
  return `${basePath}${path}`;
}

function normalizeLeaderboard(items) {
  if (!Array.isArray(items)) {
    return [];
  }

  return items
    .filter(
      (entry) =>
        entry &&
        typeof entry.employeeName === "string" &&
        typeof entry.score === "number" &&
        typeof entry.updatedAt === "string"
    )
    .map((entry) => ({
      employeeName: entry.employeeName.trim(),
      score: Math.floor(entry.score),
      updatedAt: entry.updatedAt,
    }))
    .filter((entry) => entry.employeeName && Number.isFinite(entry.score) && entry.score >= 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, LEADERBOARD_LIMIT);
}

async function readLeaderboardFromFile() {
  try {
    const raw = await fs.promises.readFile(leaderboardFilePath, "utf-8");
    const parsed = JSON.parse(raw);
    return normalizeLeaderboard(parsed);
  } catch (error) {
    if (error && error.code === "ENOENT") {
      return [];
    }
    throw error;
  }
}

async function writeLeaderboardToFile(entries) {
  const normalized = normalizeLeaderboard(entries);
  const dirPath = path.dirname(leaderboardFilePath);
  await fs.promises.mkdir(dirPath, { recursive: true });
  await fs.promises.writeFile(leaderboardFilePath, JSON.stringify(normalized, null, 2), "utf-8");
  return normalized;
}

app.get(buildPath("/leaderboard"), async (req, res) => {
  try {
    const entries = await readLeaderboardFromFile();
    res.json(entries);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
  }
});

app.post(buildPath("/leaderboard"), async (req, res) => {
  try {
    const employeeName = String(req.body?.employeeName || "").trim();
    const parsedScore = Number(req.body?.score);

    if (!employeeName || !Number.isFinite(parsedScore) || parsedScore < 0) {
      res.status(400).json({ message: "employeeName and non-negative score are required" });
      return;
    }

    const submittedScore = Math.floor(parsedScore);
    const currentEntries = await readLeaderboardFromFile();
    const existing = currentEntries.find((entry) => entry.employeeName === employeeName);

    if (!existing || submittedScore > existing.score) {
      const nextEntries = currentEntries.filter((entry) => entry.employeeName !== employeeName);
      nextEntries.push({
        employeeName,
        score: submittedScore,
        updatedAt: new Date().toISOString(),
      });

      const persisted = await writeLeaderboardToFile(nextEntries);
      res.json({ updated: true, entries: persisted });
      return;
    }

    res.json({ updated: false, entries: currentEntries });
  } catch (error) {
    console.error("Error saving leaderboard:", error);
    res.status(500).json({ message: "Failed to save leaderboard" });
  }
});

app.delete(buildPath("/leaderboard"), async (req, res) => {
  try {
    const cleared = await writeLeaderboardToFile([]);
    res.json({ cleared: true, entries: cleared });
  } catch (error) {
    console.error("Error clearing leaderboard:", error);
    res.status(500).json({ message: "Failed to clear leaderboard" });
  }
});

app.get(buildPath("/users"), async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: USERS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

app.get(buildPath("/users/:uuid"), async (req, res) => {
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

app.put(buildPath("/users/:uuid/roles"), async (req, res) => {
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

app.get(buildPath("/projects"), async (req, res) => {
  try {
    const result = await dynamoDb.scan({ TableName: PROJECTS_TABLE }).promise();
    res.json(result.Items || []);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

const port = Number(process.env.PORT) || 3001;
app.listen(port, () => {
  console.log(`Local API listening on http://localhost:${port}${basePath}`);
});
