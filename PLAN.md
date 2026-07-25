# PLAN.md — menosaint v5 (Quartz → Astro 전환)

작성: 2026-07-25
레퍼런스: https://heeho.net/
현재 상태: Quartz 4 (v4 브랜치, Cloudflare Pages, menosaint.xyz)

---

## 0. 목표와 전제

heeho.net의 구조를 menosaint에 이식한다. 단순 테마 모방이 아니라 데이터 모델과 자동화 설계를 가져온다.

가져올 네 가지:
1. 포트폴리오 원페이지 (좌측 고정 사이드바 + About / Experience / Projects / Certifications / Skills)
2. 기술·사고 콘텐츠 목록·상세 (카테고리 필터 + 검색 + 정렬 + 카드 그리드)
3. Life Map (경험을 두 축으로 기록하고 그래프로 시각화)
4. Skills ↔ 콘텐츠 태그 자동 연동

추가 요구: thread/blog 자동화 수익화 파이프라인을 나중에 붙일 수 있게 설계 여지를 남긴다 (Phase 5).

전제:
- Obsidian Legion vault가 계속 콘텐츠 소스 (Layer 1/2 아키텍처 유지)
- Cloudflare Pages + menosaint.xyz 유지
- Astro는 static output. 런타임 서버 없음

---

## 1. 레퍼런스 사이트 분석 요약

### 기술 스택

| 항목 | heeho.net |
|---|---|
| 프레임워크 | Astro v5 |
| 스타일 | Tailwind CSS v4, 단일 CSS 56KB |
| 주색 | indigo-600 `#4f46e5` |
| 폰트 | 웹폰트 없음. 시스템 스택 (Apple SD Gothic Neo / Malgun Gothic) |
| 배포 | GitHub Pages + GitHub Actions (`astro/**` 변경 시 트리거) |
| 코드 블록 | Expressive Code |
| 다이어그램 | Mermaid 11.4 (jsdelivr ESM 동적 import) |
| 댓글 | giscus (별도 public repo의 Discussions) |
| 분석 | GA4 + Partytown 워커 격리 |
| Life 그래프 | PixiJS v8 (WebGL) |
| 방문자 카운터 | 자체 API (`api.heeho.net/visitors`) |
| 검색·필터 | 라이브러리 없음. 전체 프리렌더 + 인라인 vanilla JS DOM 필터 |

검색에 Pagefind/Fuse를 안 쓴 게 핵심 판단이다. 34개 카드를 전부 HTML에 프리렌더하고 `data-category` 속성으로 거른다. 목록 페이지가 90KB로 커지지만 이 규모에선 라이브러리보다 싸다. menosaint도 같은 선택을 한다.

### URL 구조 (78개)

```
/                                   원페이지 포트폴리오
/projects/  /projects/<slug>/       22개
/contents/  /contents/<cat>/<slug>/ 34개
/life/      /life/<thread>/<slug>/  15개
/resume/ /resume/ko/ /resume/en/    비밀번호 오버레이
```

### 반복 UI 패턴 3개

좌측 인디고 풀블리드 사이드바가 전 페이지 고정. 프로필 + 섹션 네비 (현재 섹션 하이라이트) + 하단 방문자 카운터·소셜.

Card + Detail Panel. 왼쪽 카드 그리드, 오른쪽 선택 항목 상세, 첫 항목 자동 선택. Projects / Skills / Interests 세 곳에 재사용.

목록 페이지 공통 골격. 검색창 + 카테고리 칩 + 정렬 드롭다운 + 개수 + 카드 그리드. Projects와 Contents가 동일 레이아웃.

### 자동화 설계 (모방 가치 최상)

- 마크다운 1개 추가 = 목록·상세·필터·검색 자동 생성
- About 통계 전부 자동계산: Years(가장 이른 근무 시작일), Projects(파일 수), Certs(배열 길이), Companies(고유 회사 수)
- Skills 태그 ↔ 콘텐츠 frontmatter 태그 자동 매칭 → 스킬 클릭 시 관련 글 표시
- 개인정보는 환경변수 분리 (`PUBLIC_NAME_KO` 등), CI vars로 주입

