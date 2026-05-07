# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm start:dev        # 개발 서버 (hot reload)
pnpm build            # 프로덕션 빌드
pnpm test             # 단위 테스트 전체 실행
pnpm test:watch       # 테스트 감시 모드
pnpm test:cov         # 커버리지 포함 테스트
pnpm test:e2e         # E2E 테스트
pnpm lint             # ESLint 자동 수정
pnpm format           # Prettier 포맷팅
```

단일 테스트 파일 실행:
```bash
pnpm test -- --testPathPattern=users.service
```

## 기술 스택

- **Framework**: NestJS v11 (Express 기반)
- **Language**: TypeScript 5.7 (`nodenext` 모듈 시스템)
- **ORM**: TypeORM + SQLite (`better-sqlite3`)
- **Validation**: class-validator + class-transformer
- **Password**: bcrypt
- **Test**: Jest + Supertest

## 아키텍처

### 모듈 구조
NestJS 표준 모듈 패턴을 따른다. 각 도메인(users, posts)은 독립 모듈로 분리되며 `AppModule`에 등록된다.

```
src/
├── common/filters/http-exception.filter.ts  # 전역 에러 응답 포맷
├── users/                                    # 유저 도메인
└── posts/                                    # 게시글 도메인 (Board 없는 독립 엔티티)
```

### 전역 설정 (`main.ts`)
- `ValidationPipe`: `whitelist: true`, `forbidNonWhitelisted: true`, `transform: true`
- `HttpExceptionFilter`: 에러 응답을 `{ statusCode, message, timestamp }` 포맷으로 통일

### 에러 처리 규칙
| 상황 | 예외 |
|------|------|
| 리소스 없음 | `NotFoundException` (404) |
| 이메일 중복 | `ConflictException` (409) |
| 유효하지 않은 입력 | ValidationPipe가 자동으로 400 반환 |

### User 엔티티 특이사항
- `password` 컬럼은 `select: false` — 일반 `findOne` 조회에서 자동 제외됨
- 이름 필드는 `name` (username 아님)

### DTO 패턴
- `create-*.dto.ts`: `@IsNotEmpty()`, `@IsEmail()` 등 class-validator 데코레이터 사용
- `update-*.dto.ts`: 동일 필드에 `@IsOptional()` 추가 (PartialType 미사용)
- 쿼리 파라미터 숫자 변환: `@Type(() => Number)` + ValidationPipe `transform: true`

### DB 설정
- 개발: `db.sqlite` 파일, `synchronize: true`
- 테스트: `:memory:` SQLite 인메모리
