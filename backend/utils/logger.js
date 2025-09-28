import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure logs directory exists
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const logStream = fs.createWriteStream(
  path.join(logsDir, `app-${new Date().toISOString().split('T')[0]}.log`),
  { flags: 'a' }
);

const logger = {
  info: (message, meta = {}) => {
    const logEntry = {
      level: 'INFO',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.log(JSON.stringify(logEntry));
    logStream.write(JSON.stringify(logEntry) + '\n');
  },

  error: (message, error = null, meta = {}) => {
    const logEntry = {
      level: 'ERROR',
      timestamp: new Date().toISOString(),
      message,
      error: error ? error.message : null,
      stack: error ? error.stack : null,
      ...meta
    };
    console.error(JSON.stringify(logEntry));
    logStream.write(JSON.stringify(logEntry) + '\n');
  },

  warn: (message, meta = {}) => {
    const logEntry = {
      level: 'WARN',
      timestamp: new Date().toISOString(),
      message,
      ...meta
    };
    console.warn(JSON.stringify(logEntry));
    logStream.write(JSON.stringify(logEntry) + '\n');
  }
};

export default logger;