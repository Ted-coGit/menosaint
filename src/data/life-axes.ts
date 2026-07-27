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

/* ------------------------------------------------------------------ *
 * 가치 축 — 지덕체부복
 * ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ *
 * 관여 축 — 대비되는 네 쌍
 *
 * 각 방식에 판정 질문을 하나씩 붙였다. 기록할 때마다 고민하지 않기 위해서다.
 * 질문에 답이 안 나오면 그 쌍은 비워둔다. 억지로 채우면 지표가 망가진다.
 * ------------------------------------------------------------------ */

export type PairKey = "learn-make" | "deep-wide" | "alone-together" | "fill-empty"

export type Engagement = {
  name: string
  /** 한 줄 정의 */
  summary: string
  /** 이 방식인지 가르는 단일 질문 */
  test: string
  /** 내 활동에서의 예 */
  examples: string[]
}

export type EngagementPair = {
  key: PairKey
  /** 이 쌍이 재는 것 */
  axis: string
  left: Engagement
  right: Engagement
  /** 헷갈리는 경우와 판정 방법 */
  edgeCases: string[]
}

export const engagementPairs: EngagementPair[] = [
  {
    key: "learn-make",
    axis: "입력과 출력",
    left: {
      name: "익히다",
      summary: "받아들이는 쪽. 끝나고 남는 것이 내 안에 있다.",
      test: "이 활동이 끝났을 때 남는 게 내 머릿속뿐인가?",
      examples: ["책 읽기", "영어 공부", "강의 수강", "자료 조사"],
    },
    right: {
      name: "만들다",
      summary: "내놓는 쪽. 끝나고 남는 것이 내 밖에 있다.",
      test: "남에게 보여줄 수 있는 물건이 생겼는가?",
      examples: ["글쓰기", "개인 시스템 구축", "보고서", "이 사이트"],
    },
    edgeCases: [
      "책을 읽고 서평을 썼다면 두 활동으로 쪼갠다. 읽기는 익히다, 쓰기는 만들다.",
      "조사해서 보고서를 냈다면 만들다. 산출물이 목적이었기 때문이다.",
      "만들면서 배우는 경우가 많다. 그래도 결과물이 남으면 만들다로 센다.",
    ],
  },
  {
    key: "deep-wide",
    axis: "깊이와 넓이",
    left: {
      name: "파고들다",
      summary: "이미 아는 영역을 더 깊이 판다.",
      test: "같은 주제로 이미 여러 번 해본 적이 있는가?",
      examples: ["같은 산업 시장조사 반복", "한 철학자 집중", "하나의 도구 숙련"],
    },
    right: {
      name: "넓히다",
      summary: "처음 보는 영역의 지도를 그린다.",
      test: "이 영역이 나에게 처음이거나, 전체 윤곽을 잡는 단계인가?",
      examples: ["역사 통사 읽기", "새 분야 입문", "낯선 카테고리 조사"],
    },
    edgeCases: [
      "매달 하는 시장조사는 같은 산업이면 파고들다, 새 카테고리면 넓히다.",
      "입문서를 여러 권 읽으면 넓히다. 한 저자를 끝까지 가면 파고들다.",
      "깊이도 넓이도 아니면 비워둔다. 반복 실무는 대개 어느 쪽도 아니다.",
    ],
  },
  {
    key: "alone-together",
    axis: "혼자와 함께",
    left: {
      name: "혼자하다",
      summary: "나 혼자의 시간. 고독이 조건인 일.",
      test: "그 자리에 나 말고 사람이 없었는가?",
      examples: ["독서", "글쓰기", "코딩", "혼자 하는 운동"],
    },
    right: {
      name: "함께하다",
      summary: "사람이 개입하는 시간.",
      test: "다른 사람과 주고받은 것이 활동의 일부였는가?",
      examples: ["아이와 보낸 시간", "레슨", "모임", "동료와의 작업"],
    },
    edgeCases: [
      "AI와 함께 작업한 건 혼자하다. 사람 기준으로 센다.",
      "글을 써서 공개한 것 자체는 혼자하다. 반응을 주고받았다면 함께하다를 따로 기록한다.",
      "가족과 같은 공간에 있었지만 각자 딴짓이면 혼자하다.",
    ],
  },
  {
    key: "fill-empty",
    axis: "채움과 비움",
    left: {
      name: "쌓다",
      summary: "나중에 꺼내 쓸 수 있는 것이 남는다.",
      test: "1년 뒤에도 이것의 결과가 나에게 남아 있는가?",
      examples: ["지식", "기록", "자산", "근력", "관계"],
    },
    right: {
      name: "비우다",
      summary: "그 시간에 소진된다. 남기려고 하는 일이 아니다.",
      test: "그 순간을 누리는 것 자체가 목적이었는가?",
      examples: ["영화", "여행", "공연 관람", "쉼", "노는 것"],
    },
    edgeCases: [
      "운동은 의도로 가른다. 단련이 목적이면 쌓다, 해소가 목적이면 비우다.",
      "여행 중 유적을 공부했다면 겹친다. 주된 의도 하나로 판정한다.",
      "비우다를 게으름으로 읽지 않는다. 쌓다만 쌓이면 그것대로 편향이다.",
    ],
  },
]

