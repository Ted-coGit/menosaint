/**
 * 경력 타임라인. About 섹션 통계의 소스다.
 *
 * 하드코딩된 숫자를 쓰지 않는다. "경력 N년" 같은 값은 여기서 계산한다.
 * TODO(Phase 0): 실제 경력 데이터 입력.
 */

export type TimelineItem = {
  type: "work" | "education"
  title: string
  organization: string
  team?: string
  /** YYYY-MM-DD */
  startDate: string
  /** YYYY-MM-DD, 재직 중이면 null */
  endDate: string | null
  summary?: string
  highlights?: { text: string; stack?: string[] }[]
}

export const timeline: TimelineItem[] = []

const MS_PER_YEAR = 365.25 * 24 * 60 * 60 * 1000

/** 가장 이른 근무 시작일부터 현재까지의 연차. 데이터가 없으면 null. */
export function getYearsOfExperience(): number | null {
  const starts = timeline
    .filter((item) => item.type === "work")
    .map((item) => new Date(item.startDate).getTime())
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
