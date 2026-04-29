const loginBtn = document.getElementById('nav-auth-slot');
const loginSection = document.getElementsByClassName('auth-section')[0];

function displayLogin() {
  loginSection.style.display = "block";
};

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect
  // guestOnly('dashboard/dashboard.html');
  // renderNavUser('nav-user-slot');

  // Enter key submits
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
});

function validate(id,errId){
  const el = document.getElementById(id), err=document.getElementById(errId);
  const empty =! el?.value.trim();
  el?.classList.toggle('has-error',empty);
  err?.classList.toggle('show',empty);
  return !empty;
}

async function handleLogin() {
  const ok = [validate('login-email','login-emailogin-err'), validate('login-pass','login-pass-err')].every(Boolean);
  
  if (!ok) return;

  const loginData = {
    email: document.getElementById('login-email').value.trim(),
    password: document.getElementById('login-pass').value.trim()
  }

  const btn = document.getElementById('login-submit-btn');

  fetch("login/login.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(loginData), 
  })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return response.json();
    })
    .then(data => {
      showToast(data.message);
      if (data.status == "success") { 
        btn.disabled = true;
        btn.textContent = 'Logging in…';
        setTimeout(() => 
          window.location.href = data.redirect, 1500);
      } else { 
        btn.disabled = false;
        btn.textContent = 'LOG IN';
      }
    });

  // const result = await DB.login(document.getElementById('login-email').value.trim(), document.getElementById('login-pass').value); 
}

function showToast(msg,type){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'page-toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => requestAnimationFrame ( () => el.classList.add('show')));
  clearTimeout(el._t); 
  el._t=setTimeout(() => el.classList.remove('show'), 3800);
}