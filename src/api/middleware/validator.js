const { EmailError } = require('../../lib/errors');
const Logger = require('../../lib/logger');

class RequestValidator {
  static validate(schema) {
    return (req, res, next) => {
      const { error } = schema.validate(req.body);
      if (error) {
        Logger.error('Request validation failed', error);
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          details: error.details.map(detail => detail.message)
        });
      }
      next();
    };
  }
}

module.exports = RequestValidator;