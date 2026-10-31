/* ============================================================
   ARQUIVOS / LINKS DO DRIVE — consome assets/data.js
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

const ICONS = {
  pasta:      '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2z"/>',
  identidade: '<circle cx="13.5" cy="6.5" r="2.5"/><circle cx="17.5" cy="10.5" r="2.5"/><circle cx="8.5" cy="7.5" r="2.5"/><circle cx="6.5" cy="12.5" r="2.5"/><path d="M12 22a10 10 0 1 1 0-20c4 0 7 2 7 5 0 2-2 3-3 3h-2c-1 0-2 1-2 2s1 2 0 4z"/>',
  editavel:   '<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  final:      '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>',
  referencia: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  briefing:   '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/>',
  recorrente: '<path d="M17 2l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14M7 22l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/>',
  externo:    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/>',
};
const cname = k => (CLIENTS_INFO.find(c=>c.key===k)||{}).name || k;
const clogo = k => CLIENTS_INFO.find(c=>c.key===k) || {logo:'?',bg:'var(--gray)'};

let filtro = { client:'', tipo:'', q:'' };

/* ---------- Pastas principais (destaque) ---------- */
function renderFolders(){
  const pastas = LINKS.filter(l=>l.tipo==='pasta');
  $('#folders').innerHTML = pastas.map(l=>{
    const c = clogo(l.client);
    return `<button class="folder" data-link="${l.id}">
      <span class="f-logo" style="background:${c.bg}">${c.logo}</span>
      <span class="f-info"><b>${cname(l.client)}</b><small>Pasta principal</small></span>
      <svg class="f-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>
    </button>`;
  }).join('');
}

/* ---------- Tabela de links ---------- */
function visible(){
  return LINKS.filter(l =>
    (!filtro.client || l.client===filtro.client) &&
    (!filtro.tipo   || l.tipo===filtro.tipo) &&
    (!filtro.q      || (l.nome+' '+cname(l.client)).toLowerCase().includes(filtro.q.toLowerCase()))
  );
}
function rowHTML(l){
  const c = clogo(l.client), t = FILE_TYPES[l.tipo], p = PEOPLE[l.resp]||{av:'?',bg:'var(--gray)',n:l.resp};
  const principal = (l.tipo==='pasta'||l.tipo==='final');
  return `<tr class="${principal?'principal':''}" data-id="${l.id}">
    <td class="c-accent"></td>
    <td data-label="Cliente"><span class="cell-client"><span class="mlogo" style="background:${c.bg}">${c.logo}</span>${cname(l.client)}</span></td>
    <td class="c-nome" data-label="Material"><span class="t-ico ${t.cls}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[l.tipo]}</svg></span><b>${l.nome}</b></td>
    <td data-label="Tipo"><span class="badge-status ${t.cls}">${t.l}</span></td>
    <td data-label="Atualização"><span class="upd">${l.atualizacao}</span></td>
    <td data-label="Responsável"><span class="cell-resp"><span class="mav" style="background:${p.bg}">${p.av}</span>${p.n}</span></td>
    <td class="obs" data-label="Observação">${l.obs||'<span class="muted">—</span>'}</td>
    <td class="tac" data-label="Link"><button class="open-btn" data-link="${l.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>Abrir</button></td>
  </tr>`;
}
function renderTable(){
  const rows = visible();
  $('#tbody').innerHTML = rows.length ? rows.map(rowHTML).join('')
    : `<tr><td colspan="8" class="t-empty">Nenhum link encontrado com esses filtros.</td></tr>`;
  $('#count').textContent = rows.length;
}

/* ---------- interações ---------- */
document.addEventListener('click', e=>{
  const open = e.target.closest('[data-link]');
  if (open){ const l = LINKS.find(x=>x.id==open.dataset.link); toast('Abrindo no Drive: '+l.nome); }
});
$('#search').addEventListener('input', e=>{ filtro.q=e.target.value; renderTable(); });
$('#fClient').addEventListener('change', e=>{ filtro.client=e.target.value; renderTable(); });
$('#fTipo').addEventListener('change', e=>{ filtro.tipo=e.target.value; renderTable(); });

renderFolders(); renderTable();
