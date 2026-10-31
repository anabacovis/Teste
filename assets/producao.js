/* ============================================================
   PRODUÇÃO — base operacional (tabela + kanban + cards mobile)
   Consome assets/data.js (CLIENTS, PEOPLE, TYPES, STATUS, ROWS, flame…)
   ============================================================ */

/* ===================== RENDER ===================== */
const $ = s => document.querySelector(s);
const tbody = $('#tbody');
const dcards = $('#dcards');
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

let filters = { q:'', client:'', resp:'', status:'', type:'', prazo:'', prio:'', quick:'all' };
let page = 1, perPage = 10;

function matchPrazo(r){
  if (!filters.prazo) return true;
  if (filters.prazo==='atrasado') return r.late;
  if (filters.prazo==='hoje') return r.prazoDay===TODAY;
  if (filters.prazo==='semana') return r.prazoDay>=TODAY && r.prazoDay<=TODAY+6;
  return true;
}
function matchQuick(r){
  switch(filters.quick){
    case 'atrasados': return r.late;
    case 'hoje': return r.prazoDay===TODAY && r.status!=='publicado';
    case 'aprovacao': return r.status==='aprovacao';
    case 'publicado': return r.status==='publicado';
    default: return true;
  }
}
function visibleRows(){
  return ROWS.filter(r=>{
    const q = filters.q.toLowerCase();
    const text = (CLIENTS[r.client].name+' '+r.title+' '+r.sub+' '+TYPES[r.type].l).toLowerCase();
    return (!q || text.includes(q))
      && (!filters.client || r.client===filters.client)
      && (!filters.resp || r.resp===filters.resp)
      && (!filters.status || r.status===filters.status)
      && (!filters.type || r.type===filters.type)
      && (!filters.prio || r.prio===filters.prio)
      && matchPrazo(r) && matchQuick(r);
  });
}

function typeIcon(t){
  const map = {
    estatico:'<rect x="3" y="3" width="18" height="18" rx="2.5"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.6-3.6a2 2 0 0 0-2.8 0L6 21"/>',
    carrossel:'<rect x="3" y="5" width="14" height="14" rx="2"/><path d="M20 7v10"/>',
    reels:'<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    story:'<rect x="6" y="3" width="12" height="18" rx="3"/>',
    yt:'<rect x="3" y="5" width="18" height="14" rx="3"/><path d="m10 9 5 3-5 3z" fill="currentColor"/>',
    short:'<rect x="6" y="3" width="12" height="18" rx="3"/><path d="m10 9 4 3-4 3z" fill="currentColor"/>',
    news:'<path d="M4 4h16v16H4z"/><path d="M8 8h8M8 12h8M8 16h5"/>',
    demanda:'<path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><circle cx="12" cy="12" r="4"/>',
  };
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'+(map[t]||map.estatico)+'</svg>';
}
function rowAccent(r){
  if (r.late) return 'r-late';
  if (r.status==='correcao') return 'r-correcao';
  if (r.status==='aprovacao') return 'r-aprov';
  if (r.status==='publicado') return 'r-pub';
  return '';
}

/* ---------- desktop table row ---------- */
function rowHTML(r){
  const cl=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type], st=STATUS[r.status], pr=PRIO[r.prio];
  return `<tr class="${rowAccent(r)}" data-id="${r.id}">
    <td class="c-check"><label class="chk"><input type="checkbox" data-act="check"><span></span></label></td>
    <td class="c-entrega" data-label="Entrega"><span class="ent"><span class="ent-ic ${'ic-'+t.c}">${typeIcon(r.type)}</span><b>${r.title}</b></span></td>
    <td data-label="Cliente"><span class="cell-client"><span class="mlogo" style="background:${cl.bg}">${cl.logo}</span>${cl.name}</span></td>
    <td data-label="Tipo"><span class="tag ${t.c==='red'?'yt':t.c==='violet'?'story':''}" style="${t.c==='amber'?'background:var(--amber-bg);color:var(--amber)':''}">${t.l}</span></td>
    <td data-label="Responsável"><span class="cell-resp"><span class="mav" style="background:${p.bg}">${p.av}</span>${p.n}</span></td>
    <td data-label="Prazo"><span class="prazo ${r.late?'late':''}">${r.late?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="width:13px;height:13px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg>':''}${r.prazo}</span></td>
    <td data-label="Publicação"><span class="pub ${r.pub==='—'?'muted':''}">${r.pub}</span></td>
    <td data-label="Status"><button class="badge-status ${st.cls} st-btn" data-act="status">${st.l}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:12px;height:12px;margin-left:2px"><path d="m6 9 6 6 6-6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></td>
    <td data-label="Prioridade"><span class="pchip ${pr.cls}">${r.prio==='hoje'?flame():''}${pr.l}</span></td>
    <td class="tac c-acoes" data-label="Ações"><span class="acts">
      <button class="ic-mini" data-act="note" title="Editar / observação"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg></button>
      <button class="ic-mini ${r.file?'has':''}" data-act="file" title="Abrir arquivo"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg></button>
      <button class="ic-mini" data-act="hist" title="Histórico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg></button>
    </span></td>
  </tr>`;
}

