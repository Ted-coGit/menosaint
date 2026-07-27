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
4. Knowledge ↔ 노트 태그 자동 연동 (7절에서 Skills → Knowledge로 수정)

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
- Skills 태그 ↔ 콘텐츠 frontmatter 태그 자동 매칭 → 스킬 클릭 시 관련 글 표시 (menosaint는 이를 Knowledge 축으로 바꿔 채택)
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
    knowledge.ts                    지식 영역 + 노트 태그 매핑
    life-axes.ts                    열정·방식 축 정의
  components/
    Sidebar.astro
    CardDetailPanel.astro           Knowledge/Projects/Life 재사용
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

### 3.5 Knowledge ↔ 노트 연동

```
knowledge.ts:  { name: '지식 구조', tags: ['온톨로지', 'ontology', '택소노미'] }
note fm:       tags: ['온톨로지', '지식구조']
→ 영역 클릭 시 매칭된 노트가 우측 패널에 표시. 영역 옆에는 노트 개수가 붙는다
```

개수가 곧 축적의 증거다. 스스로 안다고 선언한 값이 아니라 실제로 쓴 글의 수다.
적은 영역은 결핍이 아니라 다음에 쓸 것의 목록으로 읽는다.

주의: Legion vault의 태그 체계가 아직 정착되지 않아 제목 접두사(`인문 - `, `Claude Code - `, `R1. `)가 실질적인 분류자다. 그래서 매칭을 태그와 제목 접두사 두 경로로 건다. 장기적으로는 태그로 수렴시키는 편이 낫다.

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
- 지식 영역 분류
- 한 줄 정체성 문구 (heeho의 "AI Agent Infrastructure Engineer"에 대응)

heeho는 엔지니어 포트폴리오다. Ted의 정체성("조직과 사람, 시스템과 흐름")은 결이 다르므로 섹션 이름과 축을 그대로 베끼면 안 맞을 수 있다. Phase 0에서 같이 정한다.

### Phase 1 — Astro 스캐폴드 + 원페이지 포트폴리오
Astro v5 + Tailwind v4 초기화, `v5` 브랜치 생성, 좌측 사이드바 레이아웃, About/Knowledge/Now/Experience/Projects/Life 섹션, 통계 자동계산, CF Pages 프리뷰 빌드 확인.

### Phase 2 — notes 컬렉션 (완료 2026-07-27)
목록 페이지(검색 + 지식 영역 필터 + 정렬), 상세 페이지, sync.py 개조, 404 페이지.

게이트는 vault의 기존 규약을 그대로 잇는다. `publish: true`인 노트만 나간다.
opt-in이라 표시하지 않은 노트는 공개되지 않는다. 현재 6개.

sync.py에서 바뀐 것

- 출력 `content/` → `src/content/`
- Legion frontmatter(type/status/created/updated/tags)를 Astro 스키마로 변환
- 본문 첫 h1을 title로 승격하고 본문에서 제거
- description이 없으면 첫 문단에서 뽑는다. 코드 펜스 안쪽은 건너뛴다
  (mermaid 블록을 설명으로 잘못 집는 문제가 있었다)
- status: archived → draft: true

슬러그는 한글 그대로 둔다. v4 URL과 이어지고 영문 축은 미뤄둔 상태다.

matchAreas에 제목 키워드 매칭을 추가했다. 온톨로지 노트 3개가 `domain/ai` 태그만
달고 있어 태그만으로는 지식 구조 영역이 비어 버렸다. 태그 · 제목 접두사 ·
제목 키워드 세 경로를 본다.

남은 것: RSS, Expressive Code, 첨부 이미지 처리.

### Phase 3 — Knowledge ↔ 노트 태그 연동
knowledge.ts 매칭 적용, 영역별 노트 개수 집계, Card+Detail 패널 컴포넌트화 후 Knowledge/Projects 양쪽 재사용.

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
- 공개 사이트의 중심축은 Knowledge다. Skills(역량 선언)에서 Knowledge(지식 축적)로
  바꿨다. "무엇을 잘한다"는 검증할 수 없지만 "무엇을 알아가고 있는가"는 글의 개수로
  셀 수 있다. 영역 구분은 vault `1. Memory/know` 133개의 실제 태그 분포와 제목
  접두사에서 도출했다 (AI·에이전트 / 지식 구조 / 조직·경영 / 시장·산업 / 법·규제 /
  도구·환경 / 인문).
  Notes, Projects, Life, Now가 그 뒤를 받친다.

