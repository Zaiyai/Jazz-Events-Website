const loginBtn = document.getElementById('nav-auth-slot');
const loginSection = document.getElementsByClassName('auth-section')[0];

function displayLogin() {
  loginSection.style.display = "block";
};

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect
  guestOnly('dashboard/dashboard.html');
  renderNavUser('nav-user-slot');

  // Enter key submits
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
});

function validate(id,errId){
  const el = document.getElementById(id),err=document.getElementById(errId);
  const empty =! el?.value.trim();
  el?.classList.toggle('has-error',empty);
  err?.classList.toggle('show',empty);
  return !empty;
}

async function handleLogin() {
  const ok = [validate('login-email','login-emailogin-err'),validate('login-pass','login-pass-err')].every(Boolean);
  
  if (!ok) return;

  const btn = document.getElementById('login-submit-btn');

  btn.disabled=true;
  btn.textContent='Logging in…';

  // TODO: replace DB.login with real POST /api/auth/login

  const result=await DB.login(document.getElementById('login-email').value.trim(),document.getElementById('login-pass').value);

  if(result.ok){
    showToast('Login successful! Redirecting…');
    setTimeout(() => window.location.href = 'dashboard/dashboard.html', 900);
  } else {
    showToast(result.message||'Login failed.','error'); 
    btn.disabled=false;
    btn.textContent='LOG IN';
  }
}

function showToast(msg,type){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'page-toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => requestAnimationFrame ( () => el.classList.add('show')));
  clearTimeout(el._t); 
  el._t=setTimeout(() => el.classList.remove('show'), 3800);
}