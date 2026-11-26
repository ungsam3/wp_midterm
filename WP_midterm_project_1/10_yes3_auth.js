//   [0] 관리자 계정 3개
//   [1] 회원 목록 불러오기, 저장하기
//   [2] 접근 제한 (서브페이지 <head>에서 호출)
//   [3] 회원가입
//   [4] 로그인
//   [5] 로그아웃
//   [6] 네비게이션바 전환
// -----------------------------------------------------
// localStorage 저장 키
//   'users'      : 회원가입한 일반 회원 목록 -> [{ name, studentId, email, password, role } (관리자 3명은 저장하지 않고 아래 ADMIN_USERS에만 있음)
//   'username'   : 로그인한 회원 이름
//   'role'       : 로그인한 회원 권한       -> 'president'/'vice'/'dbmanager'/'member'
//   'isLoggedIn' : 로그인 상태             -> true/false


// [0] 관리자 계정
const ADMIN_USERS = [
  { name: '회장',   studentId: '0', email: '', password: 'ghlwkd0!',    role: 'president' },
  { name: '부회장', studentId: '1', email: '', password: 'qnghlwkd1!',  role: 'vice' },
  { name: '동방장', studentId: '2', email: '', password: 'ehdqkdwkd2!', role: 'dbmanager' }
];


// [1] 회원 목록 불러오기 / 저장하기
function getUsers() {
  return JSON.parse(localStorage.getItem('users')) || [];
}

// 배열을 JSON 문자열로 바꿔 localStorage에 저장
function saveUsers(users) {
  localStorage.setItem('users', JSON.stringify(users));
}

// 로그인·학번 중복 확인용
function getAllUsers() {
  return ADMIN_USERS.concat(getUsers());
}

// 지금 로그인한 회원의 권한 ('president' / 'vice' / 'dbmanager' / 'member', 로그아웃 상태는 null)
function getRole() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    return null;
  }
  return localStorage.getItem('role') || 'member';
}


// [2] 접근 제한

// 로그인 안 했으면 서브페이지 -> 메인
function checkLogin() {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    alert('엉뚱한 사람만 볼 수 있어요!');
    location.replace('10_yes3_index.html');
  }
}

// 이미 로그인했으면 로그인/회원가입 페이지 -> 메인
function checkLoggedOut() {
  if (localStorage.getItem('isLoggedIn') === 'true') {
    alert('이미 로그인되어 있어요!');
    location.replace('10_yes3_index.html');
  }
}


// [3] 회원가입

// <form onsubmit="registerUser(event)"> 로 호출
function registerUser(event) {
  event.preventDefault(); // 폼 제출로 인한 새로고침 막기

  const name = document.getElementById('signup_name').value;
  const studentId = document.getElementById('signup_id').value;
  const email = document.getElementById('signup_email').value;
  const password = document.getElementById('signup_pw').value;

  const users = getUsers();

  // 학번 중복 확인 (관리자 학번 0, 1, 2도 가입 불가)
  for (const user of getAllUsers()) {
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
    password: password,
    role: 'member'        // 회원가입으로 만든 계정은 모두 일반 회원
  };
  users.push(newUser);
  saveUsers(users);

  // 가입과 동시에 로그인 처리
  localStorage.setItem('username', name);
  localStorage.setItem('role', 'member');
  localStorage.setItem('isLoggedIn', 'true');

  alert('엉뚱한 사람 여기 추가요~!');
  location.href = '10_yes3_index.html';
}


// [4] 로그인

// <form onsubmit="loginUser(event)"> 로 호출
function loginUser(event) {
  event.preventDefault(); // 폼 제출로 인한 새로고침 막기

  const studentId = document.getElementById('signin_id').value;
  const password = document.getElementById('signin_pw').value;

  // 학번과 비밀번호가 모두 일치하는 회원 찾기 (관리자 계정 포함)
  for (const user of getAllUsers()) {
    if (user.studentId === studentId && user.password === password) {
      localStorage.setItem('username', user.name);
      // role이 없는 예전 가입 회원은 일반 회원으로 처리
      localStorage.setItem('role', user.role || 'member');
      localStorage.setItem('isLoggedIn', 'true');

      alert('엉뚱한 ' + user.name + ' 등장!');
      location.href = '10_yes3_index.html';
      return;
    }
  }
  alert('틀렸어요! 잘못 누른 걸까요?');
}


// [5] 로그아웃

// 회원 목록 'users'는 그대로 로컬스토리지에 둘
function logoutUser() {
  localStorage.removeItem('username');
  localStorage.removeItem('role');
  localStorage.removeItem('isLoggedIn');
  location.href = '10_yes3_index.html';
}


// [6] 네비게이션바 전환

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
