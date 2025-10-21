import morgan from "morgan";
import { createStream } from "rotating-file-stream";
import path from "path";
import fs from "fs";

const logDirectory = path.join(__dirname, "../../logs");
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}

const accessLogStream = createStream("access.log", {
  interval: "1d",        //// rotate daily
  path: logDirectory,
  maxFiles: 7,           //// keep logs for 7 days
  compress: "gzip",      
});

//// for production (writes to file)
const fileLogger = morgan("combined", { stream: accessLogStream });

//// for development (colored console output)
const consoleLogger = morgan("dev");

export { fileLogger, consoleLogger };