소스 repo는 비공개다. 코드를 가져올 수 없고 구조를 재구현해야 한다.

---

## 2. 현재 menosaint와의 갭

| | menosaint (v4) | heeho.net |
|---|---|---|
| 프레임워크 | Quartz 4 (upstream 포크) | Astro v5 + Tailwind v4 |
| 데이터 모델 | 노트 그래프 + 위키링크 | Content Collections 3종 |
| 콘텐츠 | 마크다운 11개 | 71개 |
| 성격 | 지식 정원 | 포트폴리오 우선 |
| 배포 | Cloudflare Pages | GitHub Pages + Actions |

Quartz는 "모든 노트가 동등하고 링크로 연결된다"가 전제고, heeho.net은 "타입이 다른 컬렉션이 각자의 목록·상세 UI를 갖는다"가 전제다. Card+Detail, 카테고리 필터, 통계 자동계산은 Quartz의 emitter/layout 시스템과 계속 싸워야 하는 영역이라 전환이 맞다.

---

## 3. 목표 아키텍처

### 3.1 레포·브랜치 전략

`v4` 브랜치는 롤백 대비로 그대로 둔다. 새 브랜치 `v5`에 Astro 앱을 리포 루트에 올리고 Quartz 파일을 제거한다. Cloudflare Pages에서 `v5`를 프리뷰로 먼저 빌드해 검증한 뒤, 프로덕션 브랜치를 전환한다.

heeho는 `astro/` 서브폴더를 쓰지만 menosaint는 다른 앱이 없으므로 루트가 깔끔하다.

### 3.2 디렉터리

```
src/
  content/
    notes/<category>/<slug>.md      사고 기록 (Obsidian 동기화 대상)
    projects/<slug>.md              프로젝트
    life/<thread>/<slug>.md         경험 기록
    config.ts                       collection 스키마 정의
  data/
    experience.ts                   경력 타임라인 (통계 소스)
    certifications.ts               자격증
    skills.ts                       스킬 + 태그 매핑
    life-axes.ts                    열정·방식 축 정의
  components/
    Sidebar.astro
    CardDetailPanel.astro           Projects/Skills/Life 3회 재사용
    ContentCard.astro
    FilterBar.astro                 검색+칩+정렬
  layouts/
  pages/
    index.astro                     원페이지 포트폴리오
    notes/index.astro  notes/[category]/[slug].astro
    projects/index.astro  projects/[slug].astro
    life/index.astro   life/[thread]/[slug].astro
scripts/
  sync.py                           Obsidian → src/content (기존 파일 개조)
```

### 3.3 Content Collections 스키마 (초안)

```
notes:    title, description, category, tags[], pubDate, updatedDate, draft
projects: title, description, org, period, stack[], featured, cover
life:     title, description, passion, engagement, date, cover
```

`category`는 현재 Obsidian 노트의 파일명 접두사(지식 / AI / 인문)와 Quartz의 lab 폴더를 흡수한다. 즉 `lab`을 별도 컬렉션으로 두지 않고 `notes`의 category 하나로 합친다. 컬렉션이 늘수록 목록 UI를 중복 구현해야 해서다.

### 3.4 자동계산 항목

heeho의 4개 통계를 그대로 가져오되 정체성에 맞게 조정한다. 하드코딩 금지.

| 항목 | 계산 방식 |
|---|---|
| Years | `experience.ts`에서 type=work 중 가장 이른 startDate ~ 현재 |
| Projects | `src/content/projects/` 파일 수 |
| Notes | `src/content/notes/` 파일 수 |
| Certs | `certifications.ts` 배열 길이 |

### 3.5 Skills ↔ 콘텐츠 연동

```
skills.ts:  { name: 'Ontology', tags: ['온톨로지', 'Ontology'] }
note fm:    tags: ['온톨로지', '지식구조']
→ 스킬 칩 클릭 시 매칭된 노트가 우측 패널에 표시
```

