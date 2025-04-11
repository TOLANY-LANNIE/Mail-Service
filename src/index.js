const MailerService = require('./services/mailer/mailer.service');
const TemplateService = require('./services/template/template.service');
const Email = require('./models/email.model');
const app = require('./server');

module.exports = {
  MailerService,
  TemplateService,
  Email,
  app
};