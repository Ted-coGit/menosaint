# HANDOVER.md — menosaint.xyz

세션 날짜: 2026-05-24
작업자: Ted + Claude Code

---

## 작업 요약

이번 세션에서 menosaint와 menosaint-private 두 레포에 걸쳐 다섯 가지 작업을 진행했다.

**1. sync.py output 경로 수정 (완료)**
- `OUTPUT_DEFAULT`를 `quartz/content` → `content`로 수정
- docstring과 상수 두 곳 모두 수정
- dry-run으로 6개 노트 정상 확인 후 실제 동기화 실행

**2. menosaint v4 브랜치에 sync.py 추가 및 노트 동기화 (완료, 경로 이슈 있었음)**
- `main` 브랜치에서 작업하다가 v4로 전환하는 과정에서 충돌 발생
- 최종적으로 sync.py가 v4에 신규 파일로 추가됨
- 노트 1개 업데이트 포함 커밋 (c9ccd86)

**3. menosaint-private — 링크 보관함 수정 기능 추가 (완료)**
- 링크 카드 hover 시 연필(수정) 아이콘 버튼 추가
- 수정 클릭 시 기존 데이터가 채워진 모달 열림
- 모달 타이틀 "링크 추가" ↔ "링크 수정" 동적 전환
- `closeLinkModal()` 헬퍼로 닫을 때 상태 초기화

**4. menosaint-private — 프로젝트 리스트뷰 개선 (완료)**
- `.content`의 `max-width: 900px` 제거 → 전체 너비 활용
- 컬럼 단순화: 설명 제거, 이름 | 상태 | 날짜 | 스택 | GitHub+Live | 액션
- 그리드 재설계: `1fr 88px 100px auto auto auto`
- `.plist-main`, `.plist-desc` 제거 → `.plist-name`, `.plist-stack` 추가

**5. menosaint — Noto Sans KR 로컬 폰트 적용 (완료)**
- TTF 파일을 WOFF2로 변환 (9.9MB → 3.7MB, 63% 감소)
- `fontOrigin: "local"`, typography header/body를 "Noto Sans KR"로 변경
- `custom.scss`에 `@font-face` 정의 (`font-display: swap` 포함)

---

## 성공/실패 기록

### 실패한 시도들

**main 브랜치에서 sync.py 수정 후 v4로 전환 시 충돌**
- `git stash` → `git checkout v4` 실행 시 untracked `content/` 파일들이 v4 tracked 파일과 충돌
- 에러: `error: The following untracked working tree files would be overwritten by checkout`
- 해결: `git checkout -f v4` 강제 전환 후 stash pop
- 추가 이슈: v4 브랜치에는 `sync.py`가 없어서 stash pop 시 conflict
  - 에러: `CONFLICT (modify/delete): sync.py deleted in Updated upstream`
  - 해결: `git add sync.py` (파일 유지로 해결), `git stash drop`

**fonttools pip 설치 후 사용 불가**
- `pip3 install fonttools`로 설치했으나 anaconda python 환경에서 `No module named fonttools` 오류
- 원인: pip3와 python3가 다른 환경을 가리킴 (anaconda vs system)
- 해결: `brew install woff2`로 전용 CLI 툴 설치 → `woff2_compress` 명령 사용

### 성공한 것

**sync.py 경로 수정 후 동기화 검증**
- dry-run → 실제 실행 순서로 안전하게 진행
- v4 전환 후 재실행 시 1개만 업데이트 (나머지는 이미 최신, hash 일치)

**링크 수정 기능 동작 확인 (browse로 검증)**
- hover 시 수정/삭제 버튼 노출 정상
- 수정 버튼 클릭 시 "링크 수정" 타이틀 + 기존 데이터 자동 채움 확인

**리스트뷰 전체 너비 확인 (browse 1440px 뷰포트)**
- 10개 프로젝트 행이 전체 너비에 깔끔하게 정렬됨

**WOFF2 변환 성공**
- `woff2_compress` 단일 명령으로 변환 완료
- 9.9MB → 3.7MB (브라우저 캐시 이후 재방문 시 사실상 비용 없음)

---

## 주요 결정 사항

**sync.py를 v4 브랜치에 신규 파일로 추가**
- `main`에만 있던 파일을 v4에 복사하는 방식
- 이유: v4가 Cloudflare Pages 배포 브랜치이므로 모든 도구는 v4에 있어야 함

**리스트뷰 설명(desc) 컬럼 제거**
- 사용자가 직접 요청: 이름 | 상태 | 날짜 | 스택 | 링크만 있으면 충분
- 설명이 없어야 각 컬럼이 숨쉬는 공간을 확보

**max-width 완전 제거**
- 리스트뷰만 넓게 하는 방식도 가능했으나, 전체 탭이 화면 너비를 활용하는 게 자연스러움

**fontOrigin: "local" + WOFF2**
- Google Fonts 의존성 제거, 네트워크 요청 없이 자체 서빙
- WOFF2는 현대 브라우저 전부 지원, brotli 압축으로 TTF 대비 ~60% 절약
- `font-display: swap`으로 폰트 로딩 전에도 텍스트 먼저 표시

---

## 주의사항 & 교훈

