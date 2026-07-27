/**
 * Life Map 축 정의.
 *
 * 레퍼런스(heeho.net)는 두 축이었다. 무엇에 몰입하는가(열정)와 어떻게 관여하는가(방식).
 * 여기에 "왜 하는가"에 해당하는 가치 축을 하나 더 얹어 세 겹으로 만든다.
 *
 *   지덕체부복   가치 축   왜 하는가
 *   관심 대상     열정 축   무엇을 하는가
 *   방식          관여 축   어떻게 하는가
 *
 * 방식은 대비되는 쌍으로 둔다. 한쪽으로 치우쳤는지를 보기 위한 장치이므로,
 * 비어 있는 칸이 결핍이 아니라 다음에 할 것의 목록으로 읽혀야 한다.
 */

/** 가치 축. 지덕체부복 */
export type Value = {
  key: "ji" | "deok" | "che" | "bu" | "bok"
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

/** 열정 축. 시간과 에너지를 쏟는 대상 */
export type Passion = {
  name: string
  value: Value["key"]
  /** 아직 시작하지 않았지만 하려는 것 */
  planned?: boolean
}

export const passions: Passion[] = [
  { name: "AI 기술", value: "ji" },
  { name: "개인 시스템", value: "ji" },
  { name: "독서", value: "ji" },
  { name: "영어공부", value: "ji" },
  { name: "역사공부", value: "ji" },
  { name: "철학공부", value: "ji" },
  { name: "시장조사", value: "ji" },
  { name: "글쓰기", value: "deok" },
  { name: "페어런팅", value: "deok" },
  { name: "운동", value: "che", planned: true },
  { name: "보컬", value: "che", planned: true },
  { name: "주식투자", value: "bu" },
  { name: "문화생활", value: "bok" },
]

/**
 * 관여 축. 대비되는 네 쌍.
 *
 * 열정 축과 직교해야 한다. 같은 대상도 방식이 달라진다.
 * 예: AI 기술을 독서로 다루면 익히다, 개인 시스템으로 만들면 만들다.
 */
export type EngagementPair = {
  key: string
  left: { name: string; description: string }
  right: { name: string; description: string }
  axis: string
}

export const engagementPairs: EngagementPair[] = [
  {
    key: "learn-make",
    axis: "입력과 출력",
    left: { name: "익히다", description: "받아들이는 쪽. 읽고 배우고 조사한다" },
    right: { name: "만들다", description: "내놓는 쪽. 쓰고 짓고 결과물을 남긴다" },
  },
  {
    key: "deep-wide",
    axis: "깊이와 넓이",
    left: { name: "파고들다", description: "하나를 끝까지 판다" },
    right: { name: "넓히다", description: "여러 갈래를 훑어 지도를 그린다" },
  },
  {
    key: "alone-together",
    axis: "혼자와 함께",
    left: { name: "혼자하다", description: "고독한 작업. 독서, 글쓰기" },
    right: { name: "함께하다", description: "사람이 끼는 일. 페어런팅, 배움의 자리" },
  },
  {
    key: "fill-empty",
    axis: "채움과 비움",
    left: { name: "쌓다", description: "축적되는 것. 지식, 자산, 기록" },
    right: { name: "비우다", description: "쓰고 흘려보내는 것. 여가, 문화생활, 쉼" },
  },
]

/** 모든 방식 값을 평탄화 */
export const engagements = engagementPairs.flatMap((p) => [p.left.name, p.right.name])

/**
 * TickTick 습관 → 가치 축 매핑.
 *
 * 잔디 트래커의 입력이다. 습관 체크인을 5축 활동으로 환산한다.
 * habitId는 TickTick API가 돌려주는 값을 그대로 쓴다.
 *
 * 주의: 현재 습관 세트는 지·체만 덮고 덕·부·복이 비어 있다.
 * 5축을 다 채우려면 습관을 추가해야 한다. (PLAN.md 참고)
 */
export type HabitMapping = {
  habitId: string
  name: string
  value: Value["key"]
  /** TickTick에서 보관 처리된 습관 */
  archived?: boolean
}

export const habitMappings: HabitMapping[] = [
  { habitId: "62d090834d8051d1fb6ba67c", name: "Reading book", value: "ji" },
  { habitId: "65cb58d56460110df7947559", name: "Study English", value: "ji" },
  { habitId: "66ec18ff513411451004098e", name: "조깅하기", value: "che" },
  { habitId: "62d15414499c51d1fb6bc599", name: "Golf swing practice", value: "che" },
  { habitId: "62fa4ee8373851da33c8e4fa", name: "근력운동", value: "che", archived: true },
  { habitId: "66ea9c596f86112ae65254e5", name: "오늘 리뷰", value: "deok" },
]

/** 습관이 하나도 매핑되지 않은 가치 축. 트래커에서 빈 줄로 남는다 */
export function getUncoveredValues(): Value[] {
  const covered = new Set(habitMappings.filter((h) => !h.archived).map((h) => h.value))
  return values.filter((v) => !covered.has(v.key))
}
