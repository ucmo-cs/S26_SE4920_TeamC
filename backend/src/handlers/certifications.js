'use strict';

const AWS = require('aws-sdk');
const { randomUUID } = require('crypto');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const TABLE = process.env.CERTIFICATIONS_TABLE;

function json(statusCode, data) {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
}

module.exports.list = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return json(400, { message: 'Missing required query param: userId' });
    }

    const params = {
      TableName: TABLE,
      IndexName: 'userIdIndex',
      KeyConditionExpression: 'userId = :uid',
      ExpressionAttributeValues: {
        ':uid': userId,
      },
    };

    const result = await dynamoDb.query(params).promise();
    return json(200, { items: result.Items || [] });
  } catch (error) {
    console.error('certifications.list error:', error);
    return json(500, { message: 'Internal server error' });
  }
};

module.exports.create = async (event) => {
  try {
    const body = JSON.parse(event.body || '{}');

    const userId = body.userId;
    const name = body.name;

    if (!userId || !name) {
      return json(400, { message: 'Missing required fields: userId, name' });
    }

    const now = new Date().toISOString();
    const item = {
      uuid: randomUUID(),
      userId,
      name,
      issuer: body.issuer || '',
      obtainedDate: body.obtainedDate || '',
      expiryDate: body.expiryDate || '',
      status: body.status || 'ACTIVE', // ACTIVE | EXPIRED | IN_PROGRESS
      proofUrl: body.proofUrl || '',
      createdAt: now,
      updatedAt: now,
    };

    await dynamoDb
      .put({
        TableName: TABLE,
        Item: item,
      })
      .promise();

    return json(201, { item });
  } catch (error) {
    console.error('certifications.create error:', error);
    return json(500, { message: 'Internal server error' });
  }
};

module.exports.update = async (event) => {
  try {
    const uuid = event.pathParameters?.uuid;
    if (!uuid) return json(400, { message: 'Missing path param: uuid' });

    const body = JSON.parse(event.body || '{}');

    // Do not allow changing these:
    delete body.uuid;
    delete body.createdAt;

    const allowedFields = [
      'userId',
      'name',
      'issuer',
      'obtainedDate',
      'expiryDate',
      'status',
      'proofUrl',
    ];

    const updates = Object.keys(body).filter((k) => allowedFields.includes(k));
    if (updates.length === 0) {
      return json(400, { message: 'No valid fields to update' });
    }

    const ExpressionAttributeNames = {};
    const ExpressionAttributeValues = {};
    const setParts = [];

    for (const field of updates) {
      ExpressionAttributeNames['#' + field] = field;
      ExpressionAttributeValues[':' + field] = body[field];
      setParts.push(`#${field} = :${field}`);
    }

    // Always update updatedAt
    ExpressionAttributeNames['#updatedAt'] = 'updatedAt';
    ExpressionAttributeValues[':updatedAt'] = new Date().toISOString();
    setParts.push('#updatedAt = :updatedAt');

    const params = {
      TableName: TABLE,
      Key: { uuid },
      UpdateExpression: 'SET ' + setParts.join(', '),
      ExpressionAttributeNames,
      ExpressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    };

    const result = await dynamoDb.update(params).promise();
    return json(200, { item: result.Attributes });
  } catch (error) {
    console.error('certifications.update error:', error);
    return json(500, { message: 'Internal server error' });
  }
};

module.exports.remove = async (event) => {
  try {
    const uuid = event.pathParameters?.uuid;
    if (!uuid) return json(400, { message: 'Missing path param: uuid' });

    await dynamoDb
      .delete({
        TableName: TABLE,
        Key: { uuid },
      })
      .promise();

    return json(200, { message: 'Deleted', uuid });
  } catch (error) {
    console.error('certifications.remove error:', error);
    return json(500, { message: 'Internal server error' });
  }
};