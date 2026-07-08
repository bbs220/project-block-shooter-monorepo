import { z } from "zod";
import "dotenv/config";

const envSchema = z.object({
  PORT: z.string().default("3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  CLIENT_URL: z.url({ error: "CLIENT_URL must be a valid URL" }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  // NOTE: dont use logger here or its gonna crash due to circular dependency between logger and envValidated
  // Use console.error instead
  console.error("❌ Invalid or missing environment variables:");

  console.error(z.treeifyError(parsedEnv.error));

  process.exit(1);
}

export const envValid = parsedEnv.data;
