import color from "tinyrainbow";

const labels = {
  info: (text) => color.cyan(text),
  warn: (text) => color.yellow(text),
  error: (text) => color.red(text),
};

export const logger = {
  info(message) {
    console.log(formatLog("info", message));
  },

  warn(message) {
    console.warn(formatLog("warn", message));
  },

  error(message, error) {
    console.error(formatLog("error", message));
    if (error) console.error(error);
  },
};

export function formatLog(level, message, timestamp = new Date()) {
  const label = labels[level];
  if (!label) throw new Error(`Unknown log level: ${level}.`);

  const time = timestamp.toLocaleTimeString("en-GB", { hour12: false });
  return `${color.dim(`[${time}]`)} ${label(level.toUpperCase())} ${message}`;
}
