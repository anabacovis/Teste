/* ============================================================
   CALENDÁRIO — consome assets/data.js (ROWS)
   Visões: mês · semana · hoje. Coloca entregas pelo prazo interno.
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

const WD = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
const MONTH = { name:'Maio 2025', days:31, lead:3, today:22 };   // 01/05 = quinta → 3 vazios (Seg,Ter,Qua)
const WEEK  = [19,20,21,22,23,24,25];                            // semana atual (Seg–Dom)
const STC = { briefing:'var(--gray)', producao:'var(--blue)', aprovacao:'var(--amber)', correcao:'#e8633f', agendado:'var(--violet)', publicado:'var(--green)' };
const TYPE_TAG = t => TYPES[t].c==='red'?'yt':TYPES[t].c==='violet'?'story':'';

let view = 'mes';
let filt = { client:'', resp:'', status:'', tipo:'' };

function match(r){
  return (!filt.client||r.client===filt.client) && (!filt.resp||r.resp===filt.resp)
      && (!filt.status||r.status===filt.status) && (!filt.tipo||r.type===filt.tipo);
}
function dayItems(day){
  return ROWS.filter(r=>r.prazoDay===day && match(r))
    .sort((a,b)=> (b.late-a.late) || (a.prio==='hoje'?-1:1));
}
function flameI(){ return '<svg viewBox="0 0 24 24" fill="currentColor" style="width:11px;height:11px"><path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-.8-3 .3 4-2.2 5-2.2 2 0-2 .5-4-3-6z"/></svg>'; }

/* ---------- pílula compacta (mês) ---------- */
function pill(r){
  const c=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type];
  const accent = r.late ? 'var(--red)' : STC[r.status];
  return `<button class="ev ${r.late?'late':''}" style="border-left-color:${accent}" data-open="${r.id}" title="${c.name} · ${t.l} · ${STATUS[r.status].l}">
    <span class="ev-logo" style="background:${c.bg}">${c.logo}</span>
    <span class="ev-type">${t.l}</span>
    ${r.prio==='hoje'?'<span class="ev-flame">'+flameI()+'</span>':''}
    <span class="ev-av" style="background:${p.bg}">${p.av}</span>
  </button>`;
}

/* ---------- MÊS ---------- */
function renderMonth(){
  let cells = '';
  for (let i=0;i<MONTH.lead;i++) cells += '<div class="cell empty"></div>';
  for (let d=1; d<=MONTH.days; d++){
    const wd = (MONTH.lead + d - 1) % 7;
    const its = dayItems(d);
    const isToday = d===MONTH.today;
    const hasLate = its.some(x=>x.late);
    const shown = its.slice(0,3), extra = its.length-shown.length;
    cells += `<div class="cell ${wd>=5?'weekend':''} ${isToday?'today':''} ${hasLate?'has-late':''}" data-day="${d}">
      <div class="cell-h"><span class="cd">${d}</span>${isToday?'<span class="td-tag">Hoje</span>':''}</div>
      <div class="cell-evs">${shown.map(pill).join('')}${extra>0?`<button class="more" data-day-open="${d}">+${extra} mais</button>`:''}</div>
    </div>`;
  }
  $('#cal').innerHTML = `<div class="month">
    <div class="wd-head">${WD.map(w=>`<span>${w}</span>`).join('')}</div>
    <div class="grid-m">${cells}</div>
  </div>`;
}

/* ---------- SEMANA ---------- */
function renderWeek(){
  const cols = WEEK.map((d,i)=>{
    const its = dayItems(d), isToday=d===MONTH.today;
    return `<div class="wcol ${i>=5?'weekend':''} ${isToday?'today':''}">
      <div class="wcol-h"><span class="ww">${WD[i]}</span><span class="wd-n ${isToday?'on':''}">${d}</span></div>
      <div class="wcol-b">${its.length?its.map(weekItem).join(''):'<div class="w-empty">—</div>'}</div>
    </div>`;
  }).join('');
  $('#cal').innerHTML = `<div class="week">${cols}</div>`;
}
function weekItem(r){
  const c=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type], st=STATUS[r.status];
  const accent = r.late?'var(--red)':STC[r.status];
  return `<button class="wev ${r.late?'late':''}" style="border-left-color:${accent}" data-open="${r.id}">
    <div class="wev-top"><span class="ev-logo sm" style="background:${c.bg}">${c.logo}</span><b>${c.name}</b>${r.prio==='hoje'?'<span class="ev-flame" style="margin-left:auto;color:var(--red)">'+flameI()+'</span>':''}</div>
    <div class="wev-title">${r.title}</div>
    <div class="wev-foot"><span class="tag ${TYPE_TAG(r.type)}" style="padding:2px 7px;font-size:10.5px">${t.l}</span><span class="badge-status ${st.cls}" style="padding:3px 8px;font-size:11px">${st.l}</span></div>
  </button>`;
}

