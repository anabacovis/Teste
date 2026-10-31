/* Sidebar compartilhada — rail de ícones no desktop, drawer com rótulos no mobile.
   Uso: <div id="sidebar" data-active="hoje"></div> + <script src="assets/sidebar.js"></script> */
(function () {
  const ICON = {
    dashboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>',
    hoje: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
    producao: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
    calendario: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    clientes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
    metas: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>',
    financeiro: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
    aprovacoes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>',
    arquivos: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>',
    config: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    sair: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5"/><path d="M21 12H9"/></svg>',
  };
  ICON.redes = ICON.metas;

  const MAIN = [
    ['dashboard', 'Dashboard', 'Dashboard.html'],
    ['hoje', 'Hoje', 'Hoje.html', '7'],
    ['producao', 'Produção', 'Producao.html'],
    ['calendario', 'Calendário', 'Calendario.html'],
    ['redes', 'Redes sociais', 'Redes.html'],
    ['clientes', 'Clientes', 'Clientes.html'],
    ['financeiro', 'Financeiro', 'Financeiro.html'],
    ['aprovacoes', 'Aprovações', 'Aprovacoes.html'],
    ['arquivos', 'Arquivos', 'Arquivos.html'],
  ];
  const TEAM = [
    ['ana', 'Ana', 'Ana.html', 'A', 'var(--tile-orange)'],
    ['nicole', 'Nicole', 'Nicole.html', 'N', 'var(--tile-blue)'],
  ];

  const mount = document.getElementById('sidebar');
  const ACTIVE = mount ? mount.dataset.active : '';

  function navItem([key, label, href, badge]) {
    return `<a class="rail-item${key === ACTIVE ? ' active' : ''}" href="${href}" data-tip="${label}">
      <span class="ri-ic">${ICON[key] || ''}${badge ? `<i class="ri-dot"></i>` : ''}</span>
      <span class="ri-label">${label}</span>${badge ? `<span class="ri-badge">${badge}</span>` : ''}</a>`;
  }
  function teamItem([key, label, href, av, bg]) {
    return `<a class="rail-item${key === ACTIVE ? ' active' : ''}" href="${href}" data-tip="${label}">
      <span class="ri-ic"><span class="ri-av" style="background:${bg}">${av}</span></span>
      <span class="ri-label">${label}</span></a>`;
  }

  const LOGO = '<svg viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.2-8.56"/><path d="M21 4v5h-5"/></svg>';

  if (mount) {
    mount.className = 'sidebar';
    mount.innerHTML = `
      <a class="rail-logo" href="Dashboard.html" data-tip="Connect OS">${LOGO}</a>
      <div class="rail-scroll">
        <nav class="rail-nav">${MAIN.map(navItem).join('')}</nav>
        <div class="rail-div"></div>
        <div class="rail-sec">Equipe</div>
        <nav class="rail-nav">${TEAM.map(teamItem).join('')}</nav>
      </div>
      <div class="rail-foot">
        <a class="rail-item${ACTIVE === 'config' ? ' active' : ''}" href="Configuracoes.html" data-tip="Configurações"><span class="ri-ic">${ICON.config}</span><span class="ri-label">Configurações</span></a>
        <button class="rail-bell" data-tip="Notificações" aria-label="Notificações"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg><span class="ri-bdot">3</span></button>
        <a class="rail-ava" href="Ana.html" data-tip="Ana · Admin">AN</a>
        <a class="rail-item" href="#" onclick="logout();return false;" data-tip="Sair"><span class="ri-ic">${ICON.sair}</span><span class="ri-label">Sair</span></a>
      </div>`;
  }

  window.toggleSidebar = function () {
    const sb = document.getElementById('sidebar');
    const scrim = document.getElementById('scrim');
    sb.classList.toggle('open');
    if (scrim) scrim.classList.toggle('show');
  };

  // ---- Bottom nav (mobile) ----
  const BOTTOM = [
    ['dashboard', 'Dashboard', 'Dashboard.html'],
    ['hoje', 'Hoje', 'Hoje.html'],
    ['producao', 'Produção', 'Producao.html'],
    ['aprovacoes', 'Aprovações', 'Aprovacoes.html'],
  ];
  const bn = document.createElement('nav');
  bn.className = 'bottom-nav';
  bn.innerHTML = BOTTOM.map(([k, label, href]) =>
    `<a class="bn-item${k === ACTIVE ? ' active' : ''}" href="${href}">${ICON[k] || ''}<span>${label}</span></a>`
  ).join('') +
    `<button class="bn-item bn-more" onclick="toggleSidebar()"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/><circle cx="5" cy="12" r="1.6"/></svg><span>Mais</span></button>`;
  document.body.appendChild(bn);
})();
