/* =============================================================
   JAZZ EVENTS — register.js
   ============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  guestOnly('../dashboard/dashboard.html');
  renderNavUser('nav-user-slot');
});

async function handleRegister() {
  const name   = document.getElementById('reg-name').value.trim();
  const email  = document.getElementById('reg-email').value.trim();
  const code   = document.getElementById('reg-code').value.trim();
  const pass   = document.getElementById('reg-pass').value;
  const pass2  = document.getElementById('reg-pass2').value;
  const terms  = document.getElementById('terms-cb').checked;

  // Required field validation
  const valid = validateForm([
    { id: 'reg-name',  msg: 'Full name is required.' },
    { id: 'reg-email', msg: 'Email address is required.' },
    { id: 'reg-code',  msg: 'Verification code is required.' },
    { id: 'reg-pass',  msg: 'Password is required.' },
    { id: 'reg-pass2', msg: 'Please confirm your password.' },
  ]);

  // Password match
  const p2Err = document.getElementById('reg-pass2-err');
  if (pass && pass2 && pass !== pass2) {
    document.getElementById('reg-pass2').classList.add('error');
    p2Err.textContent = 'Passwords do not match.';
    p2Err.classList.add('show');
    return;
  } else {
    p2Err.classList.remove('show');
  }

  // Terms
  const termsErr = document.getElementById('terms-err');
  if (!terms) {
    termsErr.textContent = 'You must agree to the Terms of Service.';
    termsErr.classList.add('show');
    return;
  } else {
    termsErr.classList.remove('show');
  }

  if (!valid) return;

  const btn = document.getElementById('reg-btn');
  btn.textContent = 'Creating account…';
  btn.disabled = true;

  const result = await DB.register({ name, email, code, pass });

  if (result.ok) {
    showToast('Account created! Redirecting to login…');
    setTimeout(() => window.location.href = 'login.html', 1200);
  } else {
    showToast(result.message || 'Registration failed.', 'error');
    btn.textContent = 'REGISTER';
    btn.disabled = false;
  }
}

let regResendTimer = null;
let regResendCooldown = 0;

function handleRegResend() {
  if (regResendCooldown > 0) return;
  const email = document.getElementById('reg-email').value.trim();
  if (!email) { showToast('Please enter your email first.', 'error'); return; }

  // TODO: call POST /api/auth/send-code
  showToast('Verification code sent to ' + email);

  regResendCooldown = 60;
  const btn = document.getElementById('reg-resend-btn');
  regResendTimer = setInterval(() => {
    regResendCooldown--;
    btn.textContent = `Re-send (${regResendCooldown}s)`;
    if (regResendCooldown <= 0) {
      clearInterval(regResendTimer);
      btn.textContent = 'Re-send';
    }
  }, 1000);
}

window.handleRegister  = handleRegister;
window.handleRegResend = handleRegResend;
