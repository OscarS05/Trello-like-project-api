const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const fs = require('fs');
const { config } = require('../../config/config');

const logDirectory = path.join(__dirname, 'logs/');

if(!fs.existsSync(logDirectory)){
  fs.mkdirSync(logDirectory, { recursive: true });
}

const fileRotateTransport = new DailyRotateFile({
  filename: `${logDirectory}/%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  maxFiles: '7d',
  zippedArchive: true,
  level: 'info',
});

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    }),
  ),
  transports: [
    fileRotateTransport,
    new winston.transports.File({ filename: `${logDirectory}/performance.log`, level: 'info'}),
    !config.isProd && new winston.transports.Console({ level: 'info' })
  ].filter(Boolean)
});

module.exports = logger;
