document.addEventListener('DOMContentLoaded', () => {
  guestOnly('../dashboard/dashboard.html');
  renderNavUser('nav-user-slot');
});

function validate(id,errId) {
  const el = document.getElementById(id), err = document.getElementById(errId); 
  const empty =! el ?.value.trim();
  el ?.classList.toggle('has-error',empty);
  err ?.classList.toggle('show',empty);
  return !empty;
}

async function handleRegister() {
  const ok = [
    validate('r-name','r-name-err'), 
    validate('r-email','r-email-err'),
    validate('r-code','r-code-err'),
    validate('r-pass','r-pass-err'),
    validate('r-pass2','r-pass2-err')].every(Boolean);

  const pass = document.getElementById('r-pass').value, pass2 = document.getElementById('r-pass2').value;
  const p2err = document.getElementById('r-pass2-err');
  
  if (pass && pass2 && pass !== pass2) {
    document.getElementById('r-pass2').classList.add('has-error');
    p2err.textContent = 'Passwords do not match.';
    p2err.classList.add('show');
    return;
  } else { p2err.classList.remove('show'); }
  
  const terms = document.getElementById('r-terms'), terr = document.getElementById('r-terms-err');
  
  if (!terms.checked) {
    terr.classList.add('show');
    return; 
  } else {
    terr.classList.remove('show');
  }
  
  if (!ok) return;

  const btn = document.getElementById('r-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Creating account…';

  // TODO: replace with real POST /api/auth/register
  const result = await DB.register({name:document.getElementById('r-name').value.trim(), email:document.getElementById('r-email').value.trim(), code:document.getElementById('r-code').value.trim(), password:pass});

  if (result.ok) {
    showToast('Account created! Redirecting to login…');
    window.location.href = '../home.html'
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

// window.handleRegister  = handleRegister;
// window.handleRegResend = handleRegResend;
