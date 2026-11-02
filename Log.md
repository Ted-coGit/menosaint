# Log — menosaint.xyz

이미 한 일을 날짜순으로 덧붙인다. 지난 줄은 고치지 않는다. 2026-11-01 이전 이력은 git log와 HANDOVER.md의 2026-05-25 세션 요약에 있다.

## 2026-11-01 Claude

- 이번 변경
	- HANDOVER.md 다음 단계 4번(홈 개선)에 daleseo.com 레퍼런스, Ted가 마음에 든 점, 실측 구조, 방향 결정을 기록했다. 커밋 3fc5ea7, 162db79, db4e202. push하지 않았다.
	- /handover로 HANDOVER.md를 정리했다. 첫 줄 절차 정본 포인터, 현재 상태, 승인 대기·미검증 절을 추가하고, 기존 2026-05-25 내용은 모두 보존했다. 굵은 글씨와 구분선은 공통 정본 서식에 맞춰 뺐다.
	- 4벌 원칙(Legion System 17번)에 따라 빠져 있던 Log.md(이 파일)와 SOP.md(SOP-MENOSAINT, 0.1 초안)를 최소형으로 만들었다.
- 결정 이유
	- 홈 개선은 글 중심 레이아웃으로 간다(Ted 결정). 미뤄 온 원인이 목차와 구성을 먼저 생각한 것이었고, 글 한 편씩에 집중하는 편이 시작이 빠르고 지속 가능하다는 판단.
	- README.md는 Quartz 원본 README라 덮어쓰지 않았다. 공통 정본이 README 목적 변경을 금지한다.
	- SOP 코드는 SOP-MENOSAINT로 정했다. 이웃 저장소의 SOP-MENOSAINT-PRIVATE와 겹치지 않음을 볼트와 GitHub 폴더 검색으로 확인했다. SOP 색인에는 올리지 않았다(색인 행은 sop-keeper 출력으로만 붙인다).
- 확인 근거
	- daleseo.com 실측: gstack browse의 viewport 스크린샷과 computed style 측정(본문 18px, 행간 28.8px, 본문 폭 700px, 목차 요소 없음).
	- 커밋: `git log --oneline -3`에 위 세 커밋이 있다.
- 완료 기준 대비 남은 일
	- 홈 개선은 방향만 정했고 코드 변경은 없다. Claude가 제안한 순서(글 한 편 먼저, 사이드 패널 제거와 본문 폭 조정, 카드 홈은 나중)가 승인 대기다.
	- 이 handover 저장분(HANDOVER.md 갱신, Log.md·SOP.md 신규)은 commit하지 않았다.
	- 저장소 자체의 README(시작일·목적)를 어디에 둘지 미정.
