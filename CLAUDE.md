# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트

숙명여대 중앙발명동아리 **엉뚱한 사람들 (SMWU INVENTORS)**의 정적 웹사이트로, 3인 팀("yes3")의 웹프로그래밍 중간 프로젝트입니다. HTML + CSS 위주이며 빌드 과정, 패키지 매니저, 테스트, 린터는 없습니다. 인터랙션은 대부분 JS 없이 구현합니다(숨긴 radio/checkbox + `:checked ~`, `:target` 라이트박스·화면 전환, `:hover`, `@keyframes`). 다만 팀원들이 JavaScript를 추가했습니다: `10_yes3_auth.js`(웹 스토리지로 로그인·로그아웃·회원가입, 각 페이지에서 nav의 `#nav_auth`를 `renderNav()`로 바꿈), 교육자료·비품 페이지의 인라인 `<script>`, 비품 데이터 `10_yes3_equipment.json`. ABOUT US 사진 캐러셀(`.carousel` > `.carousel-view` > `.carousel-container` > `.carousel-slide`, ‹ › 버튼 `#prevBtn`/`#nextBtn`)은 사용자가 준 코드로, 스크립트가 index.html 안의 인라인 `<script>`에 있습니다(전역 변수 `track`, `currentIndex`, `updateSlide` 등을 쓰므로 같은 이름을 다른 스크립트 최상위에 선언하면 안 됩니다). `10_yes3_main.js`(index에 `defer`로 연결)에는 ABOUT US 캘린더만 있습니다: 날짜마다 radio input(`name="cal_day"`)을 JS가 만들고, 고른 날짜의 일정 목록을 보여줍니다(보기 전용. 외부인이 일정을 바꾸지 못하게 사용자 요청으로 일정 추가·삭제 기능을 없앰, `<form id="cal_form">` 태그는 남아 있음). 제목을 누르면 연도(◀ ▶, 2026년 이상)·월(1~12월 표) 선택 창이 열립니다. 기본 일정은 JS의 `DEFAULT_EVENTS`(2026 2학기 동아리 일정표, 1주차 = 8/31 월요일 시작 주, `week(n)`으로 주차 범위 계산)이고, 일정을 바꾸려면 이 배열을 고칩니다. 디자인·연출은 CSS로 하는 것을 기본으로 하고, JS가 꼭 필요할 때만 쓰며 쓰기 전에 사용자에게 알립니다.

참고: `README.md`는 일부 내용이 오래되었습니다. 파일 구조(`10_엉삼_*.html`, `css/style.css`, `assets/`)가 실제 파일과 다르므로 실제 파일을 기준으로 합니다.

## 실행

- 브라우저에서 `WP_midterm_project_1/10_yes3_index.html`을 바로 열거나,
- Live Server / Five Server 사용: `fiveserver.config.js`가 루트를 `WP_midterm_project_1`로, 시작 페이지를 `10_yes3_index.html`로 지정합니다(`.vscode/settings.json`에 Live Server 포트 5502).

모든 리소스 경로는 `WP_midterm_project_1/` 기준 상대경로입니다(`res/`: 사진·로고·커서·footer 이미지·크레용 글씨 이미지, `item/`: 비품 SVG).

## 구조

모든 페이지는 `WP_midterm_project_1/` 폴더에 평평하게 있습니다. 스타일시트는 `10_yes3_common.css` → `10_yes3_bg.css`(서브 페이지만) → 페이지 그룹 CSS 순서로 불러오며, 뒤에 오는 파일이 앞의 것을 덮어씁니다.

| 페이지 | 페이지 그룹 CSS |
|---|---|
| `10_yes3_index.html` (메인) | `10_yes3_main.css` (`bg.css` 안 씀) |
| `10_yes3_arch_learning.html` (교육자료) | `10_yes3_arch_learning.css` |
| `10_yes3_arch_gallery.html` (갤러리) | `10_yes3_arch_learning.css` + `10_yes3_arch_gallery.css` |
| `10_yes3_db_equipment.html`, `10_yes3_db_rule.html`, `10_yea3_db_cleanup.html` (동아리방) | `10_yes3_dongbang.css` |
| `10_yes3_signin.html`, `10_yes3_signup.html` | `10_yes3_login.css` |
| `10_yes3_coin.html` (후원 "BUY US A COIN" 페이지, 메인의 INSERT US COIN에서 연결) | `10_yes3_coin.css`만 사용. common/bg/nav/footer 없는 독립 페이지 |

