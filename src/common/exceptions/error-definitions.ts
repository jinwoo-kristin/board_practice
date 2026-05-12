import { HttpStatus } from '@nestjs/common';

export type ErrorDefinition = Readonly<{
  code: string;
  status: HttpStatus;
  message: string;
}>;

export const POST_NOT_FOUND: ErrorDefinition = {
  code: 'POST_NOT_FOUND',
  status: HttpStatus.NOT_FOUND,
  message: '해당 게시글이 존재하지 않습니다.',
};

export const USER_NOT_FOUND: ErrorDefinition = {
  code: 'USER_NOT_FOUND',
  status: HttpStatus.NOT_FOUND,
  message: '해당 유저가 존재하지 않습니다.',
};

export const POST_FORBIDDEN: ErrorDefinition = {
  code: 'POST_FORBIDDEN',
  status: HttpStatus.FORBIDDEN,
  message: '게시글에 접근할 권한이 없습니다.',
};
