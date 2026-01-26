import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message || 'Internal server error',
      error:
        typeof exceptionResponse === 'object' && (exceptionResponse as { error?: string }).error
          ? (exceptionResponse as { error?: string }).error
          : HttpStatus[status],
    };

    // Log error details
    this.logger.error(`HTTP ${status} Error: ${request.method} ${request.url}`, exception.stack);

    response.status(status).json(errorResponse);
  }
}
