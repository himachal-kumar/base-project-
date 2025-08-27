import dotenv from "dotenv";
import process from "process";
import path from "path";

/**
 * Loads the configuration from the environment variables.
 * It will use the NODE_ENV variable to decide which .env file to use.
 * If NODE_ENV is not set, it will use the .env.development file.
 * @returns {void} Nothing
 */
export const loadConfig = () => {
  const env = process.env.NODE_ENV ?? "development";
  const filepath = path.join(process.cwd(), `.env.${env}`);
  dotenv.config({ path: filepath });
};