/** 평탄화된 8개 방식 이름 */
export const engagements: string[] = engagementPairs.flatMap((p) => [
  p.left.name,
  p.right.name,
])

/* ------------------------------------------------------------------ *
 * 열정 축 — 시간과 에너지를 쏟는 대상
 *
 * `defaults`가 분류 비용을 줄이는 장치다. 대상을 고르면 방식이 미리 채워지고,
 * 예외인 경우만 손대면 된다. 확신이 없는 쌍은 아예 비워뒀다.
 * ------------------------------------------------------------------ */

export type Side = "left" | "right"

export type Passion = {
  name: string
  value: ValueKey
  /** 아직 시작하지 않았지만 하려는 것 */
  planned?: boolean
  /** 이 대상의 기본 방식. 기록할 때 초깃값으로 쓴다 */
  defaults?: Partial<Record<PairKey, Side>>
}

export const passions: Passion[] = [
  {
    name: "AI 기술",
    value: "ji",
    defaults: { "learn-make": "left", "alone-together": "left", "fill-empty": "left" },
  },
  {
    name: "개인 시스템",
    value: "ji",
    defaults: { "learn-make": "right", "alone-together": "left", "fill-empty": "left" },
  },
  {
    name: "독서",
    value: "ji",
    defaults: { "learn-make": "left", "alone-together": "left", "fill-empty": "left" },
  },
  {
    name: "영어공부",
    value: "ji",
    defaults: { "learn-make": "left", "fill-empty": "left" },
  },
  {
    name: "역사공부",
    value: "ji",
    defaults: { "learn-make": "left", "deep-wide": "right", "fill-empty": "left" },
  },
  {
    name: "철학공부",
    value: "ji",
    defaults: { "learn-make": "left", "deep-wide": "left", "fill-empty": "left" },
  },
  {
    name: "시장조사",
    value: "ji",
    defaults: { "learn-make": "left", "deep-wide": "left", "fill-empty": "left" },
  },
  {
    name: "글쓰기",
    value: "deok",
    defaults: { "learn-make": "right", "alone-together": "left", "fill-empty": "left" },
  },
  {
    name: "페어런팅",
    value: "deok",
    // 쌓다/비우다는 그날에 따라 갈린다. 가르치면 쌓다, 같이 놀면 비우다.
    defaults: { "alone-together": "right" },
  },
  {
    name: "운동",
    value: "che",
    planned: true,
    defaults: { "alone-together": "left" },
  },
  {
    name: "보컬",
    value: "che",
    planned: true,
    defaults: { "learn-make": "left", "alone-together": "right" },
  },
  {
    name: "주식투자",
    value: "bu",
    defaults: { "deep-wide": "left", "alone-together": "left", "fill-empty": "left" },
  },
  {
    name: "문화생활",
    value: "bok",
    defaults: { "fill-empty": "right" },
  },
]

/* ------------------------------------------------------------------ *
 * TickTick 습관 → 가치 축 매핑 (잔디 트래커 입력)
 * ------------------------------------------------------------------ */

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
 * 습관이 하나도 매핑되지 않은 가치 축.
 * 트래커에서 빈 줄로 남는다. 채우려 꾸미지 않는다.
 */
export function getUncoveredValues(): Value[] {
  const covered = new Set(habitMappings.filter((h) => !h.archived).map((h) => h.value))
  return values.filter((v) => !covered.has(v.key))
}

export function getValue(key: ValueKey): Value {
  return values.find((v) => v.key === key)!
}