/* ---------- HOJE ---------- */
function renderToday(){
  const its = dayItems(MONTH.today);
  const late = ROWS.filter(r=>r.late && match(r));
  let html = '';
  if (late.length) html += `<div class="today-alert"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg><b>${late.length} entrega(s) atrasada(s)</b> precisam de atenção antes das de hoje.</div>`;
  html += `<div class="today-head"><h3>Quinta, 5 de Junho</h3><span>${its.length} entrega(s) para hoje</span></div>`;
  html += `<div class="today-list">${its.length?its.map(todayItem).join(''):'<div class="empty">Nada agendado para hoje. ✨</div>'}</div>`;
  $('#cal').innerHTML = `<div class="today">${html}</div>`;
}
function todayItem(r){
  const c=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type], st=STATUS[r.status];
  const pr=PRIO[r.prio];
  return `<button class="titem" data-open="${r.id}">
    <span class="clogo" style="background:${c.bg}">${c.logo}</span>
    <div class="ti-main">
      <div class="ti-tags"><span class="tag ${TYPE_TAG(r.type)}" style="padding:2px 8px;font-size:11px">${t.l}</span><span class="pchip ${pr.cls}" style="padding:3px 9px;font-size:11.5px">${r.prio==='hoje'?flameI():''}${pr.l}</span></div>
      <div class="ti-title">${r.title} <span class="ti-sub">· ${r.sub}</span></div>
      <div class="ti-meta"><b>${c.name}</b><span class="dotsep"></span><span class="ev-av" style="background:${p.bg}">${p.av}</span> ${p.n}</div>
    </div>
    <span class="badge-status ${st.cls}">${st.l}</span>
  </button>`;
}

/* ---------- render dispatch ---------- */
function render(){
  $('#cal').className = 'cal-view view-'+view;
  if (view==='mes') renderMonth(); else if (view==='semana') renderWeek(); else renderToday();
}

/* ---------- view toggle + filtros ---------- */
window.setView = function(v){
  view=v;
  document.querySelectorAll('.vbtn').forEach(b=>b.classList.toggle('on', b.dataset.v===v));
  $('#periodLabel').textContent = v==='mes'?'Junho 2025' : v==='semana'?'2–8 de Junho' : 'Hoje · 5 de Junho';
  render();
};
[['#fClient','client'],['#fResp','resp'],['#fStatus','status'],['#fTipo','tipo']].forEach(([sel,k])=>{
  $(sel).addEventListener('change', e=>{ filt[k]=e.target.value; render(); });
});

/* ---------- drawer ---------- */
$('#cal').addEventListener('click', e=>{
  const it = e.target.closest('[data-open]'); if(it){ openItem(+it.dataset.open); return; }
  const dy = e.target.closest('[data-day-open]'); if(dy){ openDay(+dy.dataset.dayOpen); }
});
function openItem(id){
  const r = ROWS.find(x=>x.id===id); if(!r) return;
  const c=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type], st=STATUS[r.status], pr=PRIO[r.prio];
  $('#dwTitle').textContent = 'Detalhe da entrega';
  $('#dwBody').innerHTML = `
    <div class="dw-hero"><span class="clogo lg" style="background:${c.bg}">${c.logo}</span><div><h3>${r.title}</h3><small>${r.sub}</small></div></div>
    <div class="dw-rows">
      <div class="dwr"><span>Cliente</span><b>${c.name}</b></div>
      <div class="dwr"><span>Tipo</span><span class="tag ${TYPE_TAG(r.type)}" style="padding:3px 9px;font-size:12px">${t.l}</span></div>
      <div class="dwr"><span>Status</span><span class="badge-status ${st.cls}">${st.l}</span></div>
      <div class="dwr"><span>Responsável</span><b><span class="ev-av" style="background:${p.bg};display:inline-grid;vertical-align:-4px">${p.av}</span> ${p.n}</b></div>
      <div class="dwr"><span>Prioridade</span><span class="pchip ${pr.cls}">${r.prio==='hoje'?flameI():''}${pr.l}</span></div>
      <div class="dwr"><span>Prazo interno</span><b class="${r.late?'late':''}">${r.prazo}${r.late?' · atrasado':''}</b></div>
      <div class="dwr"><span>Publicação</span><b>${r.pub}</b></div>
    </div>
    <a class="dw-cta" href="Producao.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>Abrir na Produção</a>`;
  openDrawer();
}
function openDay(day){
  const its = dayItems(day);
  $('#dwTitle').textContent = 'Entregas do dia '+day+'/05';
  $('#dwBody').innerHTML = `<div class="dw-day">${its.map(r=>{
    const c=CLIENTS[r.client], t=TYPES[r.type], st=STATUS[r.status];
    return `<button class="titem" data-open="${r.id}" style="width:100%">
      <span class="clogo" style="background:${c.bg}">${c.logo}</span>
      <div class="ti-main"><div class="ti-title">${r.title}</div><div class="ti-meta"><b>${c.name}</b> · ${t.l}</div></div>
      <span class="badge-status ${st.cls}">${st.l}</span></button>`;
  }).join('')}</div>`;
  openDrawer();
}
function openDrawer(){ $('#drawer').classList.add('open'); $('#drawerScrim').classList.add('show'); }
window.closeDrawer = ()=>{ $('#drawer').classList.remove('open'); $('#drawerScrim').classList.remove('show'); };
$('#dwBody').addEventListener('click', e=>{ const it=e.target.closest('[data-open]'); if(it) openItem(+it.dataset.open); });

setView('mes');
