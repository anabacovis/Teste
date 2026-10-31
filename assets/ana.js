/* ============================================================
   ÁREA DA ANA — visão individual de trabalho
   Consome assets/data.js. Filtra ROWS por responsável = Ana.
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

// ---- Plano fixo contratado da Ana ----
const PLANO = { meta:76, estaticos:68, youtube:8 };
const DIA = TODAY, DIAS_MES = 31;

// ---- Fatias da Ana (live, a partir da fonte única) ----
const ana = ROWS.filter(r => r.resp==='ana');
const concl     = ana.filter(r => r.status==='publicado').length;
const agend     = ana.filter(r => r.status==='agendado').length;
const andamento = ana.filter(r => ['briefing','producao','correcao'].includes(r.status)).length;
const minhasAprov = ana.filter(r => r.status==='aprovacao').length;
const atrasadas = ana.filter(r => r.late);
const hoje      = ana.filter(r => r.prazoDay===DIA && r.status!=='publicado' && r.status!=='agendado');
const proximas  = ana.filter(r => r.prazoDay>DIA && !['publicado','agendado'].includes(r.status)).sort((a,b)=>a.prazoDay-b.prazoDay);
// Ana aprova o conteúdo de toda a agência
const aprovAgencia = ROWS.filter(r => r.status==='aprovacao').sort((a,b)=>a.prazoDay-b.prazoDay);

/* ---------- Carga / sobrecarga ---------- */
function renderCarga(){
  const concluidasMes = concl + agend;                 // entregue ou agendado
  const pctConcl = Math.round(concluidasMes / PLANO.meta * 100);
  const pace = Math.round(DIA / DIAS_MES * 100);        // ritmo esperado (~71%)
  // índice de pressão: o que exige ação imediata da Ana
  const pressao = atrasadas.length + hoje.length + aprovAgencia.length;
  let v;
  if (pressao >= 16 || atrasadas.length >= 6) v = { l:'Sobrecarregada', cls:'red',  msg:'Volume acima do saudável: priorize atrasadas e aprovações.' };
  else if (pressao >= 9)                       v = { l:'Carga alta',     cls:'amber',msg:'Dá pra segurar, mas fique de olho nas aprovações.' };
  else                                         v = { l:'No ritmo',       cls:'green',msg:'Carga sob controle para o restante do mês.' };

  $('#loadVerdict').className = 'load-pill ' + v.cls;
  $('#loadVerdict').innerHTML = (v.cls==='green'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
  ) + v.l;
  $('#loadMsg').textContent = v.msg;

  $('#loadConcl').textContent = concluidasMes;
  $('#loadMeta').textContent = PLANO.meta;
  $('#loadPct').textContent = pctConcl + '%';
  $('#barFill').style.width = Math.min(100,pctConcl) + '%';
  $('#barFill').className = 'bar-fill ' + v.cls;
  $('#paceMark').style.left = pace + '%';
  $('#paceLabel').style.left = pace + '%';
  $('#paceLabel').textContent = 'ritmo ' + pace + '%';

  $('#mAndamento').textContent = andamento;
  $('#mAtrasadas').textContent = atrasadas.length;
  $('#mAprov').textContent = aprovAgencia.length;
}

/* ---------- Focus strip ---------- */
function renderFocus(){
  $('#fHoje').textContent = hoje.length;
  $('#fAtras').textContent = atrasadas.length;
  $('#fAprov').textContent = aprovAgencia.length;
  $('#fProx').textContent = proximas.filter(r=>r.prazoDay<=DIA+6).length;
}

/* ---------- Linhas de tarefa (compactas) ---------- */
function row(r, opts={}){
  const cl=CLIENTS[r.client], t=TYPES[r.type], st=STATUS[r.status];
  const tagCls = t.c==='red'?'yt':t.c==='violet'?'story':'';
  return `<div class="trow" data-id="${r.id}">
    <span class="mlogo" style="background:${cl.bg}">${cl.logo}</span>
    <div class="trow-main">
      <div class="trow-title">${r.title} <span class="trow-sub">· ${r.sub}</span></div>
      <div class="trow-meta"><span>${cl.name}</span><span class="dotsep"></span><span class="tag ${tagCls}" style="padding:2px 8px;font-size:11px">${t.l}</span></div>
    </div>
    <span class="trow-prazo ${r.late?'late':''}">${r.late?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" style="width:13px;height:13px;vertical-align:-2px"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2" stroke-linecap="round"/></svg> ':''}${r.prazo}</span>
    <span class="badge-status ${st.cls}">${st.l}</span>
    <button class="ic-mini" data-open="${r.id}" title="Abrir na Produção"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button>
  </div>`;
}

