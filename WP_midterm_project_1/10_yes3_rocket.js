/* footer 로켓 발사 (서브 페이지 공통, 각 페이지 맨 아래에서 불러옴)
   로켓을 누르면 위로 쓩 날아가고 → 화면이 위로 올라간 뒤 → 페이지 첫 판넬 윗변에 착륙.
   착륙한 로켓을 누르면 다시 footer로 돌아감. 모양은 10_yes3_common.css의 "footer 로켓 착륙" 구역.
   메인 페이지에는 착륙할 판넬이 없어서 불러오지 않음. */
(function () {
    // 착륙할 판넬: 페이지마다 처음 나오는 것 하나
    const PADS = '#panel-gallery, #panel-learning, #panel-supplies, #panel-rule, #panel-cleanup, .signinup_item';

    const footerBtn = document.getElementById('ft-rocket');
    const panel = document.querySelector(PADS);
    if (!footerBtn || !panel) return;
    const footerImg = footerBtn.querySelector('img');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let busy = false;

    // 로켓이 판넬 기준으로 자리 잡도록
    if (getComputedStyle(panel).position === 'static') panel.style.position = 'relative';

    // 판넬 윗변에 앉을 로켓 (처음엔 숨김)
    const landed = document.createElement('button');
    landed.type = 'button';
    landed.className = 'rocket-landed';
    landed.setAttribute('aria-label', '로켓을 footer로 돌려보내기');
    landed.innerHTML = '<img src="res/footer-rocket.png" alt="">';
    landed.hidden = true;
    panel.appendChild(landed);

    // 화면에 고정된 로켓 그림을 만들어서 keyframes대로 움직임
    function fly(from, frames, duration, easing) {
        const img = document.createElement('img');
        img.src = footerImg.src;
        img.alt = '';
        img.className = 'rocket-flying';
        img.style.left = from.left + 'px';
        img.style.top = from.top + 'px';
        img.style.width = from.width + 'px';
        document.body.appendChild(img);
        const anim = img.animate(frames, { duration: duration, easing: easing, fill: 'forwards' });
        return anim.finished.then(function () { return img; });
    }

    function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

    // 착륙 자리(가로 위치·크기) 정하기
    // 로켓이 판넬 위 제목 줄(.board-head)과 높이가 겹치니까 제목·검색창을 가리지 않는 빈 곳에 앉힘
    //  - 검색창이 있으면(교육자료·비품): 제목과 검색창 사이 빈 곳 가운데, 빈 곳이 좁으면 로켓을 작게
    //  - 없으면: 판넬 오른쪽 위
    function place() {
        const p = panel.getBoundingClientRect();
        const h1 = document.querySelector('.board-head h1');
        const search = document.querySelector('.board-head .search_dbeq');
        let w = 90, left;
        if (search) {
            const from = h1 ? h1.getBoundingClientRect().right : p.left;
            const to = search.getBoundingClientRect().left;
            w = Math.max(50, Math.min(90, to - from - 40));
            left = (from + to) / 2 - w / 2;
        } else {
            left = p.right - 70 - w;
        }
        landed.style.width = w + 'px';
        landed.style.left = (left - p.left) + 'px';
        landed.style.right = 'auto';
    }
    window.addEventListener('resize', function () { if (!landed.hidden) place(); });

    footerBtn.addEventListener('click', function () {
        if (busy || !landed.hidden) return;
        busy = true;
        footerBtn.classList.add('rocket-away');

        if (reduce) {                                   // 움직임 줄이기 설정이면 바로 착륙
            landed.hidden = false;
            place();
            panel.scrollIntoView();
            busy = false;
            return;
        }

        // 1) footer → 화면 위로 발사
        const r = footerImg.getBoundingClientRect();
        fly(r, [
            { transform: 'translateY(0)' },
            { transform: 'translateY(12px)', offset: 0.15 },        // 살짝 웅크렸다가
            { transform: 'translateY(' + (-r.bottom - 40) + 'px)' } // 쓩!
        ], 750, 'cubic-bezier(.5,0,.9,.4)')
        .then(function (img) {
            img.remove();
            // 2) 화면을 판넬 위까지 올리기
            landed.hidden = false;
            landed.style.visibility = 'hidden';                     // 자리만 잡고 아직 안 보이게
            place();
            const top = landed.getBoundingClientRect().top + window.scrollY - 130;
            window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
            return wait(900);
        })
        .then(function () {
            // 3) 화면 위에서 내려와 판넬 윗변에 착륙
            const t = landed.getBoundingClientRect();
            return fly({ left: t.left, top: t.top, width: t.width }, [
                { transform: 'translateY(' + (-t.bottom - 40) + 'px)' },
                { transform: 'translateY(10px)', offset: 0.8 },          // 쿵
                { transform: 'translateY(0)' }
            ], 800, 'ease-out');
        })
        .then(function (img) {
            img.remove();
            landed.style.visibility = '';
            landed.classList.add('just-landed');
            busy = false;
        });
    });

    // 착륙한 로켓 누르면 footer로 돌아감
    landed.addEventListener('click', function () {
        if (busy) return;
        landed.hidden = true;
        landed.classList.remove('just-landed');
        footerBtn.classList.remove('rocket-away');
    });
})();