- **`10_yes3_bg.css`**: 서브 페이지 공통 배경. 남색 `body`, 그리고 `.dbeq_1`(비품·로그인·회원가입)과 `.learning_1`(교육자료)이 쓰는 `sub_image.jpg` 첫 화면 사진. 첫 화면 **높이**는 페이지마다 달라서 각 페이지 그룹 CSS에 둡니다. 또 `<header>` 안 `.sub_header`를 쓰는 페이지(갤러리·이용규칙. 청소담당은 `.cleanup_1` 사진 배너를 씀)는 메인 첫 화면과 같은 `mainpagedesign.png`가 남색으로 흐려지는 헤더(빈 `<div class="sub_header"></div>`. 메뉴 이름 글씨는 사용자 요청으로 지웠지만 아래 선택자들이 이 칸을 기준으로 하니 칸은 지우면 안 됨)와, `header:has(.sub_header) + article`에 메인 ABOUT US 같은 남색 + 파란·주황 빛 배경과, 가상 요소로 그린 반짝이는 별(`::before`, ✦ 하나를 text-shadow로 복사)·크레용 "엉사" 이미지(`::after`, `res/crayon_ungsa.png`)를 씁니다. 회원가입 페이지에도 빈 `<header>`가 있어서 `header + article`만 쓰면 회원가입까지 적용되니 `:has(.sub_header)`를 빼면 안 됩니다. 이용규칙 본문(`article.rule2`)은 비품·교육자료·청소담당과 같은 `board-head` 제목 + `.wrap` + 판넬(`.r-panel`, 규칙 카드 그리드 `.r-grid`, "나가기 전 체크" 표 `.r-table`은 CSS 체크박스) 구조이고, 스타일은 dongbang.css의 `[1-2]` 구역(seojin 담당 표시 위)에 있습니다. seojin 담당 부분의 옛 `.db_article`/`.rule_list` 스타일은 이제 안 쓰지만 지우지 않았습니다. 갤러리(`article.gallery2`)도 같은 `board-head` + `.wrap` + 판넬 2개(`#panel-gallery` marquee, `#panel-years` 연도 필터·연도별 사진 그리드) 구조이고, 연도 필터는 숨긴 radio `#yr-all`/`#yr-2026`/`#yr-2025`/`#yr-2024`(버튼·사진 묶음보다 앞) + `label.pill`로 고른 연도만 보여줍니다(CSS만). 다른 연도는 `section#y20xx`째 숨기지 않고 안의 사진 카드·연도 알약만 숨깁니다(라이트박스가 section 안에 있어서 section을 숨기면 marquee 사진을 눌러도 안 뜸). 스타일은 gallery.css 맨 아래 "판넬 디자인" 구역에 있습니다. marquee·폴라로이드·라이트박스 마크업과 스타일은 사용자 요청으로 건드리지 않습니다. 서브 페이지 footer 로켓(`#ft-rocket`)은 공통 `10_yes3_rocket.js`(각 서브 페이지 `</body>` 바로 앞에서 불러옴, 메인·후원 페이지는 안 불러옴)로 위로 날아가 화면을 올린 뒤 페이지 첫 판넬(`#panel-gallery`·`#panel-learning`·`#panel-supplies`·`#panel-rule`·`#panel-cleanup`·`.signinup_item` 중 먼저 나오는 것) 윗변에 `.rocket-landed`로 착륙하고, 착륙한 로켓을 누르면 footer로 돌아갑니다. 로켓이 판넬 위 `.board-head` 줄과 높이가 겹쳐서, 검색창이 있는 페이지(교육자료·비품)는 제목과 검색창 사이 빈 곳에(좁으면 로켓을 50px까지 줄임), 없는 페이지는 판넬 오른쪽 위에 앉힙니다(`place()`). 로켓 스타일은 common.css 맨 아래 "footer 로켓" 구역입니다(교육자료가 bg.css를 안 불러와서 common에 둠). 라이트박스가 열리면 `article.gallery2:has(.lightbox:target)`에 `z-index: 101`을 줘서 nav 위로 올립니다(bg.css의 `isolation` 때문에 x 버튼이 nav 밑에 깔리던 문제). (`.sub_header` 스타일은 원래 common.css에 있다가 팀원 작업 중 빠졌습니다.) 서브 페이지에 배경 이미지나 장식을 추가할 때는 여기서 합니다. 크레용 글씨처럼 HTML(SVG 필터)이 필요한 장식은 `res/crayon_ungsa.png` 같은 이미지로 만들어 쓰면 HTML을 건드리지 않아도 됩니다.
- **`10_yes3_common.css`**: 공통 컴포넌트. Google Fonts 불러오기(Dongle, Jua), 상단 고정 nav `.main_nav`와 hover/focus 드롭다운(`.nav_title` + `.nav_dropdown`), footer `.ft`(누를 수 있는 발명품 버튼이 있는 바닥 그림 영역 + `.ft-panel` 링크 칸). 수정하면 모든 페이지에 영향이 가므로, 가능하면 페이지 그룹 CSS에서 덮어씁니다.
- **nav와 footer 마크업은 모든 HTML 파일에 복사되어 있습니다.** nav/footer를 바꾸면 모든 페이지에 똑같이 반영해야 합니다.
- **청소담당 페이지 이름 주의:** 청소담당 페이지 파일 이름은 오타가 있는 `10_yea3_db_cleanup.html`("yea3")이고, 모든 nav가 이 이름으로 연결됩니다(예전 `10_yes3_db_cleanup.html`은 삭제됨).
- **메인 페이지(`10_yes3_index.html`)**는 화면 한 칸 크기의 섹션들로 되어 있습니다: `.main1` 첫 화면(고정 배경 `res/mainpagedesign.png`이 남색으로 흐려짐) → `.main2` ABOUT US(인라인 스크립트 사진 캐러셀 + JS 캘린더) → `.main3` HISTORY(연혁 + 눈송이) → `.main4` INVENTORS(조직도 + INSERT US COIN) → footer. 2~4 섹션은 `isolation: isolate`를 쓰고, 오락실 장식(네온사인, 인라인 SVG `#crayon` 필터를 쓴 크레용 글씨, 별, 전구 줄)은 `z-index: -1`, `pointer-events: none`인 `.deco` 레이어에 있습니다. `.main1`에는 `isolation`을 **넣으면 안 됩니다**. 안에 있는 고정 nav가 아래 섹션들에 가려집니다.
  - **눈송이 녹는 연출(HISTORY):** 눈송이 `<img class="main3_ungsasong">`가 숨긴 체크박스 `#snow-melt` + `<label class="snow-label">`로 감싸져 있습니다. 체크되면 transition으로 납작해지며 사라지고, `.snow-label::after`(물웅덩이)·`::before`(물방울)가 나타납니다. 다시 누르면 원래대로 돌아옵니다.
  - **조직도 카드(INVENTORS):** HTML 구조(`.org_executive` / `.org_inventors`의 `li > span`)는 그대로이고, footer와 같은 톤으로 맞춥니다(사용자가 네온 카드는 너무 튄다고 해서 바꿈). 색은 주황·흰색·남색만 씁니다. 카드 바탕은 footer와 같은 `res/footer-plate.png` 철판 무늬 + 남색, 임원진은 주황 윗선, 부원은 남색 윗선입니다. 직책(`.role`)은 footer "지원하기!" 같은 주황 알약이고, hover 때는 테두리가 주황이 되고 footer 버튼 같은 딱딱한 그림자가 생깁니다. 조직도에는 네온 빛번짐을 넣지 않습니다.
  - **INSERT US COIN:** `<a class="insert-coin with-bulbs">`는 `10_yes3_coin.html`로 가는 네온 간판입니다. 전구 테두리는 장식용 `.with-bulbs`(`::before`/`::after`)를 재사용하고, 안에 톱니바퀴 SVG(`.coin-gear`, 점선 원 `stroke-dasharray`로 톱니 표현) 2개와 별(`.coin-star`) 3개가 있습니다. 조직도와 겹치지 않도록 절대위치가 아니라 문서 흐름(`margin-top`)으로 배치합니다.
