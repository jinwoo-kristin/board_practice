# Board Practice

NestJS, TypeScript 학습을 위한 게시판 CRUD 프로젝트

## 학습 목표

- NestJS 핵심 개념 실습
- TypeORM을 활용한 데이터베이스 연동
- TDD 기반 테스트 작성
- 공통 에러 처리 및 API 응답 포맷 통일

## 기술 스택

| 분류 | 기술 |
|------|------|
| Framework | NestJS v11 |
| Language | TypeScript 5.7 |
| ORM | TypeORM |
| Database | SQLite |
| Testing | Jest, Supertest |

## Phas 1. 데이터베이스 연동

- [ ] SQLLite DB 사용
- [ ] TypeORM 기반 데이터베이스 연동

## Phase 2. 구현 기능 목록

### Entity 설계

**User**
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | number | PK, Auto Increment |
| name | string | 사용자명 |
| email | string | 이메일 (unique) |
| createdAt | Date | 생성일 |
| updatedAt | Date | 수정일 |

**Post (게시글)**
| 컬럼 | 타입 | 설명 |
|------|------|------|
| id | number | PK, Auto Increment |
| title | string | 제목 |
| content | string | 내용 |
| user_id | User | FK (User 1:N Post) |
| createdAt | Date | 생성일 |
| updatedAt | Date | 수정일 |


### API 엔드포인트

#### 유저 (User)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /users/signup | 회원가입 |
| GET | /users/:id | 유저 단건 조회 |

#### 게시글 (Post)

| Method | Endpoint | 설명 |
|--------|----------|------|
| GET | /boards/:boardId/posts | 게시글 목록 (페이지네이션 + 검색) |

---

## 실행 방법

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm start:dev

# 프로덕션 빌드 및 실행
pnpm build
pnpm start:prod
```
