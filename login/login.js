document.addEventListener('keydown', e => {
  if (e.key === 'Enter') handleLogin();
});

function validate(id,errId){
  const el = document.getElementById(id), err=document.getElementById(errId);
  const empty =! el?.value.trim();
  el?.classList.toggle('has-error',empty);
  err?.classList.toggle('show',empty);
  return !empty;
}

async function handleLogin() {
  const ok = [validate('login-email','login-email-err'), validate('login-pass','login-pass-err')].every(Boolean);
  if (!ok) return;

  const loginData = {
    email: document.getElementById('login-email').value.trim(),
    password: document.getElementById('login-pass').value.trim()
  }

  const btn = document.getElementById('login-submit-btn');
  const authErr = document.getElementById('login-auth-err');
  const emailInput = document.getElementById('login-email');
  const passInput = document.getElementById('login-pass');

  // Clear previous backend errors
  authErr.textContent = '';
  authErr.classList.remove('show');
  emailInput.classList.remove('has-error');
  passInput.classList.remove('has-error');

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
      if (data.status == "success") { 
        showToast(data.message);
        btn.disabled = true;
        btn.textContent = 'Logging in…';
        COOKIES.setCookie(loginData.email, data.user_type, 30);
        window.location.href = data.redirect;
      } else { 
        // Display backend error message in the UI
        authErr.textContent = data.message;
        authErr.classList.add('show');
        
        // Highlight inputs
        emailInput.classList.add('has-error');
        passInput.classList.add('has-error');
        
        btn.disabled = false;
        btn.textContent = 'LOG IN';
        
        // Optional: still show toast if desired, but UI error is primary now
        showToast(data.message, 'error');
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