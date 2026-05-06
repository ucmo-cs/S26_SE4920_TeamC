/**
 * HANDLER TEMPLATE - Authentication & User Identification
 * 
 * Use this template when creating new protected endpoint handlers that need
 * to identify the authenticated user via their session token.
 */

"use strict";

const AWS = require("aws-sdk");
const {
  authenticateToken,
  getAuthenticatedUserId,
  getAuthenticatedUser,
  requireRole,
  hasRole
} = require("../middleware/auth");

const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Example 1: Simple protected endpoint that identifies the current user
 * User making the request: event.user.uuid
 */
const exampleBasicHandler = async (event) => {
  try {
    // Get authenticated user's UUID
    const userId = getAuthenticatedUserId(event);
    
    // Or get full user object
    const user = getAuthenticatedUser(event);
    console.log(`Request from user: ${user.uuid} with roles: ${user.roles}`);

    const params = {
      TableName: process.env.USERS_TABLE || "users",
      Key: { uuid: userId }, // Use authenticated user, not path parameter
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
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

/**
 * Example 2: Admin-only endpoint
 * Only users with ADMIN role can access
 */
const exampleAdminHandler = async (event) => {
  try {
    const user = getAuthenticatedUser(event);
    
    // Handler logic restricted to admins
    console.log(`Admin action performed by: ${user.uuid}`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Admin action completed" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

/**
 * Example 3: Endpoint accessible by ADMIN or LEAD roles
 */
const exampleRoleBasedHandler = async (event) => {
  try {
    const user = getAuthenticatedUser(event);
    
    // Check if user has any of the required roles
    const isAdmin = hasRole(event, 'ADMIN');
    const isLead = hasRole(event, 'LEAD');
    
    if (isAdmin) {
      // Admin-specific logic
      console.log(`Admin ${user.uuid} accessed this endpoint`);
    } else if (isLead) {
      // Lead-specific logic
      console.log(`Lead ${user.uuid} accessed this endpoint`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Action completed" }),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

/**
 * Example 4: Restrict user to accessing only their own data
 * Important for security: users shouldn't be able to view/edit others' data
 */
const exampleSelfDataHandler = async (event) => {
  try {
    const userId = getAuthenticatedUserId(event);
    const requestedUserId = event.pathParameters?.userId;

    // Prevent users from accessing other users' data
    // Exception: Allow ADMIN to access anyone's data
    if (userId !== requestedUserId && !hasRole(event, 'ADMIN')) {
      return {
        statusCode: 403,
        body: JSON.stringify({ 
          message: "You can only access your own data" 
        }),
      };
    }

    const params = {
      TableName: process.env.USERS_TABLE || "users",
      Key: { uuid: requestedUserId },
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
      body: JSON.stringify(result.Item),
    };
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

// HANDLER WRAPPERS - These wrap your handler with authentication

/**
 * Basic authentication wrapper
 * Access user info via: event.user.uuid, event.user.roles
 */
module.exports.exampleBasicHandlerWithAuth = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }
  return exampleBasicHandler(event);
};

/**
 * Admin role required wrapper
 * Returns 403 error if user doesn't have ADMIN role
 */
module.exports.exampleAdminHandlerWithAuth = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }

  const roleError = requireRole(event, 'ADMIN');
  if (roleError) {
    return roleError;
  }

  return exampleAdminHandler(event);
};

/**
 * Multiple roles required wrapper
 * User must have one of: ADMIN or LEAD
 */
module.exports.exampleRoleBasedHandlerWithAuth = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }

  const roleError = requireRole(event, ['ADMIN', 'LEAD']);
  if (roleError) {
    return roleError;
  }

  return exampleRoleBasedHandler(event);
};

/**
 * Self-data access wrapper
 * User can only access their own data (unless ADMIN)
 */
module.exports.exampleSelfDataHandlerWithAuth = async (event) => {
  const authError = authenticateToken(event);
  if (authError) {
    return authError;
  }
  return exampleSelfDataHandler(event);
};

/**
 * QUICK REFERENCE
 * 
 * 1. To check if user is authenticated:
 *    const userId = getAuthenticatedUserId(event);
 * 
 * 2. To get user roles:
 *    const user = getAuthenticatedUser(event);
 *    console.log(user.roles);
 * 
 * 3. To check a specific role:
 *    if (hasRole(event, 'ADMIN')) { ... }
 * 
 * 4. To enforce a role requirement:
 *    const roleError = requireRole(event, 'ADMIN');
 *    if (roleError) return roleError;
 * 
 * 5. To enforce multiple roles (user needs one):
 *    const roleError = requireRole(event, ['ADMIN', 'LEAD']);
 *    if (roleError) return roleError;
 */
