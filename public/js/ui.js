// ================================================================
//  ui.js — DaPenDig App Shell
//  Desa Karang Sengon · Klabang · Bondowoso
//
//  Berisi:
//  - buildShell()      : bangun sidebar + topbar + layout
//  - render()          : fungsi utama (dipanggil setiap state berubah)
//  - rTopBar()         : topbar (dipertahankan untuk kompatibilitas)
//  - rDrawer()         : drawer/menu (tetap ada, dipanggil via sidebar)
//  - rModalWil()       : modal edit wilayah
//  - rModalExp()       : modal ekspor
//  - rModalImp()       : modal import
//  - rDashboard()      : tab beranda
//  - rPenduduk()       : tab penduduk
//  - rMonografi()      : tab monografi
//  - rMutasi()         : tab mutasi
//  - rVital()          : tab vital
//  - rSettings()       : tab akun/settings
//  - rBotNav()         : bottom nav (hidden, untuk kompatibilitas)
//  - rListOnly()       : update list penduduk tanpa full re-render
//  - rCards()          : render card penduduk
// ================================================================

// ── Theme (diinit sebelum render apa pun) ───────────────────────
(function initTheme() {
  var saved = localStorage.getItem('dapendig-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
})();

// ── SHELL BUILDER ────────────────────────────────────────────────
// Dipanggil sekali setelah data pertama kali dimuat
var _shellBuilt = false;

function buildShell() {
  if (_shellBuilt) return;
  _shellBuilt = true;

  var body = document.body;
  body.innerHTML = ''; // reset loading screen

  // Wrapper utama
  var shell = document.createElement('div');
  shell.id = 'app-shell';

  // ──────────────── SIDEBAR ────────────────
  var sidebar = document.createElement('aside');
  sidebar.id = 'sidebar';

  // Header sidebar
  sidebar.innerHTML =
    '<div class="sb-head">' +
      '<div class="sb-logo">🏛️</div>' +
      '<div class="sb-brand">' +
        '<div class="sb-brand-name">DaPenDig</div>' +
        '<div class="sb-brand-sub">Data Penduduk Digital</div>' +
      '</div>' +
    '</div>' +
    '<div class="sb-banner" id="sb-banner">' +
      'Selamat datang kembali' +
      '<strong id="sb-username">—</strong>' +
    '</div>';

  // Nav
  var nav = document.createElement('nav');
  nav.className = 'sb-nav';

  var mainMenus = [
    { id: 'dashboard', ic: '🏠', lb: 'Beranda' },
    { id: 'penduduk',  ic: '👥', lb: 'Penduduk' },
    { id: 'monografi', ic: '📊', lb: 'Monografi' },
    { id: 'mutasi',    ic: '🔄', lb: 'Mutasi' },
    { id: 'vital',     ic: '⭐', lb: 'Vital' }
  ];

  mainMenus.forEach(function (m) {
    var btn = document.createElement('div');
    btn.className = 'nav-i' + (ST.tab === m.id ? ' on' : '');
    btn.dataset.tab = m.id;
    btn.innerHTML = '<span class="nav-ic">' + m.ic + '</span><span class="nav-lbl">' + m.lb + '</span>';
    btn.onclick = function () {
      ST.tab = m.id; ST.view = 'list';
      updateSidebarActive();
      closeSidebar();
      render();
    };
    nav.appendChild(btn);
  });

  // Divider
  var div1 = document.createElement('div');
  div1.className = 'sb-divider';
  nav.appendChild(div1);

  var toolMenus = [
    { ic: '🗺️', lb: 'Edit Info Wilayah', fn: function () { ST.wilEdit = true; ST.wDraft = Object.assign({}, ST.wil); closeSidebar(); render(); } },
    { ic: '📤', lb: 'Ekspor Data',        fn: function () { ST.showExp = true; closeSidebar(); render(); } },
    { ic: '📥', lb: 'Import Excel',       fn: function () { ST.showImp = true; ST.impStep = 'upload'; ST.impRaw = []; ST.impMap = {}; ST.impDone = false; closeSidebar(); render(); } }
  ];

  toolMenus.forEach(function (m) {
    var btn = document.createElement('div');
    btn.className = 'nav-i';
    btn.innerHTML = '<span class="nav-ic">' + m.ic + '</span><span class="nav-lbl">' + m.lb + '</span>';
    btn.onclick = m.fn;
    nav.appendChild(btn);
  });

  // PWA install (hidden sampai beforeinstallprompt)
  var pwaBtn = document.createElement('div');
  pwaBtn.className = 'nav-i';
  pwaBtn.id = '_drawerInstall';
  pwaBtn.style.display = 'none';
  pwaBtn.innerHTML = '<span class="nav-ic">📲</span><span class="nav-lbl">Pasang ke Beranda</span>';
  pwaBtn.onclick = function () {
    if (window._dPwa) {
      window._dPwa.prompt();
      window._dPwa.userChoice.then(function () { window._dPwa = null; pwaBtn.style.display = 'none'; });
    } else {
      alert('Gunakan Chrome/Edge. Buka menu browser → "Tambahkan ke layar beranda".');
    }
  };
  nav.appendChild(pwaBtn);

  sidebar.appendChild(nav);

  // Footer sidebar
  var foot = document.createElement('div');
  foot.className = 'sb-foot';

  // Theme toggle
  var themeBtn = document.createElement('button');
  themeBtn.className = 'sb-theme-btn';
  themeBtn.id = 'sb-theme-btn';
  themeBtn.innerHTML = _getThemeIcon() + ' ' + _getThemeLabel();
  themeBtn.onclick = function () {
    var cur  = document.documentElement.getAttribute('data-theme');
    var next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('dapendig-theme', next);
    // Update CSS compat vars
    _applyCompatVars(next);
    themeBtn.innerHTML = _getThemeIcon() + ' ' + _getThemeLabel();
  };
  foot.appendChild(themeBtn);

  // User info
  var userRow = document.createElement('div');
  userRow.className = 'sb-user';
  userRow.id = 'sb-user';
  userRow.innerHTML =
    '<div class="sb-avatar" id="sb-avatar">?</div>' +
    '<div style="flex:1;min-width:0">' +
      '<div class="sb-uname" id="sb-uname">—</div>' +
      '<div class="sb-urole" id="sb-urole">—</div>' +
    '</div>';
  foot.appendChild(userRow);

  // Divider
  var div2 = document.createElement('div');
  div2.className = 'sb-divider';
  foot.appendChild(div2);

  // Logout
  var logoutBtn = document.createElement('button');
  logoutBtn.className = 'btn-logout-sb';
  logoutBtn.id = '_lo';
  logoutBtn.innerHTML = '<span style="font-size:1rem">🚪</span> Keluar';
  logoutBtn.onclick = function () {
    firebase.auth().signOut().then(function () { localStorage.clear(); window.location.href = 'index.html'; });
  };
  foot.appendChild(logoutBtn);

  sidebar.appendChild(foot);

  // ──────────────── OVERLAY ────────────────
  var overlay = document.createElement('div');
  overlay.id = 'sb-overlay';
  overlay.className = 'hidden';
  overlay.onclick = closeSidebar;

  // ──────────────── MAIN AREA ────────────────
  var mainArea = document.createElement('div');
  mainArea.id = 'main-area';

  // Topbar
  var topbar = document.createElement('header');
  topbar.id = 'topbar';
  topbar.innerHTML =
    '<button id="hamburger" onclick="openSidebar()" aria-label="Buka menu">' +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">' +
        '<line x1="3" y1="6" x2="21" y2="6"/>' +
        '<line x1="3" y1="12" x2="21" y2="12"/>' +
        '<line x1="3" y1="18" x2="21" y2="18"/>' +
      '</svg>' +
    '</button>' +
    '<div style="flex:1;min-width:0">' +
      '<div id="topbar-title">🏛️ DaPenDig</div>' +
      '<div id="topbar-sub" style="font-size:.7rem;color:var(--mu)"></div>' +
    '</div>';

  // Content
  var contentArea = document.createElement('main');
  contentArea.id = 'content-area';

  // App div (tempat render() menaruh konten)
  var appDiv = document.createElement('div');
  appDiv.id = 'app';
  contentArea.appendChild(appDiv);

  mainArea.appendChild(topbar);
  mainArea.appendChild(contentArea);

  // Susun
  shell.appendChild(sidebar);
  shell.appendChild(overlay);
  shell.appendChild(mainArea);
  body.appendChild(shell);

  // Update user info
  _updateUserInfo();

  // Apply compat vars sesuai tema saat ini
  _applyCompatVars(document.documentElement.getAttribute('data-theme'));
}

// ── Helper tema ──────────────────────────────────────────────────
function _getThemeIcon() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? '🌙' : '☀️';
}
function _getThemeLabel() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'Mode Gelap' : 'Mode Terang';
}

