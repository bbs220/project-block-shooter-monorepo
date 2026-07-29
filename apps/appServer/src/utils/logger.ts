import { envValid } from "./envValid.js";
import pino from "pino";

export const logger = pino({
  // in production, only log "info", "warn", and "error" (hides debug logs to save money/space)
  level: envValid.NODE_ENV === "production" ? "info" : "debug",

  // use pino-pretty only in development so we can actually read it
  transport:
    envValid.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            translateTime: "SYS:standard", // adds a nice timestamp
          },
        }
      : undefined, // in production, it defaults to blazing fast JSON
});
