import { HttpStatus } from '@nestjs/common';

export class ErrorCode {
  static readonly POST_NOT_FOUND = new ErrorCode(
    HttpStatus.NOT_FOUND,
    '해당 게시글이 존재하지 않습니다.',
  );
  static readonly USER_NOT_FOUND = new ErrorCode(
    HttpStatus.NOT_FOUND,
    '해당 유저가 존재하지 않습니다.',
  );
  static readonly POST_FORBIDDEN = new ErrorCode(
    HttpStatus.FORBIDDEN,
    '게시글에 접근할 권한이 없습니다.',
  );

  private constructor(
    readonly status: HttpStatus,
    readonly message: string,
  ) {}
}
