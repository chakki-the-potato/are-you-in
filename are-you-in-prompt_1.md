# MeetCast — 팀 일정 투표 웹앱 개발 프롬프트

## 프로젝트 개요

When2meet처럼 누구나 무료로 사용할 수 있는 팀 일정 투표 웹앱.
로그인 없이 닉네임만으로 약속을 생성하고 투표할 수 있다.

### 핵심 가치
- **진입 장벽 제로**: 회원가입, 로그인 없음. 닉네임만 입력하면 끝.
- **타임테이블 기반**: 생성자가 가용 시간을 입력하고, 그 중 우선 옵션(최대 3개)을 뽑아 투표에 올린다.
- **반응형 UI**: 모바일, 데스크탑 모두 한 눈에 보기 좋게.

---

## 기술 스택

| 구성 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Next.js (App Router) | 15.x |
| 언어 | TypeScript | 5.x |
| 스타일링 | Tailwind CSS | 4.x |
| DB + Realtime | Supabase (PostgreSQL) | - |
| 비밀번호 해싱 | bcrypt (bcryptjs) | - |
| 배포 | Vercel | - |

---

## 사용자 역할 및 인증

### 생성자 (Creator)
- 약속 생성 시 **닉네임 + 약속 비밀번호** 입력 (필수)
- 비밀번호는 약속 수정/확정/재투표 등 관리 기능에 접근할 때 사용
- 비밀번호는 bcrypt로 해싱하여 DB 저장
- 생성자도 PARTICIPANTS 테이블에 `is_creator: true`로 저장되어 본인도 투표/타임테이블 참여 가능

### 참여자 (Participant)
- URL 또는 약속 이름 검색으로 진입
- **닉네임만 입력**하면 바로 투표/타임테이블 참여 가능
- 이메일, 로그인 없음

### 관리자 접근 방식
- 약속 페이지에 자물쇠 아이콘(관리자 버튼) 존재
- 클릭 시 비밀번호 입력 모달 → 인증 성공 시 관리자 패널 활성화
- 같은 URL에서 비밀번호 입력 여부로 참여자 뷰 / 관리자 뷰 분기

---

## 핵심 사용자 플로우

### 생성자 플로우
1. 메인 페이지 → "약속 만들기" 클릭
2. 기본 정보 입력: 약속 제목, 설명(선택), 최소 참여 인원, 닉네임, 비밀번호
3. 날짜 선택 + 시간 범위 설정 (예: 4/20, 10:00 ~ 18:00)
4. 타임테이블에서 본인 가용 시간 드래그 선택
5. 타임테이블 위에서 셀 탭 → 핀 꽂기 → 우선 옵션 등록 (최대 3개)
6. 생성 완료 → URL 복사하여 공유

### 참여자 플로우
1. URL 클릭 또는 메인 페이지에서 약속 이름 검색
2. 닉네임 입력
3. 우선 옵션에 대해 Accept / Decline 투표 (빠른 투표)
4. (선택) 타임테이블 열어서 본인 가용 시간 전체 입력
5. (선택) 옵션 전부 불가 시 대안 시간 제안

### 확정 플로우
1. 최소 인원 달성 시 → 페이지에 "확정 가능" 표시
2. 생성자가 자물쇠 → 비밀번호 입력 → 관리자 패널에서 확정 버튼 클릭
3. 약속 상태가 "confirmed"로 변경, 확정된 옵션 표시
4. 미달성 시 → 생성자가 타임테이블 히트맵 참고하여 새 옵션 추가 → 재투표

---

## 페이지 구조

### 1. 메인 페이지 (`/`)
- 약속 이름 검색 바 (검색 결과: 제목, 생성자 닉네임, 생성 날짜 표시)
- "약속 만들기" CTA 버튼
- 간단한 서비스 소개

### 2. 약속 생성 페이지 (`/create`)
- Step 1: 기본 정보 폼 (제목, 설명, 최소 인원, 닉네임, 비밀번호)
- Step 2: 날짜 선택 + 시간 범위 설정
- Step 3: 타임테이블 (본인 가용 시간 드래그 입력 + 우선 옵션 핀 꽂기)
- Step 4: 생성 완료 → URL 표시 + 복사 버튼

### 3. 약속 페이지 (`/event/[slug]`)
- 약속 정보 헤더 (제목, 설명, 최소 인원, 현재 참여자 수, 상태)
- 닉네임 입력 영역 (참여 전)
- 우선 옵션 투표 카드 (각 옵션별 Accept/Decline 버튼 + 실시간 카운트)
- 타임테이블 섹션 (접기/펼치기, 겹침 히트맵)
- 대안 시간 제안 섹션
- 자물쇠 아이콘 → 관리자 패널 (비밀번호 인증 후)
  - 옵션 수정/추가
  - 확정 버튼
  - 재투표 트리거

---

## 데이터베이스 스키마 (Supabase PostgreSQL)

