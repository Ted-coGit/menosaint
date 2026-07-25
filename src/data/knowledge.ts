/**
 * 지식 영역.
 *
 * 이 사이트의 중심축이다. "무엇을 잘한다"는 역량 선언이 아니라
 * "무엇을 알아가고 있는가"를 글의 축적으로 보여준다.
 *
 * 영역 구분은 지어낸 것이 아니라 Legion vault `1. Memory/know`(133개)의
 * 실제 태그 분포와 제목 접두사 규칙에서 뽑았다.
 *   domain/ai 42 · domain/management 14 · domain/workflow 10
 *   domain/legal 8 · domain/market-research 7
 *
 * 매칭은 두 경로를 쓴다. vault 태그 체계가 완전히 정착되지 않아
 * 제목 접두사(`인문 - `, `Claude Code - `)가 실질적인 분류자 역할을 하기 때문이다.
 */

export type KnowledgeArea = {
  name: string
  slug: string
  description: string
  /** 노트 frontmatter 태그 매칭용. 표기 흔들림을 흡수하도록 여러 개를 둔다 */
  tags: string[]
  /** 제목 접두사 매칭용 */
  titlePrefixes?: string[]
  /** 이 영역에서 실제로 다룬 대표 주제 */
  topics: string[]
}

export const knowledgeAreas: KnowledgeArea[] = [
  {
    name: "AI · 에이전트",
    slug: "ai",
    description: "에이전트를 어떻게 일하게 만들 것인가. 가장 많이 쓰고 있는 영역이다.",
    tags: ["domain/ai", "AI", "Claude", "바이브코딩"],
    titlePrefixes: ["Agent -", "Claude Code -", "Claude -", "AI Saga -"],
    topics: [
      "코딩 에이전트 운영",
      "하네스 설계",
      "스킬과 커맨드의 층위",
      "컨텍스트 운영",
      "자가 개선의 성립 조건",
      "멀티모델 워크플로우",
    ],
  },
  {
    name: "지식 구조",
    slug: "knowledge-structure",
    description: "정보를 어떻게 구조화하면 나중에 쓸 수 있게 되는가.",
    tags: ["온톨로지", "ontology", "택소노미", "taxonomy", "domain/pkm", "지식관리"],
    topics: [
      "온톨로지와 택소노미",
      "조직지식관리 온톨로지 설계",
      "구조적 사고",
      "세션 핸드오버",
      "검색·합성 레이어",
    ],
  },
  {
    name: "조직 · 경영",
    slug: "management",
    description: "사람이 문제처럼 보일 때 실제 원인은 대개 구조에 있다.",
    tags: ["domain/management", "KPI", "OKR", "성과관리", "보상"],
    topics: [
      "KPI와 OKR의 설계 철학",
      "보상 철학과 성과급의 역설",
      "RACI · SIPOC",
      "프로세스 매핑",
      "기획이라는 일",
    ],
  },
  {
    name: "시장 · 산업",
    slug: "market",
    description: "무엇을 보고 무엇을 근거로 판단할 것인가.",
    tags: ["domain/market-research", "시장조사", "MedicalAesthetics"],
    titlePrefixes: ["R0.", "R1.", "R2.", "R3.", "R4.", "R5.", "R9."],
    topics: [
      "TAM · SAM · SOM",
      "시장조사 소스 인덱스",
      "메디컬 에스테틱 산업",
      "규제 프레임 (EMDN, IMDRF)",
      "손익 지표 읽기",
    ],
  },
  {
    name: "법 · 규제",
    slug: "legal",
    description: "회사를 움직이는 규칙의 문법.",
    tags: ["domain/legal"],
    topics: [
      "이사의 충실의무",
      "주주총회 결의사항",
      "스톡옵션과 베스팅",
      "근로 관련 입법 쟁점",
    ],
  },
  {
    name: "도구 · 환경",
    slug: "tooling",
    description: "손에 익은 도구가 사고의 속도를 결정한다.",
    tags: ["domain/workflow", "터미널", "Mac", "웹"],
    topics: ["Git", "셸과 터미널", "tmux · cmux", "원격 제어", "웹 스크래핑"],
  },
  {
    name: "인문",
    slug: "humanities",
    description: "기술보다 오래 남는 질문들.",
    tags: ["인문"],
    titlePrefixes: ["인문 -"],
    topics: [
      "신뢰와 통제의 역설",
      "더닝-크루거 효과",
      "감시와 순응",
      "좋은 어른의 역할",
      "우로보로스 효과",
    ],
  },
]

/**
 * 노트 하나가 어느 지식 영역에 속하는지 판정한다.
 * 태그와 제목 접두사를 모두 본다. 복수 영역에 걸칠 수 있다.
 */
export function matchAreas(note: { title: string; tags?: string[] }): KnowledgeArea[] {
  const tags = new Set((note.tags ?? []).map((t) => t.trim().toLowerCase()))
  return knowledgeAreas.filter((area) => {
    const byTag = area.tags.some((t) => tags.has(t.toLowerCase()))
    const byTitle = (area.titlePrefixes ?? []).some((p) => note.title.startsWith(p))
    return byTag || byTitle
  })
}
