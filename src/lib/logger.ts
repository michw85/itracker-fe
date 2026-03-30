const isDev = import.meta.env.DEV;
const isTest = import.meta.env.MODE === "test";

type LogLevel = "debug" | "info" | "warn" | "error";

const logWithLevel = (level: LogLevel, ...args: unknown[]) => {
  if (isTest) return;

  const prefix = `[${level.toUpperCase()}]`;

  switch (level) {
    case "debug":
      if (isDev) console.debug(prefix, ...args);
      break;
    case "info":
      if (isDev) console.log(prefix, ...args);
      break;
    case "warn":
      if (isDev) console.warn(prefix, ...args);
      break;
    case "error":
      // We always display errors, but in production they can be sent to the service
      console.error(prefix, ...args);
      break;
  }
};

export const logger = {
  debug: (...args: unknown[]) => logWithLevel("debug", ...args),
  info: (...args: unknown[]) => logWithLevel("info", ...args),
  warn: (...args: unknown[]) => logWithLevel("warn", ...args),
  error: (...args: unknown[]) => logWithLevel("error", ...args),
};