function _applyCompatVars(theme) {
  // Update --bg --card dll agar JS original yang pakai var() tetap benar
  var root = document.documentElement;
  if (theme === 'light') {
    root.style.setProperty('--bg',   '#f0f8ff');
    root.style.setProperty('--card', '#ffffff');
    root.style.setProperty('--bd',   '#bae6fd');
    root.style.setProperty('--ac',   '#0284c7');
    root.style.setProperty('--tx',   '#0f172a');
    root.style.setProperty('--mu',   '#64748b');
    root.style.setProperty('--ok',   '#059669');
  } else {
    root.style.setProperty('--bg',   '#0a0f1e');
    root.style.setProperty('--card', '#111827');
    root.style.setProperty('--bd',   '#1f2937');
    root.style.setProperty('--ac',   '#0ea5e9');
    root.style.setProperty('--tx',   '#e2e8f0');
    root.style.setProperty('--mu',   '#64748b');
    root.style.setProperty('--ok',   '#22c55e');
  }
}

// ── Update user info di sidebar ──────────────────────────────────
function _updateUserInfo() {
  if (!fbUser) return;
  var email  = fbUser.email || '';
  var uname  = email.split('@')[0];
  var initl  = uname.charAt(0).toUpperCase();

  var elName   = document.getElementById('sb-uname');
  var elRole   = document.getElementById('sb-urole');
  var elAvatar = document.getElementById('sb-avatar');
  var elBanner = document.getElementById('sb-username');

  if (elName)   elName.textContent   = email;
  if (elRole)   elRole.textContent   = 'Pengguna';
  if (elAvatar) elAvatar.textContent = initl;
  if (elBanner) elBanner.textContent = uname;

  // Topbar sub (wilayah)
  var topSub = document.getElementById('topbar-sub');
  if (topSub) topSub.textContent = esc(ST.wil.desa) + ' · ' + esc(ST.wil.kecamatan) + ' · ' + esc(ST.wil.tahun);
}

