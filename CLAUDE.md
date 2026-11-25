# CLAUDE.md

이 파일은 Claude Code(claude.ai/code)가 이 저장소에서 작업할 때 참고하는 안내서입니다.

## 프로젝트

숙명여대 중앙발명동아리 **엉뚱한 사람들 (SMWU INVENTORS)**의 정적 웹사이트로, 3인 팀("yes3")의 웹프로그래밍 중간 프로젝트입니다. HTML + CSS만 사용하며 **JavaScript, 빌드 과정, 패키지 매니저, 테스트, 린터가 모두 없습니다**. README에 적혀 있듯 인터랙션은 일부러 JS 없이 구현합니다(숨긴 radio/checkbox + `:checked ~`, `:target` 라이트박스·화면 전환, `:hover`, `@keyframes`). 사용자가 따로 요청하지 않는 한 이 방식을 유지합니다. (사용자가 조직도 작업 때 JavaScript를 써도 된다고 한 적이 있지만, 지금까지는 모두 CSS로 해결했습니다. JS가 꼭 필요할 때만 쓰고, 쓰기 전에 알립니다.)

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
| `10_yes3_coin.html` (후원 "BUY US A COIN" 오락기 페이지, 메인의 INSERT US COIN에서 연결) | `10_yes3_coin.css`만 사용. common/bg/nav/footer 없는 독립 페이지 |

- **`10_yes3_bg.css`**: 서브 페이지 공통 배경. 남색 `body`, 그리고 `.dbeq_1`(비품·로그인·회원가입)과 `.learning_1`(교육자료)이 쓰는 `sub_image.jpg` 첫 화면 사진. 첫 화면 **높이**는 페이지마다 달라서 각 페이지 그룹 CSS에 둡니다. 서브 페이지에 배경 이미지나 장식을 추가할 때는 여기서 합니다. 크레용 글씨처럼 HTML(SVG 필터)이 필요한 장식은 `res/crayon_ungsa.png` 같은 이미지로 만들어 쓰면 HTML을 건드리지 않아도 됩니다.
- **`10_yes3_common.css`**: 공통 컴포넌트. Google Fonts 불러오기(Dongle, Jua), 상단 고정 nav `.main_nav`와 hover/focus 드롭다운(`.nav_title` + `.nav_dropdown`), footer `.ft`(누를 수 있는 발명품 버튼이 있는 바닥 그림 영역 + `.ft-panel` 링크 칸). 수정하면 모든 페이지에 영향이 가므로, 가능하면 페이지 그룹 CSS에서 덮어씁니다.
- **nav와 footer 마크업은 모든 HTML 파일에 복사되어 있습니다.** nav/footer를 바꾸면 모든 페이지에 똑같이 반영해야 합니다.
- **청소담당 페이지 이름 주의:** 모든 nav가 `10_yea3_db_cleanup.html`(오타 "yea3")로 연결되어 있고, 내용이 다른 예전 파일 `10_yes3_db_cleanup.html`도 남아 있습니다. 따로 말이 없으면 `yea3` 파일을 수정합니다.
- **메인 페이지(`10_yes3_index.html`)**는 화면 한 칸 크기의 섹션들로 되어 있습니다: `.main1` 첫 화면(고정 배경 `res/mainpagedesign.png`이 남색으로 흐려짐) → `.main2` ABOUT US(radio로 넘기는 사진 슬라이드 + CSS grid 캘린더) → `.main3` HISTORY(연혁 + 눈송이) → `.main4` INVENTORS(조직도 + INSERT US COIN) → footer. 2~4 섹션은 `isolation: isolate`를 쓰고, 오락실 장식(네온사인, 인라인 SVG `#crayon` 필터를 쓴 크레용 글씨, 별, 전구 줄)은 `z-index: -1`, `pointer-events: none`인 `.deco` 레이어에 있습니다. `.main1`에는 `isolation`을 **넣으면 안 됩니다**. 안에 있는 고정 nav가 아래 섹션들에 가려집니다.
  - **눈송이 녹는 연출(HISTORY):** 눈송이 `<img class="main3_ungsasong">`가 숨긴 체크박스 `#snow-melt` + `<label class="snow-label">`로 감싸져 있습니다. 체크되면 transition으로 납작해지며 사라지고, `.snow-label::after`(물웅덩이)·`::before`(물방울)가 나타납니다. 다시 누르면 원래대로 돌아옵니다.
  - **조직도 카드(INVENTORS):** HTML 구조(`.org_executive` / `.org_inventors`의 `li > span`)는 그대로이고, 카드마다 CSS 변수 `--neon` 하나로 테두리·빛번짐·이름 빛·직책 배지(`.role`) 색을 정합니다. 임원진은 호박색(회장은 금색 + `::after` 왕관), 부원은 `nth-child(4n+…)`로 파랑·분홍·보라·민트가 돌아갑니다. `li::before`는 hover 때 뜨는 "1P" 배지라 다른 용도로 쓰면 안 됩니다.
  - **INSERT US COIN:** `<a class="insert-coin with-bulbs">`는 `10_yes3_coin.html`로 가는 네온 간판입니다. 전구 테두리는 장식용 `.with-bulbs`(`::before`/`::after`)를 재사용하고, 안에 톱니바퀴 SVG(`.coin-gear`, 점선 원 `stroke-dasharray`로 톱니 표현) 2개와 별(`.coin-star`) 3개가 있습니다. 조직도와 겹치지 않도록 절대위치가 아니라 문서 흐름(`margin-top`)으로 배치합니다.
