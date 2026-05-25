# HANDOVER.md — menosaint.xyz

세션 날짜: 2026-05-25
작업자: Ted + Claude Code

---

## 작업 요약

이번 세션은 menosaint.xyz UI 타이포그래피 및 레이아웃 전반을 개선하는 작업이었다.

### 1. 탐색기(Explorer) 폰트 경량화 (완료)

- 폴더명(Lab, Notes): `font-weight 600, 0.95rem` → `font-weight 400, 0.85rem`
- 노트 아이템: font-size/weight 미지정(브라우저 기본) → `font-weight 400, 0.85rem, var(--headerFont)` 명시
- 결과: 폴더명과 노트 아이템이 색만 다르고 크기·weight 동일해짐

### 2. 날짜/read time (contentMeta) 개선 (완료)

- `margin-top: 0` → `margin-top: 0.5rem` (제목과 간격 확보)
- `font-size` 명시 → `0.78rem`
- `color: var(--darkgray)` → `color: var(--gray)` (더 흐리게)

### 3. 태그(tag-link) 스타일 경량화 (완료)

- `font-size: 0.75rem`, `font-weight: 400($normalWeight)` 추가
- 기존에는 `a` 태그 기본 스타일인 `font-weight: 600`이 그대로 상속되고 있었음

### 4. 사이드 패널 너비 확대 (완료)

- `$sidePanelWidth: 320px` → `352px` (약 10% 확대)
- 좌우 패널이 동시에 넓어지고 가운데 콘텐츠 영역은 `auto`이므로 자동으로 좁아짐

### 5. 목차(TOC) 폰트 통일 (완료)

- 오른쪽 패널 목차 항목: font-size/weight 미지정 → `0.85rem, 400, var(--headerFont)`
- 왼쪽 탐색기와 동일한 스타일로 양쪽 패널 균형 맞춤

---

## 성공/실패 기록

### 실패한 시도

없음. 이번 세션은 모두 첫 시도에 성공.

### 주의했던 것

**탐색기 노트 아이템이 처음에는 변경되지 않은 것처럼 보임**
- 폴더명만 수정한 첫 빌드 결과 확인 시 노트 목록이 펼쳐지지 않은 상태였음
- browse로 Notes 폴더를 클릭했더니 `/notes/` 페이지로 이동 (토글이 아닌 링크로 작동)
- 이후 snapshot -i로 구조 확인 후 노트 아이템 항목이 이미 펼쳐진 상태임을 확인하고 스크린샷으로 검증

**빌드 결과 확인 시 뷰포트 크기**
- 기본 뷰포트로는 양쪽 패널이 좁아져 목차가 잘 보이지 않음
- `$B viewport 1440x900` → `screenshot --clip 0,0,1440,500`으로 상단 영역만 고해상도 확인

### 성공한 것

- 모든 변경사항 Cloudflare Pages 빌드 정상 반영 확인
- browse로 스크린샷 검증 후 사용자 확인 완료

---

## 주요 결정 사항

**font-size 기준: 0.85rem (사이드 패널) vs 0.78rem (메타) vs 0.75rem (태그)**
- 사이드 패널(탐색기, 목차): `0.85rem` — 내비게이션 역할, 충분히 읽혀야 함
- 날짜/read time: `0.78rem` — 보조 정보, 존재감을 낮춤
- 태그: `0.75rem` — 가장 부수적인 요소

**color: var(--gray) for contentMeta**
- 기존 `--darkgray`보다 한 단계 더 흐린 `--gray` 사용
- 제목과 시각적 계층을 명확히 분리

**$sidePanelWidth: 320px → 352px**
- 10% 확대로 좌우 패널에 텍스트 여유 공간 확보
- 가운데 영역은 `auto`이므로 별도 수정 없이 자동 조정됨

---

## 주의사항 & 교훈

**브랜치 확인 필수**
- `menosaint` 레포는 `main`과 `v4` 두 브랜치가 공존
- `main`: 초기 커밋 2개만 있는 구버전 (거의 사용 안 함)
- `v4`: 실제 배포 브랜치. 작업 전 반드시 `git branch` 확인
- `mdeploy` alias는 `git push origin v4`이므로 현재 브랜치가 v4인지 확인 필수

**Quartz 스타일 구조: 두 곳에 분리**
- `quartz/styles/` — 전역 스타일 (base.scss, variables.scss, custom.scss)
- `quartz/components/styles/` — 컴포넌트별 스타일 (explorer.scss, toc.scss, contentMeta.scss 등)
- font-weight 변수: `$normalWeight(400)`, `$semiBoldWeight(600)`, `$boldWeight(700)` — variables.scss에 정의

**Quartz의 `a` 태그 기본 스타일이 semiBold(600)**
- `base.scss` 의 `a { font-weight: $semiBoldWeight }` 가 전체에 적용됨
- 태그, 링크 등 font-weight를 가볍게 하려면 해당 selector에서 명시적으로 `$normalWeight`로 오버라이드해야 함

**pip3 vs python3 환경 불일치 (anaconda)**
- `pip3 install` 후 `python3 -m module` 실행 시 module not found 가능
- 우회: brew로 독립 CLI 툴 설치

**SEED_VERSION (menosaint-private)**
- `app.js`의 시드 데이터 변경 시 반드시 `const SEED_VERSION = N` 올릴 것

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
   - 마지막 리포트: 2026-05-21 — 현재 4일+ 누락

3. **now.md, about.md 콘텐츠 업데이트** — 더미 상태
4. **menosaint.xyz 홈 개선** — Recent Notes 섹션, 브랜딩 개성
5. **Google OAuth 연결 (선택)** — Zero Trust → Settings → Authentication

---

## 중요 파일 맵

### 이번 세션 수정 파일

```
/Users/hokyoung/Library/Projects/GitHub/menosaint/

quartz/styles/
├── variables.scss          — $sidePanelWidth: 320px → 352px
├── base.scss               — .tag-link에 font-size 0.75rem, font-weight 400 추가
└── custom.scss             — @font-face (변경 없음)

quartz/components/styles/
├── explorer.scss           — 폴더명/노트 아이템 font-size 0.85rem, weight 400
├── toc.scss                — 목차 항목 font-size 0.85rem, weight 400
└── contentMeta.scss        — margin-top 0.5rem, font-size 0.78rem, color var(--gray)
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
│   ├── static/fonts/          ← NotoSansKR WOFF2 (3.7MB)
│   ├── styles/                ← 전역 스타일
│   └── components/styles/     ← 컴포넌트별 스타일
├── sync.py                    ← Obsidian → content/ 동기화 스크립트
├── quartz.config.ts           ← fontOrigin: local, typography: Noto Sans KR
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
    └── 2026-05-21.md  — 마지막 리포트 (4일+ 누락)
```
