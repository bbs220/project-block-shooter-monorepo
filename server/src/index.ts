import "dotenv/config";
import { logger } from "./utils/logger.js";
import { envValid } from "./utils/envValid.js";

logger.info(`env info:${envValid}`);
