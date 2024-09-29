import * as winston from "winston";
import 'winston-daily-rotate-file';
import * as path from "path";
import * as os from "os";
import * as fs from "fs/promises";

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

  private async ensureLogDirectory(): Promise<void> {
    try {
      await fs.access(this.logDir);
    } catch (error) {
      if (error.code === 'ENOENT') {
        try {
          await fs.mkdir(this.logDir, { recursive: true });
          this.log('info', `Created log directory: ${this.logDir}`);
        } catch (error) {
          this.log('error', `Failed to create log directory: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        this.log('error', `Failed to access log directory: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
  }

  private createLogger(): winston.Logger {
    const logFormat = winston.format.printf(({ timestamp, level, label, message }) => {
      return `${timestamp} ${level} [${label}]: ${message}`;
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

  public async cleanupOldLogs(): Promise<void> {
    this.log('info', 'Starting log cleanup');

    try {
      const files = await fs.readdir(this.logDir);
      const now = Date.now();

      const deletePromises = files.map(async (file) => {
        const filePath = path.resolve(this.logDir, file);
        try {
          const stats = await fs.stat(filePath);
          const fileAgeInDays = (now - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);

          // Check if the file is older than 2 days
          if (fileAgeInDays > 2) {
            await fs.unlink(filePath);
            this.log('info', `Deleted old log file: ${file}`);
          }
        } catch (err) {
          this.log('error', `Error handling file ${file}: ${err instanceof Error ? err.message : String(err)}`);
        }
      });

      await Promise.all(deletePromises);
    } catch (err) {
      this.log('error', `Error reading log directory: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  public setupLogCleanup(): void {
    this.cleanupOldLogs();
    setInterval(() => this.cleanupOldLogs(), 24 * 60 * 60 * 1000);
  }
}

export const logger = Logger.getInstance();