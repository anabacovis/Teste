/* ============================================================
   APROVAÇÕES — consome assets/data.js (APPROVALS)
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

const TYPE_TAG = t => TYPES[t].c==='red'?'yt':TYPES[t].c==='violet'?'story':'';
const cname = k => CLIENTS[k].name;

// SLA: 24h leve · 48h médio · 72h crítico
function sla(h){
  if (h>=72) return { k:'critico', l:'crítico' };
  if (h>=48) return { k:'medio',   l:'médio' };
  if (h>=24) return { k:'leve',    l:'leve' };
  return { k:'ok', l:'no prazo' };
}
function waitLabel(h){ return h<24 ? 'há '+h+'h' : 'há '+Math.round(h/24)+' dia'+(Math.round(h/24)>1?'s':''); }
const pendente = a => ['aguardando','reenviado','correcao'].includes(a.status);
const emEspera = a => ['aguardando','reenviado','vencido'].includes(a.status);

let filtro = { quick:'todas', client:'' };

/* ---------- Destaques (cards topo) ---------- */
function renderStats(){
  const aguardando = APPROVALS.filter(a=>a.status==='aguardando'||a.status==='reenviado').length;
  const criticas = APPROVALS.filter(a=>emEspera(a) && (a.horas>=72)).length;
  const proximas = APPROVALS.filter(a=>emEspera(a) && a.prazoDay<=TODAY+2).length;
  const grp = {};
  APPROVALS.filter(pendente).forEach(a=>grp[a.client]=(grp[a.client]||0)+1);
  const top = Object.entries(grp).sort((x,y)=>y[1]-x[1])[0];
  $('#sAguard').textContent = aguardando;
  $('#sCrit').textContent = criticas;
  $('#sProx').textContent = proximas;
  $('#sTopCli').textContent = top ? cname(top[0]) : '—';
  $('#sTopCliSub').textContent = top ? top[1]+' aprovações pendentes' : 'Nenhuma pendência';

  // chip counts
  $('#qc-paradas').textContent = APPROVALS.filter(a=>emEspera(a)&&a.horas>=48).length;
  $('#qc-criticas').textContent = criticas;
  $('#qc-aguardando').textContent = aguardando;
  $('#qc-correcao').textContent = APPROVALS.filter(a=>a.status==='correcao').length;
  $('#qc-aprovadas').textContent = APPROVALS.filter(a=>a.status==='aprovado').length;
}

/* ---------- Filtro ---------- */
function matchQuick(a){
  switch(filtro.quick){
    case 'paradas':   return emEspera(a) && a.horas>=48;
    case 'criticas':  return emEspera(a) && a.horas>=72;
    case 'aguardando':return a.status==='aguardando'||a.status==='reenviado';
    case 'correcao':  return a.status==='correcao';
    case 'aprovadas': return a.status==='aprovado';
    default: return true;
  }
}
function visible(){ return APPROVALS.filter(a=>matchQuick(a) && (!filtro.client||a.client===filtro.client)); }

/* ---------- Card ---------- */
function cardHTML(a){
  const c = CLIENTS[a.client], p = PEOPLE[a.resp], t = TYPES[a.tipo], st = APR_STATUS[a.status];
  const s = sla(a.horas);
  const espera = emEspera(a);
  const done = a.status==='aprovado';
  return `<article class="apr ${done?'done':''} sla-${espera?s.k:'none'}" data-id="${a.id}">
    <div class="apr-logo"><span class="clogo" style="background:${c.bg}">${c.logo}</span></div>
    <div class="apr-body">
      <div class="apr-tags">
        <span class="tag ${TYPE_TAG(a.tipo)}" style="padding:3px 9px;font-size:11.5px">${t.l}</span>
        <span class="ver">${a.versao}</span>
        <span class="badge-status ${st.cls}" data-status-label>${st.l}</span>
      </div>
      <h3 class="apr-title">${a.entrega} <span class="apr-sub">· ${a.sub}</span></h3>
      <div class="apr-meta">
        <span class="mi client">${c.name}</span>
        <span class="dotsep"></span>
        <span class="mi"><span class="resp-av" style="background:${p.bg}">${p.av}</span>${p.n}</span>
        <span class="dotsep"></span>
        <span class="mi">Enviado ${a.enviadoEm}</span>
      </div>
      <div class="apr-fb" ${a.feedback?'':'hidden'}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
        <span class="fb-txt">${a.feedback||''}</span>
      </div>
    </div>
    <div class="apr-side">
      ${espera ? `<div class="sla-pill ${s.k}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${waitLabel(a.horas)}</div><div class="sla-note">SLA ${s.l}</div>`
        : `<div class="sla-pill done"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>aprovado</div>`}
      <div class="apr-actions">
        <button class="ab open" data-act="open" title="Abrir arquivo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg></button>
        ${done ? '' : `
        <button class="ab ok" data-act="aprovar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>Aprovar</button>
        <button class="ab warn" data-act="correcao"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4z"/></svg>Correção</button>
        <button class="ab info" data-act="reenviar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v6h6"/><path d="M3 13a9 9 0 1 0 3-7.7L3 8"/></svg>Reenviar</button>`}
      </div>
    </div>
    <div class="apr-correcao" hidden>
      <textarea placeholder="O que precisa ser corrigido?"></textarea>
      <div class="cr-actions"><button class="ab warn cr-send">Enviar correção</button><button class="ab ghost cr-cancel">Cancelar</button></div>
    </div>
  </article>`;
}

function render(){
  const rows = visible();
  $('#list').innerHTML = rows.length ? rows.map(cardHTML).join('') : '<div class="empty">Nenhuma aprovação nesta visão. 🎉</div>';
  $('#count').textContent = rows.length;
}

/* ---------- Ações ---------- */
$('#list').addEventListener('click', e=>{
  const btn = e.target.closest('[data-act]'); if(!btn) return;
  const card = btn.closest('.apr'); const a = APPROVALS.find(x=>x.id==card.dataset.id);
  const act = btn.dataset.act;
  if (act==='open') { toast('Abrindo "'+a.entrega+'" no Drive…'); return; }
  if (act==='aprovar'){ a.status='aprovado'; refresh('Aprovado: '+a.entrega+' ✓'); return; }
  if (act==='reenviar'){ a.status='reenviado'; a.horas=1; a.versao='v'+((parseInt(a.versao.slice(1))||1)+1); a.feedback=''; refresh('Reenviado para aprovação: '+a.entrega); return; }
  if (act==='correcao'){ card.querySelector('.apr-correcao').hidden=false; card.querySelector('textarea').focus(); return; }
});
$('#list').addEventListener('click', e=>{
  const card = e.target.closest('.apr'); if(!card) return;
  if (e.target.closest('.cr-cancel')) { card.querySelector('.apr-correcao').hidden=true; }
  if (e.target.closest('.cr-send')) {
    const a = APPROVALS.find(x=>x.id==card.dataset.id);
    const val = card.querySelector('.apr-correcao textarea').value.trim();
    a.status='correcao'; a.feedback = val || 'Correção solicitada.';
    refresh('Correção solicitada: '+a.entrega);
  }
});
function refresh(msg){ renderStats(); render(); if(msg) toast(msg); }

/* ---------- Filtros ---------- */
document.querySelectorAll('.qchip').forEach(c=>c.addEventListener('click',()=>{
  document.querySelectorAll('.qchip').forEach(x=>x.classList.remove('on')); c.classList.add('on');
  filtro.quick=c.dataset.q; render();
}));
$('#fClient').addEventListener('change', e=>{ filtro.client=e.target.value; render(); });

renderStats(); render();
