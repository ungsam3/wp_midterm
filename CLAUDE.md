# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트

숙명여대 중앙발명동아리 **엉뚱한 사람들 (SMWU INVENTORS)**의 정적 웹사이트로, 3인 팀("yes3")의 웹프로그래밍 중간 프로젝트입니다. HTML + CSS 위주이며 빌드 과정, 패키지 매니저, 테스트, 린터는 없습니다. 인터랙션은 대부분 JS 없이 구현합니다(숨긴 radio/checkbox + `:checked ~`, `:target` 라이트박스·화면 전환, `:hover`, `@keyframes`). 다만 팀원들이 JavaScript를 추가했습니다: `10_yes3_auth.js`(웹 스토리지로 로그인·로그아웃·회원가입, 각 페이지에서 nav의 `#nav_auth`를 `renderNav()`로 바꿈), 교육자료·비품 페이지의 인라인 `<script>`, 비품 데이터 `10_yes3_equipment.json`. ABOUT US 사진 캐러셀(`.carousel` > `.carousel-view` > `.carousel-container` > `.carousel-slide`, ‹ › 버튼 `#prevBtn`/`#nextBtn`)은 사용자가 준 코드로, 스크립트가 index.html 안의 인라인 `<script>`에 있습니다(전역 변수 `track`, `currentIndex`, `updateSlide` 등을 쓰므로 같은 이름을 다른 스크립트 최상위에 선언하면 안 됩니다). `10_yes3_main.js`(index에 `defer`로 연결)에는 ABOUT US 캘린더만 있습니다: 날짜마다 radio input(`name="cal_day"`)을 JS가 만들고, 고른 날짜의 일정 목록을 보여줍니다(보기 전용. 외부인이 일정을 바꾸지 못하게 사용자 요청으로 일정 추가·삭제 기능을 없앰, `<form id="cal_form">` 태그는 남아 있음). 제목을 누르면 연도(◀ ▶, 2026년 이상)·월(1~12월 표) 선택 창이 열립니다. 기본 일정은 JS의 `DEFAULT_EVENTS`(2026 2학기 동아리 일정표, 1주차 = 8/31 월요일 시작 주, `week(n)`으로 주차 범위 계산)이고, 일정을 바꾸려면 이 배열을 고칩니다. 디자인·연출은 CSS로 하는 것을 기본으로 하고, JS가 꼭 필요할 때만 쓰며 쓰기 전에 사용자에게 알립니다.

참고: `README.md`는 일부 내용이 오래되었습니다. 파일 구조(`10_엉삼_*.html`, `css/style.css`, `assets/`)가 실제 파일과 다르므로 실제 파일을 기준으로 합니다.

## 교안 범위 규칙 (반드시 지킴)

발표 때 교수님이 코드를 설명하라고 하므로, **웹프로그래밍 교안(2026-2, 김상연 교수님)에 있는 기술만** 씁니다.

- 요청이 교안을 **크게 벗어나면 바로 만들지 않습니다.** 먼저 거절하거나, 왜 교안 밖인지 사유와 교안 안에서 할 수 있는 대안을 설명하고 진행할지 묻습니다.
  - 예: Promise·async/await 직접 사용, Web Animations API, getBoundingClientRect, IntersectionObserver, 외부 라이브러리·프레임워크(jQuery, React 등), Canvas 게임 루프 등
- 교안 경계에 걸치는 것은 쓰되, 사용자에게 "교안 몇 주차의 어떤 내용인지"를 알립니다.
- 코드 주석에는 해당 기술이 몇 주차 교안인지 적어 두면 발표 준비에 도움이 됩니다(예: `// 11주차: createElement`).

교안 범위 요약:

