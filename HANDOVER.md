절차 정본: SOP.md (SOP-MENOSAINT, 0.1 초안. 정해진 반복 절차 없음)

# HANDOVER.md — menosaint.xyz

최근 갱신: 2026-11-01 (Claude, /handover)
이전 세션: 2026-05-25 (Ted + Claude Code)

## 현재 상태

- 저장소: v4 브랜치. 2026-11-01 기준 로컬 커밋 3개(3fc5ea7, 162db79, db4e202)가 원격보다 앞서 있다. push하지 않았다.
- 사이트 레이아웃은 아직 Quartz 기본 3단(왼쪽 탐색기, 가운데 본문, 오른쪽 목차)이다. 2026-05-25에 스타일만 다듬었다.
- 홈 개선 방향이 2026-11-01에 정해졌다. 글 중심, 카드 목록 홈. 레퍼런스는 daleseo.com. 실제 코드 변경은 아직 없다.

## 2026-11-01 세션 요약

- daleseo.com을 menosaint 홈 개선 레퍼런스로 다음 단계 4번에 기록했다(3fc5ea7).
- Ted가 마음에 든 점을 원문 그대로 기록했다(162db79).
- gstack browse로 daleseo.com 홈과 글 한 편을 열어 구조를 쟀고, Ted의 방향 결정과 함께 기록했다(db4e202). 스크린샷은 세션 scratchpad에만 있고 저장소에는 넣지 않았다.
- /handover로 이 문서를 정리하고, 4벌 원칙(Legion System 17번)에 따라 빠져 있던 Log.md와 SOP.md를 최소형으로 만들었다. README.md는 Quartz 원본 README라 손대지 않았다.

## 2026-05-25 세션 요약

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

## 성공/실패 기록

### 실패한 시도

- 2026-05-25: 없음. 모두 첫 시도에 성공.
- 2026-11-01: 없음.

### 주의했던 것 (2026-05-25)

탐색기 노트 아이템이 처음에는 변경되지 않은 것처럼 보임
- 폴더명만 수정한 첫 빌드 결과 확인 시 노트 목록이 펼쳐지지 않은 상태였음
- browse로 Notes 폴더를 클릭했더니 `/notes/` 페이지로 이동 (토글이 아닌 링크로 작동)
- 이후 snapshot -i로 구조 확인 후 노트 아이템 항목이 이미 펼쳐진 상태임을 확인하고 스크린샷으로 검증

빌드 결과 확인 시 뷰포트 크기
- 기본 뷰포트로는 양쪽 패널이 좁아져 목차가 잘 보이지 않음
- `$B viewport 1440x900` → `screenshot --clip 0,0,1440,500`으로 상단 영역만 고해상도 확인

### 성공한 것

- 2026-05-25: 모든 변경사항 Cloudflare Pages 빌드 정상 반영 확인. browse로 스크린샷 검증 후 사용자 확인 완료.
- 2026-11-01: daleseo.com 실측. 홈 2열 카드, 글 본문 폭 700px, 본문 18px, 행간 28.8px(1.6), 목차·탐색기 없음. 근거는 browse의 computed style 측정과 viewport 스크린샷.

## 주요 결정 사항

홈 개선은 글 중심 레이아웃으로 간다 (2026-11-01, Ted 결정)
- 이 작업은 스타일 수정이 아니라 레이아웃 변경이다.
- 지금까지 미뤄 온 이유는 목차와 구성을 먼저 생각했기 때문이다. 구조를 먼저 짜지 않고 글 한 편 한 편에 집중하는 편이 시작이 빠르고 지속 가능하다.

font-size 기준: 0.85rem (사이드 패널) vs 0.78rem (메타) vs 0.75rem (태그) (2026-05-25)
- 사이드 패널(탐색기, 목차): `0.85rem` — 내비게이션 역할, 충분히 읽혀야 함
- 날짜/read time: `0.78rem` — 보조 정보, 존재감을 낮춤
- 태그: `0.75rem` — 가장 부수적인 요소

color: var(--gray) for contentMeta (2026-05-25)
- 기존 `--darkgray`보다 한 단계 더 흐린 `--gray` 사용
- 제목과 시각적 계층을 명확히 분리

$sidePanelWidth: 320px → 352px (2026-05-25)
- 10% 확대로 좌우 패널에 텍스트 여유 공간 확보
- 가운데 영역은 `auto`이므로 별도 수정 없이 자동 조정됨
- 2026-11-01 결정으로 사이드 패널을 빼는 방향이 되어, 이 값은 레이아웃 변경 때 의미가 없어질 수 있다.

## 승인 대기·미검증

- 승인 대기: Claude가 제안한 홈 개선 순서(아래 다음 단계 4번). Ted가 아직 승인하지 않았다. 특히 "사이드 패널 제거와 본문 폭 조정을 지금 진행할까"에 답이 없다.
- 미검증: Quartz로 카드형 홈(대표 이미지 포함)을 어디까지 만들 수 있는지 확인하지 않았다.
- 미검증: daleseo.com 홈 상단의 큰 빈 영역이 광고 자리인지 확인하지 않았다(추정).
- 미검증: newsman 경로 `/Users/ted/...`는 2026-05-25 기록이다. 지금 머신의 홈 폴더는 `/Users/hokyoung`이라 그 경로가 존재하는지 확인하지 않았다.
- 판단 필요: 저장소 README.md가 Quartz 원본 README다. menosaint 자체의 README(시작일·목적)를 어디에 둘지 정하지 않았다. Quartz README를 덮어쓰지 않으려고 이번에 손대지 않았다.

## 주의사항 & 교훈