**브랜치 확인 필수**
- `menosaint` 레포는 `main`과 `v4` 두 브랜치가 공존
- `main`: 초기 커밋 2개만 있는 구버전 (거의 사용 안 함)
- `v4`: 실제 배포 브랜치. 작업 전 반드시 `git branch` 확인
- `mdeploy` alias는 `git push origin v4`이므로 현재 브랜치가 v4인지 확인 필수

**sync.py는 v4 브랜치에서 실행**
- `python3 sync.py`는 v4 checkout 상태에서 실행해야 함
- output 경로 `content/`는 v4 브랜치 루트 기준

**pip3 vs python3 환경 불일치 (anaconda)**
- `pip3 install` 후 `python3 -m module` 실행 시 module not found가 날 수 있음
- 원인: anaconda python이 system python과 다른 site-packages를 사용
- 우회: brew로 독립 CLI 툴 설치 (`brew install woff2`, `brew install fonttools` 등)

**menosaint-private hover 버튼 패턴**
- 링크 수정/삭제, 프로젝트 편집/삭제 모두 hover 시에만 표시되는 `.icon-btn` 패턴
- CSS `.link-actions`, `.project-actions`에 `opacity: 0` → hover 시 `opacity: 1` 전환

**SEED_VERSION (menosaint-private)**
- `app.js`의 시드 데이터 변경 시 반드시 `const SEED_VERSION = N` 올릴 것
- 올리지 않으면 기존 브라우저에 반영 안 됨

---

## 다음 단계

1. **gdata-viewer → Fly.io 배포**
   - `fly launch`로 Express 서버 그대로 배포
   - `gdata.menosaint.xyz` 서브도메인 연결
   - `exchange-history.json` persistent volume으로 영속화 필요
   - Cloudflare Zero Trust Access 적용 (선택)

2. **newsman 최신 업데이트**
   - `cd /Users/ted/Github/Ted-vibe-coding-lab/experiments/newsman`
   - `python3 newsman.py` 실행 (`.env` 파일 존재, 키 포함)
   - 마지막 리포트: 2026-05-21 — 현재 3일+ 누락

3. **now.md, about.md 콘텐츠 업데이트** — 더미 상태
4. **menosaint.xyz 홈 개선** — Recent Notes 섹션, 브랜딩 개성
5. **Google OAuth 연결 (선택)** — Zero Trust → Settings → Authentication

---

## 중요 파일 맵

### 이번 세션 수정 파일

```
/Users/ted/Github/menosaint/
├── sync.py                         — output 경로 수정, v4에 신규 추가
├── quartz.config.ts                — fontOrigin: local, typography: Noto Sans KR
├── quartz/styles/custom.scss       — @font-face 정의 (woff2)
├── quartz/static/fonts/
│   └── NotoSansKR-VariableFont_wght.woff2  — 변환된 폰트 (3.7MB)
├── content/notes/                  — sync 결과물 (6개 노트)
│   └── .sync-manifest.json
└── HANDOVER.md                     — 이 파일

/Users/ted/Github/menosaint-private/
├── index.html   — link-modal h3에 id="link-modal-title" 추가
├── app.js       — editLink(), closeLinkModal() 추가, save 핸들러 수정, 리스트뷰 HTML 재구성
└── style.css    — max-width 제거, 리스트뷰 그리드 재설계, plist-name/plist-stack 추가
```

### menosaint v4 브랜치 구조 (핵심)

```
menosaint/ (outer repo, v4)
├── content/                   ← 사용자 노트 (정상 tracked)
│   ├── index.md
│   ├── about.md
│   ├── now.md
│   ├── lab/
│   └── notes/
├── quartz/                    ← Quartz 프레임워크 소스
│   ├── static/fonts/          ← NotoSansKR WOFF2
│   └── styles/custom.scss     ← @font-face 정의
├── sync.py                    ← Obsidian → content/ 동기화 스크립트
├── quartz.config.ts
├── quartz.layout.ts
└── package.json
```

### 인프라 (변경 없음)

```
GitHub (공개): https://github.com/Ted-coGit/menosaint (branch: v4)
GitHub (비공개): https://github.com/Ted-coGit/menosaint-private (branch: main)

Cloudflare Pages:
  menosaint.xyz           → Ted-coGit/menosaint, v4 브랜치
  private.menosaint.xyz   → Ted-coGit/menosaint-private, main 브랜치

Cloudflare Zero Trust:
  팀명: soft-credit-4fe4
  Application: menosaint private
  Policy: only-me (Emails → jinhokyoung83@gmail.com)
```

### Shell Aliases (~/.zshrc)

```
msync-dry   — python3 sync.py --dry-run (미리보기)
msync       — python3 sync.py (동기화만)
mdeploy     — git add -A && git commit && git push origin v4
mpublish    — msync && mdeploy (전체 배포)
```

### newsman

```
/Users/ted/Github/Ted-vibe-coding-lab/experiments/newsman/
├── newsman.py         — 메인 실행 파일
├── config.yaml        — 추적 기업 watchlist
├── .env               — ANTHROPIC_API_KEY, BRAVE_API_KEY
└── output/
    └── 2026-05-21.md  — 마지막 리포트 (3일+ 누락)
```
