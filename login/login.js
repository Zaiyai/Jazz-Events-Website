const loginBtn = document.getElementById('nav-auth-slot');
const loginSection = document.getElementsByClassName('auth-section')[0];

function displayLogin() {
  loginSection.style.display = "block";
};

document.addEventListener('DOMContentLoaded', () => {
  // If already logged in, redirect
  guestOnly('../dashboard/dashboard.html');
  renderNavUser('nav-user-slot');

  // Enter key submits
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') handleLogin();
  });
});

async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const pass  = document.getElementById('login-pass').value;

  const valid = validateForm([
    { id: 'login-email', msg: 'Email address is required.' },
    { id: 'login-pass',  msg: 'Password is required.' },
  ]);
  if (!valid) return;

  const btn = document.getElementById('login-btn');
  btn.textContent = 'Logging in…';
  btn.disabled = true;

  const result = await DB.login(email, pass);

  if (result.ok) {
    showToast('Login successful! Redirecting…');
    setTimeout(() => window.location.href = '../dashboard/dashboard.html', 900);
  } else {
    showToast(result.message || 'Login failed.', 'error');
    btn.textContent = 'LOG IN';
    btn.disabled = false;
  }
}

let resendTimer = null;
let resendCooldown = 0;

function handleResend() {
  if (resendCooldown > 0) return;
  const email = document.getElementById('login-email').value.trim();
  if (!email) { showToast('Please enter your email first.', 'error'); return; }

  // TODO: call POST /api/auth/send-code with email
  showToast('Verification code sent to ' + email);

  resendCooldown = 60;
  const btn = document.getElementById('resend-btn');
  resendTimer = setInterval(() => {
    resendCooldown--;
    btn.textContent = `Re-send (${resendCooldown}s)`;
    if (resendCooldown <= 0) {
      clearInterval(resendTimer);
      btn.textContent = 'Re-send';
    }
  }, 1000);
}

window.handleLogin  = handleLogin;
window.handleResend = handleResend;
