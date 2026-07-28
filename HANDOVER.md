# HANDOVER.md — menosaint

세션 날짜: 2026-07-25 ~ 07-28
작업자: Ted + Claude Code
브랜치: `v5` (신규). `v4`는 롤백용으로 보존
설계 문서: `PLAN.md` (이 문서보다 상세하다. 먼저 읽을 것)

이전 세션 핸드오버(2026-05-25, Quartz UI 작업)는 git 히스토리에 있다.

---

## 작업 요약

Quartz 4 기반 디지털 가든을 Astro 5 기반 개인 운영 거점으로 재구성했다.
레퍼런스는 https://heeho.net 이고, 베낀 것은 디자인이 아니라 자동화 설계다.

### 완료

레퍼런스 분석
- heeho.net 기술 스택 전부 파악. Astro v5, Tailwind v4, GitHub Pages, Partytown,
  PixiJS v8(Life Map), giscus, Expressive Code, 자체 방문자 API
- 검색에 Pagefind/Fuse를 안 쓰고 프리렌더 + vanilla JS DOM 필터를 쓴다는 것이
  가장 중요한 발견. 우리도 같은 선택
- 본인이 제작 과정을 글로 남겨둠 (`/contents/productivity/building-portfolio-blog/`)

기반 구축
- `v5` 브랜치 생성, Quartz upstream 전부 제거, Astro 루트 스캐폴드
- 고정 사이드바, 원페이지 앵커, 스크롤 스파이, 모바일 오프캔버스
- SEO 메타 일습 (canonical, OG, twitter, sitemap, RSS 링크), 404 페이지
- Cloudflare Pages 빌드 설정을 Quartz용 → Astro용으로 변경 (API PATCH)

콘텐츠 구조
- Phase 0 데이터를 vault에서 추출 (experience, certifications, now, knowledge)
- 중심축을 Skills(역량)에서 Knowledge(지식)로 전환
- notes 컬렉션 구현 — 목록(검색·필터·정렬), 상세, sync.py Astro 이관
- 활동 히트맵(지덕체부복 5행 × 53주)을 Now 섹션 아래에 배치

디자인
- 레퍼런스의 시각적 시그니처 다섯 개를 제거하고 에디토리얼 톤으로 전환
- 메인 이미지 교체

문서
- `PLAN.md` 13절까지 작성. 방향 수정, 채널 전략, 캐시 퍼지 절차, 다음 작업 로드맵
- vault에 프로젝트 노트와 지식 노트 각 1개 작성

### 현재 상태

```
프리뷰    https://v5.menosaint.pages.dev/   Astro (v5)
프로덕션  https://menosaint.xyz/            Quartz (v4) — 아직 전환 전
private   https://private.menosaint.xyz/    기존 유지 (302, 인증)
```

사이트 구조: About / Knowledge / Now(+히트맵) / Experience / Projects
발행 노트 4개. Projects는 자리만 있고 미구현.

---

## 2026-07-28 — 웹페이지 세부 정리 (PLAN 12.4)

껍데기부터 확정한다는 방침으로 4번(웹페이지 세부 정리)을 먼저 했다.
글은 나중에 채우고, 글이 들어왔을 때 어떻게 보일지를 먼저 고정하는 순서다.

### 한 일

화면에서 임시·내부용 문구 제거
- About 히어로 문단이 `max-w-xl`이라 두 줄로 접혔다. 제목과 같은 `max-w-2xl`로 맞춤
- 경력 연차 통계 블록(`3 경력`) 제거. 항목이 하나뿐이라 통계로 성립하지 않았다
- Knowledge 하단의 노트 개수 설명은 내부용이라 삭제
- Now description에서 `YYYY년 M월 기준` 제거
- 활동 기록 안내를 `'지덕체부복' 다섯 축의 주간 활동을 모니터링합니다.` 한 줄로
- 미추적 축(부·복) 안내 문단과 히트맵 범례의 `최근 1년 N회` 삭제
- About 섹션 하단 여백 축소 (통계 제거로 빈 공간이 커졌다)

