import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(
  HttpException,
  InternalServerErrorException,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  UnauthorizedException,
)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor() {}

  async catch(exception: any, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest<Request>();
    const response = host.switchToHttp().getResponse<Response>();
    let message = exception.message || null;
    if (message == 'Bad Request Exception') {
      message = exception.response.message || message;
    }

    const statusCode = exception.getResponse();

    const status = exception.getStatus() || 500;

    this.logger.warn(`${statusCode} ${message}`);

    const body: any = {
      status: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request?.url,
    };

    return response.status(status).json(body);
  }
}