### EVENTS 테이블
```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  creator_nickname TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  event_date DATE NOT NULL,
  range_start TIME NOT NULL,
  range_end TIME NOT NULL,
  min_participants INT NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'confirmed', 'closed')),
  confirmed_option_id UUID REFERENCES time_options(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### PARTICIPANTS 테이블
```sql
CREATE TABLE participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  is_creator BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(event_id, nickname)
);
```

### TIME_OPTIONS 테이블
```sql
CREATE TABLE time_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  priority INT NOT NULL CHECK (priority BETWEEN 1 AND 3)
);
```

### VOTES 테이블
```sql
CREATE TABLE votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  option_id UUID REFERENCES time_options(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  response TEXT NOT NULL CHECK (response IN ('accept', 'decline')),
  voted_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(option_id, participant_id)
);
```

### TIMETABLE_SLOTS 테이블
```sql
CREATE TABLE timetable_slots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL
);
```

### ALT_SUGGESTIONS 테이블
```sql
CREATE TABLE alt_suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  participant_id UUID REFERENCES participants(id) ON DELETE CASCADE,
  suggested_start TIMESTAMPTZ NOT NULL,
  suggested_end TIMESTAMPTZ NOT NULL,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## API Routes (Next.js API Routes)

### 약속 관련
- `POST /api/events` — 약속 생성 (title, description, creator_nickname, password, event_date, range_start, range_end, min_participants, time_options[], timetable_slots[])
- `GET /api/events/[slug]` — 약속 상세 조회
- `GET /api/events/search?q=검색어` — 약속 이름 검색
- `POST /api/events/[slug]/verify` — 관리자 비밀번호 검증
- `PATCH /api/events/[slug]/confirm` — 약속 확정 (비밀번호 필요)
- `PATCH /api/events/[slug]/options` — 옵션 수정/추가 (비밀번호 필요)

### 참여자 관련
- `POST /api/events/[slug]/join` — 참여자 등록 (nickname)
- `POST /api/events/[slug]/vote` — 투표 (participant_id, option_id, response)
- `POST /api/events/[slug]/timetable` — 타임테이블 가용 시간 저장
- `POST /api/events/[slug]/suggest` — 대안 시간 제안

---

## 타임테이블 UI 스펙

### 그리드 구조
- 세로축: 시간 (range_start ~ range_end, 15분 간격)
- 가로축: 날짜 (단일 날짜 또는 복수 날짜)
- 셀 크기: 최소 높이 24px, 너비는 반응형

### 인터랙션
- **드래그 선택**: 마우스/터치로 셀을 드래그하여 가용 시간 범위 선택
- **핀 꽂기** (생성자 전용): 선택한 셀을 탭하면 핀 아이콘 + "옵션 A/B/C" 라벨 표시
- **히트맵**: 참여자들의 겹치는 시간대를 색상 농도로 표시 (진할수록 많이 겹침)

### 반응형
- 데스크탑: 전체 그리드 한 화면에 표시
- 모바일: 날짜별 1열 표시, 좌우 스와이프로 날짜 전환

---

## 실시간 기능 (Supabase Realtime)

- VOTES 테이블 변경 구독 → 투표 카운트 실시간 업데이트
- TIMETABLE_SLOTS 테이블 변경 구독 → 히트맵 실시간 업데이트
- PARTICIPANTS 테이블 변경 구독 → 참여자 수 실시간 업데이트

---

## 추가 참고사항

### slug 생성 규칙
- 제목을 URL-safe 문자열로 변환 (한글 → 그대로 인코딩 or 영문 변환)
- 중복 시 뒤에 랜덤 4자리 추가 (예: `team-meeting`, `team-meeting-a3k7`)

### 보안
- 비밀번호는 bcrypt (salt rounds: 10)으로 해싱하여 저장
- API Route에서 비밀번호 검증 후 세션 쿠키 또는 JWT 발급하여 관리자 상태 유지
- Supabase Row Level Security (RLS) 활성화

### 상태 관리
- 약속 상태: `open` → `confirmed` → `closed`
- `open`: 투표 진행 중
- `confirmed`: 최소 인원 달성 + 생성자 확정
- `closed`: 약속 종료 또는 만료

---

## 개발 순서

1. **프로젝트 세팅**: Next.js + TypeScript + Tailwind + Supabase 연동
2. **DB 스키마**: Supabase에서 테이블 생성 + RLS 정책
3. **약속 생성 플로우**: 생성 페이지 → API → DB 저장 → slug URL 생성
4. **약속 조회 + 검색**: 메인 페이지 검색 + slug 페이지 렌더링
5. **옵션 투표**: Accept/Decline UI + API + 실시간 카운트
6. **타임테이블**: 드래그 선택 그리드 + 히트맵 + 반응형
7. **관리자 기능**: 비밀번호 인증 + 확정 + 옵션 수정 + 재투표
8. **UI 폴리싱**: 반응형 최적화, 에러 처리, 로딩 상태
9. **배포**: Vercel 연결 + 환경변수 설정

---

## 환경변수

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