// ── Sidebar open/close ───────────────────────────────────────────
function openSidebar() {
  var sb  = document.getElementById('sidebar');
  var ov  = document.getElementById('sb-overlay');
  if (sb) sb.classList.add('open');
  if (ov) ov.classList.remove('hidden');
}

function closeSidebar() {
  var sb = document.getElementById('sidebar');
  var ov = document.getElementById('sb-overlay');
  if (sb) sb.classList.remove('open');
  if (ov) ov.classList.add('hidden');
}

function updateSidebarActive() {
  document.querySelectorAll('#sidebar .nav-i[data-tab]').forEach(function (btn) {
    btn.classList.toggle('on', btn.dataset.tab === ST.tab);
  });
}

// ── rTopBar — dipertahankan untuk kompatibilitas (tidak dipakai render baru) ──
function rTopBar() {
  // Shell topbar sudah ada di DOM — fungsi ini hanya update judul
  var titleEl = document.getElementById('topbar-title');
  var subEl   = document.getElementById('topbar-sub');

  if (ST.view === 'form' || ST.view === 'detail') {
    if (titleEl) {
      titleEl.innerHTML = '<button style="background:none;border:none;color:var(--ac);font-size:14px;font-weight:700;cursor:pointer;padding:0" onclick="ST.view=\'list\';render()">← Kembali</button>';
    }
    if (subEl) subEl.textContent = '';
  } else {
    if (titleEl) titleEl.innerHTML = '🏛️ DaPenDig';
    if (subEl)   subEl.textContent = esc(ST.wil.desa) + ' · ' + esc(ST.wil.kecamatan) + ' · ' + esc(ST.wil.tahun);
  }
  // Kembalikan dummy element agar kode yang memanggil appendChild(rTopBar()) tidak error
  return document.createDocumentFragment();
}

