import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BoardException } from '../exceptions/board.exception';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {

  catch(exception: unknown, host: ArgumentsHost): void {
    if (exception instanceof BoardException) {
      this.handleBoardException(exception, host);
      return;
    }
    if (exception instanceof BadRequestException) {
      this.handleValidation(exception, host);
      return;
    }
    this.handleUnknown(exception, host);
  }

  private handleBoardException(
    exception: BoardException,
    host: ArgumentsHost,
  ): void {
    const { response, request } = this.getHttpContext(host);
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleValidation(
    exception: BadRequestException,
    host: ArgumentsHost,
  ): void {
    const { response, request } = this.getHttpContext(host);
    const message = this.extractValidationMessage(exception);

    response.status(HttpStatus.BAD_REQUEST).json({
      statusCode: HttpStatus.BAD_REQUEST,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private extractValidationMessage(
    exception: BadRequestException,
  ): string | string[] {
    const res = exception.getResponse();
    if (typeof res === 'object' && res !== null && 'message' in res) {
      return (res as { message: string | string[] }).message;
    }
    return exception.message;
  }

  private handleUnknown(exception: unknown, host: ArgumentsHost): void {
    const { response, request } = this.getHttpContext(host);
    
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private getHttpContext(host: ArgumentsHost): {
    response: Response;
    request: Request;
  } {
    const ctx = host.switchToHttp();
    return {
      response: ctx.getResponse<Response>(),
      request: ctx.getRequest<Request>(),
    };
  }
}
