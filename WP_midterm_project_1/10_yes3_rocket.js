/* footer 로켓·로봇 이륙 → 판넬 위 착륙 (서브 페이지 공통, 각 페이지 맨 아래에서 불러옴)
   교안 범위만 사용:
   - 움직임은 전부 CSS(@keyframes, transform)가 맡고, JS는 class를 바꾸고 시간을 맞추기만 함
   - 모양·위치·애니메이션은 10_yes3_common.css 맨 아래 "footer 로켓·로봇" 구역

   순서: footer 로켓 클릭 → [이륙] 위로 날아가 사라짐 → 화면을 맨 위로 올림
         → [착륙] 판넬 위에서 쿵 내려앉음
         착륙한 것을 클릭 → 아래로 날아가 사라짐 → 화면을 맨 아래(footer)로 내림 → footer 자리에 쿵 (이륙의 반대) */

// 날아갈 발명품 목록 (10주차: 객체 배열)
//  btnId: footer 버튼 id, img: 그림 파일, type: 착륙 모양 class 이름
const FLYERS = [
    { btnId: "ft-rocket", img: "res/footer-rocket.png", type: "lander-rocket", name: "로켓" },
    { btnId: "ft-robot",  img: "res/footer-robot.png",  type: "lander-robot",  name: "로봇" }
];

// 착륙할 판넬: 페이지마다 처음 나오는 것 하나 (11주차: querySelector + CSS 선택자)
const landingPanel = document.querySelector(
    "#panel-gallery, #panel-learning, #panel-supplies, #panel-rule, #panel-cleanup, .signinup_item"
);

let isFlying = false;   // 하나가 날아가는 중이면 다른 클릭은 무시

// 발명품 하나에 이륙·착륙 기능을 붙이는 함수 (10주차: 함수 선언)
function setupFlyer(flyer) {
    const footerBtn = document.getElementById(flyer.btnId);   // 11주차: getElementById
    if (!footerBtn || !landingPanel) return;

    // 판넬 위에 앉을 버튼을 미리 만들어서 넣어 둠 (11주차: createElement, appendChild)
    // 처음엔 CSS에서 display: none 이라 안 보임
    const landed = document.createElement("button");
    landed.setAttribute("type", "button");                    // 11주차: setAttribute
    landed.setAttribute("class", "rocket-landed " + flyer.type);
    landed.setAttribute("title", flyer.name + " 돌려보내기");
    const img = document.createElement("img");
    img.setAttribute("src", flyer.img);
    img.setAttribute("alt", flyer.name);
    landed.appendChild(img);
    landingPanel.appendChild(landed);

    // footer에서 누르면 이륙 (12주차: addEventListener)
    footerBtn.addEventListener("click", () => {
        if (isFlying) return;
        isFlying = true;

        // 1) 이륙: class를 붙이면 CSS 애니메이션(ft-takeoff)이 위로 날려 보냄
        footerBtn.setAttribute("class", "ft-obj takeoff");

        // 2) 0.8초 뒤(이륙이 끝나면) 화면을 맨 위로 부드럽게 올림 (10주차: setTimeout, window 객체)
        setTimeout(() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }, 800);

        // 3) 1.6초 뒤 판넬 위에 착륙: class를 붙이면 CSS 애니메이션(ft-landing)이 위에서 내려앉힘
        setTimeout(() => {
            landed.setAttribute("class", "rocket-landed " + flyer.type + " landing");
        }, 1600);

        // 4) 착륙 애니메이션(0.8초)이 끝나면 다시 누를 수 있게
        setTimeout(() => {
            isFlying = false;
        }, 2400);
    });

    // 착륙한 것을 누르면 이륙의 반대: 아래로 날아가 사라짐 → 화면이 footer까지 내려감 → footer 자리에 착륙
    landed.addEventListener("click", () => {
        if (isFlying) return;
        isFlying = true;

        // 1) 판넬 위에서 아래로 쓩 (CSS 애니메이션 ft-leave)
        landed.setAttribute("class", "rocket-landed " + flyer.type + " landing leaving");

        // 2) 0.7초 뒤 판넬 위 버튼은 숨기고, 화면을 맨 아래(footer)까지 부드럽게 내림
        //    document.body.scrollHeight = 페이지 전체 높이 (11주차 DOM 속성)
        setTimeout(() => {
            landed.setAttribute("class", "rocket-landed " + flyer.type);
            window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }, 700);

        // 3) 1.5초 뒤 footer 자리에 위에서 내려와 착륙 (CSS 애니메이션 ft-return)
        setTimeout(() => {
            footerBtn.setAttribute("class", "ft-obj returning");
        }, 1500);

        // 4) 착륙(0.8초)이 끝나면 원래 상태로 정리하고 다시 누를 수 있게
        setTimeout(() => {
            footerBtn.setAttribute("class", "ft-obj");
            isFlying = false;
        }, 2300);
    });
}

// 목록에 있는 발명품마다 기능 붙이기 (10주차: for … of)
for (const flyer of FLYERS) {
    setupFlyer(flyer);
}
