const winston = require('winston');
const momentTimezone = require('moment-timezone');

const { combine, splat, colorize, printf } = winston.format;

const customFormat = printf(info => {
  const { level, message, ...data } = info;
  const keys = Object.keys(data);
  const msgsToConcat = [message];

  if (keys.length) {
    const metadata = {};
    keys.forEach(key => {
      metadata[key] = data[key];
    });
    msgsToConcat.push(JSON.stringify(metadata));
  }

  return `[${momentTimezone(info.timestamp)
    .utc()
    .format('YYYY-MM-DD HH:mm:ss')}] ${info.level}: ${msgsToConcat.join(' ')}`;
});

const logger = winston.createLogger({
  format: combine(splat(), colorize(), customFormat),
  transports: [new winston.transports.Console({})],
});

module.exports = logger;
