const { createLogger, transports, format } = require('winston');

const logger = createLogger({
    level: 'info', // níveis: error, warn, info
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        new transports.File({ filename: 'logger/logs_registers/info.log', level: 'info' }),
        new transports.File({ filename: 'logger/logs_registers/error.log', level: 'error' }),
        new transports.File({ filename: 'logger/logs_registers/warn.log', level: 'warn' })
    ],
    exceptionHandlers: [
        new transports.File({ filename: 'logger/logs_registers/exceptions.log' })
    ]
});

module.exports = logger;