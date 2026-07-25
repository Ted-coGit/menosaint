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
  ogImage: "/images/og-default.png",
} as const

export const profile = {
  nameKo: env.PUBLIC_NAME_KO ?? "Ted",
  nameEn: env.PUBLIC_NAME_EN ?? "Ted",
  /** TODO(Phase 0): 정체성 한 줄 문구 확정 */
  role: env.PUBLIC_ROLE ?? "Systems & Organization",
  tagline: "조직과 사람, 시스템과 흐름에 관심이 많습니다.",
  avatar: env.PUBLIC_AVATAR ?? "/images/avatar.svg",
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
 * TODO(Phase 0): 섹션 구성이 Ted의 정체성에 맞는지 재검토.
 * 현재는 레퍼런스(heeho.net) 구성을 그대로 옮겨둔 상태다.
 */
export type NavItem = {
  label: string
  anchor?: string
  href?: string
  sub?: boolean
}

export const nav: NavItem[] = [
  { label: "ABOUT", anchor: "about" },
  { label: "EXPERIENCE", anchor: "experience" },
  { label: "PROJECTS", anchor: "projects" },
  { label: "DETAILS", href: "/projects/", sub: true },
  { label: "CERTIFICATIONS", anchor: "certifications" },
  { label: "SKILLS", anchor: "skills" },
  { label: "NOTES", href: "/notes/", sub: true },
]