- **후원 페이지(`10_yes3_coin.html`)**: 오락기 모양. 첫 화면(`.scr-start`, 배경 `res/gameover.png`)에서 NEXT를 누르면 `:target`으로 계좌 화면(`#account`, 영어 기울임체)으로 바뀝니다. `#account`가 `.scr-start`보다 **앞에** 있어야 `#account:target ~ .scr-start`로 첫 화면을 숨길 수 있습니다. 픽셀 글꼴은 `@font-face "Pixel2"`가 `res/fonts/pixel2.ttf`를 가리키지만 파일이 아직 없어 Press Start 2P / 주아체로 대체되어 보입니다. 계좌 정보(카카오뱅크 11111-1111-1111, 예금주 SMWU INVENTORS)는 임시 값입니다.
- **디자인 테마:** 진한 남색 `#060B1E` 배경이 그라데이션으로 footer 회색(`#161a21`)까지 이어집니다. 포인트 색은 주황 `#ff8800`/`#FF7A1A`, 파랑 `#37a1ff`/`#0078d7`, 노랑 `#ffbc00`/`#FDB813`. 메인 본문 글꼴은 주아체, 섹션 제목은 동글체입니다. 각 페이지 그룹 CSS 끝에는 전체 커서 `* { cursor: url('res/cursor_white.png') 2 2, auto; }`가 있습니다.
- 반응형 처리는 `10_yes3_main.css` 안의 `@media (max-width: …)` 블록(조직도 칸 수, 1200px 이하에서 큰 장식 숨기기)뿐이며, 나머지 레이아웃은 데스크톱 기준입니다.

## Git 작업 방식

- 팀원마다 자기 브랜치(`채린`, `seeun`, `seojin`)에서 작업하고 GitHub Pull Request로 `main`에 합칩니다(원격 저장소 `ungsam3/wp_midterm`).
- `main`을 개인 브랜치로 pull하기 전에 로컬 변경 사항을 커밋하거나 stash합니다. 팀원이 같은 파일을 고쳤으면 `git pull origin main`이 중단되며, nav/footer가 모든 파일에 복사되어 있어서 자주 일어납니다.
- 커밋 메시지는 한국어로 씁니다.
