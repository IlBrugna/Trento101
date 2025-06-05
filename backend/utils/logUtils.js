import logModel from '../models/logModel.js';

/**
 * Records an action log in the system
 * @param {Object} req - Express request object
 * @param {string} action - Action description (e.g., 'user_login', 'poll_created')
 * @param {Object} options - Additional options
 * @param {string} options.userEmail - User email (optional)
 * @param {Object} options.details - Additional details to log (optional)
 * @param {string} options.status - 'success', 'failed', or 'error' (default: 'success')
 */
export const logAction = async (req, action, options = {}) => {
  try {
    const logEntry = new logModel({
      action,
      userEmail: options.userEmail || null,
      ip: req.clientIP || req.ip || req.connection.remoteAddress,
      details: options.details || null,
      status: options.status || 'success'
    });

    await logEntry.save();
  } catch (error) {
    // Don't throw errors to avoid breaking the main flow
    console.error('Failed to log action:', error);
  }
};

/**
 * Records a login event
 * @param {Object} req - Express request object
 * @param {string} userEmail - User email
 * @param {boolean} success - Whether login was successful
 */
export const recordLogin = async (req, userEmail, success = true) => {
  await logAction(req, 'user_login', {
    userEmail,
    status: success ? 'success' : 'failed'
  });
};

/**
 * Records a company creation event
 * @param {Object} req - Express request object
 * @param {string} companyId - Company ID
 * @param {string} userEmail - User email (optional)
 */
export const recordCompanyCreation = async (req, companyId, userEmail = null) => {
  await logAction(req, 'company_created', {
    userEmail,
    details: { companyId }
  });
};

/**
 * Records a poll creation event
 * @param {Object} req - Express request object
 * @param {string} pollId - Poll ID
 * @param {string} userEmail - User email (optional)
 */
export const recordPollCreation = async (req, pollId, userEmail = null) => {
  await logAction(req, 'poll_created', {
    userEmail,
    details: { pollId }
  });
};