/* ---------- mobile card ---------- */
function cardHTML(r){
  const cl=CLIENTS[r.client], p=PEOPLE[r.resp], t=TYPES[r.type], st=STATUS[r.status], pr=PRIO[r.prio];
  return `<div class="dcard ${rowAccent(r)}" data-id="${r.id}">
    <span class="dc-ic ic-${t.c}">${typeIcon(r.type)}</span>
    <div class="dc-main">
      <div class="dc-title">${r.title}</div>
      <div class="dc-sub">${cl.name} · ${p.n}</div>
    </div>
    <div class="dc-chips">
      <button class="badge-status ${st.cls} st-btn" data-act="status">${st.l}</button>
      <span class="pchip ${pr.cls}">${r.prio==='hoje'?flame():''}${pr.l}</span>
    </div>
    <button class="dc-more" data-act="menu" aria-label="Ações"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg></button>
  </div>`;
}

/* ---------- KPIs ---------- */
function renderKpis(){
  const setk=(sel,fn)=>{ const el=$(sel); if(el) el.textContent = ROWS.filter(fn).length; };
  $('#k-total') && ($('#k-total').textContent = ROWS.length);
  setk('#k-atrasadas', r=>r.late);
  setk('#k-hoje', r=>r.prazoDay===TODAY && r.status!=='publicado');
  setk('#k-aprovacao', r=>r.status==='aprovacao');
  setk('#k-publicado', r=>r.status==='publicado');
}

/* ---------- pagination ---------- */
function renderPager(total){
  const pages = Math.max(1, Math.ceil(total/perPage));
  if (page>pages) page=pages;
  const from = total? (page-1)*perPage+1 : 0;
  const to = Math.min(total, page*perPage);
  $('#pgRange').innerHTML = `Mostrando <b>${from}</b> a <b>${to}</b> de <b>${total}</b> entregas`;
  let nums=[];
  if (pages<=7){ for(let i=1;i<=pages;i++) nums.push(i); }
  else if (page<=3){ nums=[1,2,3,4,'…',pages]; }
  else if (page>=pages-2){ nums=[1,'…',pages-3,pages-2,pages-1,pages]; }
  else { nums=[1,'…',page-1,page,page+1,'…',pages]; }
  $('#pgNums').innerHTML = nums.map(n=> n==='…'
    ? '<span class="pg-gap">…</span>'
    : `<button class="pg-n ${n===page?'on':''}" data-pg="${n}">${n}</button>`).join('');
  $('#pgPrev').disabled = page<=1;
  $('#pgNext').disabled = page>=pages;
}

/* ---------- main render ---------- */
function render(){
  const rows = visibleRows();
  const slice = rows.slice((page-1)*perPage, page*perPage);
  tbody.innerHTML = slice.length ? slice.map(rowHTML).join('')
    : `<tr><td colspan="10" class="t-empty">Nenhuma entrega encontrada com esses filtros.</td></tr>`;
  if (dcards) dcards.innerHTML = slice.length ? slice.map(cardHTML).join('')
    : `<div class="t-empty">Nenhuma entrega encontrada.</div>`;
  renderKpis(); renderPager(rows.length);
}

/* ---------- interactions ---------- */
let openPop=null;
function closePop(){ if(openPop){ openPop.remove(); openPop=null; } }
document.addEventListener('click', closePop);

function rowFromEvent(e){ const el=e.target.closest('[data-id]'); return el?ROWS.find(x=>x.id==el.dataset.id):null; }

function handleAct(e){
  const btn = e.target.closest('[data-act]'); if(!btn) return;
  e.stopPropagation();
  const r = rowFromEvent(e); if(!r && btn.dataset.act!=='check') return;
  const act = btn.dataset.act;
  if (act==='check'){ btn.closest('tr').classList.toggle('sel', btn.checked); return; }
  if (act==='status') openStatusPop(btn, r);
  else if (act==='file'){ closePop(); r.file ? toast('Abrindo "'+r.title+'" no Drive…') : toast('Nenhum arquivo anexado ainda'); }
  else if (act==='note') openNotePop(btn, r);
  else if (act==='hist'){ closePop(); openDrawer(r); }
  else if (act==='menu') openCardMenu(btn, r);
}
tbody.addEventListener('click', handleAct);
if (dcards) dcards.addEventListener('click', handleAct);

