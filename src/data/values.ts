/**
 * 가치 축 — 지덕체부복.
 *
 * 활동 히트맵의 행이 된다. 개인 활동을 다섯 갈래로 집계하되,
 * 무엇을 했는지는 남기지 않는다. 몇 번 했는지만 센다.
 *
 * 이 축 위에 얹히는 분류 체계 전체(관심 대상, 관여 방식 4쌍)는 사이트가 아니라
 * vault의 지식 노트에 있다. 개별 경험 기록은 네이버 블로그로 나간다.
 * 여기 남는 것은 집계에 필요한 최소한이다.
 */

export type ValueKey = "ji" | "deok" | "che" | "bu" | "bok"

export type Value = {
  key: ValueKey
  name: string
  hanja: string
  description: string
}

export const values: Value[] = [
  { key: "ji", name: "지", hanja: "智", description: "알아가는 것" },
  { key: "deok", name: "덕", hanja: "德", description: "사람됨과 베푸는 것" },
  { key: "che", name: "체", hanja: "體", description: "몸을 쓰는 것" },
  { key: "bu", name: "부", hanja: "富", description: "자산을 다루는 것" },
  { key: "bok", name: "복", hanja: "福", description: "누리고 쉬는 것" },
]

/**
 * TickTick 습관 → 가치 축 매핑.
 *
 * 갱신은 TickTick MCP(`mcp__claude_ai_ticktick__get_habit_checkins`)로 한다.
 * `mcp__ticktick__list_habits` 쪽은 빈 배열을 돌려주므로 쓰지 않는다.
 * 체크를 놓친 날은 `upsert_habit_checkins`로 사후 보정한다.
 */
export type HabitMapping = {
  habitId: string
  name: string
  value: ValueKey
  /** TickTick에서 보관 처리된 습관 */
  archived?: boolean
}

export const habitMappings: HabitMapping[] = [
  { habitId: "62d090834d8051d1fb6ba67c", name: "Reading book", value: "ji" },
  { habitId: "65cb58d56460110df7947559", name: "Study English", value: "ji" },
  { habitId: "66ea9c596f86112ae65254e5", name: "오늘 리뷰", value: "deok" },
  { habitId: "66ec18ff513411451004098e", name: "조깅하기", value: "che" },
  { habitId: "62d15414499c51d1fb6bc599", name: "Golf swing practice", value: "che" },
  { habitId: "62fa4ee8373851da33c8e4fa", name: "근력운동", value: "che", archived: true },
]

/**
 * 추적하는 습관이 없는 가치 축. 히트맵에서 빈 줄로 남는다.
 * 채우려고 꾸미지 않는다. 비어 있다는 사실 자체가 기록이다.
 */
export function getUncoveredValues(): Value[] {
  const covered = new Set(habitMappings.filter((h) => !h.archived).map((h) => h.value))
  return values.filter((v) => !covered.has(v.key))
}