| 주차 | 내용 |
|---|---|
| 2 | HTML 기본 구조, 제목·문단·목록·표, 구조화 태그(header, nav, article, section, aside, footer) |
| 3 | a(href, target, `#id` 이동), img, figure/figcaption, audio, video, iframe, canvas, svg |
| 4 | form(get/post), input 종류, label, textarea, fieldset/legend, select, button, datalist |
| 5 | CSS 선언 방식, 선택자(id, class, 가상클래스 :hover :checked :nth-child 등), font, text, color, background, list, table |
| 6 | 웹폰트, 박스 모델, box-sizing, opacity, overflow, object-fit, position, z-index, display, flex |
| 9 | 변수(var/let/const), 자료형, 연산자, alert/confirm/prompt, if/switch, for/while |
| 10 | 함수(선언·표현식·화살표), setTimeout, parseInt, Date, Math, 배열(push, map, filter, join, slice …), window, navigator, 객체·생성자·class, for…in / for…of, 스프레드 |
| 11 | DOM: getElementById, getElementsBy…, querySelector(All), value, innerText, innerHTML, get/set/removeAttribute, `element.style.…`, createElement, createTextNode, appendChild, replaceChild, remove, removeChild, parentNode/parentElement, childNodes, firstChild, lastChild |
| 12 | 이벤트(click, mouseover, keydown, load, scroll, wheel, change, focus, submit …), 인라인/프로퍼티/addEventListener 등록, 이벤트 객체(type, target, key, clientX, deltaY), preventDefault, stopPropagation, `window.innerHeight`, CSS `transform: translateY` + `transition` |
| 13 | JSON(stringify, parse), AJAX, fetch().then().catch() (Promise 개념 자체는 교안에서 생략), CORS, localStorage/sessionStorage(setItem, getItem, removeItem, clear) |
| 14 | Node.js, Express(라우팅, req/res, 미들웨어, express.static) |

교안 슬라이드에 직접 나오지 않지만 이미 프로젝트에 쓰인 것: `@keyframes` 애니메이션, `:target`, `:has()`, `::before`/`::after`, `grid` 세부 속성, `window.scrollTo`, `document.body.scrollHeight`. 새로 쓸 때는 사용자에게 알립니다.

## 실행

- 브라우저에서 `WP_midterm_project_1/10_yes3_index.html`을 바로 열거나,
- Live Server / Five Server 사용: `fiveserver.config.js`가 루트를 `WP_midterm_project_1`로, 시작 페이지를 `10_yes3_index.html`로 지정합니다(`.vscode/settings.json`에 Live Server 포트 5502).

모든 리소스 경로는 `WP_midterm_project_1/` 기준 상대경로입니다(`res/`: 사진·로고·커서·footer 이미지·크레용 글씨 이미지, `item/`: 비품 SVG).

## 구조

모든 페이지는 `WP_midterm_project_1/` 폴더에 평평하게 있습니다. 스타일시트는 `10_yes3_common.css` → 페이지 그룹 CSS 순서로 불러오며, 뒤에 오는 파일이 앞의 것을 덮어씁니다.

| 페이지 | 페이지 그룹 CSS |
|---|---|
| `10_yes3_index.html` (메인) | `10_yes3_main.css` |
| `10_yes3_arch_learning.html` (교육자료) | `10_yes3_arch_learning.css` |
| `10_yes3_arch_gallery.html` (갤러리) | `10_yes3_arch_learning.css` + `10_yes3_arch_gallery.css` |
| `10_yes3_db_equipment.html`, `10_yes3_db_rule.html`, `10_yea3_db_cleanup.html` (동아리방) | `10_yes3_dongbang.css` |
| `10_yes3_signin.html`, `10_yes3_signup.html` | `10_yes3_login.css` |
| `10_yes3_coin.html` (후원 "BUY US A COIN" 페이지, 메인의 INSERT US COIN에서 연결) | `10_yes3_coin.css`만 사용. common/bg/nav/footer 없는 독립 페이지 |

