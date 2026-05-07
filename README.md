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

- [x] SQLLite DB 사용
- [x] TypeORM 기반 데이터베이스 연동

## Phase 2. 기능 구현

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
| POST | /users | 회원가입 |
| GET | /users/:id | 유저 단건 조회 |

### 기능 구현 목록

- [x] 유저 생성
  - [x]  validation
      - [x] email / name / password string empty 에러 처리
  - [x]  password 암호화 후 DB 저장
- [x] 유저 조회
  - [x] validation
    - [x] 404 에러

#### 게시글 (Post)

| Method | Endpoint | 설명 |
|--------|----------|------|
| POST | /posts | 게시글 생성 |

- [x] 게시글 생성
  - [x] validation
    - [x] title / content string empty 에러 처리
    - [x] user 404 에러 처리
- [ ] 게시글 조회
- [ ] 게시글 삭제
- [ ] 게시글 수정

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
