/**
 * 자격증.
 *
 * 현재 공개 사이트에는 별도 섹션을 두지 않는다 (PLAN.md 7절).
 * 데이터는 유지하고, 필요해지면 섹션을 되살린다.
 */

export type Certification = {
  name: string
  issuer: string
  /** YYYY-MM. 모르면 null */
  issued: string | null
  /** YYYY-MM. 만료 없으면 null */
  expires?: string | null
  credentialUrl?: string
}

export const certifications: Certification[] = [
  {
    name: "사회복지사 2급",
    issuer: "보건복지부",
    // TODO: 취득 연월 확인
    issued: null,
    expires: null,
  },
]