사이드바 구성:

```
About
Knowledge       중심축
  ㄴ 노트 전체   → /notes/
Now
Experience      추상화
Projects
  ㄴ 프로젝트 전체 → /projects/
Life
  ㄴ Life Map   → /life/
```

### Phase 0 데이터 출처

- 정체성·역할·관심 주제 — vault `WhoIam.md`
- 담당 영역 — vault `1. Memory/do/JD_운영기획팀_진호경_markdown_v01.md` (JD v01, 2026-02-27)
- 지식 영역 — vault `1. Memory/know` 133개의 태그 분포와 제목 접두사
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

## 8. 배포 채널과 수익화 (2026-07-27)

이 사이트는 유일한 채널이 아니다. 같은 주제의 글을 네이버 블로그에 병행 게재한다.
네이버는 국내 검색 유입과 수익화 기반, menosaint는 원본과 구조의 보관소로 나눈다.

- menosaint에는 당분간 광고를 붙이지 않는다. 읽는 경험을 해치지 않는 쪽을 택한다
- 수익화 기반은 네이버 쪽에서 만든다

### 중복 게재가 아니라 분업 (2026-07-27 수정)

처음에는 같은 글을 양쪽에 올리는 구조로 봤다. 그러면 검색엔진 입장에서 중복
콘텐츠가 되어 canonical을 어느 쪽으로 선언할지 정해야 하고, 어느 쪽을 택해도
손해가 생긴다.

분업으로 바꾸면 그 문제가 사라진다.

- menosaint — 원본 진입점. 구조, 축, 요약, 링크 허브
- 네이버 블로그 — 사진과 세부. menosaint에서 아웃바운드로 연결

이 구조의 이점 셋.

첫째, 사진 문제가 풀린다. 이미지 바이너리를 git에 넣으면 되돌릴 수 없고 클론이
계속 무거워진다. Life는 사진이 본질인 콘텐츠라 이 문제가 가장 크게 걸린다.
네이버가 사진 호스팅을 떠안는다.

둘째, 중복 콘텐츠가 아니므로 canonical 결정이 불필요하다.

셋째, menosaint에서 네이버로 유입이 흐른다. 블로그 검색지수가 올라가고 수익화
기반이 된다.

- 이 구조는 6절의 파생 파이프라인과 맞물린다. 원문 하나에서 채널별 파생물을 만드는
  방향은 그대로 유효하고, 첫 대상 채널이 네이버가 된다

## 9. 활동 기록 설계 (2026-07-27)

### Life 섹션은 두지 않는다 (2026-07-27 결정)

서술형 일상 기록을 개인 사이트에 공개할 이유가 없다. 인스타그램도 안 하는 사람이
억지로 일상을 풀면 유지가 안 되고 글에 티가 난다. 사이트 정체성(사고 기록)과도
결이 안 맞는다.

- 서술형 일상 기록과 사진 — 네이버 블로그. 수익화 기반
- Obsidian daily — 개인 기록으로만 유지. 공개하지 않는다
- 집계(잔디)만 menosaint에 남긴다. Now 섹션 아래

잔디를 남기는 이유는 개인정보가 없기 때문이다. "7월 셋째 주 지 축 1회"뿐이고
무슨 책을 읽었는지, 어디 갔는지, 누구와 있었는지가 없다. 노출이 아니라 집계다.
Now가 의도를 문장으로 답한다면 잔디는 실제를 데이터로 답한다. 둘이 어긋나면
그것도 정보다.

분류 체계 전체(관심 대상, 방식 4쌍, 판정 질문, 경계 사례)는 코드가 아니라 vault
지식 노트에 둔다. `1. Memory/know/삶의 활동을 분류하는 세 축`. 사이트에는
집계에 필요한 최소한(`src/data/values.ts`)만 남긴다.

### 세 축 (vault 노트가 원본)

레퍼런스는 2축이었다. 여기에 가치 축을 얹어 3겹으로 만든다.

```
지덕체부복   가치 축   왜 하는가        5개
관심 대상     열정 축   무엇을 하는가    13개
방식          관여 축   어떻게 하는가    4쌍 8개
```

복(福)은 누림·여가로 정의했다. 페어런팅은 덕으로 간다.

방식 4쌍: 익히다↔만들다 / 파고들다↔넓히다 / 혼자하다↔함께하다 / 쌓다↔비우다.
쌓다↔비우다는 여가·문화생활이 들어갈 자리라 유지한다.