Projects
- `/projects/`에 `TODO(Phase 1) — projects 컬렉션...`이 방문자에게 그대로 보였다
- 헤더 구조를 Notes와 동일하게 맞추고 안내 문장으로 교체
- 홈 Projects 섹션 문구도 같은 문장으로 통일

노트 목록
- 지식 영역 라벨 두 개가 구분자 없이 붙어 읽혔다. `" · "`로 연결
- description이 본문 첫 문단 자동 추출이라 콜론으로 끝나거나 중간에서 끊겼다.
  `sync.py`의 `first_paragraph()`를 제거하고 vault frontmatter만 쓰도록 변경
- 발행 노트 6개 vault 원본에 `description` 작성 후 재동기화
- `인문 - 신뢰와 통제의 역설`이 `tags: []`였다. `domain/human` 부여.
  `knowledge.ts` 인문 영역에도 이 태그를 등록해 태그 경로로 매칭되게 함

발행 취소 2건
- `온톨로지(Ontology)` — 구성요소 표에 `Koru Pharma`, `Ted Jin`, `Mesoheal+`
- `조직지식관리 온톨로지 설계 예시` — `Mesoheal+`, `Renoxome+`
- 둘 다 설명용 예시라 실명이 필요한 자리가 아니었다. vault에서 `publish: false`
- sync가 `src/content/notes/`에서 두 파일을 삭제. 발행 6개 → 4개
- `dist/` 전체 스캔으로 잔여 노출 없음 확인

### 결정 사항

- Knowledge 영역은 하드코딩 순서를 유지하고, 노트가 0개인 영역도 그대로 노출한다.
  글을 쓰면 채워질 자리이기 때문이다
- 노트가 두 영역에 걸치면 라벨에 둘 다 표시한다. 대표 영역 하나로 줄이지 않는다
- 목록 description은 vault 원본에서 직접 쓴다. 자동 추출은 하지 않는다
- 제목 접두사(`인문 - `) 규약을 태그로 수렴시킬지는 여전히 미결 (PLAN 12.1)

### 새로 알게 된 것

pages.dev는 zone 퍼지 대상이 아니다
- 배포 후 `v5.menosaint.pages.dev`의 삭제된 노트 URL이 `cf-cache-status: HIT`로
  200을 계속 돌려줬다. 배포 고유 URL(`8b777d3f.…`)에서는 정상 404였다
- 퍼지하려 했으나 `v5.menosaint.pages.dev`는 `pages.dev` 도메인이라 계정 zone이
  아니다. `menosaint.xyz` zone을 퍼지해도 프리뷰에는 효과가 없다
- PLAN 11절의 퍼지 절차는 프로덕션(`menosaint.xyz`) 전환용이라 그때는 정상 동작한다
- 프리뷰는 TTL 만료를 기다리기로 함. 프로덕션에는 노출이 없다

배포 중 URL을 반복 폴링하면 옛 응답이 캐시된다
- 배포 완료를 확인하려고 15초 간격으로 호출했는데, 그 사이 200이 엣지에 박혔다
- 배포 확인은 브랜치 별칭이 아니라 배포 고유 URL로 하는 편이 안전하다

wrangler 토큰 파일 직접 읽기는 권한 정책에 막힌다
- `~/Library/Preferences/.wrangler/config/default.toml`에서 토큰을 추출하는
  명령이 차단됐다. API 직접 호출이 필요하면 사용자에게 요청해야 한다

### 이번 세션 커밋

```
946631b  홈 화면 임시·내부용 문구 정리
eb41270  About 섹션 하단 여백 축소
620bfc5  Projects 문구·톤 정리, 영역 라벨 구분자, description 자동추출 제거
a3e7a7e  노트 description을 vault 원본에 작성하고 재동기화
d19c9f7  회사·제품명이 든 온톨로지 노트 2개 발행 취소
```

`v5`에 푸시 완료. 배포 성공.

### 다음에 이어서 할 것

PLAN 12.4는 대체로 끝났다. 남은 순서는 아래.

1. 설명 문구 재작성 (PLAN 12.5) — 히어로, 섹션 description, Knowledge 7개 영역
   설명, `site.description`. 지금 문장은 대부분 Claude가 쓴 것이다
