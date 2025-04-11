const config = {
    // Previous email config
    email: process.env.EMAIL_ADDRESS || 'your.email@gmail.com',
    senderName: process.env.SENDER_NAME || 'Your Application',
    oauth2: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      redirectUri: process.env.REDIRECT_URI || 'https://developers.google.com/oauthplayground'
    },
    smtp: {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    defaultProvider: process.env.DEFAULT_EMAIL_PROVIDER || 'gmail',
    defaultTemplateEngine: process.env.DEFAULT_TEMPLATE_ENGINE || 'handlebars',
    templatesDir: process.env.TEMPLATES_DIR || './templates',
    
    // API configuration
    api: {
      port: process.env.PORT || 3000,
      apiKey: process.env.API_KEY || 'your-secure-api-key',
      cors: {
        origin: process.env.CORS_ORIGIN || 'http://localhost:4200', // Angular app URL
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key']
      },
      rateLimit: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      }
    }
  };
  
  module.exports = config;