브랜치 확인 필수
- `menosaint` 레포는 `main`과 `v4` 두 브랜치가 공존
- `main`: 초기 커밋 2개만 있는 구버전 (거의 사용 안 함)
- `v4`: 실제 배포 브랜치. 작업 전 반드시 `git branch` 확인
- `mdeploy` alias는 `git push origin v4`이므로 현재 브랜치가 v4인지 확인 필수

Quartz 스타일 구조: 두 곳에 분리
- `quartz/styles/` — 전역 스타일 (base.scss, variables.scss, custom.scss)
- `quartz/components/styles/` — 컴포넌트별 스타일 (explorer.scss, toc.scss, contentMeta.scss 등)
- font-weight 변수: `$normalWeight(400)`, `$semiBoldWeight(600)`, `$boldWeight(700)` — variables.scss에 정의

Quartz의 `a` 태그 기본 스타일이 semiBold(600)
- `base.scss` 의 `a { font-weight: $semiBoldWeight }` 가 전체에 적용됨
- 태그, 링크 등 font-weight를 가볍게 하려면 해당 selector에서 명시적으로 `$normalWeight`로 오버라이드해야 함

pip3 vs python3 환경 불일치 (anaconda)
- `pip3 install` 후 `python3 -m module` 실행 시 module not found 가능
- 우회: brew로 독립 CLI 툴 설치

SEED_VERSION (menosaint-private)
- `app.js`의 시드 데이터 변경 시 반드시 `const SEED_VERSION = N` 올릴 것

레이아웃 작업도 "구조 먼저"가 될 수 있다 (2026-11-01)
- 미뤄 온 원인이 구성을 먼저 생각한 것이라면, 레이아웃을 완성하고 글을 쓰겠다는 순서도 같은 함정이다. 글을 먼저 쓰고 레이아웃은 최소 변경부터.

## 다음 단계

1. gdata-viewer → Fly.io 배포
	- `fly launch`로 Express 서버 그대로 배포
	- `gdata.menosaint.xyz` 서브도메인 연결
	- `exchange-history.json` persistent volume으로 영속화 필요
	- Cloudflare Zero Trust Access 적용 (선택)
2. newsman 최신 업데이트
	- `cd /Users/ted/Github/Ted-vibe-coding-lab/experiments/newsman` (2026-05-25 기록 경로, 현재 머신에서 미확인)
	- `python3 newsman.py` 실행 (`.env` 파일 존재, 키 포함)
	- 마지막 리포트: 2026-05-21 (2026-05-25 기준 기록. 이후 상태 확인 안 함)
3. now.md, about.md 콘텐츠 업데이트 — 더미 상태
4. menosaint.xyz 홈 개선 — Recent Notes 섹션, 브랜딩 개성
	- 지향 레퍼런스: https://daleseo.com/ (2026-11-01 Ted가 "바랐던 menosaint 모습에 가깝다"고 메모)
	- 마음에 든 점(Ted): 특별한 형식 없이 카드 목록을 보여준다. 직관적인 제목과 단순한 이미지. 카드를 클릭하면 가독성 높은 글이 나온다. 제목과 글을 보여주는 데 최적화된 방식이다.
	- 실측 (2026-11-01, 1440px 화면): 홈은 상단 바(로고, 카테고리 5개, About, 다크모드, 검색) 아래 "1022 posts" 한 줄, 그 아래 2열 카드(대표 이미지 + 제목 + 요약 두어 줄). 사이드 패널 없음. 글 화면은 가운데 정렬 제목, 대표 이미지, 본문 폭 약 700px, 본문 18px / 행간 1.6, 목차·탐색기 없음. 홈 상단의 큰 빈 영역은 광고 자리로 보임(확인 안 함).
	- 방향 결정 (Ted): 이 작업은 스타일 수정이 아니라 레이아웃 변경이다. 지금까지 미뤄 온 이유는 목차와 구성을 먼저 생각했기 때문이고, 구조를 먼저 짜지 않고 글 한 편 한 편에 집중하는 편이 시작이 빠르고 지속 가능하다고 판단함.
	- Claude 제안 순서 (2026-11-01, 승인 대기):
		- 1) 글 한 편을 먼저 쓴다. 사이트가 아직 예쁘지 않아도 된다.
		- 2) 최소 레이아웃 변경: `quartz.layout.ts`에서 탐색기와 목차를 빼고 본문 폭을 700px 안팎으로 좁힌다. 소요는 반나절 이하로 추정.
		- 3) 카드 목록 홈은 글이 몇 편 쌓인 뒤에 만든다. 카드 이미지는 글마다 대표 이미지 필드가 필요하다.
	- 기각한 선택지: 다른 블로그 엔진(Astro, Hugo 등)으로 이전. `sync.py` 동기화와 Cloudflare 배포를 다시 맞춰야 하고, 그 자체가 또 하나의 "먼저 하는 구조 작업"이 된다.
	- 시작 조건: Ted가 위 순서를 승인하거나 고칠 것.
5. Google OAuth 연결 (선택) — Zero Trust → Settings → Authentication

## 중요 파일 맵

### 2026-05-25 세션 수정 파일

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

### 홈 개선 때 손댈 곳 (2026-11-01 추정, 미확인)

- `quartz.layout.ts` — 좌우 패널 구성(탐색기, 목차)
- `quartz/styles/variables.scss` — 패널·본문 폭 변수

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
├── HANDOVER.md / Log.md / SOP.md  ← 인계 문서 (README.md는 Quartz 원본)
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

### newsman (2026-05-25 기록 경로, 현재 머신에서 미확인)

```
/Users/ted/Github/Ted-vibe-coding-lab/experiments/newsman/
├── newsman.py         — 메인 실행 파일
├── config.yaml        — 추적 기업 watchlist
├── .env               — ANTHROPIC_API_KEY, BRAVE_API_KEY
└── output/
    └── 2026-05-21.md  — 마지막 리포트
```