function renderLists(){
  // atrasadas
  const secA = $('#secAtrasadas');
  if (atrasadas.length){ secA.style.display=''; $('#listAtrasadas').innerHTML = atrasadas.map(r=>row(r)).join(''); $('#cAtras').textContent = atrasadas.length; }
  else secA.style.display='none';
  // hoje
  $('#listHoje').innerHTML = hoje.length ? hoje.map(r=>row(r)).join('') : emptyState('Nada vence hoje. Aproveite para adiantar as próximas. ✨');
  $('#cHoje').textContent = hoje.length;
  // proximas
  const prox = proximas.slice(0,6);
  $('#listProximas').innerHTML = prox.length ? prox.map(r=>row(r)).join('') : emptyState('Sem próximas entregas no radar.');
  $('#cProx').textContent = proximas.length;
}
function emptyState(msg){ return `<div class="empty-row">${msg}</div>`; }

/* ---------- Produção por cliente ---------- */
function renderPorCliente(){
  const groups = {};
  ana.forEach(r=>{ (groups[r.client] = groups[r.client] || {total:0,done:0}); groups[r.client].total++; if(['publicado','agendado'].includes(r.status)) groups[r.client].done++; });
  const arr = Object.entries(groups).sort((a,b)=>b[1].total-a[1].total);
  $('#porCliente').innerHTML = arr.map(([k,g])=>{
    const cl=CLIENTS[k], pct=Math.round(g.done/g.total*100);
    return `<div class="pc-row">
      <span class="pc-name"><span class="mlogo sm" style="background:${cl.bg}">${cl.logo}</span>${cl.name}</span>
      <div class="pc-bar"><span style="width:${pct}%"></span></div>
      <span class="pc-val">${g.done}/${g.total}</span>
    </div>`;
  }).join('');
}

/* ---------- Status das entregas (barra segmentada) ---------- */
function renderStatus(){
  const counts = {}; STATUS_ORDER.forEach(k=>counts[k]=0);
  ana.forEach(r=>counts[r.status]++);
  const total = ana.length;
  $('#statusBar').innerHTML = STATUS_ORDER.filter(k=>counts[k]>0).map(k=>
    `<span class="seg-${STATUS[k].cls}" style="width:${counts[k]/total*100}%" title="${STATUS[k].l}: ${counts[k]}"></span>`).join('');
  $('#statusLegend').innerHTML = STATUS_ORDER.map(k=>
    `<div class="leg"><span class="leg-dot ${STATUS[k].cls}"></span>${STATUS[k].l}<b>${counts[k]}</b></div>`).join('');
}

/* ---------- Aprovações pendentes (agência) ---------- */
function renderAprov(){
  const list = $('#aprovList');
  function paint(){
    if (!aprovAgencia.length){ list.innerHTML = emptyState('Tudo aprovado. Caixa de aprovações zerada! 🎉'); $('#cAprov').textContent='0'; return; }
    $('#cAprov').textContent = aprovAgencia.length;
    list.innerHTML = aprovAgencia.slice(0,6).map(r=>{
      const cl=CLIENTS[r.client], t=TYPES[r.type];
      return `<div class="ap-row" data-id="${r.id}">
        <span class="mlogo" style="background:${cl.bg}">${cl.logo}</span>
        <div class="trow-main"><div class="trow-title">${r.title}</div><div class="trow-meta"><span>${cl.name}</span><span class="dotsep"></span><span>${t.l}</span></div></div>
        <button class="ap-btn ok" data-ok="${r.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>Aprovar</button>
      </div>`;
    }).join('') + (aprovAgencia.length>6 ? `<a class="ap-more" href="Aprovacoes.html">Ver todas as ${aprovAgencia.length} aprovações →</a>` : '');
  }
  paint();
  list.onclick = (e)=>{
    const b = e.target.closest('[data-ok]'); if(!b) return;
    const id = +b.dataset.ok; const r = ROWS.find(x=>x.id===id);
    r.status='agendado'; r.history.unshift({txt:'Aprovado por Ana → Agendado', who:'Ana', when:'Hoje · agora', status:'agendado'});
    const i = aprovAgencia.findIndex(x=>x.id===id); if(i>=0) aprovAgencia.splice(i,1);
    paint(); renderFocus(); renderCarga(); renderStatus(); renderPorCliente();
    toast('Aprovado: '+r.title);
  };
}

/* ---------- Financeiro (autorizado) ---------- */
function renderFinanceiro(){
  const faturaveis = concl + agend;
  const valor = faturaveis * 90;  // valor médio por entrega
  $('#finEntregas').textContent = faturaveis;
  $('#finValor').textContent = 'R$ ' + valor.toLocaleString('pt-BR');
}

/* ---------- open row -> Produção ---------- */
document.addEventListener('click', e=>{
  const b = e.target.closest('[data-open]'); if(!b) return;
  toast('Abrindo na Produção…');
});

renderCarga(); renderFocus(); renderLists(); renderPorCliente(); renderStatus(); renderAprov(); renderFinanceiro();
