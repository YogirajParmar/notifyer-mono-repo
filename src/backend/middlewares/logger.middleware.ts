import { Request, Response, NextFunction } from 'express';
import { Logger } from '../helpers/logger.helper';

export class ApiLoggerMiddleware {
  private logger: Logger;

  constructor() {
    this.logger = Logger.getInstance();
  }

  public logApiCall = (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      this.logger.log('info', `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration.toFixed(3)} ms`);
    });
    next();
  }
}