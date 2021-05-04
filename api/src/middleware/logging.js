import * as winston from "winston"
import {logConfig} from "../utils/config";

const consoleTransport = new winston.transports.Console();

const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
);

const myWinstonOptions = {
    transports: [consoleTransport],
    format: logFormat,
    level: logConfig.level,
};

export const logger = new winston.createLogger(myWinstonOptions);

export function logRequest(req, res, next) {
    logger.info(req.url)
    next()
}

export function logError(err, req, res, next) {
    logger.error(err)
    next()
}

