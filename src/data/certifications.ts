/**
 * 자격증. Certs 통계는 이 배열의 길이로 계산된다.
 * TODO(Phase 0): 실제 자격증 입력.
 */

export type Certification = {
  name: string
  issuer: string
  /** YYYY-MM */
  issued: string
  /** YYYY-MM, 만료 없으면 null */
  expires?: string | null
  credentialUrl?: string
  badgeUrl?: string
}

export const certifications: Certification[] = []
