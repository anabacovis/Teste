/* ============================================================
   ÁREA DA NICOLE — visão individual (audiovisual)
   Consome assets/data.js. Filtra ROWS por responsável = Nicole.
   Ênfase: vídeo, urgência, atraso e demandas sob demanda.
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

const DIA = TODAY, DIAS_MES = 31;
const VIDEO = ['reels','short','yt','story'];

// ---- Fatias da Nicole (live) ----
const nic = ROWS.filter(r => r.resp==='nicole');
const concl     = nic.filter(r => r.status==='publicado').length;
const agend     = nic.filter(r => r.status==='agendado').length;
const andamento = nic.filter(r => ['briefing','producao','correcao'].includes(r.status)).length;
const atrasadas = nic.filter(r => r.late);
const hoje      = nic.filter(r => r.prazoDay===DIA && !['publicado','agendado'].includes(r.status));
const proximas  = nic.filter(r => r.prazoDay>DIA && !['publicado','agendado'].includes(r.status)).sort((a,b)=>a.prazoDay-b.prazoDay);
const videos    = nic.filter(r => VIDEO.includes(r.type) && !['publicado','agendado'].includes(r.status)).sort((a,b)=> (b.late-a.late)||(a.prazoDay-b.prazoDay));
const sobDemandaAll = nic.filter(r => r.type==='demanda');
const sobDemanda    = sobDemandaAll.filter(r => !['publicado','agendado'].includes(r.status)).sort((a,b)=>a.prazoDay-b.prazoDay);
// aprovações relacionadas à Nicole = entregas dela aguardando aprovação
const minhasAprov = nic.filter(r => r.status==='aprovacao').sort((a,b)=>a.prazoDay-b.prazoDay);

// ---- Plano fixo: 20–24 fixas + sob demanda ----
const META_FIXA = 24;
const metaTotal = META_FIXA + sobDemandaAll.length;

/* ---------- Carga / sobrecarga ---------- */
function renderCarga(){
  const feito = concl + agend;
  const pctConcl = Math.round(feito / metaTotal * 100);
  const pace = Math.round(DIA / DIAS_MES * 100);
  const pressao = atrasadas.length*2 + videos.filter(v=>v.status==='producao'||v.late).length + sobDemanda.length + hoje.length;
  let v;
  if (pressao >= 16 || atrasadas.length >= 6) v = { l:'Sobrecarregada', cls:'red',   msg:'Muitos vídeos abertos e atrasos: priorize gravação e edição.' };
  else if (pressao >= 9)                       v = { l:'Carga alta',     cls:'amber', msg:'Pipeline de vídeo cheio — atenção aos prazos curtos.' };
  else                                         v = { l:'No ritmo',       cls:'green', msg:'Produção de vídeo sob controle neste mês.' };

  $('#loadVerdict').className = 'load-pill ' + v.cls;
  $('#loadVerdict').innerHTML = (v.cls==='green'
    ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>'
    : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>'
  ) + v.l;
  $('#loadMsg').textContent = v.msg;
  $('#loadConcl').textContent = feito;
  $('#loadMeta').textContent = metaTotal;
  $('#loadPct').textContent = pctConcl + '%';
  $('#barFill').style.width = Math.min(100,pctConcl) + '%';
  $('#barFill').className = 'bar-fill ' + v.cls;
  $('#paceMark').style.left = pace + '%';
  $('#paceLabel').style.left = pace + '%';
  $('#paceLabel').textContent = 'ritmo ' + pace + '%';
  $('#planoTxt').innerHTML = `Plano: <b>20–24 fixas</b> + <b>${sobDemandaAll.length}</b> sob demanda este mês`;

  $('#mVideos').textContent = videos.length;
  $('#mAtrasadas').textContent = atrasadas.length;
  $('#mDemanda').textContent = sobDemanda.length;
}

/* ---------- Focus strip ---------- */
function renderFocus(){
  $('#fHoje').textContent = hoje.length;
  $('#fAtras').textContent = atrasadas.length;
  $('#fVideos').textContent = videos.length;
  $('#fDemanda').textContent = sobDemanda.length;
}

