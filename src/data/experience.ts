/**
 * 경력 타임라인.
 *
 * 설계 원칙 두 가지.
 *
 * 1) 하드코딩된 숫자를 쓰지 않는다. "경력 N년" 같은 값은 여기서 계산한다.
 * 2) 노출 수위를 코드가 아니라 데이터로 결정한다. 항목별 `visibility`만 바꾸면
 *    공개 범위가 달라진다. 컴포넌트를 고칠 필요가 없다.
 *
 *    public   — 그대로 공개
 *    abstract — 조직명·소속을 가리고 역할과 주제만 공개 (기본값)
 *    private  — 공개하지 않음. 비공개 이력서 페이지에서만 사용
 *
 * 출처: Legion vault `1. Memory/do/JD_운영기획팀_진호경_markdown_v01.md` (JD v01, 2026-02-27)
 */

export type Visibility = "public" | "abstract" | "private"

export type TimelineItem = {
  type: "work" | "education"
  /** 공개용 제목. 조직이 드러나지 않는 역할 중심 표현 */
  title: string
  /** 실제 조직명. abstract/private에서는 렌더링하지 않는다 */
  organization: string
  /** 조직을 가릴 때 대신 노출할 업종·규모 */
  organizationLabel?: string
  team?: string
  /** YYYY-MM-DD. 모르면 null */
  startDate: string | null
  /** YYYY-MM-DD. 재직 중이면 null */
  endDate: string | null
  visibility: Visibility
  summary?: string
  /** 담당 영역. JD 대분류 기준 */
  domains?: { name: string; detail: string }[]
}

export const timeline: TimelineItem[] = [
  {
    type: "work",
    title: "운영기획 · 팀 리드",
    organization: "코루파마",
    organizationLabel: "의료기기 · 메디컬 에스테틱",
    team: "운영기획팀",
    startDate: "2023-01-26",
    endDate: null,
    visibility: "abstract",
    summary:
      "전사 운영기획, 사업계획, 변화관리, 시장정보, IR 지원, 내부 커뮤니케이션을 담당한다. " +
      "정형화된 기능부서 업무보다, 조직에서 아직 주인이 명확하지 않거나 체계화되지 않은 일을 구조화하는 성격이 강하다.",
    domains: [
      {
        name: "운영기획",
        detail:
          "연간 사업계획 수립 프로세스 운영, 정기 리뷰 사이클 설계, 운영제도 개선과 변화관리, 경영정보 체계 구축",
      },
      {
        name: "조사",
        detail:
          "시장·산업 데스크 리서치와 Market Brief 발행, 경쟁사·제품 데이터베이스 구축, 정부지원사업 모니터링, 리서치 워크플로우 자동화",
      },
      {
        name: "대외소통",
        detail:
          "대외용 사업계획서와 IR 문서 작성, 규제 변화 모니터링, 투자자·주주 커뮤니케이션 이력 관리",
      },
      {
        name: "팀 운영",
        detail: "팀 성과·예산 관리, 직무 supervising과 코칭",
      },
    ],
  },

  // TODO(Phase 0): 이전 경력, 학력 추가.
  // vault에서 찾지 못했다. 직접 입력이 필요하다.
]

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

/**
 * 가장 이른 근무 시작일부터 현재까지의 연차.
 * startDate가 없는 항목은 계산에서 제외한다. 알 수 있는 게 없으면 null.
 */
export function getYearsOfExperience(): number | null {
  const starts = timeline
    .filter((item) => item.type === "work" && item.startDate !== null)
    .map((item) => new Date(item.startDate!).getTime())
    .sort((a, b) => a - b)

  if (starts.length === 0) return null
  return Math.floor((Date.now() - starts[0]!) / MS_PER_YEAR)
}

/** 근무한 고유 조직 수. */
export function getCompanyCount(): number {
  return new Set(
    timeline.filter((item) => item.type === "work").map((item) => item.organization),
  ).size
}

/** 공개 가능한 항목만. `private`은 비공개 페이지에서 따로 읽는다. */
export function getPublicTimeline(): TimelineItem[] {
  return timeline.filter((item) => item.visibility !== "private")
}
