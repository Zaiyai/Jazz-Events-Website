var verified = false;

async function sendCode() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("pass").value;

  const response = await fetch("send_code.php", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
          name,
          email,
          password
      })
  });

  
  const data = await response.json();
  
  if (data.message == "Email already taken.") {
    let emailError = document.getElementById('email-err');
    emailError.textContent = "Email already taken";
    emailError.classList.toggle('show');
    emailError.textContent = "Email is required";
  }
  
  showToast(data.message);
};

function validate(id,errId) {
  const el = document.getElementById(id), err = document.getElementById(errId); 
  const empty =! el ?.value.trim();
  el ?.classList.toggle('has-error',empty);
  err ?.classList.toggle('show',empty);
  return !empty;
}

async function handleRegister() {
  const ok = [
    validate('name','name-err'), 
    validate('email','email-err'),
    validate('code','code-err'),
    validate('pass','pass-err'),
    validate('pass2','pass2-err')].every(Boolean);

  const emailEl = document.getElementById('email');
  const emailErr = document.getElementById('email-err');
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (ok && !emailRegex.test(emailEl.value)) {
    emailEl.classList.add('has-error');
    emailErr.textContent = "Please enter a valid email address."; 
    emailErr.classList.add('show');
    return;
  }

  const pass = document.getElementById('pass').value, pass2 = document.getElementById('pass2').value;
  const p2err = document.getElementById('pass2-err');
  
  if (pass && pass2 && pass !== pass2) {
    document.getElementById('pass2').classList.add('has-error');
    p2err.classList.add('show');
    return;
  } else { p2err.classList.remove('show'); }
  
  const terms = document.getElementById('terms'), terr = document.getElementById('terms-err');
  
  if (!terms.checked) {
    terr.classList.add('show');
    return; 
  } else {
    terr.classList.remove('show');
  }
  
  if (!ok) return;

  const btn = document.getElementById('submit-btn');
  
  const registerData = {
    name: document.getElementById('name').value.trim(),
    email: document.getElementById('email').value.trim(),
    password: pass,
    code: document.getElementById("code").value
  }

  fetch("register.php", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(registerData), 
  })
    .then(response => {
      if (!response.ok) throw new Error("HTTP error: " + response.status);
      return response.json();
    })
    .then(data => { 
      showToast(data.message);
      if (data.status == "success") { 
        btn.disabled = true;
        btn.textContent = 'Creating account…';
        console.log("HELLo")
        setTimeout(()=>{ window.location.href = data.redirect + "?showLogin=true" }, 1500);
      } else { 
        btn.disabled = false;
        btn.textContent = 'REGISTER';

        if (data.message == "Email already taken.") {
          let emailError = document.getElementById('email-err');
          emailError.textContent = "Email already taken";
          emailError.classList.toggle('show');
          emailError.textContent = "Email is required";
        }
      }
    });
}

function showToast(msg,type){
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'page-toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => requestAnimationFrame ( () => el.classList.add('show')));
  clearTimeout(el._t); 
  el._t=setTimeout(() => el.classList.remove('show'), 3800);
}

let regResendTimer = null;
let regResendCooldown = 0;

function handleRegResend() {
  if (regResendCooldown > 0) return;
  const email = document.getElementById('reg-email').value.trim();
  if (!email) { showToast('Please enter your email first.', 'error'); return; }

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