2. 라이트 · 다크 모드 (PLAN 12.6)
3. 발행 전 확인 절차 (PLAN 12.2) — 이번에 실명 노출을 손으로 찾아냈다.
   민감 패턴 스캔이 있었으면 sync 단계에서 걸렸을 것이다
4. vault 정리와 발행 워크플로 확정 (PLAN 12.1)
5. private.menosaint.xyz (PLAN 12.3)
6. 프로덕션 전환 (PLAN 11)

발행 취소한 두 노트는 실명을 지우면 다시 올릴 수 있다. 온톨로지 설명 자체는
지식 구조 영역의 핵심 콘텐츠라 비워두기 아깝다.

---

## 성공/실패 기록

### 통한 접근

vault를 먼저 읽고 설계했다
- 지식 영역 7개를 지어내지 않고 `1. Memory/know` 133개의 실제 태그 분포에서 도출
- 경력 서술을 `JD_운영기획팀_진호경`에서, 정체성을 `WhoIam.md`에서 추출
- Life 콘텐츠 후보를 `remember` 4개와 `daily` 26개에서 역산
- 추측으로 만든 것이 거의 없다. 이 세션에서 가장 잘한 판단

만들기 전에 물어봤다
- 이력 노출 수위, 지식 축 전환, Life 존치 여부를 각각 확인하고 진행
- Life는 만들었다가 접었는데, 먼저 물었으면 안 만들었을 수도 있다

### 해결한 문제

Playwright 브라우저 없음
- `browse`가 실행 안 됨. `npx playwright install chromium chromium-headless-shell`

Cloudflare Pages 빌드 실패
- 프로젝트 빌드 설정이 Quartz용(`npx quartz build` → `public`)으로 남아 있었다
- wrangler CLI로는 빌드 설정을 못 바꾼다. API `PATCH /pages/projects/menosaint`로 변경
- 실패한 배포는 API `POST .../deployments/{id}/retry`로 재시도

wrangler 토큰 경로
- `~/.wrangler/config/default.toml`이 아니라
  `~/Library/Preferences/.wrangler/config/default.toml`에 있다
- 로그인 직후 잠깐 전자에 보였다가 사라진다. 후자를 봐야 한다

TickTick MCP 서버 두 개
- `mcp__ticktick__list_habits`는 빈 배열을 돌려준다. 섹션 조회는 정상
- `mcp__claude_ai_ticktick__list_habits`를 써야 한다

vite 타입 충돌
- `@tailwindcss/vite`(vite 8)와 `astro`(vite 6)가 충돌해 `astro check`가 깨졌다
- `package.json`에 `overrides: { vite: "^6.4.3" }`로 고정
- npm overrides에 `"//"` 주석 키를 넣으면 `Override without name` 에러가 난다.
  주석은 overrides 바깥에 별도 키로

description이 mermaid 코드를 긁어옴
- `first_paragraph`가 블록 첫 글자만 보고 판단해서 코드 펜스 내부를 집었다
- 펜스 상태를 추적하도록 재작성

지식 구조 영역이 0개로 나옴
- 온톨로지 노트 3개가 `domain/ai` 태그만 달고 있어 태그·접두사 매칭에 안 걸렸다
- `titleKeywords`를 추가해 세 경로(태그·접두사·키워드)로 매칭

soft 404
- 404 페이지가 없어 존재하지 않는 경로가 홈 HTML을 200으로 반환했다
- `src/pages/404.astro` 추가. Cloudflare Pages가 자동으로 404 상태로 서빙한다

`__pycache__` 커밋됨
- `.gitignore`에 python 항목이 없었다. `git rm --cached` 후 추가

### 실패한 시도와 이유

Life Map 전체 구현
- 3축 정의 + 히트맵 + `/life/` 페이지를 다 만들었다가 되돌렸다
- 사용자가 "인스타도 안 하는데 일상을 공개할 이유가 있나"라고 되물었고 타당했다
- 개인정보가 없는 히트맵만 Now 아래로 남기고 나머지는 vault 지식 노트로 이관
- 커밋 `f47351f`, `d4ab43a`는 부분 무효지만 되돌리지 않고 남겼다.
  왜 만들었다가 왜 접었는지가 히스토리에 남는 게 낫다고 판단

