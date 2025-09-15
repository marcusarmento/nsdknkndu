const { createLogger, format, transports } = require('winston');

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}] ${message}`;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
      )
    }),
    new transports.File({ filename: 'app.log', level: 'info' }),
    new transports.File({ filename: 'error.log', level: 'error' })
  ]
});

module.exports = logger;
