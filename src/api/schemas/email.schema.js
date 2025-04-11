const Joi = require('joi');

const emailSchema = Joi.object({
  // Recipients
  to: Joi.alternatives().try(
    Joi.string().email().required(),
    Joi.array().items(Joi.string().email()).min(1).required()
  ),
  cc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ),
  bcc: Joi.alternatives().try(
    Joi.string().email(),
    Joi.array().items(Joi.string().email())
  ),
  
  // Content options
  subject: Joi.string(),
  text: Joi.string(),
  html: Joi.string(),
  
  // Template options
  template: Joi.string(),
  context: Joi.object(),
  
  // Additional options
  attachments: Joi.array().items(
    Joi.object({
      filename: Joi.string().required(),
      content: Joi.alternatives().try(
        Joi.string(),
        Joi.binary()
      ),
      path: Joi.string(),
      contentType: Joi.string(),
      cid: Joi.string()
    })
  ),
  priority: Joi.string().valid('high', 'normal', 'low'),
  replyTo: Joi.string().email(),
  headers: Joi.object()
}).xor('text', 'html', 'template') // Require at least one of these
  .with('template', 'context'); // If template is specified, context is required

module.exports = {
  emailSchema
};