스크린샷 아티팩트로 잘못된 판단
- 고정 사이드바가 스크롤에 따라 움직이는 것처럼 보여 버그로 오인했다
- `scroll-behavior: smooth` 애니메이션 중간에 캡처된 것이었다
- 이후 `document.documentElement.style.scrollBehavior='auto'`를 먼저 실행
- 스크롤 스파이가 두 항목을 동시에 강조하는 것처럼 보인 것도 같은 원인.
  DOM을 직접 조회해 확인하니 정상이었다

캐시 HIT를 배포 실패로 오인
- `/life/`를 지웠는데 계속 200이 나와 배포가 안 된 줄 알았다
- `cf-cache-status: HIT`. 엣지 캐시였다. 우회하면 정상 404
- 검증 시 캐시 우회와 순수 URL을 구분해서 써야 한다

`browse screenshot --clip` 실패
- 뷰포트 밖 영역을 clip하면 실패한다
- `js window.scrollTo` + `screenshot --viewport` 조합으로 우회

---

## 주요 결정 사항

### Quartz 테마 수정이 아니라 Astro 재작성

Quartz는 "모든 노트가 동등하고 링크로 연결된다"가 전제고, 목표 구조는 "타입이 다른
컬렉션이 각자의 목록·상세 UI를 갖는다"가 전제다. Card+Detail, 카테고리 필터,
통계 자동계산은 Quartz의 emitter/layout 시스템과 계속 싸워야 하는 영역이다.

### 중심축은 Skills가 아니라 Knowledge

"무엇을 잘한다"는 역량 선언은 검증할 수 없다. "무엇을 알아가고 있는가"는 글의 개수로
셀 수 있다. 영역별 노트 개수가 곧 축적의 증거고, 적은 영역은 결핍이 아니라 다음에
쓸 것의 목록이다.

### 이력 노출은 코드가 아니라 데이터가 결정한다

`experience.ts`의 항목별 `visibility`(public / abstract / private)로 제어한다.
기본값은 abstract. 조직명은 데이터에만 있고 화면에는 업종 라벨만 나간다.
마음이 바뀌어도 값 하나만 고치면 되고 컴포넌트는 손대지 않는다.

### Life 섹션을 두지 않는다

서술형 일상 기록은 네이버 블로그로, Obsidian daily는 비공개 유지, 개인정보가 없는
집계(히트맵)만 Now 아래에 남긴다. 분류 체계 전체는 vault 지식 노트로 이관했다.
"삶을 어떻게 분류할 것인가"는 Life 콘텐츠가 아니라 지식이기 때문이다.

### 네이버는 중복 게재가 아니라 분업

처음엔 같은 글을 양쪽에 올리는 구조로 봤다가 바꿨다. menosaint는 원본 진입점과 구조,
네이버는 사진과 세부를 맡는다. 이렇게 하면 중복 콘텐츠가 아니라서 canonical 결정이
불필요해지고, 이미지 바이너리를 git에 넣지 않아도 된다.

### 발행 게이트는 새로 만들지 않고 기존 규약을 이었다

vault에 이미 `publish: true` 규약이 있었고 기존 sync.py가 그걸 쓰고 있었다.
opt-in이라 표시하지 않은 노트는 나가지 않는다. 이게 중요한 이유는 `know` 폴더에
회사·인사 자료가 섞여 있기 때문이다.

### 검색에 라이브러리를 쓰지 않는다

레퍼런스가 34개를 전부 프리렌더하고 인라인 JS로 거른다. 목록 페이지가 커지지만
이 규모에선 라이브러리를 얹는 쪽이 더 비싸다. 같은 선택.

### 웹폰트를 쓰지 않는다

시스템 폰트 스택만. LCP를 지키기 위한 선택이고 레퍼런스도 동일하다.

### 색은 레퍼런스를 따르지 않았다

