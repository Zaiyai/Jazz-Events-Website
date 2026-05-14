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

function validate(id, errId) {
  const el = document.getElementById(id), err = document.getElementById(errId);
  const empty = !el?.value.trim();
  if (el) {
    if (empty) {
      el.classList.add('has-error');
      // Special check for digit row highlight
      if (el.classList.contains('reg-digit-input')) {
        el.parentElement.classList.add('has-error');
      }
    } else {
      el.classList.remove('has-error');
      if (el.classList.contains('reg-digit-input')) {
        el.parentElement.classList.remove('has-error');
      }
    }
  }
  if (err) {
    if (empty) err.classList.add('show');
    else err.classList.remove('show');
  }
  return !empty;
}

function validatePasswordComplex(pass) {
  if (pass.length < 8) return "Must be at least 8 characters.";
  if (!/[A-Z]/.test(pass)) return "Must contain at least one uppercase letter.";
  if (!/[a-z]/.test(pass)) return "Must contain at least one lowercase letter.";
  if (!/[0-9]/.test(pass)) return "Must contain at least one number.";
  if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(pass)) return "Must contain at least one special character.";
  return "";
}

async function handleRegister() {
  const digitInputs = document.querySelectorAll('.reg-digit-input');
  const code = Array.from(digitInputs).map(i => i.value).join('');
  const codeValid = code.length === 6;

  const ok = [
    validate('name', 'name-err'),
    validate('email', 'email-err'),
    validate('pass', 'pass-err'),
    validate('pass2', 'pass2-err')
  ].every(Boolean) && codeValid;

  const codeErr = document.getElementById('code-err');
  if (!codeValid) {
    digitInputs.forEach(i => i.classList.add('has-error'));
    codeErr.classList.add('show');
  } else {
    digitInputs.forEach(i => i.classList.remove('has-error'));
    codeErr.classList.remove('show');
  }

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
  const passErr = document.getElementById('pass-err');
  
  if (pass) {
    const pwdErrorMsg = validatePasswordComplex(pass);
    if (pwdErrorMsg !== "") {
      document.getElementById('pass').classList.add('has-error');
      passErr.textContent = pwdErrorMsg;
      passErr.classList.add('show');
      return;
    } else {
      passErr.textContent = "Password is required."; // Reset to default if empty next time
    }
  }

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
    code: code,
    password: pass
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
        setTimeout(() =>
          window.location.href = data.redirect + "?showLogin=true", 1500);
      } else {
        btn.disabled = false;
        btn.textContent = 'REGISTER';

        if (data.message == "Email already taken.") {
          let emailError = document.getElementById('email-err');
          emailError.textContent = "Email already taken";
          emailError.classList.toggle('show');
          emailError.textContent = "Email is required";
          document.getElementById('email').classList.add('has-error');
        }
      }
    });
}

function showToast(msg, type) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.className = 'page-toast' + (type ? ' ' + type : '');
  requestAnimationFrame(() => requestAnimationFrame(() => el.classList.add('show')));
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 3800);
}

/* --- Verification Code Handling --- */
document.addEventListener('DOMContentLoaded', () => {
  const digitInputs = document.querySelectorAll('.reg-digit-input');

  digitInputs.forEach((input, idx) => {
    // Input handling
    input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val) {
        input.classList.add('has-value');
        if (idx < digitInputs.length - 1) {
          digitInputs[idx + 1].focus();
        }
      } else {
        input.classList.remove('has-value');
      }
    });

    // Backspace handling
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && !input.value && idx > 0) {
        digitInputs[idx - 1].focus();
      }
    });

    // Paste handling
    input.addEventListener('paste', (e) => {
      e.preventDefault();
      const data = e.clipboardData.getData('text').slice(0, 6);
      if (!/^\d+$/.test(data)) return;

      data.split('').forEach((char, i) => {
        if (digitInputs[idx + i]) {
          digitInputs[idx + i].value = char;
          digitInputs[idx + i].classList.add('has-value');
          if (idx + i < digitInputs.length - 1) {
            digitInputs[idx + i + 1].focus();
          }
        }
      });
    });
  });
});

// Resend logic
const resendBtn = document.getElementById('resend-btn');
let cooldown = 0;
let timer = null;

async function handleResend() {
  if (cooldown > 0) return;

  const email = document.getElementById('email').value.trim();
  if (!email) {
    showToast('Please enter your email first.', 'error');
    document.getElementById('email').focus();
    return;
  }

  const data = await sendCode(email);

  if (data && data.status == "success") {
    showToast(data.message);
  } else {
    showToast(data.message, "error");
    return;
  }

  cooldown = 60;
  resendBtn.disabled = true;
  timer = setInterval(() => {
    cooldown--;
    resendBtn.textContent = `Resend (${cooldown}s)`;
    if (cooldown <= 0) {
      clearInterval(timer);
      resendBtn.disabled = false;
      resendBtn.textContent = 'Re-send';
    }
  }, 1000);
}