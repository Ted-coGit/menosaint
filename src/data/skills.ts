/**
 * 역량 분류.
 *
 * `tags`는 노트 frontmatter의 태그와 매칭해 "이 주제로 쓴 글"을 자동으로 붙이는 데 쓴다.
 * 하나의 스킬에 여러 표기(한글/영문/약어)를 넣어두면 매칭률이 올라간다.
 *
 * 출처: Legion vault `WhoIam.md`, `1. Memory/do/` 대분류 구조
 */

export type Skill = {
  name: string
  /** 노트 태그 매칭용 키워드. 표기 흔들림을 흡수한다 */
  tags: string[]
}

export type SkillGroup = {
  category: string
  skills: Skill[]
}

export const skillGroups: SkillGroup[] = [
  {
    category: "운영기획",
    skills: [
      { name: "사업계획", tags: ["사업계획", "business-plan", "annual-plan"] },
      { name: "KPI · BSC", tags: ["KPI", "BSC", "OKR", "MBO", "성과관리"] },
      { name: "변화관리", tags: ["변화관리", "change-management"] },
      { name: "운영제도 설계", tags: ["운영제도", "제도개선", "operating-system"] },
      { name: "PMI", tags: ["PMI", "인수합병", "post-merger"] },
      { name: "조직진단", tags: ["조직진단", "리더십진단", "org-design", "직무기술서"] },
    ],
  },
  {
    category: "조사 · 분석",
    skills: [
      { name: "시장조사", tags: ["시장조사", "market-research", "domain/market-research"] },
      { name: "Market Brief", tags: ["market-brief", "마켓브리프"] },
      { name: "경쟁사 DB", tags: ["경쟁사", "competitor", "database"] },
      { name: "데스크 리서치", tags: ["desk-research", "데스크리서치", "리서치"] },
      { name: "산업 모니터링", tags: ["규제", "정부지원사업", "산업동향"] },
    ],
  },
  {
    category: "대외소통",
    skills: [
      { name: "IR", tags: ["IR", "투자자", "주주"] },
      { name: "사업계획서", tags: ["사업계획서", "제안서"] },
      { name: "내부 커뮤니케이션", tags: ["내부커뮤니케이션", "communication"] },
    ],
  },
  {
    category: "AI · 자동화",
    skills: [
      { name: "Claude Code", tags: ["Claude", "claude-code", "domain/ai"] },
      { name: "Agent orchestration", tags: ["agent", "에이전트", "orchestration", "multi-agent"] },
      { name: "Harness design", tags: ["harness", "하네스", "prompt", "skill"] },
      { name: "Obsidian 지식관리", tags: ["Obsidian", "지식관리", "knowledge-management", "PKM"] },
      { name: "온톨로지 · 택소노미", tags: ["온톨로지", "ontology", "택소노미", "taxonomy"] },
      { name: "워크플로우 자동화", tags: ["자동화", "automation", "workflow", "n8n"] },
      { name: "Python", tags: ["Python", "scraper", "크롤링", "scraping"] },
      { name: "SQLite", tags: ["SQLite", "데이터베이스"] },
    ],
  },
]

/** 평탄화된 전체 스킬 목록. */
export const skills: Skill[] = skillGroups.flatMap((g) => g.skills)

/**
 * 노트의 태그 배열을 받아 매칭되는 스킬 이름을 돌려준다.
 * 대소문자와 앞뒤 공백은 무시한다.
 */
export function matchSkills(noteTags: string[]): string[] {
  const normalized = new Set(noteTags.map((t) => t.trim().toLowerCase()))
  return skills
    .filter((skill) => skill.tags.some((t) => normalized.has(t.toLowerCase())))
    .map((skill) => skill.name)
}
