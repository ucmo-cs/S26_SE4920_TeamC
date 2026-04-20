"use strict";

const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "default-secret-key";

/**
 * Authenticates a request using JWT token from the Authorization header
 * Extracts the bearer token and verifies it, attaching user info to the event
 * Usage: const authError = authenticateToken(event); if (authError) return authError;
 * @param {Object} event - Lambda event object
 * @returns {null|Object} null if authenticated, error response object if not
 */
const authenticateToken = (event) => {
  const authHeader = event.headers.Authorization || event.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Access token required" }),
    };
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Attach user info to event for use in handlers
    event.user = decoded;
    return null; // No error, proceed
  } catch (error) {
    return {
      statusCode: 403,
      body: JSON.stringify({ message: "Invalid or expired token" }),
    };
  }
};

/**
 * Gets the authenticated user's UUID from the event
 * Must be called after authenticateToken has been validated
 * @param {Object} event - Lambda event object with attached user info
 * @returns {string} The user's UUID
 */
const getAuthenticatedUserId = (event) => {
  return event?.user?.uuid;
};

/**
 * Gets all user information from the authenticated session
 * Includes UUID and roles
 * @param {Object} event - Lambda event object with attached user info
 * @returns {Object} User object with uuid and roles
 */
const getAuthenticatedUser = (event) => {
  return event?.user || {};
};

/**
 * Checks if the authenticated user has a specific role
 * @param {Object} event - Lambda event object with attached user info
 * @param {string} role - Role to check (e.g., 'ADMIN', 'LEAD')
 * @returns {boolean} true if user has the role, false otherwise
 */
const hasRole = (event, role) => {
  const userRoles = event?.user?.roles || [];
  return userRoles.includes(role);
};

/**
 * Requires specific role, returns error if user doesn't have it
 * @param {Object} event - Lambda event object with attached user info
 * @param {string|string[]} requiredRoles - Single role or array of roles to check
 * @returns {null|Object} null if authorized, error response object if not
 */
const requireRole = (event, requiredRoles) => {
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  const userRoles = event?.user?.roles || [];
  
  const hasRequiredRole = roles.some(role => userRoles.includes(role));
  
  if (!hasRequiredRole) {
    return {
      statusCode: 403,
      body: JSON.stringify({ 
        message: `Required role(s) not found: ${roles.join(', ')}` 
      }),
    };
  }
  
  return null; // Authorized
};

module.exports = { 
  authenticateToken,
  getAuthenticatedUserId,
  getAuthenticatedUser,
  hasRole,
  requireRole
};