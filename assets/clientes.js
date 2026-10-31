/* ============================================================
   CLIENTES — cadastro e controle operacional
   Consome assets/data.js (CLIENTS_INFO, PEOPLE, brl)
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

let filtro = { status:'', resp:'', q:'' };

const MODULOS = [
  { key:'aprovacoes', label:'Aprovações',  icon:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/>' },
  { key:'calendario', label:'Calendário sazonal', icon:'<rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4M3 10h18"/>' },
  { key:'financeiro', label:'Financeiro',  icon:'<path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>' },
  { key:'arquivos',   label:'Arquivos',    icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>' },
  { key:'publicacoes',label:'Publicações automáticas', icon:'<path d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z"/>' },
];
const LINK_BTNS = [
  { label:'Drive',     icon:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/>' },
  { label:'Instagram', icon:'<rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>' },
  { label:'Briefing',  icon:'<path d="M9 11H3v10h6zM21 3h-6v18h6zM15 7H9v14h6z"/>' },
];

function visible(){
  return CLIENTS_INFO.filter(c =>
    (!filtro.status || c.status===filtro.status) &&
    (!filtro.resp   || c.resp===filtro.resp) &&
    (!filtro.q      || c.name.toLowerCase().includes(filtro.q.toLowerCase()))
  );
}

function summary(){
  const ativos = CLIENTS_INFO.filter(c=>c.status==='ativo');
  const mrr = ativos.reduce((a,c)=>a+(c.valor||0),0);
  const meta = ativos.reduce((a,c)=>a+c.meta,0);
  $('#sTotal').textContent = CLIENTS_INFO.length;
  $('#sAtivos').textContent = ativos.length;
  $('#sMrr').textContent = brl(mrr);
  $('#sMeta').textContent = meta;
}

function toggleHTML(c, m){
  const val = c.mod[m.key];
  const locked = val==='locked';
  const on = val===true;
  return `<button class="tgl ${on?'on':''} ${locked?'locked':''}" data-client="${c.key}" data-mod="${m.key}" ${locked?'disabled':''}>
    <span class="tgl-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${m.icon}</svg></span>
    <span class="tgl-label">${m.label}</span>
    ${locked
      ? '<span class="tgl-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></span>'
      : `<span class="switch"><span class="knob"></span></span>`}
  </button>`;
}

function cardHTML(c){
  const p = PEOPLE[c.resp];
  const st = c.status==='ativo' ? '<span class="badge-status st-green">Ativo</span>' : '<span class="badge-status st-gray">Inativo</span>';
  return `<article class="ccard ${c.status==='inativo'?'inativo':''}" data-client="${c.key}">
    <div class="ccard-head">
      <span class="clogo" style="background:${c.bg}">${c.logo}</span>
      <div class="ccard-id">
        <h3>${c.name}</h3>
        <div class="ccard-resp">${st}<span class="resp"><span class="resp-av" style="background:${p.bg}">${p.av}</span>${p.n}</span></div>
      </div>
      <button class="edit-btn" data-edit="${c.key}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>Editar</button>
    </div>

    <div class="ccard-metrics">
      <div class="metric"><div class="mk">Meta mensal</div><div class="mv">${c.meta} <small>entregas</small></div></div>
      <div class="metric"><div class="mk">Valor mensal</div><div class="mv">${c.valor==null?'<span style="color:var(--violet)">Permuta</span>':brl(c.valor)}</div></div>
      <div class="metric"><div class="mk">Vencimento</div><div class="mv">dia ${c.venc}</div></div>
    </div>

    <div class="ccard-block">
      <div class="bk-label">Regras recorrentes</div>
      <div class="chips">${c.regras.map(r=>`<span class="chip">${r}</span>`).join('')}</div>
    </div>

    <div class="ccard-block">
      <div class="bk-label">Módulos ativos</div>
      <div class="modules">${MODULOS.map(m=>toggleHTML(c,m)).join('')}</div>
    </div>

    <div class="ccard-foot">
      <div class="links">${LINK_BTNS.map(l=>`<button class="lnk" data-link="${l.label}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${l.icon}</svg>${l.label}</button>`).join('')}</div>
      ${c.obs?`<div class="obs"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>${c.obs}</div>`:''}
    </div>
  </article>`;
}

function render(){
  const rows = visible();
  $('#grid').innerHTML = rows.length ? rows.map(cardHTML).join('') : '<div class="empty">Nenhum cliente com esses filtros.</div>';
  $('#count').textContent = rows.length;
}

/* ---------- interações ---------- */
document.addEventListener('click', e=>{
  const tgl = e.target.closest('.tgl:not(.locked)');
  if (tgl){
    const c = CLIENTS_INFO.find(x=>x.key===tgl.dataset.client);
    const m = tgl.dataset.mod;
    c.mod[m] = !c.mod[m];
    if (typeof agosSaveClients === 'function') agosSaveClients(s => {
      s.edits[c.key] = s.edits[c.key] || {};
      s.edits[c.key].mod = c.mod;
    });
    tgl.classList.toggle('on', c.mod[m]);
    summary();
    toast(MODULOS.find(x=>x.key===m).label + (c.mod[m]?' ativado':' desativado') + ' · ' + c.name);
    return;
  }
  const edit = e.target.closest('[data-edit]');
  if (edit){ ClientModal.open(edit.dataset.edit); return; }
  const lnk = e.target.closest('[data-link]');
  if (lnk){ toast('Abrindo ' + lnk.dataset.link + '…'); return; }
});

$('#fStatus').addEventListener('change', e=>{ filtro.status=e.target.value; render(); });
$('#fResp').addEventListener('change', e=>{ filtro.resp=e.target.value; render(); });
let searchT;
$('#search').addEventListener('input', e=>{
  clearTimeout(searchT);
  searchT = setTimeout(()=>{ filtro.q=e.target.value; render(); }, 150);
});

/* Adicionar cliente + callback do modal */
$('#btnAddClient')?.addEventListener('click', ()=> ClientModal.open());
window.cmOnSaved = (key, name)=>{
  summary(); render();
  toast(key ? name+' atualizado' : name+' adicionado');
};

summary(); render();