주의: Legion vault의 태그는 `domain/ai` 형태의 접두사 규칙이다. Astro 쪽 태그와 1:1이 아니므로 sync.py에서 매핑 테이블을 태워야 한다.

### 3.6 Life Map

heeho의 두 축 모델을 그대로 채택한다.
- 열정 (무엇에 몰입하는가): 개별 대상
- 방식 (어떻게 관여하는가): 대비쌍 4쌍 (공연하다↔관람하다, 탐험하다↔연결하다, 배우다↔만들다, 나누다↔성찰하다)

축 정의는 Ted의 실제 활동에 맞게 다시 짜야 한다. heeho의 쌍을 그대로 쓸지는 Phase 4에서 결정.

그래프 렌더링은 PixiJS v8이 원본이지만 무겁다. 노드 수가 수십 개 규모면 d3-force + Canvas 2D로 충분하다. Phase 4에서 실측 후 결정.

---

## 4. Obsidian 동기화 재설계

기존 `sync.py`는 vault → Quartz용 flat 마크다운을 만든다. Astro용으로 다시 짜야 한다. 바뀌는 지점:

1. 출력 경로가 `content/` → `src/content/<collection>/<category>/`
2. frontmatter 변환. Legion의 `type/status/created/updated/tags` → Astro 스키마의 `title/description/category/tags/pubDate/updatedDate/draft`
3. 제목 추출. Legion 노트는 frontmatter에 `title`이 없고 본문 `# 제목`에 있다. 본문 첫 h1을 뽑아 title로 승격하고 본문에서 제거
4. 위키링크 `[[x]]` 처리. Astro는 기본 지원이 없다. remark 플러그인을 넣거나 sync 단계에서 상대 링크로 치환
5. slug 생성. 현재 파일명이 `지식 - 온톨로지와 택소노미.md` 형태다. URL에 한글이 들어가면 공유·분석이 지저분해진다. frontmatter에 명시적 `slug` 필드를 두고 영문 슬러그를 쓰는 쪽을 권한다 (heeho 방식). 기존 노트 7개는 수동 부여

`type` 매핑 초안: `know`/`learn` → notes, `do` → projects 후보, `remember` → life 후보, `journal` → 제외 (현행 유지).

---

## 5. 단계 계획

### Phase 0 — 데이터 수집 (블로킹)
포트폴리오 섹션을 채울 실물 데이터가 없다. 아래가 있어야 Phase 1을 끝낼 수 있다.
- 경력 타임라인 (회사, 기간, 역할, 주요 프로젝트)
- 프로젝트 목록 (제목, 기간, 스택, 설명, 대표 이미지)
- 자격증 목록
- 스킬 카테고리와 항목
- 한 줄 정체성 문구 (heeho의 "AI Agent Infrastructure Engineer"에 대응)

heeho는 엔지니어 포트폴리오다. Ted의 정체성("조직과 사람, 시스템과 흐름")은 결이 다르므로 섹션 이름과 축을 그대로 베끼면 안 맞을 수 있다. Phase 0에서 같이 정한다.

### Phase 1 — Astro 스캐폴드 + 원페이지 포트폴리오
Astro v5 + Tailwind v4 초기화, `v5` 브랜치 생성, 좌측 사이드바 레이아웃, About/Experience/Projects/Certifications/Skills 섹션, 통계 자동계산, CF Pages 프리뷰 빌드 확인.

### Phase 2 — notes 컬렉션
목록 페이지 (검색+카테고리 칩+정렬+카드 그리드), 상세 페이지, Expressive Code, sync.py 개조, 기존 노트 7개 마이그레이션, RSS·sitemap·OG.

### Phase 3 — Skills ↔ 태그 연동
skills.ts 태그 매핑, Card+Detail 패널 컴포넌트화 후 Projects/Skills 양쪽 재사용.

### Phase 4 — Life Map
life 컬렉션, 두 축 정의, 그래프·타임라인·목록 3뷰, 렌더링 라이브러리 결정.

### Phase 5 — 배포 전환 + 수익화 파이프라인 설계
CF Pages 프로덕션 브랜치를 v5로 전환. 이후 thread/blog 자동화 파이프라인 설계 착수.

