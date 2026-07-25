/**
 * 사이트 전역 설정.
 *
 * 개인정보는 환경변수로 분리한다. 로컬은 .env, 배포는 CI 환경변수.
 * 값이 없으면 아래 fallback이 쓰인다.
 */

const env = import.meta.env

export const site = {
  name: env.PUBLIC_SITE_NAME ?? "menosaint",
  url: "https://menosaint.xyz",
  locale: "ko-KR",
  lang: "ko",
  description:
    "조직과 사람, 시스템과 흐름에 관한 기록. 사고의 과정을 남기는 공간입니다.",
  // TODO: 전용 OG 이미지 제작. 지금은 아바타로 대체한다
  ogImage: "/images/avatar.jpg",
} as const

export const profile = {
  nameKo: env.PUBLIC_NAME_KO ?? "Ted",
  nameEn: env.PUBLIC_NAME_EN ?? "Ted",
  /**
   * 공개용 한 줄 정체성. 소속이 아니라 하는 일로 설명한다.
   * 출처: Legion vault `WhoIam.md` 1.1 기본 정체성
   * TODO(Phase 0): 후보 중 확정 — "AI-enabled Operator" / "Operating Designer" / 현재 값
   */
  role: env.PUBLIC_ROLE ?? "AI-enabled Operator",
  tagline: "조직과 사람, 시스템과 흐름에 관심이 많습니다.",
  avatar: env.PUBLIC_AVATAR ?? "/images/avatar.jpg",
  email: env.PUBLIC_EMAIL ?? "ted@menosaint.xyz",
} as const

export const socials = [
  { label: "GitHub", href: env.PUBLIC_GITHUB ?? "https://github.com", icon: "github" },
  { label: "LinkedIn", href: env.PUBLIC_LINKEDIN ?? "https://linkedin.com", icon: "linkedin" },
] as const

/**
 * 사이드바 내비게이션.
 *
 * `anchor`는 원페이지(/) 내 섹션 id, `href`는 별도 라우트.
 * `sub: true`면 상위 항목에 딸린 하위 링크로 들여쓰기 렌더링한다.
 *
 * 구성 근거: 이 사이트는 구직용 포트폴리오가 아니라 사고 기록과 경험 저장소다.
 * 중심축은 Knowledge다. "무엇을 잘한다"는 역량 선언(Skills)이 아니라
 * "무엇을 알아가고 있는가"를 글의 축적으로 보여준다.
 * Experience는 조직을 가린 추상화 형태로만 남기고, Projects와 Life가 그 뒤를 받친다.
 */
export type NavItem = {
  label: string
  anchor?: string
  href?: string
  sub?: boolean
}

export const nav: NavItem[] = [
  { label: "About", anchor: "about" },
  { label: "Knowledge", anchor: "knowledge" },
  { label: "노트 전체", href: "/notes/", sub: true },
  { label: "Now", anchor: "now" },
  { label: "Experience", anchor: "experience" },
  { label: "Projects", anchor: "projects" },
  { label: "프로젝트 전체", href: "/projects/", sub: true },
  { label: "Life", anchor: "life" },
  { label: "Life Map", href: "/life/", sub: true },
]