- **후원 페이지(`10_yes3_coin.html`)**: footer 디자인에 맞춘 카드. 위쪽 무대(`.coin-stage`)는 `res/footer-floor.png` 바닥 위에 `footer-robot.png` 로봇, SVG 톱니바퀴(노랑 + 굵은 검정 외곽선), 전구(`footer-bulb.png`, 계좌 화면이나 hover 때 `footer-bulb-on.png`)가 서 있고, 아래 판넬(`.coin-panel`)은 footer와 같은 `footer-plate.png` 철판 무늬입니다. 글꼴은 주아체(본문)·동글체(큰 제목)만, 네온 없음, 색은 사이트에 이미 있는 색만 씁니다. 첫 화면(`#start`)에서 NEXT를 누르면 `:target`으로 계좌 화면(`#account`, 영어 기울임체)으로 바뀝니다. `#account`가 `.coin-start`보다 **앞에** 있어야 `#account:target ~ .coin-start`로 첫 화면을 숨길 수 있습니다. 계좌 정보(Kakao Bank 11111-1111-1111, 예금주 SMWU Inventors)는 임시 값입니다.
- **메인 제목 "엉뚱한 사람들"**: 원래 디자인 유지(동글체 `.dongle-regular`, 글자 사이 띄어쓰기 "엉 뚱 한 사 람 들", 주황 `#ff8800` / 파랑 `#37a1ff`, 160px). 네온 튜브·손글씨 버전을 시도했지만 사용자가 원래대로 되돌렸습니다. 메인 footer는 `10_yes3_main.css` 맨 아래에서만 덮어써서(어둑한 안개 `.ft-stage::before`, 발명품 채도 낮춤) 감성술집 톤에 맞춥니다. footer 로고 "엉뚱한 사람들"은 원래 디자인 그대로입니다. 첫 화면 스티커 버튼, footer "지원하기!", "발명품을 눌러보세요!" 노란 알약(`.ft-hint`)은 사용자 요청으로 원래 디자인을 유지합니다.
- **디자인 테마:** 진한 남색 `#060B1E` 배경이 그라데이션으로 footer 회색(`#161a21`)까지 이어집니다. 포인트 색은 주황 `#ff8800`/`#FF7A1A`, 파랑 `#37a1ff`/`#0078d7`, 노랑 `#ffbc00`/`#FDB813`. 메인 본문 글꼴은 주아체, 섹션 제목은 동글체입니다. 각 페이지 그룹 CSS 끝에는 전체 커서 `* { cursor: url('res/cursor_white.png') 2 2, auto; }`가 있습니다.
- 반응형 처리는 `10_yes3_main.css` 안의 `@media (max-width: …)` 블록(조직도 칸 수, 1200px 이하에서 큰 장식 숨기기)뿐이며, 나머지 레이아웃은 데스크톱 기준입니다.

## Git 작업 방식

- 팀원마다 자기 브랜치(`채린`, `seeun`, `seojin`)에서 작업하고 GitHub Pull Request로 `main`에 합칩니다(원격 저장소 `ungsam3/wp_midterm`).
- `main`을 개인 브랜치로 pull하기 전에 로컬 변경 사항을 커밋하거나 stash합니다. 팀원이 같은 파일을 고쳤으면 `git pull origin main`이 중단되며, nav/footer가 모든 파일에 복사되어 있어서 자주 일어납니다.
- 커밋 메시지는 한국어로 씁니다.