function openCardMenu(btn, r){
  const isOpen = openPop && openPop._for==='menu'+r.id; closePop(); if(isOpen) return;
  const pop=document.createElement('div'); pop.className='pop'; pop._for='menu'+r.id;
  const mi=(m,label,svg)=>`<button data-m="${m}"><span class="mi-ic">${svg}</span>${label}</button>`;
  pop.innerHTML='<div class="pop-t">Ações</div>'+
    mi('status','Mudar status','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>')+
    mi('file','Abrir arquivo','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>')+
    mi('note','Observação','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>')+
    mi('hist','Histórico','<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>');
  pop.addEventListener('click',ev=>ev.stopPropagation());
  pop.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    const m=b.dataset.m;
    if(m==='status'){ openStatusPop(btn,r); return; }
    closePop();
    if(m==='file') r.file?toast('Abrindo "'+r.title+'" no Drive…'):toast('Nenhum arquivo anexado');
    if(m==='note') openNotePop(btn,r);
    if(m==='hist') openDrawer(r);
  }));
  place(pop, btn);
}

function openStatusPop(btn, r){
  const isOpen = openPop && openPop._for==='status'+r.id; closePop(); if(isOpen) return;
  const pop=document.createElement('div'); pop.className='pop'; pop._for='status'+r.id;
  pop.innerHTML='<div class="pop-t">Mudar status</div>'+STATUS_ORDER.map(k=>{
    const s=STATUS[k];
    return `<button data-k="${k}"><span class="sw ${s.cls}"></span>${s.l}${r.status===k?'<svg class="ck" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>':''}</button>`;
  }).join('');
  pop.addEventListener('click',ev=>ev.stopPropagation());
  pop.querySelectorAll('button').forEach(b=>b.addEventListener('click',()=>{
    const k=b.dataset.k; if(k!==r.status){
      r.status=k;
      r.history.unshift({ txt:'Status → '+STATUS[k].l, who:'Ana', when:'Hoje · agora', status:k });
      if(k==='publicado'){ r.late=false; if(r.pub==='—') r.pub='22/05'; }
      render(); renderBoard();
      toast(r.title+' → '+STATUS[k].l);
    }
    closePop();
  }));
  place(pop, btn);
}

function openNotePop(btn, r){
  const isOpen = openPop && openPop._for==='note'+r.id; closePop(); if(isOpen) return;
  const pop=document.createElement('div'); pop.className='pop pop-note'; pop._for='note'+r.id;
  pop.innerHTML=`<div class="pop-t">Observação curta</div>
    <textarea maxlength="140" placeholder="Ex.: aguardando material do cliente…">${r.note||''}</textarea>
    <div class="pop-actions"><button class="btn btn-primary save" style="padding:8px 14px;font-size:13px">Salvar</button><button class="cancel qa-sm">Cancelar</button></div>`;
  pop.addEventListener('click',ev=>ev.stopPropagation());
  pop.querySelector('textarea').focus();
  pop.querySelector('.save').addEventListener('click',()=>{ r.note=pop.querySelector('textarea').value.trim(); render(); closePop(); toast(r.note?'Observação salva':'Observação removida'); });
  pop.querySelector('.cancel').addEventListener('click',closePop);
  place(pop, btn);
}

function place(pop, btn){
  document.body.appendChild(pop); openPop=pop;
  const r=btn.getBoundingClientRect(); const w=pop.offsetWidth||220, h=pop.offsetHeight||200;
  let left=r.left+window.scrollX; if(left+w>window.innerWidth-12) left=r.right+window.scrollX-w;
  let top=r.bottom+window.scrollY+6; if(r.bottom+h>window.innerHeight-12) top=r.top+window.scrollY-h-6;
  pop.style.top=Math.max(12,top)+'px'; pop.style.left=Math.max(12,left)+'px';
}

/* ---------- history drawer ---------- */
function openDrawer(r){
  const cl=CLIENTS[r.client];
  $('#dwClient').innerHTML=`<span class="mlogo" style="background:${cl.bg}">${cl.logo}</span><div><b>${r.title}</b><small>${cl.name} · ${r.sub}</small></div>`;
  $('#dwTimeline').innerHTML = r.history.map((h,i)=>{
    const col = h.status?STATUS[h.status].cls:'st-violet';
    return `<div class="tl-item ${i===0?'now':''}">
      <span class="tl-dot ${col}"></span>
      <div class="tl-body"><div class="tl-txt">${h.txt}</div><div class="tl-meta">${h.who} · ${h.when}</div></div>
    </div>`;
  }).join('');
  $('#drawer').classList.add('open'); $('#drawerScrim').classList.add('show');
}
function closeDrawer(){ $('#drawer').classList.remove('open'); $('#drawerScrim').classList.remove('show'); }
window.closeDrawer=closeDrawer;