// ── rBotNav — hidden, dipertahankan untuk kompatibilitas ────────
function rBotNav() {
  return document.createDocumentFragment();
}

// ── rDrawer — drawer asli tetap tersedia untuk overlay modal ────
function rDrawer() {
  // Drawer asli tidak dipakai lagi (diganti sidebar)
  // Fungsi tetap ada untuk menghindari error JS
  return document.createDocumentFragment();
}

// ═══════════════════════════════════════════════════════════════
//  RENDER UTAMA
// ═══════════════════════════════════════════════════════════════
function render() {
  // Tandai app sudah render — matikan timeout checker di app.html
  if (typeof _appReady !== 'undefined') _appReady = true;
  // Pertama kali → bangun shell
  if (!_shellBuilt) buildShell();

  // Update user info & wilayah
  _updateUserInfo();

  // Update topbar
  rTopBar();

  // Update sidebar active
  updateSidebarActive();

  var app = document.getElementById('app');
  if (!app) return;

  // Toast container — selalu ada
  app.innerHTML = '<div id="_toast" class="toast"></div>';

  // Modal overlay — prioritas tertinggi
  if (ST.wilEdit)   { app.appendChild(rModalWil()); return; }
  if (ST.showExp)   { app.appendChild(rModalExp()); return; }
  if (ST.showImp)   { app.appendChild(rModalImp()); return; }

  // Render konten tab
  var content;
  if      (ST.tab === 'dashboard') content = rDashboard();
  else if (ST.tab === 'penduduk')  content = rPenduduk();
  else if (ST.tab === 'monografi') content = rMonografi();
  else if (ST.tab === 'mutasi')    content = rMutasi();
  else if (ST.tab === 'vital')     content = rVital();
  else                             content = rSettings();

  if (content) app.appendChild(content);
}

// ── PWA ─────────────────────────────────────────────────────────
window._dPwa = null;
window.addEventListener('beforeinstallprompt', function (e) {
  e.preventDefault();
  window._dPwa = e;
  var el = document.getElementById('_drawerInstall');
  if (el) el.style.display = 'flex';
});
window.addEventListener('appinstalled', function () {
  window._dPwa = null;
  var el = document.getElementById('_drawerInstall');
  if (el) el.style.display = 'none';
});
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(function () {
    // Dengarkan broadcast SW_UPDATED dari service worker baru
    // → soft reload otomatis tanpa user perlu hard refresh
    navigator.serviceWorker.addEventListener('message', function (e) {
      if (e.data && e.data.type === 'SW_UPDATED') {
        window.location.reload();
      }
    });
  }).catch(function () {});
}

