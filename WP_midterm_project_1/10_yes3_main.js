/* 메인 페이지 전용 스크립트 (index.html에서 defer로 불러옴)
   - ABOUT US 캘린더 (날짜 radio input, 보기 전용)
   - 사진 캐러셀은 index.html 안의 <script>에 있음 */
/* ABOUT US 캘린더
   - 날짜 하나하나가 radio input (name="cal_day") → 고르면 그날 일정 목록이 나옴
   - 방문자가 일정을 바꾸지 못하도록 일정 추가·삭제 기능은 없음 (일정은 아래 DEFAULT_EVENTS에서만 수정)
   - 제목(2026년 10월)을 누르면 연도(◀ ▶)와 월(1~12월 표) 고르는 창
   - 2026년 1월보다 앞으로는 못 감
   - 기본 일정: 2026 2학기 동아리 일정표 (1주차 = 개강 9/1이 있는 주, 월요일 시작) */
(function () {
    const form = document.getElementById('cal_form');
    if (!form) return;

    const MIN_YEAR = 2026;
    const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

    // ---------- 기본 일정 (동아리 일정표) ----------
    // date: 하루 일정 / start~end: 주간·여러 날 일정
    // type: week(○주차 주간 일정) · optional(*희망자만) · holiday(공휴일) · exam(시험)
    const SEMESTER_START = '2026-08-31';      // 1주차 월요일 (개강 9/1이 있는 주)
    function week(n) {                        // n주차의 월~일
        const s = addDays(parse(SEMESTER_START), (n - 1) * 7);
        return { start: fmt(s), end: fmt(addDays(s, 6)), week: n };
    }
    const DEFAULT_EVENTS = [
        Object.assign({ title: '청파제 부스 준비', type: 'week' }, week(1)),
        Object.assign({ title: '청파제 부스 준비', type: 'week' }, week(2)),
        { title: '청파제 부스', date: '2026-09-16' },
        { title: '메이커페어 구경 (9/19 또는 9/20)', start: '2026-09-19', end: '2026-09-20', type: 'optional' },
        { title: '추석', start: '2026-09-24', end: '2026-09-26', type: 'holiday' },
        { title: '한강 피크닉', date: '2026-10-02', type: 'optional' },
        Object.assign({ title: '중간고사', type: 'exam' }, week(8)),
        Object.assign({ title: 'MT, 엉뚱한 발명대회 공지', type: 'week' }, week(9)),
        Object.assign({ title: 'MT, 엉뚱한 발명대회 준비', type: 'week' }, week(10)),
        { title: '엉뚱한 발명대회 발표', date: '2026-11-13' },
        { title: '말랑이 만들기', date: '2026-11-20', type: 'optional' },
        Object.assign({ title: '기말고사', type: 'exam' }, week(15)),
        Object.assign({ title: '종강파티', type: 'week' }, week(15)),
        Object.assign({ title: '종강파티', type: 'week' }, week(16)),
        Object.assign({ title: '크리스마스 동방꾸미기', type: 'optional' }, week(17))
    ];

    // ---------- 날짜 도우미 ----------
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function fmt(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
    function parse(s) { const p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
    function addDays(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
    function short(s) { const d = parse(s); return (d.getMonth() + 1) + '/' + d.getDate(); }

    // 그날에 해당하는 일정 전부
    function eventsOn(dateStr) {
        return DEFAULT_EVENTS.filter(function (ev) {
            if (ev.date) return ev.date === dateStr;
            return ev.start <= dateStr && dateStr <= ev.end;
        });
    }

    // ---------- 화면 요소 ----------
    const titleBtn = document.getElementById('cal_title');
    const prevBtn = document.getElementById('cal_prev');
    const nextBtn = document.getElementById('cal_next');
    const picker = document.getElementById('cal_picker');
    const yearLabel = document.getElementById('cal_year_label');
    const yearPrev = document.getElementById('cal_year_prev');
    const yearNext = document.getElementById('cal_year_next');
    const monthsBox = document.getElementById('cal_months');
    const daysBox = document.getElementById('cal_days');
    const detailTitle = document.getElementById('cal_detail_title');
    const eventList = document.getElementById('cal_events');

    // 처음 보여줄 달: 오늘 (2026년 이전이면 2026년 1월)
    const today = new Date();
    let viewYear = today.getFullYear();
    let viewMonth = today.getMonth();         // 0 = 1월
    if (viewYear < MIN_YEAR) { viewYear = MIN_YEAR; viewMonth = 0; }
    let pickerYear = viewYear;
    let selected = fmt(today) >= MIN_YEAR + '-01-01' ? fmt(today) : null;

    // 월 표 (1월~12월 radio)
    for (let m = 0; m < 12; m++) {
        const id = 'cal_month_' + m;
        const radio = document.createElement('input');
        radio.type = 'radio';
        radio.name = 'cal_month';
        radio.id = id;
        radio.value = m;
        radio.addEventListener('click', function () {
            viewYear = pickerYear;
            viewMonth = m;
            closePicker();
            render();
        });
        const label = document.createElement('label');
        label.htmlFor = id;
        label.textContent = (m + 1) + '월';
        monthsBox.append(radio, label);
    }

    // ---------- 달력 그리기 ----------
    function render() {
        titleBtn.textContent = viewYear + '년 ' + (viewMonth + 1) + '월';
        prevBtn.disabled = (viewYear === MIN_YEAR && viewMonth === 0);

        daysBox.innerHTML = '';
        const first = new Date(viewYear, viewMonth, 1);
        const lastDate = new Date(viewYear, viewMonth + 1, 0).getDate();

        // 1일 앞 빈칸
        for (let i = 0; i < first.getDay(); i++) {
            daysBox.appendChild(document.createElement('span'));
        }

        for (let d = 1; d <= lastDate; d++) {
            const date = new Date(viewYear, viewMonth, d);
            const dateStr = fmt(date);
            const id = 'cal_day_' + dateStr;

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'cal_day';
            radio.id = id;
            radio.value = dateStr;
            radio.checked = (dateStr === selected);
            radio.addEventListener('change', function () {
                selected = dateStr;
                showDetail();
            });

            const label = document.createElement('label');
            label.htmlFor = id;
            label.textContent = d;

            const evs = eventsOn(dateStr);
            if (date.getDay() === 0) label.classList.add('sun');
            if (date.getDay() === 6) label.classList.add('sat');
            if (evs.some(function (ev) { return ev.type === 'holiday'; })) label.classList.add('holiday');
            if (evs.some(function (ev) { return ev.date; })) label.classList.add('has_event');
            if (evs.some(function (ev) { return !ev.date && ev.type !== 'holiday'; })) label.classList.add('has_week');
            if (dateStr === fmt(today)) label.classList.add('today');
            label.title = evs.map(function (ev) { return ev.title; }).join(', ');

            daysBox.append(radio, label);
        }
        showDetail();
    }

    // ---------- 고른 날짜 일정 목록 ----------
    function showDetail() {
        eventList.innerHTML = '';
        if (!selected) {
            detailTitle.textContent = '날짜를 골라주세요';
            return;
        }
        const d = parse(selected);
        detailTitle.textContent = (d.getMonth() + 1) + '월 ' + d.getDate() + '일 (' + WEEKDAYS[d.getDay()] + ')';

        const evs = eventsOn(selected);
        if (evs.length === 0) {
            const li = document.createElement('li');
            li.className = 'empty';
            li.textContent = '일정이 없어요';
            eventList.appendChild(li);
            return;
        }
        evs.forEach(function (ev) {
            const li = document.createElement('li');

            const tagText = ev.type === 'holiday' ? '공휴일'
                : ev.type === 'exam' ? '시험'
                : ev.week ? ev.week + '주차'
                : '';
            if (tagText) li.appendChild(tag(tagText, ev.type));
            if (ev.type === 'optional') li.appendChild(tag('희망자만', 'optional'));

            li.appendChild(document.createTextNode(ev.title));

            if (!ev.date) {
                const range = document.createElement('span');
                range.className = 'range';
                range.textContent = short(ev.start) + '~' + short(ev.end);
                li.appendChild(range);
            }
            eventList.appendChild(li);
        });
    }

    function tag(text, kind) {
        const span = document.createElement('span');
        span.className = 'tag ' + (kind || '');
        span.textContent = text;
        return span;
    }

    // 엔터 등으로 form이 제출되어 페이지가 새로고침되지 않게 막기
    form.addEventListener('submit', function (e) { e.preventDefault(); });

    // ---------- 달 이동 (◀ ▶) ----------
    prevBtn.addEventListener('click', function () {
        if (viewYear === MIN_YEAR && viewMonth === 0) return;
        viewMonth--;
        if (viewMonth < 0) { viewMonth = 11; viewYear--; }
        render();
    });
    nextBtn.addEventListener('click', function () {
        viewMonth++;
        if (viewMonth > 11) { viewMonth = 0; viewYear++; }
        render();
    });

    // ---------- 연도·월 고르는 창 ----------
    function openPicker() {
        pickerYear = viewYear;
        updatePicker();
        picker.hidden = false;
        titleBtn.setAttribute('aria-expanded', 'true');
    }
    function closePicker() {
        picker.hidden = true;
        titleBtn.setAttribute('aria-expanded', 'false');
    }
    function updatePicker() {
        yearLabel.textContent = pickerYear + '년';
        yearPrev.disabled = (pickerYear <= MIN_YEAR);
        monthsBox.querySelectorAll('input').forEach(function (radio) {
            radio.checked = (pickerYear === viewYear && +radio.value === viewMonth);
        });
    }
    titleBtn.addEventListener('click', function () {
        if (picker.hidden) openPicker(); else closePicker();
    });
    yearPrev.addEventListener('click', function () {
        if (pickerYear > MIN_YEAR) { pickerYear--; updatePicker(); }
    });
    yearNext.addEventListener('click', function () {
        pickerYear++;
        updatePicker();
    });

    render();
})();
