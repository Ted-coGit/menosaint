import { defineCollection, z } from "astro:content"
import { glob } from "astro/loaders"

/**
 * notes — 사고 기록.
 *
 * Obsidian Legion vault의 `1. Memory/`에서 `publish: true`인 노트만 동기화된다.
 * 게이트는 opt-in이다. 표시하지 않은 노트는 나가지 않는다.
 * 변환은 `sync.py`가 한다. 여기 파일을 직접 고치지 않는다.
 *
 * 슬러그는 한글 그대로 둔다. v4에서 쓰던 URL과 이어지고,
 * 영문 번역 축은 뒤로 미뤄둔 상태다.
 */
const notes = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/notes" }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    tags: z.array(z.string()).default([]),
    /** vault의 created */
    pubDate: z.coerce.date(),
    /** vault의 updated. created와 같으면 생략된다 */
    updatedDate: z.coerce.date().optional(),
    draft: z.boolean().default(false),
    /** vault 원본 경로. 디버깅과 역추적용 */
    source: z.string().optional(),
  }),
})

export const collections = { notes }