// ═══════════════════════════════════════════════════════════════
//  MODAL: EDIT WILAYAH (identik dengan original)
// ═══════════════════════════════════════════════════════════════
function rModalWil() {
  var w = ST.wDraft;
  var ov = document.createElement('div'); ov.className = 'ovl';
  var box = document.createElement('div'); box.className = 'mbox';
  box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ac);margin-bottom:14px">🗺️ Edit Info Wilayah</div>' +
    [['Nama Desa / Kelurahan','desa'],['Kecamatan','kecamatan'],['Kabupaten / Kota','kabupaten'],['Provinsi','provinsi'],['Tahun','tahun']].map(function (x) {
      return '<div style="margin-bottom:10px"><label style="font-size:11px;color:var(--mu);font-weight:700;display:block;margin-bottom:5px;text-transform:uppercase">' + x[0] + '</label><input type="text" data-key="' + x[1] + '" value="' + esc(w[x[1]] || '') + '"/></div>';
    }).join('') +
    '<div class="pb"><button class="bc" onclick="ST.wilEdit=false;render()">Batal</button><button class="bs" id="_wsave">💾 Simpan</button></div>';
  box.querySelectorAll('input[data-key]').forEach(function (i) { i.oninput = function (e) { ST.wDraft[e.target.dataset.key] = e.target.value; }; });
  box.querySelector('#_wsave').onclick = function () {
    var wilData = Object.assign({}, ST.wDraft, { updated_by: fbUser ? fbUser.email : '', updated_at: firebase.firestore.FieldValue.serverTimestamp() });
    fbDb.collection('config').doc('wilayah').set(wilData).then(function () {
      ST.wil = Object.assign({}, ST.wDraft);
      LS.s('dp_wil', JSON.stringify(ST.wil));
      dbLog('edit_wilayah', 'Info wilayah diperbarui: ' + wilData.desa);
      ST.wilEdit = false; render(); toast('Wilayah disimpan!');
    }).catch(function (e) { toast('Gagal simpan: ' + e.message, 'err'); });
  };
  ov.appendChild(box); return ov;
}

// ═══════════════════════════════════════════════════════════════
//  MODAL: EKSPOR (identik dengan original)
// ═══════════════════════════════════════════════════════════════
function rModalExp() {
  var ov = document.createElement('div'); ov.className = 'ovl';
  var box = document.createElement('div'); box.className = 'mbox';
  box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ac);margin-bottom:12px">📤 Ekspor Data</div>' +
    '<div class="tabrow"><button class="tabbtn' + (ST.expType === 'reguler' ? ' on' : '') + '" id="_et1">📋 Data Reguler</button><button class="tabbtn' + (ST.expType === 'bulanan' ? ' on' : '') + '" id="_et2">📅 Laporan Bulanan</button></div>' +
    '<div id="_expbody"></div>' +
    '<div class="pb" style="margin-top:8px"><button class="bs" onclick="doExp(\'excel\')">📊 Excel</button><button class="bc" style="flex:0 0 auto;padding:12px 13px" onclick="ST.showExp=false;render()">✕</button></div>';
  function rEB() {
    var b = box.querySelector('#_expbody');
    if (ST.expType === 'reguler') {
      b.innerHTML = '<label style="font-size:11px;color:var(--mu);font-weight:700;display:block;margin-bottom:5px;text-transform:uppercase">Data</label><select id="_expt">' + [['penduduk','Data Penduduk'],['mk','Mutasi Keluar'],['mm','Mutasi Masuk'],['lh','Kelahiran'],['mn','Kematian']].map(function (x) { return '<option value="' + x[0] + '"' + (ST.expTarget === x[0] ? ' selected' : '') + '>' + x[1] + '</option>'; }).join('') + '</select>';
      box.querySelector('#_expt').onchange = function (e) { ST.expTarget = e.target.value; };
    } else {
      b.innerHTML = '<div style="display:flex;gap:8px"><div style="flex:1"><label style="font-size:11px;color:var(--mu);font-weight:700;display:block;margin-bottom:5px;text-transform:uppercase">Bulan</label><select id="_expm">' + BLN.slice(1).map(function (b, i) { var v = String(i + 1).padStart(2, '0'); return '<option value="' + v + '"' + (v === ST.expBulan ? ' selected' : '') + '>' + b + '</option>'; }).join('') + '</select></div><div style="flex:1"><label style="font-size:11px;color:var(--mu);font-weight:700;display:block;margin-bottom:5px;text-transform:uppercase">Tahun</label><input type="number" id="_expy" value="' + ST.expTahun + '"/></div></div>';
      box.querySelector('#_expm').onchange = function (e) { ST.expBulan = e.target.value; };
      box.querySelector('#_expy').oninput = function (e) { ST.expTahun = e.target.value; };
    }
  }
  box.querySelector('#_et1').onclick = function () { ST.expType = 'reguler'; rEB(); this.className = 'tabbtn on'; box.querySelector('#_et2').className = 'tabbtn'; };
  box.querySelector('#_et2').onclick = function () { ST.expType = 'bulanan'; rEB(); this.className = 'tabbtn on'; box.querySelector('#_et1').className = 'tabbtn'; };
  rEB(); ov.appendChild(box); return ov;
}

