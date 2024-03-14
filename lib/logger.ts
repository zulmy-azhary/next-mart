import winston, { format } from "winston";

const { combine, timestamp } = winston.format;

export const logger = winston.createLogger({
  levels: winston.config.syslog.levels,
  format: combine(timestamp(), format.json()),
  transports: [
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
      ),
    }),
  ],
});
