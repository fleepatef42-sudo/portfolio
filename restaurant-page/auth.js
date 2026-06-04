/* ===== Marea Auth System ===== */

// --- Utility: Toast Notifications ---
function showToast(message, type = 'success') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = message;
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// --- Utility: Get users from localStorage ---
function getUsers() {
  return JSON.parse(localStorage.getItem('marea_users') || '[]');
}

function saveUsers(users) {
  localStorage.setItem('marea_users', JSON.stringify(users));
}

function setCurrentUser(user) {
  localStorage.setItem('marea_current_user', JSON.stringify(user));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('marea_current_user') || 'null');
}

// --- Toggle Password Visibility ---
document.querySelectorAll('.toggle-pass').forEach(btn => {
  btn.addEventListener('click', () => {
    const field = btn.closest('.field-input');
    const input = field.querySelector('input');
    const eyeOpen = btn.querySelector('.eye-open');
    const eyeClosed = btn.querySelector('.eye-closed');

    if (input.type === 'password') {
      input.type = 'text';
      eyeOpen.style.display = 'none';
      eyeClosed.style.display = 'block';
    } else {
      input.type = 'password';
      eyeOpen.style.display = 'block';
      eyeClosed.style.display = 'none';
    }
  });
});

// --- Password Strength Meter ---
const regPasswordInput = document.getElementById('regPassword');
const strengthContainer = document.getElementById('passwordStrength');

if (regPasswordInput && strengthContainer) {
  regPasswordInput.addEventListener('input', () => {
    const val = regPasswordInput.value;
    const bars = strengthContainer.querySelectorAll('.bar');
    const textEl = strengthContainer.querySelector('.strength-text');
    let score = 0;

    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) score++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) score++;

    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
    const classes = ['', 'active-weak', 'active-fair', 'active-good', 'active-strong'];

    bars.forEach((bar, i) => {
      bar.className = 'bar';
      if (i < score) bar.classList.add(classes[score]);
    });

    textEl.textContent = val.length > 0 ? levels[score] : '';
  });
}

// --- Confirm Password Match ---
const regConfirmInput = document.getElementById('regConfirmPassword');
const matchError = document.getElementById('matchError');

if (regConfirmInput && matchError) {
  regConfirmInput.addEventListener('input', () => {
    if (regConfirmInput.value && regPasswordInput.value !== regConfirmInput.value) {
      matchError.textContent = 'Passwords do not match';
    } else {
      matchError.textContent = '';
    }
  });
}

// --- Login Form ---
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      setCurrentUser(user);
      showToast(`Welcome back, ${user.firstName}!`, 'success');
      setTimeout(() => window.location.href = 'index.html', 1200);
    } else {
      showToast('Invalid email or password', 'error');
    }
  });
}

// --- Register Form ---
const registerForm = document.getElementById('registerForm');
if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('regFirstName').value.trim();
    const lastName = document.getElementById('regLastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirmPassword').value;

    if (password !== confirm) {
      showToast('Passwords do not match', 'error');
      return;
    }

    if (password.length < 8) {
      showToast('Password must be at least 8 characters', 'error');
      return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
      showToast('An account with this email already exists', 'error');
      return;
    }

    const newUser = { firstName, lastName, email, phone, password };
    users.push(newUser);
    saveUsers(users);
    setCurrentUser(newUser);

    showToast('Account created successfully!', 'success');
    setTimeout(() => window.location.href = 'index.html', 1200);
  });
}