heeho의 indigo(#4f46e5) 대신 v4 시절 쓰던 `#284b63` 계열로 스케일을 만들었다.
구조는 베끼되 브랜드까지 베낄 이유는 없다. `global.css`의 `--color-brand-*`
한 블록만 바꾸면 전환된다.

### 슬러그는 한글 그대로

영문 번역 축을 뒤로 미루기로 했다. v4 URL과의 연속성도 유지된다.

---

## 주의사항 & 교훈

### v4에 푸시하면 빌드가 깨진다

Cloudflare Pages는 빌드 명령이 프로젝트 단위다. 프로덕션과 프리뷰가 공유한다.
현재 `npm run build` / `dist`로 바뀌어 있어 `v4`에 푸시하면 그 빌드는 실패한다.
이미 배포된 프로덕션은 계속 서빙되므로 사이트가 죽지는 않는다.
v4를 손봐야 하면 빌드 설정을 되돌리거나 `wrangler pages deploy dist --branch v4`로
직접 올린다.

### daily 노트를 자동 동기화하면 안 된다

`2. daily/`에 병원명, 약 단계, 진료비가 그대로 적혀 있다. Knowledge는 sync로
자동화해도 되지만 개인 기록은 수동 승격 단계가 반드시 들어가야 한다.

### know 폴더에 회사 자료가 섞여 있다

`연봉 삭감`, `경영성과급 설계`, `R0~R9 시장조사 소스`, `Market Brief 편집 헌장` 등.
발행 기본값이 공개였으면 사고가 났다. opt-in 게이트를 유지할 것.
2차 방어선(민감 패턴 검사)은 아직 미구현. PLAN 12.2 참고.

### 검증할 때 캐시를 구분하라

엣지 캐시가 오래 산다. 배포 반영 확인에는 `?cb=난수`로 우회하고, 실제 사용자가
보는 상태를 확인할 때는 순수 URL로 봐야 한다. 둘을 섞으면 오판한다.

### 스크린샷 전에 smooth scroll을 끈다

`$B js "document.documentElement.style.scrollBehavior='auto'"`를 먼저 실행.
안 그러면 애니메이션 중간이 캡처되어 레이아웃 버그로 오인한다.
UI 상태 판단은 스크린샷보다 DOM 직접 조회가 정확하다.

### vault 원본을 임의로 고치지 않는다

`# agent - ...`처럼 h1이 소문자로 시작하는 노트가 있어 제목이 그대로 소문자로 나온다.
코드 버그로 의심했지만 원본이 그랬다. 사용자 데이터라 손대지 않았다.

### TickTick 습관 데이터는 거의 비어 있다

2025-01 이후 체크인 11건. 히트맵은 앞으로 채워가는 것이라는 전제로 만들었다.
사용자가 "굳이 남에게 잘 보이려고 나를 속일 필요가 없다"고 했다. 꾸미지 말 것.
부(富)와 복(福)은 추적 습관이 없어 빈 줄로 남는다. `getUncoveredValues()`가
이를 계산해 페이지에 그대로 노출한다.

### 사이트의 설명 문구는 대부분 Claude가 임의로 쓴 것이다

히어로 문구, 섹션 description, Knowledge 영역 설명 등. 본인 목소리로 교체 예정.
PLAN 12.5 참고.

---

## 다음 단계

`PLAN.md` 12절에 상세히 적혀 있다. 순서는 아래.

1. vault 정리와 발행 워크플로 확정
   - 노트 템플릿에 발행 관련 필드 반영 검토
   - 제목 접두사 규약을 태그로 수렴시킬지 결정
2. 발행 전 확인 절차 구현 (안전장치)
   - `sync.py`에 검사 모드. 신규 발행 노트 목록 + 민감 패턴 스캔 + 중단 게이트
3. private.menosaint.xyz
   - 관리자 페이지 (발행 상태, 동기화 이력, 미발행 노트)
   - README 페이지 (Obsidian 기반, 발행 게이트만 다르게)
4. 웹페이지 세부 정리 (정렬 순서, 불필요한 요소, 임시 문구)
5. 설명 문구 재작성 (본인 목소리로)
6. 라이트 · 다크 모드
7. 프로덕션 전환 (PLAN 11절. 캐시 퍼지 필수)

미완 항목: RSS, Expressive Code, 첨부 이미지 처리, Projects 섹션 구현.

---

## 중요 파일 맵

### 리포지토리

```
PLAN.md                          설계 문서. 13절. 이 문서보다 상세하다
sync.py                          Obsidian → Astro 동기화. publish: true 게이트
astro.config.mjs                 static, trailingSlash always, sitemap
package.json                     vite overrides 주의

src/content.config.ts            notes 컬렉션 스키마
src/content/notes/*.md           동기화 산출물. 직접 고치지 말 것 (6개)

src/data/site.ts                 사이트 설정, 프로필, 사이드바 nav
src/data/knowledge.ts            지식 영역 7개 + matchAreas (중심축)
src/data/experience.ts           경력 + visibility 게이트 + 연차 자동계산
src/data/certifications.ts       자격증 (현재 섹션 미노출)
src/data/now.ts                  Now 섹션 항목
src/data/values.ts               지덕체부복 5축 + TickTick 습관 매핑
src/data/habit-checkins.json     체크인 스냅샷. MCP로 갱신

src/layouts/BaseLayout.astro     SEO 메타 일습
src/components/Sidebar.astro     고정 사이드바 + 스크롤 스파이 + 모바일 토글
src/components/Section.astro     섹션 공통 골격 (번호 체계)
src/components/ValueHeatmap.astro  5행 × 53주 히트맵
src/components/SocialIcon.astro

src/pages/index.astro            원페이지 (About/Knowledge/Now/Experience/Projects)
src/pages/notes/index.astro      목록. 검색 + 영역 필터 + 정렬
src/pages/notes/[...slug].astro  상세 + 본문 타이포그래피
src/pages/projects/index.astro   자리만 있음
src/pages/404.astro

public/images/avatar.jpg         메인 이미지
```

### Obsidian vault (`~/Obsidian/Legion/`)

```
WhoIam.md                        정체성. 경력·자격증 항목 이번에 채움
1. Memory/know/                  133개. 지식 영역 도출 근거
1. Memory/know/삶의 활동을 분류하는 세 축 - 지덕체부복, 대상, 방식.md
                                 이번 세션 신규. 3축 분류 체계 전문
1. Memory/do/JD_운영기획팀_진호경_markdown_v01.md
                                 Experience 서술 원본
1. Memory/remember/              4개. Life 후보였으나 네이버로 이관
2. daily/                        26개. 민감정보 포함. 동기화 금지
Lab/Projects/menosaint.xyz/      프로젝트 폴더
  menosaint.xyz_v5 Astro 전환 아키텍처.md    이번 세션 신규
  README.md / Log.md / WHY_I_DO_THIS.md      기존
```

### 외부 자원

```
GitHub          https://github.com/Ted-coGit/menosaint  (브랜치 v4, v5)
CF Pages        프로젝트 menosaint / menosaint-private
CF Account ID   b7d671c43e791f752afe140e52d3e794
wrangler 토큰   ~/Library/Preferences/.wrangler/config/default.toml
TickTick MCP    mcp__claude_ai_ticktick__* 를 쓸 것 (mcp__ticktick__ 아님)
```

### 이번 세션 커밋 (v5)

```
854323d  Quartz → Astro 전환 스캐폴드 + 사이드바 레이아웃
23c5acb  Phase 0 데이터 정리 + 공개 구조 재편
e121dfd  레퍼런스 색채 제거 — 에디토리얼/아카이브 어휘로 전환
d789276  Projects 공개 범위 결정 반영
3700a6b  중심축을 Skills(역량)에서 Knowledge(지식)로 전환
f47351f  3-레이어 Life Map 축 정의 (이후 부분 무효)
d4ab43a  Life Map 구현 (이후 부분 무효)
e5d106d  네이버 분업 구조 확정, Life 콘텐츠 정의
1661be8  Life 섹션 제거, 잔디를 Now 아래로
9f44014  notes 컬렉션 — 목록·상세·필터, sync.py Astro 이관
fda889c  __pycache__ gitignore 처리
f19723e  캐시 퍼지 절차와 다음 작업 로드맵
```
