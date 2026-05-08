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
    const status = exception.getStatus();
    this.createErrorResponse(host, status, exception.message);
  }

   private createErrorResponse(host: ArgumentsHost, status: HttpStatus, message: string | string[]) {
    const { response, request } = this.getHttpContext(host);

    return response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private handleValidation(
    exception: BadRequestException,
    host: ArgumentsHost,
  ): void {
    const message = this.extractValidationMessage(exception);
    this.createErrorResponse(host, HttpStatus.BAD_REQUEST, message);
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

  private handleUnknown(_exception: unknown, host: ArgumentsHost): void {
    this.createErrorResponse(host, HttpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
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
