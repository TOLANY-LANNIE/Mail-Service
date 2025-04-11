const MailerService = require('../../services/mailer/mailer.service');
const Logger = require('../../lib/logger');

class EmailController {
  constructor() {
    this.mailerService = new MailerService();
    this.initialized = false;
  }

  async init() {
    if (!this.initialized) {
      await this.mailerService.initialize();
      this.initialized = true;
    }
  }

  async sendEmail(req, res) {
    try {
      // Initialize mailer if not already done
      await this.init();
      
      // Send email with data from the Angular application
      const result = await this.mailerService.send(req.body);
      
      if (result.success) {
        return res.status(200).json({
          success: true,
          messageId: result.messageId,
          envelope: result.envelope
        });
      } else {
        return res.status(500).json({
          success: false,
          error: result.error,
          code: result.code
        });
      }
    } catch (error) {
      Logger.error('Error in send-email controller', error);
      return res.status(500).json({
        success: false,
        error: 'Internal server error',
        details: error.message
      });
    }
  }

  async getTemplates(req, res) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const config = require('../../config/config');
      
      // Get list of templates (directories) from templates folder
      const templatesDir = path.resolve(config.templatesDir);
      const templates = await fs.readdir(templatesDir);
      
      // Filter to only include directories
      const templateFolders = [];
      for (const template of templates) {
        const stats = await fs.stat(path.join(templatesDir, template));
        if (stats.isDirectory()) {
          templateFolders.push(template);
        }
      }
      
      return res.status(200).json({
        success: true,
        templates: templateFolders
      });
    } catch (error) {
      Logger.error('Error getting templates', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get templates',
        details: error.message
      });
    }
  }

  async getTemplateInfo(req, res) {
    try {
      const fs = require('fs').promises;
      const path = require('path');
      const config = require('../../config/config');
      
      const templateName = req.params.templateName;
      
      // Validate template exists
      const templateDir = path.join(config.templatesDir, templateName);
      try {
        await fs.access(templateDir);
      } catch (error) {
        return res.status(404).json({
          success: false,
          error: 'Template not found',
          details: `Template '${templateName}' does not exist`
        });
      }
      
      // Get required context variables (by parsing template files)
      // This is a simplified approach - a more robust solution would use the template engine
      const templateFiles = await fs.readdir(templateDir);
      let contextVars = new Set();
      
      // Get file extension based on engine
      const fileExt = config.defaultTemplateEngine === 'ejs' ? '.ejs' : '.hbs';
      
      for (const file of templateFiles) {
        if (file.endsWith(fileExt)) {
          const content = await fs.readFile(path.join(templateDir, file), 'utf8');
          
          // Simple regex to find variables in templates
          // Note: This is a basic approach and might not work for all template syntaxes
          const regex = config.defaultTemplateEngine === 'ejs' 
            ? /<%= *([\w.]+) *%>/g
            : /{{(?!#|\/|>|if|else|each)([\w.]+)}}/g;
          
          let match;
          while ((match = regex.exec(content)) !== null) {
            contextVars.add(match[1]);
          }
        }
      }
      
      return res.status(200).json({
        success: true,
        template: {
          name: templateName,
          requiredContext: Array.from(contextVars)
        }
      });
    } catch (error) {
      Logger.error('Error getting template info', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to get template info',
        details: error.message
      });
    }
  }
}

module.exports = new EmailController();