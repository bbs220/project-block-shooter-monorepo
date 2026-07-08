import "dotenv/config";
import { logger } from "./utils/logger.js";
import { envValid } from "./utils/envValid.js";

logger.info([envValid.PORT, envValid.NODE_ENV, envValid.CLIENT_URL]);
