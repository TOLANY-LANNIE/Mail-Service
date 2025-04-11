const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const config = require('./config/config');
const Logger = require('./lib/logger');
const emailRoutes = require('./api/routes/email.routes');

// Create Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors(config.api.cors));
app.use(express.json({ limit: '10mb' })); // Allow for attachments
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit(config.api.rateLimit);
app.use('/api/', limiter);

// Routes
app.use('/api/email', emailRoutes);

// Not found handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    details: `Route ${req.method} ${req.url} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  Logger.error('Unhandled error', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    details: err.message
  });
});

// Start server
if (require.main === module) {
  app.listen(config.api.port, () => {
    Logger.info(`Email API server running on port ${config.api.port}`);
  });
}

module.exports = app;