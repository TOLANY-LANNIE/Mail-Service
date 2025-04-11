const config = require('../../config/config');
const Logger = require('../../lib/logger');

class AuthMiddleware {
  static apiKeyAuth(req, res, next) {
    // Check API key from headers
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== config.api.apiKey) {
      Logger.error('Invalid API key', { ip: req.ip });
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        details: 'Invalid or missing API key'
      });
    }
    
    next();
  }
}

module.exports = AuthMiddleware;