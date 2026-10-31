/* ============================================================
   FINANCEIRO (fase simples) — consome assets/data.js (BILLING)
   ============================================================ */
const $ = s => document.querySelector(s);

/* ---- brlNum helper (brl is defined in data.js) ---- */
function brlNum(v){ return (v===null||v===undefined||v==='') ? null : +v; }
const tbody = $('#tbody');
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2200); }

let filters = { comp:'jun', client:'', status:'' };

function monthRows(){ return BILLING.filter(b=>b.comp===filters.comp); }
function visibleRows(){
  return BILLING.filter(b =>
    b.comp===filters.comp &&
    (!filters.client || b.client===filters.client) &&
    (!filters.status || b.status===filters.status)
  );
}

/* ---------- Cards de topo ---------- */
function renderCards(){
  const rows = monthRows();
  const sum = (fn)=> rows.filter(fn).reduce((a,b)=> a + (brlNum(b.valor)||0), 0);
  const hasPlaceholder = rows.some(b=>b.valor===null||b.valor===undefined);
  // safeBrl: se há placeholders e o valor somado é 0, mostra "—" em vez de "R$ 0,00"
  const safeBrl = v => (hasPlaceholder && (v===0||v===null||v===undefined)) ? brl(null) : brl(v);
  const prevista = sum(b=>b.status!=='cancelado');
  const recebido = sum(b=>b.status==='pago');
  const aReceber = sum(b=>['a_vencer','vencendo','vencido','previsto'].includes(b.status));
  const vencido  = sum(b=>b.status==='vencido');
  const vencHoje = sum(b=>b.status==='vencendo');
  const inad = [...new Set(rows.filter(b=>b.status==='vencido').map(b=>b.client))];

  $('#cPrev').innerHTML = safeBrl(prevista);
  $('#cReceb').innerHTML = safeBrl(recebido);
  $('#cAReceber').innerHTML = safeBrl(aReceber);
  $('#cVencido').innerHTML = safeBrl(vencido);
  $('#cVencHoje').innerHTML = safeBrl(vencHoje);
  $('#cInad').textContent = inad.length;
  $('#cInadSub').textContent = inad.length ? inad.map(k=>CLIENTS[k].name).join(', ') : 'Nenhum cliente em atraso';
  // Mostrar banner de valores placeholder
  const banner = $('#placeholderBanner');
  if(banner) banner.style.display = hasPlaceholder ? 'flex' : 'none';

  // % recebido
  const pct = prevista ? Math.round(recebido/prevista*100) : 0;
  $('#recebPct').textContent = pct + '% da receita prevista';
  $('#recebBar').style.width = pct + '%';
}

/* ---------- Alertas ---------- */
function renderAlertas(){
  const rows = monthRows();
  const venc = rows.filter(b=>b.status==='vencendo');
  const atr  = rows.filter(b=>b.status==='vencido');
  const box = $('#alertas');
  let html = '';
  if (venc.length) html += `<div class="alert coral"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><b>${venc.length} cobrança(s) vencem hoje</b> — ${brl(venc.reduce((a,b)=>a+b.valor,0))}. Envie o lembrete.</div>`;
  if (atr.length)  html += `<div class="alert red"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg><b>${atr.length} cobrança(s) vencidas</b> — ${brl(atr.reduce((a,b)=>a+b.valor,0))} em aberto. Acione os inadimplentes.</div>`;
  box.innerHTML = html;
  box.style.display = html ? 'flex' : 'none';
}

/* ---------- Tabela ---------- */
function rowHTML(b){
  const cl=CLIENTS[b.client], st=FIN_STATUS[b.status];
  const rowCls = b.status==='vencido'?'r-late':b.status==='vencendo'?'r-correcao':b.status==='pago'?'r-pub':'';
  const canPay = !['pago','cancelado'].includes(b.status);
  return `<tr class="${rowCls}" data-id="${b.id}">
    <td class="c-accent"></td>
    <td data-label="Cliente"><span class="cell-client"><span class="mlogo" style="background:${cl.bg}">${cl.logo}</span>${cl.name}</span></td>
    <td data-label="Competência"><div class="c-tit"><b>${b.titulo}</b><small>${COMPETENCIAS[b.comp]}</small></div></td>
    <td data-label="Vencimento"><span class="venc ${b.status==='vencido'?'late':b.status==='vencendo'?'today':''}">${b.venc}</span></td>
    <td class="val ${b.status==='cancelado'?'canceled':''}" data-label="Valor">${brl(b.valor)}</td>
    <td data-label="Pagamento"><span class="pgto ${b.pago==='—'?'muted':''}">${b.pago}</span></td>
    <td data-label="Status"><span class="badge-status ${st.cls}">${st.l}</span></td>
    <td class="obs" data-label="Observação">${b.obs || '<span class="muted">—</span>'}</td>
    <td class="tac" data-label="Ação">${canPay
      ? `<button class="pay-btn" data-pay="${b.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>Marcar pago</button>`
      : (b.status==='pago' ? '<span class="paid-tag"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>Pago</span>' : '<span class="muted">—</span>')}
    </td>
  </tr>`;
}
function renderTable(){
  const rows = visibleRows();
  tbody.innerHTML = rows.length ? rows.map(rowHTML).join('')
    : `<tr><td colspan="9" class="t-empty">Nenhuma cobrança com esses filtros.</td></tr>`;
  $('#count').textContent = rows.length;
}

/* ---------- Marcar como pago ---------- */
tbody.addEventListener('click', e=>{
  const btn = e.target.closest('[data-pay]'); if(!btn) return;
  const b = BILLING.find(x=>x.id==btn.dataset.pay);
  b.status='pago'; b.pago='22/05';
  renderCards(); renderAlertas(); renderTable();
  toast(CLIENTS[b.client].name + ' · ' + b.titulo + ' marcada como paga');
});

/* ---------- Filtros ---------- */
$('#fComp').addEventListener('change', e=>{ filters.comp=e.target.value; renderAll(); });
$('#fClient').addEventListener('change', e=>{ filters.client=e.target.value; renderTable(); });
$('#fStatus').addEventListener('change', e=>{ filters.status=e.target.value; renderTable(); });

function renderAll(){ renderCards(); renderAlertas(); renderTable(); }
renderAll();
