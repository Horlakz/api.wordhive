import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl: url } = req;

    const start = Date.now();
    res.on('finish', () => {
      const elapsed = Date.now() - start;
      const statusCode = res.statusCode;

      this.logger.log(`[${method}] ${url} - ${statusCode} - ${elapsed}ms`);
    });

    next();
  }
}
