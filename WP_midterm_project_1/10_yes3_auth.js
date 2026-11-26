// =====================================================
// 10_yes3_auth.js
// 로그인 / 로그아웃 / 회원가입 / 접근 제한 (웹스토리지 기반)
// -----------------------------------------------------
// localStorage 저장 키
//   'users'      : 회원 목록 (JSON 문자열)
//                  [{ name, studentId, email, password }, ...]
//   'username'   : 로그인한 회원 이름
//   'isLoggedIn' : 로그인 상태 ('true' 문자열)
// -----------------------------------------------------
//   [1] 회원 목록 불러오기 / 저장하기
//   [2] 접근 제한 (서브페이지 <head>에서 호출)
//   [3] 회원가입
//   [4] 로그인
//   [5] 로그아웃
//   [6] 네비게이션바 전환 (모든 페이지 </body> 앞에서 호출)
// =====================================================


// [1] 회원 목록 불러오기 / 저장하기 --------------------

// localStorage의 'users'를 배열로 꺼내기 (없으면 빈 배열)
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// 배열을 JSON 문자열로 바꿔 localStorage에 저장
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}


// [2] 접근 제한 ------------------------------------------

// 서브페이지용: 로그인 안 했으면 메인으로 보내기
function checkLogin() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('엉뚱한 사람만 볼 수 있어요!');
    // replace: 방문 기록을 남기지 않아 뒤로가기 무한반복을 막음
    location.replace('10_yes3_index.html');
  }
}

// 로그인/회원가입 페이지용: 이미 로그인했으면 메인으로 보내기
function checkLoggedOut() {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    alert('이미 로그인되어 있어요!');
    location.replace('10_yes3_index.html');
  }
}


// [3] 회원가입 -------------------------------------------

// <form onsubmit="registerUser(event)"> 로 호출
function registerUser(event) {
  event.preventDefault(); // 폼 제출로 인한 새로고침 막기

  const name = document.getElementById('signup_name').value;
  const studentId = document.getElementById('signup_id').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_pw').value;

  const users = getUsers();

  // 학번 중복 확인
  for (const user of users) {
    if (user.studentId === studentId) {
      alert('당신은 이미 엉뚱해요!');
      return;
    }
  }

  // 새 회원 추가 후 저장
  const newUser = {
    name: name,
    studentId: studentId,
    email: email,
    password: password
  };
  users.push(newUser);
  saveUsers(users);

  // 가입과 동시에 로그인 처리
  localStorage.setItem('username', name);
  localStorage.setItem('isLoggedIn', 'true');

  alert('엉뚱한 사람 여기 추가요~!');
  location.href = '10_yes3_index.html';
}


// [4] 로그인 ---------------------------------------------

// <form onsubmit="loginUser(event)"> 로 호출
function loginUser(event) {
  event.preventDefault(); // 폼 제출로 인한 새로고침 막기

  const studentId = document.getElementById('signin_id').value;
  const password = document.getElementById('signin_pw').value;

  const users = getUsers();

  // 학번과 비밀번호가 모두 일치하는 회원 찾기
  for (const user of users) {
    if (user.studentId === studentId && user.password === password) {
      localStorage.setItem('username', user.name);
      localStorage.setItem('isLoggedIn', 'true');

      alert('엉뚱한 ' + user.name + ' 등장!');
      location.href = '10_yes3_index.html';
      return;
    }
  }

  // 반복문을 다 돌았는데 못 찾은 경우
  alert('틀렸어요! 잘못 누른 걸까요?');
}


// [5] 로그아웃 -------------------------------------------

// 네비게이션바 '로그아웃' 링크에서 호출
// (회원 목록 'users'는 지우지 않음)
function logoutUser() {
  localStorage.removeItem('username');
  localStorage.removeItem('isLoggedIn');
  location.href = '10_yes3_index.html';
}


// [6] 네비게이션바 전환 ----------------------------------

// 로그인 상태면 '로그인' 메뉴를 'OO님 / 로그아웃'으로 바꾸기
// (로그아웃 상태면 HTML에 적힌 기본 메뉴 그대로 둠)
function renderNav() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return;
  }

  const navAuth = document.getElementById('nav_auth');
  if (!navAuth) {
    return; // 이 페이지에 nav_auth가 없으면 아무것도 안 함
  }

  navAuth.innerHTML =
    '<span class="nav_title" tabindex="0" id="nav_username"></span>' +
    '<ul class="nav_dropdown">' +
    '  <li><a href="#" onclick="logoutUser(); return false;">로그아웃</a></li>' +
    '</ul>';

  // 이름은 innerText로 넣어서 HTML로 해석되지 않게 함
  document.getElementById('nav_username').innerText =
    localStorage.getItem('username') + '님';
}