/* ---------- Linha de tarefa compacta ---------- */
function row(r){
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

/* ---------- Vídeo card (destaque) ---------- */
function videoCard(r){
  const cl=CLIENTS[r.client], t=TYPES[r.type], st=STATUS[r.status];
  return `<div class="vcard ${r.late?'late':''}" data-id="${r.id}">
    <div class="vthumb" style="background:${cl.bg}">
      <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
      <span class="vtype">${t.l}</span>
    </div>
    <div class="vbody">
      <div class="vtitle">${r.title}</div>
      <div class="vmeta"><span class="mlogo sm" style="background:${cl.bg}">${cl.logo}</span>${cl.name} · ${r.sub}</div>
      <div class="vfoot">
        <span class="badge-status ${st.cls}">${st.l}</span>
        <span class="trow-prazo ${r.late?'late':''}">${r.late?'⏱ ':''}${r.prazo}</span>
      </div>
    </div>
  </div>`;
}

function emptyState(msg){ return `<div class="empty-row">${msg}</div>`; }

function renderLists(){
  const secA = $('#secAtrasadas');
  if (atrasadas.length){ secA.style.display=''; $('#listAtrasadas').innerHTML = atrasadas.map(row).join(''); $('#cAtras').textContent = atrasadas.length; }
  else secA.style.display='none';

  $('#videoGrid').innerHTML = videos.length ? videos.slice(0,6).map(videoCard).join('') : emptyState('Nenhum vídeo em produção agora.');
  $('#cVideos').textContent = videos.length;

  $('#listHoje').innerHTML = hoje.length ? hoje.map(row).join('') : emptyState('Nada vence hoje. Bom momento para gravar adiantado. 🎬');
  $('#cHoje').textContent = hoje.length;

  $('#listProximas').innerHTML = proximas.length ? proximas.slice(0,6).map(row).join('') : emptyState('Sem próximas entregas no radar.');
  $('#cProx').textContent = proximas.length;

  $('#listDemanda').innerHTML = sobDemanda.length ? sobDemanda.map(row).join('') : emptyState('Nenhuma demanda avulsa em aberto.');
  $('#cDemanda').textContent = sobDemanda.length;
}

/* ---------- Produção por cliente ---------- */
function renderPorCliente(){
  const groups = {};
  nic.forEach(r=>{ (groups[r.client]=groups[r.client]||{total:0,done:0}); groups[r.client].total++; if(['publicado','agendado'].includes(r.status)) groups[r.client].done++; });
  const arr = Object.entries(groups).sort((a,b)=>b[1].total-a[1].total);
  $('#porCliente').innerHTML = arr.map(([k,g])=>{
    const cl=CLIENTS[k], pct=Math.round(g.done/g.total*100);
    return `<div class="pc-row"><span class="pc-name"><span class="mlogo sm" style="background:${cl.bg}">${cl.logo}</span>${cl.name}</span>
      <div class="pc-bar"><span style="width:${pct}%"></span></div><span class="pc-val">${g.done}/${g.total}</span></div>`;
  }).join('');
}

/* ---------- Status das entregas ---------- */
function renderStatus(){
  const counts={}; STATUS_ORDER.forEach(k=>counts[k]=0); nic.forEach(r=>counts[r.status]++);
  const total=nic.length;
  $('#statusBar').innerHTML = STATUS_ORDER.filter(k=>counts[k]>0).map(k=>`<span class="seg-${STATUS[k].cls}" style="width:${counts[k]/total*100}%" title="${STATUS[k].l}: ${counts[k]}"></span>`).join('');
  $('#statusLegend').innerHTML = STATUS_ORDER.map(k=>`<div class="leg"><span class="leg-dot ${STATUS[k].cls}"></span>${STATUS[k].l}<b>${counts[k]}</b></div>`).join('');
}

/* ---------- Aprovações relacionadas à Nicole ---------- */
function renderAprov(){
  const list = $('#aprovList');
  if (!minhasAprov.length){ list.innerHTML = emptyState('Nenhuma entrega sua aguardando aprovação.'); $('#cAprov').textContent='0'; return; }
  $('#cAprov').textContent = minhasAprov.length;
  list.innerHTML = minhasAprov.slice(0,6).map(r=>{
    const cl=CLIENTS[r.client], t=TYPES[r.type];
    return `<div class="ap-row" data-id="${r.id}">
      <span class="mlogo" style="background:${cl.bg}">${cl.logo}</span>
      <div class="trow-main"><div class="trow-title">${r.title}</div><div class="trow-meta"><span>${cl.name}</span><span class="dotsep"></span><span>${t.l}</span></div></div>
      <span class="ap-wait">Aguardando Ana</span>
    </div>`;
  }).join('') + (minhasAprov.length>6 ? `<a class="ap-more" href="Aprovacoes.html">Ver todas (${minhasAprov.length}) →</a>` : '');
}

document.addEventListener('click', e=>{ if(e.target.closest('[data-open]')||e.target.closest('.vcard')) toast('Abrindo na Produção…'); });

renderCarga(); renderFocus(); renderLists(); renderPorCliente(); renderStatus(); renderAprov();
