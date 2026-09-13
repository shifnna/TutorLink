import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logDirectory = path.join(__dirname, "../../logs");

if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const accessLogStream = createStream("access.log", {
  interval: "1d",
  path: logDirectory,
  maxFiles: 7,
  compress: "gzip",
});

const fileLogger = morgan("combined", {
  stream: accessLogStream,
});

const consoleLogger = morgan("dev");

export { fileLogger, consoleLogger };