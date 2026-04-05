// ================================================================
//  auth.js — DaPenDig Login Page
//  Desa Karang Sengon · Klabang · Bondowoso
//  Dipakai oleh: index.html
//  Tugas: cek sesi, login email/password, redirect ke app.html
// ================================================================

(function () {
  'use strict';

  // Elemen UI
  var btnLogin     = document.getElementById('btn-login');
  var btnLoginText = document.getElementById('btn-login-text');
  var btnSpinner   = document.getElementById('btn-login-spinner');
  var emailInput   = document.getElementById('login-email');
  var passInput    = document.getElementById('login-password');
  var alertBox     = document.getElementById('login-alert');
  var alertMsg     = document.getElementById('login-alert-msg');

  // ── Pesan error ──────────────────────────────────────────────
  var ERROR_MAP = {
    'auth/invalid-email':          'Format email tidak valid.',
    'auth/user-not-found':         'Email tidak terdaftar.',
    'auth/wrong-password':         'Password salah. Coba lagi.',
    'auth/invalid-credential':     'Email atau password salah.',
    'auth/too-many-requests':      'Terlalu banyak percobaan. Coba beberapa menit lagi.',
    'auth/network-request-failed': 'Gagal terhubung. Periksa koneksi internet.',
    'auth/user-disabled':          'Akun ini telah dinonaktifkan.'
  };

  function friendlyError(code) {
    return ERROR_MAP[code] || 'Login gagal. Coba lagi.';
  }

  // ── Tampilkan / sembunyikan alert ────────────────────────────
  function showAlert(msg) {
    alertMsg.textContent = msg;
    alertBox.classList.remove('hidden');
  }

  function hideAlert() {
    alertBox.classList.add('hidden');
  }

  // ── Loading state tombol ─────────────────────────────────────
  function setLoading(on) {
    btnLogin.disabled = on;
    btnLoginText.classList.toggle('hidden', on);
    btnSpinner.classList.toggle('hidden', !on);
  }

  // ── Init Firebase ────────────────────────────────────────────
  // Firebase SDK compat dimuat via CDN di index.html head
  // (jika tidak ada, tampilkan error)
  function waitForFirebase(cb, tries) {
    tries = tries || 0;
    if (typeof firebase !== 'undefined' && firebase.auth) {
      // Coba init jika belum
      if (!firebase.apps.length && typeof FIREBASE_CONFIG !== 'undefined') {
        try { firebase.initializeApp(FIREBASE_CONFIG); } catch (e) {}
      }
      cb();
    } else if (tries < 30) {
      setTimeout(function () { waitForFirebase(cb, tries + 1); }, 200);
    } else {
      // Firebase gagal load
      if (window.showLogin) window.showLogin();
      showAlert('Gagal memuat Firebase. Periksa koneksi atau reload halaman.');
    }
  }

  // ── Cek sesi aktif ───────────────────────────────────────────
  function checkSession() {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // Sudah login → langsung ke app
        window.location.replace('app.html');
      } else {
        // Belum login → tampilkan form login
        if (window.showLogin) window.showLogin();
      }
    });
  }

  // ── Proses login ─────────────────────────────────────────────
  function doLogin() {
    var email = (emailInput.value || '').trim();
    var pass  = (passInput.value  || '');

    hideAlert();

    if (!email) { showAlert('Email tidak boleh kosong.'); emailInput.focus(); return; }
    if (!pass)  { showAlert('Password tidak boleh kosong.'); passInput.focus(); return; }

    setLoading(true);

    // Simpan sesi permanen di browser (tidak hilang walau tab/browser ditutup)
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
      .then(function () {
        return firebase.auth().signInWithEmailAndPassword(email, pass);
      })
      .then(function () {
        // Sukses → redirect ke app.html
        window.location.replace('app.html');
      })
      .catch(function (err) {
        setLoading(false);
        showAlert(friendlyError(err.code));
        passInput.value = '';
        passInput.focus();
      });
  }

  // ── Event listeners ──────────────────────────────────────────
  if (btnLogin) {
    btnLogin.addEventListener('click', doLogin);
  }

  // Micro-animation: ripple pada tombol login
  if (btnLogin) {
    btnLogin.addEventListener('click', function (e) {
      var rect   = btnLogin.getBoundingClientRect();
      var ripple = document.createElement('span');
      var size   = Math.max(rect.width, rect.height);
      ripple.style.cssText = [
        'position:absolute',
        'width:'  + size + 'px',
        'height:' + size + 'px',
        'left:'   + (e.clientX - rect.left  - size / 2) + 'px',
        'top:'    + (e.clientY - rect.top   - size / 2) + 'px',
        'background:rgba(255,255,255,0.25)',
        'border-radius:50%',
        'transform:scale(0)',
        'animation:ripple 0.5s linear',
        'pointer-events:none'
      ].join(';');
      btnLogin.style.position = 'relative';
      btnLogin.style.overflow = 'hidden';
      btnLogin.appendChild(ripple);
      setTimeout(function () { ripple.remove(); }, 600);
    });
  }

  // ── Start ─────────────────────────────────────────────────────
  // Muat Firebase SDK dari CDN (index.html sudah pasang script tag)
  // Tunggu sampai firebase global tersedia
  waitForFirebase(checkSession);

})();
