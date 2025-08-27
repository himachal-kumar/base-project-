"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadConfig = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const process_1 = __importDefault(require("process"));
const path_1 = __importDefault(require("path"));
/**
 * Loads the configuration from the environment variables.
 * It will use the NODE_ENV variable to decide which .env file to use.
 * If NODE_ENV is not set, it will use the .env.development file.
 * @returns {void} Nothing
 */
const loadConfig = () => {
    var _a;
    const env = (_a = process_1.default.env.NODE_ENV) !== null && _a !== void 0 ? _a : "development";
    const filepath = path_1.default.join(process_1.default.cwd(), `.env.${env}`);
    dotenv_1.default.config({ path: filepath });
};
exports.loadConfig = loadConfig;
