import { createLogger, format, transports } from 'winston';
import path from 'path';

const customFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);


const winstonLogger = createLogger({
    level: 'info',
    format: customFormat,
    transports: [
        new transports.File({
            filename: path.join(__dirname, 'logger/loggerEvent.log'),
            level: 'info',
        }),
        new transports.Console({
            format: format.simple()
        })
    ],
});


export default winstonLogger; 