// ═══════════════════════════════════════════════════════════════
//  MODAL: IMPORT (identik dengan original)
// ═══════════════════════════════════════════════════════════════
function rModalImp() {
  var ov = document.createElement('div'); ov.className = 'ovl';
  var box = document.createElement('div'); box.className = 'mbox';
  if (ST.impStep === 'upload') {
    box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ac);margin-bottom:12px">📥 Import Excel</div><div class="note">Dukung .xlsx .xls .csv dari SIAK atau Excel manual.</div><div class="dz" id="_dz"><div style="font-size:32px;margin-bottom:8px">📊</div><p style="font-size:13px;color:var(--mu)">Klik atau seret file</p></div><input type="file" id="_fi" accept=".xlsx,.xls,.csv" style="display:none"/><button class="bc" style="width:100%;margin-bottom:8px" id="_tmpl">📋 Download Template</button><button class="bd" style="width:100%;border:none" onclick="ST.showImp=false;render()">✕ Batal</button>';
    var dz = box.querySelector('#_dz'), fi = box.querySelector('#_fi');
    dz.onclick = function () { fi.click(); };
    dz.ondragover = function (e) { e.preventDefault(); dz.classList.add('over'); };
    dz.ondragleave = function () { dz.classList.remove('over'); };
    dz.ondrop = function (e) { e.preventDefault(); dz.classList.remove('over'); var f = e.dataTransfer.files[0]; if (f) readExcel(f); };
    fi.onchange = function (e) { var f = e.target.files[0]; if (f) readExcel(f); };
    box.querySelector('#_tmpl').onclick = function () {
      var ws = XLSX.utils.aoa_to_sheet([KDPD.map(function (k) { return k.l; }), ['3302011234567890', '3302011234560001', 'Budi Santoso', 'Laki-laki', 'Kepala Keluarga', 'Kawin', 'S1', 'PNS', 'O', 'Islam', 'Semarang', '1980-05-15', 'Siti', 'Harto', '001', '002']]);
      var wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Data'); XLSX.writeFile(wb, 'Template-DAPENDIG.xlsx');
    };
  } else if (ST.impStep === 'mapping') {
    box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ac);margin-bottom:4px">🗂️ Petakan Kolom</div><div style="font-size:12px;color:var(--mu);margin-bottom:10px">' + ST.impRaw.length + ' baris.</div><div style="overflow-x:auto;max-height:260px;overflow-y:auto;margin-bottom:10px"><table class="mtbl"><thead><tr><th>Kolom Excel</th><th>→ DAPENDIG</th><th>Contoh</th></tr></thead><tbody id="_mb"></tbody></table></div><div class="note" id="_mi">Periksa mapping</div><div class="pb"><button class="bc" onclick="ST.impStep=\'upload\';render()">← Kembali</button><button class="bs" id="_ib">✅ Import ' + ST.impRaw.length + ' Data</button></div>';
    var tbody = box.querySelector('#_mb');
    ST.impHdr.forEach(function (h) {
      var tr = document.createElement('tr');
      tr.innerHTML = '<td style="font-weight:600">' + esc(h) + '</td><td><select data-h="' + esc(h) + '" style="font-size:12px;padding:4px 6px;border-radius:6px;background:var(--bg);border:1px solid var(--bd);color:var(--tx)"><option value="">-- Lewati --</option>' + KDPD.map(function (k) { return '<option value="' + k.k + '"' + (ST.impMap[h] === k.k ? ' selected' : '') + '>' + esc(k.l) + '</option>'; }).join('') + '</select></td><td style="font-size:11px;color:var(--ac);font-family:monospace;max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + esc(String((ST.impPrev[0] && ST.impPrev[0][h]) || '').slice(0, 16)) + '</td>';
      tr.querySelector('select').onchange = function (e) { ST.impMap[e.target.dataset.h] = e.target.value; var n = Object.values(ST.impMap).filter(Boolean).length; box.querySelector('#_mi').textContent = '✅ ' + n + ' kolom terpetakan.'; };
      tbody.appendChild(tr);
    });
    box.querySelector('#_ib').onclick = async function () { ST.impStep = 'importing'; render(); await doImport(); };
  } else if (ST.impStep === 'importing') {
    box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ac);margin-bottom:12px">⏳ Mengimport...</div><div class="pbar"><div class="pfill" id="_pf" style="width:0%"></div></div><div style="text-align:center;font-size:12px;color:var(--mu);margin:8px 0">' + ST.impProg + '%...</div><div style="display:flex;justify-content:center"><div class="spin"></div></div>';
  } else {
    box.innerHTML = '<div style="font-weight:800;font-size:15px;color:var(--ok);margin-bottom:12px">✅ Import Selesai!</div><div class="note">' + ST.impN + ' data diimport.</div><button class="bs" style="width:100%" onclick="ST.showImp=false;ST.tab=\'penduduk\';render()">Lihat Data →</button>';
  }
  ov.appendChild(box); return ov;
}

