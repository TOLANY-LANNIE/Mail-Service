const express = require('express');
const router = express.Router();
const EmailController = require('../controllers/email.controller');
const RequestValidator = require('../middleware/validator');
const AuthMiddleware = require('../middleware/auth.middleware');
const { emailSchema } = require('../schemas/email.schema');

// Apply auth middleware to all routes
router.use(AuthMiddleware.apiKeyAuth);

// Send email route
router.post(
  '/send',
  RequestValidator.validate(emailSchema),
  EmailController.sendEmail.bind(EmailController)
);

// Get available templates
router.get(
  '/templates',
  EmailController.getTemplates.bind(EmailController)
);

// Get template info
router.get(
  '/templates/:templateName',
  EmailController.getTemplateInfo.bind(EmailController)
);

module.exports = router;