- **서브 페이지 공통 배경 (common.css `[1-2]`)**: 예전 `10_yes3_bg.css`는 내용이 남색 `body`와 사진 배너뿐이라, "불필요한 파일 분리는 감점" 요구사항 때문에 common.css로 합치고 지웠습니다. 남색 `body`, 그리고 `.dbeq_1`(비품·이용규칙·로그인·회원가입)과 `.learning_1`(교육자료·갤러리)이 쓰는 `sub_image.jpg` 첫 화면 사진. 첫 화면 **높이**는 페이지마다 달라서 각 페이지 그룹 CSS에 둡니다. 갤러리는 `.learning_1`, 이용규칙은 `.dbeq_1` 배너를 써서 모든 서브 페이지 위쪽이 같습니다(예전 메인 그림 `.sub_header` 헤더와 본문 그라데이션·별·크레용 장식은 사용자 요청으로 지움. `res/crayon_ungsa.png`는 이제 안 씀). 본문은 배경 없이 body 남색이 그대로 이어집니다. 이용규칙 본문(`article.rule2`)은 비품·교육자료·청소담당과 같은 `board-head` 제목 + `.wrap` + 판넬(`.r-panel`, 안내 문구 + 꾸벅 인사하는 눈송이 `.r-bow`, 규칙 목록 `.r-grid`(교육자료 목록처럼 카드 테두리 없이 구분선으로 나눈 1열 6줄, 노랑 번호 + 문장, 제목·안내 문구·목록 모두 왼쪽 정렬(사용자 요청으로 가운데 → 왼쪽). 꼬리표 알약은 사용자 요청으로 지움) + 판넬 2 고발 댓글(`#panel-report`) + 맨 아래 노란 띠 marquee(`.r-marquee`, "안그러면 회장이 못 들어오게 할거야미~" 12개를 이어 붙여 -50% 이동으로 끊김 없이 반복). 고발 댓글은 청소담당 응원 댓글과 같은 디자인이라 article에 `cleanup2` 클래스를 같이 붙여 seojin의 `.cleanup2 .c-…` CSS를 재사용하고(`<article class="rule2 cleanup2">`), JS는 이용규칙 페이지 인라인 `<script>`로, 사용자 요청에 따라 청소담당 응원 댓글 코드와 같은 방식(댓글 배열 → `innerHTML`로 다시 그리기, `esc()`로 글자 처리, 목록 하나에 click 이벤트 + `data-i`로 하트 토글, 저장 없음)으로 처리합니다. 경고 문구 `.r-warn`. 예전 "나가기 전 체크" 표는 사용자 요청으로 지움) 구조이고, 스타일은 dongbang.css의 `[1-2]` 구역(seojin 담당 표시 위)에 있습니다. seojin 담당 부분의 옛 `.db_article`/`.rule_list` 스타일은 이제 안 쓰지만 지우지 않았습니다. 갤러리(`article.gallery2`)도 같은 `board-head` + `.wrap` + 맨 위 필름 띠(`section.g-film#panel-gallery`, 판넬 상자 없음) + 오늘의 엉사 사진 판넬(`#panel-today`, 같은 인라인 스크립트에서 `Date`로 연·월·일 숫자를 만들어 사진 개수로 나눈 나머지 번째 사진을 보여줌, 같은 날엔 같은 사진, 누르면 그 라이트박스) + 랜덤 추억 뽑기 판넬(`#panel-gacha`) + 판넬(`#panel-years` 연도 필터·연도별 사진 그리드) 구조이고, 사진 목록과 설명 멘트는 `10_yes3_gallery.json`(`photos` 배열: `id`=라이트박스 id, `src`, `title`, `desc`=사용자가 직접 쓰는 설명 멘트)에 있고 갤러리 HTML 맨 아래 인라인 `<script>`가 13주차 `fetch().then(res => res.json())`로 불러와 `galleryPhotos`에 넣음(불러오기 전엔 뽑기 버튼 disabled, file://로 열면 fetch가 안 되니 Live Server 필요). 뽑기 기계는 버튼 대신 레버 `res/lever_orange.png`(한 그림을 위 `.lever-stick`(막대, 받침 가운데 72px 100px 축으로 회전)·아래 `.lever-base`(받침, 고정) 두 칸으로 overflow로 잘라 보여줌)를 마우스로 오른쪽→왼쪽으로 끌어 -55도까지 당기면 시작(12주차 mousedown/mousemove/mouseup + `clientX`, 11주차 `style.transform`, 키보드 Enter/스페이스도 됨, `gachaReady`가 false면 무시)하고(교안 범위: `Math.random`, 자기 자신을 다시 부르는 `setTimeout`으로 점점 느려지며 18번 바뀐 뒤 멈춤, `setAttribute`로 창 `a#gacha-link`의 href를 당첨 사진 라이트박스 `#photo-…`로 바꿈)이고 움직임은 `.gacha-machine`의 `.spinning`/`.win` 클래스 + gallery.css "랜덤 추억 뽑기 기계" 구역 keyframes입니다(사진을 추가·삭제하면 `10_yes3_gallery.json`도 고쳐야 함), 연도 필터는 숨긴 radio `#yr-all`/`#yr-2026`/`#yr-2025`/`#yr-2024`(버튼·사진 묶음보다 앞) + `label.pill`로 고른 연도만 보여줍니다(CSS만). 다른 연도는 `section#y20xx`째 숨기지 않고 안의 사진 카드·연도 알약만 숨깁니다(라이트박스가 section 안에 있어서 section을 숨기면 marquee 사진을 눌러도 안 뜸). 스타일은 gallery.css 맨 아래 "판넬 디자인" 구역에 있습니다. marquee 움직임과 폴라로이드 원래 CSS는 그대로 두고, gallery.css "맨 위 필름 띠" 구역에서 `.g-film` 안의 폴라로이드만 검은 필름 칸으로 덮어씁니다(흰 테두리·기울기 없음, 필름 구멍은 `.scrolling-track::before/::after`로 사진과 같이 흐름). 칸 폭 258 + 간격 14 = 272 = 구멍 무늬 34px x 8이라 -50% 반복 때 튀지 않으니 폭을 바꾸면 이 관계를 유지해야 합니다. 갤러리 관리 기능(권한표상 보류, 담당 팀원이 구현)용 **화면만** 있습니다: 연도 버튼 줄 오른쪽 끝 `a.g-edit-btn`(수정, `.write-btn` 재사용, `href="#g-edit"`)을 누르면 `#g-edit:target`으로 반투명 회색 둥근 모달 `.g-modal`이 열리고(JS 없음, 배경·✕를 누르면 `href="#"`로 닫힘), 안에 `#add-photo`(사진 추가, `.btn-submit`)·`#delete-photo`(사진 삭제, `.btn-cancel`) 버튼이 있습니다. 모두 `.g-admin` 클래스가 있어 권한 없는 계정에서 한 번에 숨길 수 있고, 추가·삭제 기능과 권한 처리는 아직 없습니다. 라이트박스는 사용자 요청으로 바꿨습니다: 각 라이트박스 안에 이전/다음 링크(`.lb-prev`/`.lb-next`, `href="#photo-…"`로 `:target` 이동, 연도별 사진 순서 2026→2024로 11장이 한 바퀴 돎)와 `.lb-count`("1 / 11")가 있고, 사진은 굵은 검정 테두리(6px), 테이프는 사용자가 준 만화풍 `res/scotch_tape_orange.png`(정사각형 이미지라 회전 없이 씀, 원본 초록 `tape.png`는 안 씀)입니다. 사진을 추가·삭제하면 앞뒤 라이트박스의 이전/다음 링크와 번호도 고쳐야 합니다. 서브 페이지 footer 로켓(`#ft-rocket`)과 로봇(`#ft-robot`)은 공통 `10_yes3_rocket.js`(각 서브 페이지 `</body>` 바로 앞에서 불러옴, 메인·후원 페이지는 안 불러옴)로 누르면 위로 날아가 사라지고(footer 버튼에 `.takeoff` → `@keyframes ft-takeoff`), 0.8초 뒤 화면을 맨 위로 올린 다음, 1.6초 뒤 페이지 첫 판넬(`#panel-gallery`·`#panel-learning`·`#panel-supplies`·`#panel-rule`·`#panel-cleanup`·`.signinup_item` 중 먼저 나오는 것) 윗변에 미리 만들어 둔 `.rocket-landed`에 `.landing`을 붙여 위에서 내려앉힙니다(`@keyframes ft-landing`). 착륙한 것을 누르면 반대로 아래로 날아가 사라지고(`.leaving` → `@keyframes ft-leave`), 0.7초 뒤 화면을 맨 아래(`document.body.scrollHeight`)로 내린 다음, 1.5초 뒤 footer 자리에 위에서 내려와 착륙합니다(`.returning` → `@keyframes ft-return`). 발표 때 설명할 수 있도록 **교안 범위만** 씁니다(이벤트 리스너, getElementById·querySelector, createElement·appendChild·setAttribute, setTimeout, CSS transform·@keyframes). Web Animations API·Promise·getBoundingClientRect 같은 교안 밖 기술은 쓰지 않습니다. 날아갈 것 목록은 JS의 `FLYERS` 배열이고, 자리는 CSS로 고정합니다(기본: 판넬 오른쪽 위 로켓 `right: 70px`, 그 왼쪽 로봇 `right: 184px`; 검색창이 있는 교육자료·비품은 `left` px로 제목과 검색창 사이). 스타일은 common.css 맨 아래 "footer 로켓·로봇" 구역입니다. 서브 페이지 공통 배경을 바꿀 때는 common.css `[1-2]`에서 합니다. 본문 article에 배경을 깔면 위아래 경계가 선처럼 보이니 주의합니다.
- **`10_yes3_common.css`**: 공통 컴포넌트. Google Fonts 불러오기(Dongle, Jua), 상단 고정 nav `.main_nav`와 hover/focus 드롭다운(`.nav_title` + `.nav_dropdown`), footer `.ft`(누를 수 있는 발명품 버튼이 있는 바닥 그림 영역 + `.ft-panel` 링크 칸). 수정하면 모든 페이지에 영향이 가므로, 가능하면 페이지 그룹 CSS에서 덮어씁니다.
- **nav와 footer 마크업은 모든 HTML 파일에 복사되어 있습니다.** nav/footer를 바꾸면 모든 페이지에 똑같이 반영해야 합니다. nav 바로 앞에는 `<div class="nav_bg">`(반투명 남색빛 검은 칸 + blur, 아래쪽은 `mask-image`로 서서히 투명)가 있고 스타일은 common.css에 있습니다. nav 안에 넣으면 `.item:first-child`/`:last-child` 선택자가 깨지므로 nav 밖 형제로 둡니다.
- **청소담당 페이지 이름 주의:** 청소담당 페이지 파일 이름은 오타가 있는 `10_yea3_db_cleanup.html`("yea3")이고, 모든 nav가 이 이름으로 연결됩니다(예전 `10_yes3_db_cleanup.html`은 삭제됨).
- **메인 페이지(`10_yes3_index.html`)**는 화면 한 칸 크기의 섹션들로 되어 있습니다: `.main1` 첫 화면(고정 배경 `res/mainpagedesign.png`이 남색으로 흐려짐) → `.main2` ABOUT US(인라인 스크립트 사진 캐러셀 + JS 캘린더) → `.main3` HISTORY(연혁 + 눈송이) → `.main4` INVENTORS(조직도 + INSERT US COIN) → footer. 2~4 섹션은 `isolation: isolate`를 쓰고, 오락실 장식(네온사인, 인라인 SVG `#crayon` 필터를 쓴 크레용 글씨, 별, 전구 줄)은 `z-index: -1`, `pointer-events: none`인 `.deco` 레이어에 있습니다. `.main1`에는 `isolation`을 **넣으면 안 됩니다**. 안에 있는 고정 nav가 아래 섹션들에 가려집니다.
  - **눈송이 녹는 연출(HISTORY):** 눈송이 `<img class="main3_ungsasong">`가 숨긴 체크박스 `#snow-melt` + `<label class="snow-label">`로 감싸져 있습니다. 체크되면 transition으로 납작해지며 사라지고, `.snow-label::after`(물웅덩이)·`::before`(물방울)가 나타납니다. 다시 누르면 원래대로 돌아옵니다.
  - **조직도 카드(INVENTORS):** HTML 구조(`.org_executive` / `.org_inventors`의 `li > span`)는 그대로이고, footer와 같은 톤으로 맞춥니다(사용자가 네온 카드는 너무 튄다고 해서 바꿈). 색은 주황·흰색·남색만 씁니다. 카드 바탕은 footer와 같은 `res/footer-plate.png` 철판 무늬 + 남색, 임원진은 주황 윗선, 부원은 남색 윗선입니다. 직책(`.role`)은 footer "지원하기!" 같은 주황 알약이고, hover 때는 테두리가 주황이 되고 footer 버튼 같은 딱딱한 그림자가 생깁니다. 조직도에는 네온 빛번짐을 넣지 않습니다.
  - **INSERT US COIN:** `<a class="insert-coin with-bulbs">`는 `10_yes3_coin.html`로 가는 네온 간판입니다. 전구 테두리는 장식용 `.with-bulbs`(`::before`/`::after`)를 재사용하고, 안에 톱니바퀴 SVG(`.coin-gear`, 점선 원 `stroke-dasharray`로 톱니 표현) 2개와 별(`.coin-star`) 3개가 있습니다. 조직도와 겹치지 않도록 절대위치가 아니라 문서 흐름(`margin-top`)으로 배치합니다.
- **후원 페이지(`10_yes3_coin.html`)**: footer 디자인에 맞춘 카드. 위쪽 무대(`.coin-stage`)는 `res/footer-floor.png` 바닥 위에 `footer-robot.png` 로봇, SVG 톱니바퀴(노랑 + 굵은 검정 외곽선), 전구(`footer-bulb.png`, 계좌 화면이나 hover 때 `footer-bulb-on.png`)가 서 있고, 아래 판넬(`.coin-panel`)은 footer와 같은 `footer-plate.png` 철판 무늬입니다. 글꼴은 주아체(본문)·동글체(큰 제목)만, 네온 없음, 색은 사이트에 이미 있는 색만 씁니다. 첫 화면(`#start`)에서 NEXT를 누르면 `:target`으로 계좌 화면(`#account`, 영어 기울임체)으로 바뀝니다. `#account`가 `.coin-start`보다 **앞에** 있어야 `#account:target ~ .coin-start`로 첫 화면을 숨길 수 있습니다. 계좌 정보(Kakao Bank 11111-1111-1111, 예금주 SMWU Inventors)는 임시 값입니다.
- **메인 제목 "엉뚱한 사람들"**: 원래 디자인 유지(동글체 `.dongle-regular`, 글자 사이 띄어쓰기 "엉 뚱 한 사 람 들", 주황 `#ff8800` / 파랑 `#37a1ff`, 160px). 네온 튜브·손글씨 버전을 시도했지만 사용자가 원래대로 되돌렸습니다. 그 위 서브타이틀(`.title_line1.wave`, "SMWU INVENTORS · …")은 글자마다 `<span style="--i:n">`(`.wave_letters`, aria-hidden)으로 감싸서 새로고침 때 앞 글자부터 차례로 튀어 오르는 파도타기(`@keyframes sub-wave`, 꼭대기에서 노랑)를 한 번 하고, 화면 읽기용 전체 문장은 `.wave_sr`에 따로 있습니다. 문구를 바꾸면 두 곳 다 고쳐야 합니다. 메인 footer는 `10_yes3_main.css` 맨 아래에서만 덮어써서(어둑한 안개 `.ft-stage::before`, 발명품 채도 낮춤) 감성술집 톤에 맞춥니다. footer 로고 "엉뚱한 사람들"은 원래 디자인 그대로입니다. 첫 화면 스티커 버튼, footer "지원하기!", "발명품을 눌러보세요!" 노란 알약(`.ft-hint`)은 사용자 요청으로 원래 디자인을 유지합니다.
- **디자인 테마:** 진한 남색 `#060B1E` 배경이 그라데이션으로 footer 회색(`#161a21`)까지 이어집니다. 포인트 색은 주황 `#ff8800`/`#FF7A1A`, 파랑 `#37a1ff`/`#0078d7`, 노랑 `#ffbc00`/`#FDB813`. 메인 본문 글꼴은 주아체, 섹션 제목은 동글체입니다. 각 페이지 그룹 CSS 끝에는 전체 커서 `* { cursor: url('res/cursor_white.png') 2 2, auto; }`가 있습니다.
- 반응형 처리는 `10_yes3_main.css` 안의 `@media (max-width: …)` 블록(조직도 칸 수, 1200px 이하에서 큰 장식 숨기기)뿐이며, 나머지 레이아웃은 데스크톱 기준입니다.

## Git 작업 방식

- 팀원마다 자기 브랜치(`채린`, `seeun`, `seojin`)에서 작업하고 GitHub Pull Request로 `main`에 합칩니다(원격 저장소 `ungsam3/wp_midterm`).
- `main`을 개인 브랜치로 pull하기 전에 로컬 변경 사항을 커밋하거나 stash합니다. 팀원이 같은 파일을 고쳤으면 `git pull origin main`이 중단되며, nav/footer가 모든 파일에 복사되어 있어서 자주 일어납니다.
- 커밋 메시지는 한국어로 씁니다.
