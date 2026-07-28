/**
 * /now — 지금 무엇에 몰입하고 있는가.
 * https://nownownow.com/about
 *
 * 이력서가 없어도 "지금 어디에 시간을 쓰는 사람인지"는 이 섹션이 답한다.
 * 자주 바뀌는 값이라 데이터로 분리한다. 갱신하면 `updated`도 같이 바꾼다.
 *
 * 출처: 기존 v4 `content/now.md`, Legion vault `WhoIam.md` 1.7 / 1.9
 */

export const now = {
  /** YYYY-MM. 화면에는 "YYYY년 M월 기준"으로 표시된다 */
  updated: "2026-07",
  items: [
    {
      title: "menosaint.xyz",
      detail: "private vault 위에 public layer를 얹는 작업. 지금 이 사이트를 다시 만들고 있다.",
    },
    {
      title: "Legion AI",
      detail:
        "개인 운영 시스템을 설계하고 있다. AI를 일상과 사고 흐름에 어떻게 통합할 수 있는지 실험 중이다.",
    },
    {
      title: "올해의 두 가지",
      detail: "2026년은 AI와 영어 공부에 중점을 두기로 했다.",
    },
  ],
} as const
