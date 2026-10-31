/* ============================================================
   CLIENTES-MODAL — Adicionar / editar cliente
   Autocontido: injeta o próprio CSS. Persiste via agosSaveClients
   (definido em data.js) para valer em todas as telas.
   ============================================================ */
(function(){
'use strict';

const CORES = [
  { id:'blue',   bg:'linear-gradient(135deg,#4a7dff,#2b54d4)' },
  { id:'violet', bg:'linear-gradient(135deg,#8a63f4,#5f38d0)' },
  { id:'green',  bg:'linear-gradient(135deg,#3fb98a,#1f8f68)' },
  { id:'amber',  bg:'linear-gradient(135deg,#f0a53e,#cf7c14)' },
  { id:'rose',   bg:'linear-gradient(135deg,#ef6292,#c93868)' },
  { id:'teal',   bg:'linear-gradient(135deg,#37b6c9,#1687a0)' },
  { id:'slate',  bg:'linear-gradient(135deg,#7d8aa5,#56637d)' },
  { id:'olive',  bg:'linear-gradient(135deg,#7ba35c,#557d3a)' },
];

const css = `
.cm-overlay{position:fixed;inset:0;background:rgba(9,13,24,.55);backdrop-filter:blur(3px);z-index:120;display:flex;align-items:center;justify-content:center;padding:24px;opacity:0;pointer-events:none;transition:opacity .18s ease}
.cm-overlay.open{opacity:1;pointer-events:auto}
.cm-modal{background:var(--surface,#fff);border-radius:20px;width:min(560px,100%);max-height:calc(100vh - 48px);overflow:auto;box-shadow:0 24px 64px rgba(9,13,24,.35);transform:translateY(10px) scale(.98);transition:transform .18s ease}
.cm-overlay.open .cm-modal{transform:none}
.cm-head{display:flex;align-items:center;justify-content:space-between;padding:22px 26px 0}
.cm-head h2{font-size:19px;font-weight:800;margin:0}
.cm-x{border:0;background:none;cursor:pointer;color:inherit;opacity:.55;padding:6px;border-radius:8px}
.cm-x:hover{opacity:1;background:rgba(0,0,0,.06)}
.cm-x svg{width:20px;height:20px}
.cm-body{padding:18px 26px 24px;display:grid;gap:16px}
.cm-row{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.cm-row3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px}
.cm-f label{display:block;font-size:12px;font-weight:700;letter-spacing:.02em;margin-bottom:6px;opacity:.75}
.cm-f input,.cm-f select{width:100%;box-sizing:border-box;padding:10px 12px;border:1.5px solid var(--border-2,#dfe3ee);border-radius:10px;font:inherit;font-size:14px;background:var(--canvas,#f5f6fb)}
.cm-f input:focus,.cm-f select:focus{outline:none;border-color:var(--blue,#4a7dff)}
.cm-swatches{display:flex;gap:10px;flex-wrap:wrap}
.cm-sw{width:38px;height:38px;border-radius:11px;border:2.5px solid transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:12px}
.cm-sw.sel{border-color:var(--ink,#1a2236);box-shadow:0 0 0 2px var(--surface,#fff) inset}
.cm-foot{display:flex;justify-content:flex-end;gap:10px;padding:0 26px 24px}
.cm-err{font-size:12.5px;color:#c9384a;font-weight:600;display:none}
.cm-err.show{display:block}
`;

let editKey = null;
let corSel = CORES[2].bg;

function el(html){ const d=document.createElement('div'); d.innerHTML=html.trim(); return d.firstChild; }

function respOptions(sel){
  return Object.entries(PEOPLE).map(([k,p])=>`<option value="${k}" ${k===sel?'selected':''}>${p.n}</option>`).join('');
}

function build(){
  if(document.getElementById('cmOverlay')) return;
  const st=document.createElement('style'); st.textContent=css; document.head.appendChild(st);
  const ov = el(`<div class="cm-overlay" id="cmOverlay" role="dialog" aria-modal="true" aria-labelledby="cmTitle">
    <div class="cm-modal">
      <div class="cm-head"><h2 id="cmTitle">Adicionar cliente</h2>
        <button class="cm-x" id="cmClose" aria-label="Fechar"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>
      </div>
      <div class="cm-body">
        <div class="cm-row">
          <div class="cm-f" style="grid-column:1/-1"><label for="cmName">Nome do cliente</label><input id="cmName" type="text" placeholder="Ex.: Outofdoors Travel" maxlength="48"></div>
        </div>
        <div class="cm-f"><label>Cor do avatar</label><div class="cm-swatches" id="cmSw"></div></div>
        <div class="cm-row3">
          <div class="cm-f"><label for="cmResp">Responsável</label><select id="cmResp"></select></div>
          <div class="cm-f"><label for="cmMeta">Meta mensal</label><input id="cmMeta" type="number" min="0" max="99" value="8"></div>
          <div class="cm-f"><label for="cmStatus">Status</label><select id="cmStatus"><option value="ativo">Ativo</option><option value="inativo">Inativo</option></select></div>
        </div>
        <div class="cm-row">
          <div class="cm-f"><label for="cmValor">Valor mensal (R$) — vazio = permuta</label><input id="cmValor" type="number" min="0" step="50" placeholder="Permuta"></div>
          <div class="cm-f"><label for="cmVenc">Dia do vencimento</label><input id="cmVenc" type="number" min="1" max="28" value="10"></div>
        </div>
        <div class="cm-f"><label for="cmRegras">Regras recorrentes (separe por vírgula)</label><input id="cmRegras" type="text" placeholder="Ex.: 2 posts/semana, 1 reels/mês"></div>
        <div class="cm-err" id="cmErr">Informe o nome do cliente.</div>
      </div>
      <div class="cm-foot">
        <button class="btn" id="cmCancel">Cancelar</button>
        <button class="btn btn-primary" id="cmSave">Salvar cliente</button>
      </div>
    </div>
  </div>`);
  document.body.appendChild(ov);

  const sw = ov.querySelector('#cmSw');
  sw.innerHTML = CORES.map((c,i)=>`<button type="button" class="cm-sw ${c.bg===corSel?'sel':''}" data-bg="${c.bg}" style="background:${c.bg}" aria-label="Cor ${c.id}"></button>`).join('');
  sw.addEventListener('click', e=>{
    const b = e.target.closest('.cm-sw'); if(!b) return;
    corSel = b.dataset.bg;
    sw.querySelectorAll('.cm-sw').forEach(x=>x.classList.toggle('sel', x===b));
  });
  ov.querySelector('#cmResp').innerHTML = respOptions('ana');

  ov.addEventListener('click', e=>{ if(e.target===ov) close(); });
  ov.querySelector('#cmClose').addEventListener('click', close);
  ov.querySelector('#cmCancel').addEventListener('click', close);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape' && ov.classList.contains('open')) close(); });
  ov.querySelector('#cmSave').addEventListener('click', save);
}

function initials(name){
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return ((parts[0]||'')[0]||'').toUpperCase() + ((parts[1]||'')[0]||'').toUpperCase() || 'C';
}
function slug(name){
  const base = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'').slice(0,14) || 'cliente';
  let k = base, i = 2;
  while (CLIENTS_INFO.some(c=>c.key===k)) k = base + (i++);
  return k;
}

function open(key){
  build();
  editKey = key || null;
  const ov = document.getElementById('cmOverlay');
  const c = key ? CLIENTS_INFO.find(x=>x.key===key) : null;
  ov.querySelector('#cmTitle').textContent = c ? 'Editar cliente' : 'Adicionar cliente';
  ov.querySelector('#cmSave').textContent  = c ? 'Salvar alterações' : 'Salvar cliente';
  ov.querySelector('#cmName').value   = c ? c.name : '';
  ov.querySelector('#cmResp').innerHTML = respOptions(c ? c.resp : 'ana');
  ov.querySelector('#cmMeta').value   = c ? c.meta : 8;
  ov.querySelector('#cmStatus').value = c ? c.status : 'ativo';
  ov.querySelector('#cmValor').value  = c && c.valor!=null ? c.valor : '';
  ov.querySelector('#cmVenc').value   = c ? c.venc : 10;
  ov.querySelector('#cmRegras').value = c ? c.regras.join(', ') : '';
  corSel = c ? c.bg : CORES[2].bg;
  ov.querySelectorAll('.cm-sw').forEach(x=>x.classList.toggle('sel', x.dataset.bg===corSel));
  ov.querySelector('#cmErr').classList.remove('show');
  ov.classList.add('open');
  setTimeout(()=>ov.querySelector('#cmName').focus(), 60);
}
function close(){ document.getElementById('cmOverlay')?.classList.remove('open'); }

function save(){
  const ov = document.getElementById('cmOverlay');
  const name = ov.querySelector('#cmName').value.trim();
  if(!name){ ov.querySelector('#cmErr').classList.add('show'); ov.querySelector('#cmName').focus(); return; }
  const valorRaw = ov.querySelector('#cmValor').value;
  const patch = {
    name,
    logo: initials(name),
    bg: corSel,
    resp: ov.querySelector('#cmResp').value,
    meta: Math.max(0, parseInt(ov.querySelector('#cmMeta').value,10) || 0),
    status: ov.querySelector('#cmStatus').value,
    valor: valorRaw === '' ? null : Math.max(0, parseFloat(valorRaw) || 0),
    venc: Math.min(28, Math.max(1, parseInt(ov.querySelector('#cmVenc').value,10) || 10)),
    regras: ov.querySelector('#cmRegras').value.split(',').map(s=>s.trim()).filter(Boolean),
  };

  if(editKey){
    const c = CLIENTS_INFO.find(x=>x.key===editKey);
    Object.assign(c, patch);
    CLIENTS[editKey].name = c.name; CLIENTS[editKey].logo = c.logo; CLIENTS[editKey].bg = c.bg;
    if (typeof agosSaveClients === 'function') agosSaveClients(s => { s.edits[editKey] = Object.assign(s.edits[editKey]||{}, patch); });
  } else {
    const key = slug(name);
    const novo = Object.assign({ key, obs:'', mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} }, patch);
    CLIENTS_INFO.push(novo);
    CLIENTS[key] = { name:novo.name, logo:novo.logo, bg:novo.bg };
    if (typeof agosSaveClients === 'function') agosSaveClients(s => { s.added.push(novo); });
  }
  close();
  if (typeof window.cmOnSaved === 'function') window.cmOnSaved(editKey, name);
}

window.ClientModal = { open };
})();
