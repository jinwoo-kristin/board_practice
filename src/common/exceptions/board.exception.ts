import { HttpException } from '@nestjs/common';
import { ErrorCode } from './error-code';

export class BoardException extends HttpException {
  constructor(readonly errorCode: ErrorCode) {
    super(errorCode.message, errorCode.status);
  }
}