---

## 6. 수익화 파이프라인 (Phase 5, 설계만)

방향: 콘텐츠 하나를 여러 채널로 파생시키는 구조. heeho도 `contents-creator` / `linkedin-post` Claude Code 스킬로 같은 걸 한다.

지금 단계에서 남겨둘 여지:
- notes frontmatter에 채널 배포 상태 필드를 넣을 자리를 비워둔다 (`syndication: { thread: ..., linkedin: ... }`)
- 원문 마크다운이 단일 소스가 되도록 유지. 파생물은 생성물로 취급하고 vault에 되먹이지 않는다
- WIP 폴더 패턴 채택. 미완성 글이 실수로 배포되지 않게 함

강의 수강 후 구체 요구가 잡히면 그때 설계한다. 지금 미리 만들지 않는다.

---

## 7. 방향 수정 (2026-07-25)

heeho.net은 개발자가 본인을 홍보하는 구직용 포트폴리오다. menosaint는 재직 중인 사람의
사고 기록이자 경험 저장소다. 목적이 다르므로 섹션 구성을 그대로 베끼지 않는다.

결정한 것:

- 이력은 추상화해서만 공개한다. 조직명과 재직 기간을 가리고 담당 영역과 주제만 남긴다.
  노출 수위는 `experience.ts`의 항목별 `visibility`(public / abstract / private)로 제어한다.
  코드가 아니라 데이터가 공개 범위를 결정하므로 나중에 바꿔도 컴포넌트를 손대지 않는다.
- Certifications는 섹션에서 뺀다. 데이터 파일은 남겨두고 필요해지면 되살린다.
- 공개 사이트의 중심축은 넷이다. Notes(사고 기록), Projects(Lab 실험), Life(경험 저장소),
  Now(지금 하는 일).

사이드바 구성:

```
ABOUT
NOW
EXPERIENCE      추상화
SKILLS
  ㄴ NOTES      → /notes/
PROJECTS
  ㄴ LAB        → /projects/
LIFE
  ㄴ MAP        → /life/
```

### Phase 0 데이터 출처

- 정체성·역할·관심 주제 — vault `WhoIam.md`
- 담당 영역 — vault `1. Memory/do/JD_운영기획팀_진호경_markdown_v01.md` (JD v01, 2026-02-27)
- 역량 분류 — `WhoIam.md` + `1. Memory/do/` 대분류 4개 + AI·자동화
- Now — 기존 v4 `content/now.md` + `WhoIam.md` 1.7 / 1.9
- Projects 후보 — vault `Lab/Projects/` 22개 폴더, 각 폴더의 README.md

### 아직 못 채운 데이터

vault에서 찾지 못했다. 직접 입력이 필요하다.

- 이전 경력, 학력
- 자격증 취득 연월 — 사회복지사 2급(보건복지부). 취득 시점 미확인

### Projects 공개 범위 (결정)

회사 업무와 연계된 작업은 공개하지 않는다. vault `Lab/Projects/` 22개 중
`HR_data_PMI`, `Prj_MAGIC`, `Prj_NUGGET`, `Prj_SSAL`, `Prj_Koru_app` 등
회사 데이터·업무에 걸린 항목은 제외하고, 개인 실험만 낸다.

---

## 8. 열린 결정 사항

1. 한글 슬러그 대신 영문 슬러그 채택 여부
2. 기존 URL(`/notes/...`, `/lab/...`) 보존 여부. 안 하면 리다이렉트 불필요
3. 댓글 giscus 도입 여부
4. Life Map 두 축의 대비쌍 정의 — heeho의 4쌍을 그대로 쓸지 재정의할지
5. 방문자 카운터 — heeho는 자체 API를 쓴다. menosaint는 Plausible을 쓰고 있으므로 별도 백엔드 없이 갈지 결정
6. Projects 공개 범위 — Lab 22개 중 무엇을 낼지. 회사 업무 연계 프로젝트(HR_data_PMI 등)는 제외 검토
