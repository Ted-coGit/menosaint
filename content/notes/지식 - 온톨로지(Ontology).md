---
type: know
status: active
created: 2026-04-03
updated: 2026-04-03
tags:
- domain/ai
---


# 온톨로지 (Ontology)

## 1. 개념 정의

**철학적 기원:** 온톨로지(Ontology)는 그리스어 'ontos(존재)'와 'logos(이론)'에서 유래한 철학 용어로, "무엇이 존재하는가"를 탐구하는 형이상학의 한 분야다. 아리스토텔레스의 범주론에서 시작해 존재의 본질과 분류를 다룬다.

**정보과학 맥락:** 1990년대 이후 컴퓨터과학과 인공지능 분야에서 온톨로지는 "공유된 개념화의 명시적 명세(explicit specification of a shared conceptualization)"로 재정의됐다 (Gruber, 1993). 특정 도메인에서 사용하는 개념, 개념 간 관계, 제약조건을 형식화하여 기계와 인간이 함께 이해할 수 있는 지식 모델을 만든다.

> 요약: 온톨로지는 조직이나 도메인의 지식을 **명시적이고 공유 가능한 형태**로 구조화한 체계다. 단순 분류를 넘어, 개념 간 **의미적 관계와 추론 규칙**까지 정의한다.

---

## 2. 핵심 구성 요소

| 요소 | 정의 | 예시 |
|------|------|------|
| **Class** | 개념의 집합, 유형 | `Product`, `Person`, `Organization` |
| **Instance** | 클래스의 구체적 사례 | `Mesoheal+`, `Ted Jin`, `Koru Pharma` |
| **Property** | 클래스나 인스턴스의 속성 | `hasName`, `manufacturedIn`, `expiryDate` |
| **Relation** | 개념 간 연결 관계 | `is-a`, `part-of`, `exports-to`, `regulated-by` |
| **Axiom** | 제약조건과 논리 규칙 | "모든 수출 제품은 반드시 규제 허가를 가진다" |

표준 표현 언어: **OWL (Web Ontology Language)**, **RDF/RDFS**, **SPARQL** (쿼리)

---

## 3. 산업·사회 적용 사례

**의료 — SNOMED CT**
- 350,000개 이상의 의료 개념과 관계를 정의한 임상 온톨로지
- 질병, 증상, 약물, 수술 간의 의미적 관계 표현
- 임상 의사결정 지원, EHR 시스템 표준화에 사용

**금융 — FIBO (Financial Industry Business Ontology)**
- 금융 상품, 기관, 계약, 프로세스를 정형화한 업계 표준 온톨로지
- 규제 보고, 리스크 관리, 데이터 거버넌스에 활용

**웹 — Schema.org**
- Google, Microsoft, Yahoo가 공동 개발한 웹 콘텐츠 온톨로지
- 검색엔진이 웹페이지의 의미를 이해하는 기반 (SEO, Rich Snippet)

**기업 데이터 — Palantir Foundry**
- 조직 전체 데이터를 Object·Property·Link·Action으로 모델링
- 의사결정 지원을 위한 "조직의 디지털 트윈(Digital Twin)" 구현

---

## 4. 발전 가능성

**AI/LLM과의 결합**
- LLM은 언어를 처리하지만 구조화된 지식이 약하다. 온톨로지를 결합하면 추론 정확도와 일관성이 향상된다.
- RAG(Retrieval-Augmented Generation)와 지식 그래프를 결합하면 "사실 기반 AI" 구현 가능

**지식 그래프 (Knowledge Graph)**
- 온톨로지를 실제 데이터로 채운 것이 지식 그래프
- Google Knowledge Graph, Wikidata, DBpedia가 대표 사례
- 기업 내부 지식 그래프는 데이터 사일로 해소의 핵심 수단

**시맨틱 웹 (Semantic Web)**
- Tim Berners-Lee가 제안한 "기계가 이해하는 웹"
- Linked Data 원칙에 따라 온톨로지 기반 데이터를 웹에 공개·연결

---

## 5. 개인 지식관리(PKM)에서의 적용

Obsidian 같은 PKM 도구에서 온톨로지적 사고를 적용하는 방법:

**개념 구조화 (Class 정의)**
- 노트의 `type` frontmatter로 개념 유형 정의 (`know`, `do`, `learn`, `remember`)
- 폴더 구조를 도메인별 클래스 계층으로 설계

**관계 표현 (Relation 정의)**
- `링크`로 노트 간 의미적 연결 표현
- 링크에 의미를 부여: "이 노트는 저 노트의 사례다", "이 개념은 저 개념을 전제한다"

**속성 표현 (Property 정의)**
- frontmatter 필드를 일관되게 정의 (`status`, `domain`, `source` 등)
- Dataview 플러그인으로 속성 기반 쿼리 가능

**추론 대체 (Axiom 대체)**
- 태그 체계를 통한 암묵적 규칙 정의 (`domain/knowledge-management`, `type/tool` 등)
- MOC(Map of Content) 노트로 개념 간 관계 명시

> 핵심 원칙: 노트를 단순히 "저장"하지 말고, **"어떤 개념이고, 무엇과 연결되며, 왜 중요한가"를 명시**하는 것이 온톨로지적 PKM이다.

---

## 관련 노트

- [온톨로지와 택소노미](/notes/온톨로지와-택소노미)
- 팔란티어와 온톨로지
- [조직지식관리 온톨로지 설계 예시](/notes/조직지식관리-온톨로지-설계-예시)

---

*참고: Wikipedia - Ontology (information science) · Gruber (1993) "A translation approach to portable ontology specifications" · Palantir Foundry Docs*