/* ---------- Kanban view ---------- */
function renderBoard(){
  const board=$('#board'); if(!board) return;
  board.innerHTML = STATUS_ORDER.map(k=>{
    const s=STATUS[k];
    const items=visibleRows().filter(r=>r.status===k);
    return `<section class="col"><div class="col-head"><span class="cdot ${s.cls}"></span><span class="ctitle">${s.l}</span><span class="ccount">${items.length}</span></div>
      <div class="col-body">${items.map(kanbanCard).join('') || '<div class="empty">—</div>'}</div></section>`;
  }).join('');
}
function kanbanCard(r){
  const cl=CLIENTS[r.client],p=PEOPLE[r.resp],t=TYPES[r.type],pr=PRIO[r.prio];
  return `<div class="kc">
    <div class="kc-top"><span class="tag ${t.c==='red'?'yt':t.c==='violet'?'story':''}">${t.l}</span><span class="pchip ${pr.cls}" style="padding:3px 8px;font-size:11.5px">${r.prio==='hoje'?flame():''}${pr.l}</span></div>
    <h4 class="kc-title">${r.title}</h4><div class="kc-sub">${r.sub}</div>
    <div class="kc-foot"><span class="kc-client"><span class="kc-logo" style="background:${cl.bg}">${cl.logo}</span>${cl.name}</span>
    <span class="kc-right"><span class="kc-due ${r.late?'late':''}">${r.prazo}</span><span class="kc-av" style="background:${p.bg}">${p.av}</span></span></div>
  </div>`;
}

/* ---------- filter wiring ---------- */
function reset(){ page=1; render(); renderBoard(); }
['#search','#searchM'].forEach(sel=>{ const el=$(sel); if(el) el.addEventListener('input', e=>{
  filters.q=e.target.value; const other = sel==='#search'?$('#searchM'):$('#search'); if(other) other.value=e.target.value; reset();
}); });
[['#fClient','client'],['#fResp','resp'],['#fStatus','status'],['#fType','type'],['#fPrazo','prazo'],['#fPrio','prio']].forEach(([sel,key])=>{
  const el=$(sel); if(el) el.addEventListener('change', e=>{ filters[key]=e.target.value; reset(); });
});
$('#clearF') && $('#clearF').addEventListener('click',()=>{
  filters={ q:'', client:'', resp:'', status:'', type:'', prazo:'', prio:'', quick:'all' };
  ['#search','#searchM'].forEach(s=>{ if($(s)) $(s).value=''; });
  ['#fClient','#fResp','#fStatus','#fType','#fPrazo','#fPrio'].forEach(s=>{ if($(s)) $(s).value=''; });
  document.querySelectorAll('.kpi').forEach(x=>x.classList.remove('on'));
  reset(); toast('Filtros limpos');
});

/* KPI cards act as quick filters */
document.querySelectorAll('.kpi[data-q]').forEach(c=>c.addEventListener('click',()=>{
  const q=c.dataset.q; const wasOn=c.classList.contains('on');
  document.querySelectorAll('.kpi').forEach(x=>x.classList.remove('on'));
  filters.quick = wasOn ? 'all' : q;
  if(!wasOn) c.classList.add('on');
  reset();
}));

/* pagination */
$('#pgPrev').addEventListener('click',()=>{ if(page>1){ page--; render(); } });
$('#pgNext').addEventListener('click',()=>{ page++; render(); });
$('#pgNums').addEventListener('click',e=>{ const b=e.target.closest('[data-pg]'); if(b){ page=+b.dataset.pg; render(); } });
$('#perPage').addEventListener('change',e=>{ perPage=+e.target.value; page=1; render(); });

/* select-all */
$('#checkAll') && $('#checkAll').addEventListener('change',e=>{
  document.querySelectorAll('#tbody [data-act="check"]').forEach(c=>{ c.checked=e.target.checked; c.closest('tr').classList.toggle('sel',e.target.checked); });
});

/* tabs */
window.setView=function(v){
  const tbl=v==='table';
  $('#viewTable').classList.toggle('on',tbl); $('#viewKanban').classList.toggle('on',!tbl);
  $('#tableScroll').style.display=tbl?'':'none';
  $('#tableFoot').style.display=tbl?'':'none';
  if(dcards) dcards.style.display=tbl?'':'none';
  $('#board').style.display=tbl?'none':'grid';
  if(!tbl) renderBoard();
};

/* mobile filter sheet */
window.toggleFilters=function(){
  $('#filters').classList.toggle('open');
  $('#sheetScrim').classList.toggle('show');
};

render();