### 분류 비용을 줄이는 두 장치

기록할 때마다 8개 중 뭘 고를지 고민하면 기록을 안 하게 된다. 그래서 둘을 넣었다.

첫째, 방식마다 판정 질문을 하나씩 붙였다. 예를 들어 쌓다는 "1년 뒤에도 이것의
결과가 나에게 남아 있는가", 비우다는 "그 순간을 누리는 것 자체가 목적이었는가".
질문에 답이 안 나오면 그 쌍은 비운다. 억지로 채우면 지표가 망가진다.

둘째, 관심 대상마다 기본 방식을 미리 넣어뒀다(`passions[].defaults`). 대상만 고르면
방식이 채워지고 예외만 손보면 된다. 확신이 없는 쌍은 비워뒀다.

### 시각화 — 잔디 트래커

레퍼런스의 포스 그래프(PixiJS) 대신 5행 히트맵을 쓴다. 행이 지덕체부복, 칸이 한 주다.

총계만 보여주는 방식과 다른 점은 시간축이다. "지는 채웠는데 체는 석 달째 비었다"가
보인다. PixiJS도 필요 없어졌다. CSS 그리드로 끝난다.

데이터는 TickTick 습관 체크인이다. 주의할 점 셋.

- MCP 서버가 둘 붙어 있는데 `mcp__ticktick__list_habits`는 빈 배열을 돌려준다.
  `mcp__claude_ai_ticktick__*`를 써야 한다. 섹션 조회는 양쪽 다 된다
- 사후 보정은 `upsert_habit_checkins`로 한다. 스탬프(YYYYMMDD)와 status(2=완료)
- 체크인 데이터가 현재 거의 없다. 2025-01 이후 11건. 잔디는 앞으로 채운다

현재 습관은 지·덕·체만 덮고 부·복은 빈 줄로 남는다. 꾸미지 않는다.
`getUncoveredValues()`가 이걸 계산해 페이지에 그대로 표시한다.

### Life에 무엇을 넣는가

잔디는 습관 체크이고, 기록은 서술형이다. 후자가 무엇인지 헷갈려서 비어 있었다.

Knowledge와 가르는 기준은 하나다. 1년 뒤 다른 사람이 읽어도 쓸모가 있으면
Knowledge, 그때의 나를 기록한 것이면 Life다. `온톨로지와 택소노미`는 내가 아니어도
유효한 지식이고, `데미안을 읽고`는 2026년 4월의 내가 그 책을 어떻게 읽었는지의
기록이라 대체 불가다. 쌓다/비우다 판정 질문과 같은 논리다.

후보는 vault에 이미 있는 것에서 역산했다.

- 독서 감상 — `1. Memory/remember`에 데미안·싯다르타 2개. 첫 기록 후보
- 아이들과 한 일 — daily에 가장 자주 등장. 덕 · 함께하다
- 본 것 — 월드컵 경기 감상 등. 복 · 비우다. 현재 복 축을 채울 유일한 후보
- 몸의 기록 — 다이어트, 운동, 앞으로 보컬. 체 축
- 종교 — 가톨릭 성경 노트. 축과 공개 여부 모두 미정

주의: daily를 자동 동기화하면 안 된다. 병원명, 약 단계, 진료비가 그대로 적혀 있다.
Knowledge는 sync로 자동화해도 되지만 Life는 daily에서 건져 올려 다시 쓰는 수동
승격 단계가 반드시 들어가야 한다.

스키마는 작게 시작한다. `title / date / passion / value / engagements[] / visibility`.
씨앗이 두세 개뿐이라 크게 짜면 헛돈다. 열 개쯤 쌓인 뒤 실제 패턴을 보고 늘린다.

## 10. 열린 결정 사항

1. 한글 슬러그 대신 영문 슬러그 채택 여부
2. 기존 URL(`/notes/...`, `/lab/...`) 보존 여부. 안 하면 리다이렉트 불필요
3. 댓글 giscus 도입 여부
4. Life Map 두 축의 대비쌍 정의 — heeho의 4쌍을 그대로 쓸지 재정의할지
5. 방문자 카운터 — heeho는 자체 API를 쓴다. menosaint는 Plausible을 쓰고 있으므로 별도 백엔드 없이 갈지 결정
6. Life 기록 중 종교(가톨릭)를 어느 축에 둘지, 공개할지
7. 몸의 기록 공개 범위 — daily에 병원명·진료비가 섞여 있어 그대로 올릴 수 없다
