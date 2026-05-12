import { HttpException } from '@nestjs/common';
import { ErrorDefinition } from './error-definitions';

export class BoardException extends HttpException {
  constructor(readonly error: ErrorDefinition) {
    super({ code: error.code, message: error.message }, error.status);
  }
}
