// Import Winston library for advanced logging with multiple transports and formatting options
import winston from 'winston';

// Create a new Winston logger instance with custom configuration
const logger = winston.createLogger({
  // Set logging level based on environment: 'info' for production, 'debug' for development
  // Production logs only important messages (info, warn, error), development includes debug messages
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

  // Combine multiple formatting functions to create the final log output format
  format: winston.format.combine(
    // Add ISO timestamp to each log entry for tracking when events occurred
    winston.format.timestamp(),

    // Add color coding to log levels (error=red, warn=yellow, info=green, etc.) for better readability
    winston.format.colorize(),

    // Define custom printf formatter to structure the final log message output
    winston.format.printf(({ level, message, timestamp, ...meta }) => {
      // Check if there are additional metadata fields beyond level, message, and timestamp
      // If metadata exists, stringify it and append to the log message
      const rest = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';

      // Return formatted log string: timestamp [level] message metadata
      // Example: "2025-12-08T23:59:40Z [info] Server started {port: 5000}"
      return `${timestamp} [${level}] ${message}${rest}`;
    })
  ),

  // Define where logs should be sent - currently only to console
  // Could be extended to include file transports or external logging services
  transports: [new winston.transports.Console()],
});

// Export the configured logger instance for use throughout the application
export default logger;
