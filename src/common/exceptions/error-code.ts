import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  private static readonly INSTANCE = new ErrorCode();

  status!: HttpStatus;
  message!: string;

  private constructor() {}

  static POST_NOT_FOUND(): ErrorCode {
    ErrorCode.INSTANCE.status = HttpStatus.NOT_FOUND;
    ErrorCode.INSTANCE.message = '해당 게시글이 존재하지 않습니다.';
    return ErrorCode.INSTANCE;
  }

  static USER_NOT_FOUND(): ErrorCode {
    ErrorCode.INSTANCE.status = HttpStatus.NOT_FOUND;
    ErrorCode.INSTANCE.message = '해당 유저가 존재하지 않습니다.';
    return ErrorCode.INSTANCE;
  }

  static POST_FORBIDDEN(): ErrorCode {
    ErrorCode.INSTANCE.status = HttpStatus.FORBIDDEN;
    ErrorCode.INSTANCE.message = '게시글에 접근할 권한이 없습니다.';
    return ErrorCode.INSTANCE;
  }
}
