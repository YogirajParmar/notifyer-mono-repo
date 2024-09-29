import * as winston from "winston";
import 'winston-daily-rotate-file';
import * as path from "path";
import * as os from "os";
import * as fs from "fs";

export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;
  private logDir: string;

  private constructor() {
    this.logDir = path.join(os.homedir(), '.notifyer-logs');
    this.ensureLogDirectory();
    this.logger = this.createLogger();
  }

  public static getInstance(labelName = "no-label"): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private ensureLogDirectory(): void {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private createLogger(): winston.Logger {
    const logFormat = winston.format.printf(({ timestamp, level, label, message }) => {
      return `(${timestamp} ${level} [${label}]: ${message})`;
    });

    const rotatingFileTransport = new winston.transports.DailyRotateFile({
      filename: path.join(this.logDir, 'app-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: logFormat
    });

    return winston.createLogger({
      level: "info",
      format: winston.format.combine(
        winston.format.label({ label: 'no-label' }),
        winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
        logFormat
      ),
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            logFormat
          )
        }),
        rotatingFileTransport
      ]
    });
  }

  public log(level: string, message: string): void {
    this.logger.log(level, message);
  }

  public cleanupOldLogs(): void {
    this.log('info', 'Starting log cleanup');

    fs.readdir(this.logDir, (err, files) => {
      if (err) {
        this.log('error', `Error reading log directory: ${err.message}`);
        return;
      }

      const now = new Date();
      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            this.log('error', `Error getting file stats for ${file}: ${err.message}`);
            return;
          }

          const fileAge = new Date(stats.mtime);
          if ((now.getTime() - fileAge.getTime()) / (1000 * 60 * 60 * 24) > 14) {
            fs.unlink(filePath, err => {
              if (err) {
                this.log('error', `Error deleting old log file ${file}: ${err.message}`);
              } else {
                this.log('info', `Deleted old log file: ${file}`);
              }
            });
          }
        });
      });
    });
  }

  public setupLogCleanup(): void {
    this.cleanupOldLogs();
    setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000); // Run every 24 hours
  }
}

export const logger = Logger.getInstance();