// ═══════════════════════════════════════════════════════════════
//  TAB FUNCTIONS — STUB PLACEHOLDERS
//  Fungsi-fungsi ini akan diisi oleh konten dari app.html original
//  Untuk sesi ini, stub ditempatkan agar shell tidak error
//  (Langkah 5 mapping app.html original sudah selesai di atas)
// ═══════════════════════════════════════════════════════════════

// rDashboard, rPenduduk, rMonografi, rMutasi, rVital, rSettings,
// rPendDetail, rPendForm, rCards, rListOnly
// — semua ini sudah ada di app.html original sebagai inline script
// — ui.js memanggil mereka; fungsi tersebut harus didefinisikan
//   di app.html SEBELUM <script src="js/ui.js"></script>

// Jika fungsi belum tersedia (misal halaman test), buat stub:
if (typeof rDashboard === 'undefined') {
  window.rDashboard = function () {
    var d = document.createElement('div');
    d.className = 'pcontent';
    d.style.cssText = 'display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:60vh;gap:12px;color:var(--mu)';
    d.innerHTML = '<div style="font-size:3rem">🏠</div><div style="font-weight:700;color:var(--tx)">Beranda</div><div class="spin"></div><div style="font-size:12px">Memuat data...</div>';
    return d;
  };
}
if (typeof rPenduduk  === 'undefined') { window.rPenduduk  = function () { var d = document.createElement('div'); d.className = 'pcontent'; d.innerHTML = '<div class="empty"><div style="font-size:3rem">👥</div><div>Penduduk</div></div>'; return d; }; }
if (typeof rMonografi === 'undefined') { window.rMonografi = function () { var d = document.createElement('div'); d.className = 'pcontent'; d.innerHTML = '<div class="empty"><div style="font-size:3rem">📊</div><div>Monografi</div></div>'; return d; }; }
if (typeof rMutasi    === 'undefined') { window.rMutasi    = function () { var d = document.createElement('div'); d.className = 'pcontent'; d.innerHTML = '<div class="empty"><div style="font-size:3rem">🔄</div><div>Mutasi</div></div>'; return d; }; }
if (typeof rVital     === 'undefined') { window.rVital     = function () { var d = document.createElement('div'); d.className = 'pcontent'; d.innerHTML = '<div class="empty"><div style="font-size:3rem">⭐</div><div>Vital</div></div>'; return d; }; }
if (typeof rSettings  === 'undefined') { window.rSettings  = function () { var d = document.createElement('div'); d.className = 'pcontent'; d.innerHTML = '<div class="empty"><div style="font-size:3rem">⚙️</div><div>Akun</div></div>'; return d; }; }
if (typeof rListOnly  === 'undefined') { window.rListOnly  = function () { var l = document.getElementById('_plist'); if (l && typeof rCards === 'function') rCards(l); }; }
if (typeof rCards     === 'undefined') { window.rCards     = function (c) { if (c) c.innerHTML = '<div class="empty">Memuat...</div>'; }; }
