/* ============================================================
   NOVA-DEMANDA.JS — Modal de criação de entrega
   Agência OS · conectar via <script src="assets/nova-demanda.js">
   ============================================================
   Uso:
   1. Incluir <script src="assets/data.js"> antes deste script
   2. Incluir <script src="assets/nova-demanda.js"> após
   3. Chamar NovaDemanda.open() no click do botão "Nova Demanda"
   ============================================================ */

(function(global){

const HTML = `
<div id="nd-backdrop" style="position:fixed;inset:0;background:rgba(9,13,24,.55);z-index:200;display:none;align-items:flex-end;justify-content:center;padding:0 0 0 0;" onclick="NovaDemanda.close(event)">
<div id="nd-modal" onclick="event.stopPropagation()" style="
  background:#fff;border-radius:24px 24px 0 0;width:100%;max-width:580px;
  max-height:92vh;overflow-y:auto;box-shadow:0 -8px 48px rgba(15,23,41,.22);
  font-family:inherit;display:flex;flex-direction:column;
  @media (min-width:600px){border-radius:24px;margin:auto;}
">
  <div style="display:flex;align-items:center;justify-content:space-between;padding:22px 24px 0;flex-shrink:0;">
    <div>
      <div style="font-size:20px;font-weight:800;color:#1a2236;letter-spacing:-.3px">Nova Demanda</div>
      <div style="font-size:13.5px;color:#818b9e;font-weight:600;margin-top:3px">Preencha os campos obrigatórios para registrar a entrega.</div>
    </div>
    <button onclick="NovaDemanda.close()" style="width:38px;height:38px;border-radius:11px;border:1px solid #e9ebf2;background:#f5f6fb;cursor:pointer;display:grid;place-items:center;color:#4a546a;flex-shrink:0;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>
  </div>
  <form id="nd-form" novalidate style="padding:20px 24px 24px;display:flex;flex-direction:column;gap:16px;overflow-y:auto;">

    <!-- ROW: Cliente + Responsável -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div>
        <label class="nd-label">Cliente <span class="nd-req">*</span></label>
        <div class="nd-sel-wrap">
          <select id="nd-client" class="nd-sel" required>
            <option value="">Selecionar…</option>
            <option value="bells">Bells</option>
            <option value="brasa">Brasa Meat</option>
            <option value="casa">Casa de Pedra</option>
            <option value="igreja">Igreja</option>
            <option value="lcs">LCS</option>
            <option value="trinitas">Trinitas</option>
            <option value="unique">Unique</option>
            <option value="outdoors">Outofdoors Travel</option>
            <option value="vinicius">Vinicius Cortazio</option>
          </select>
        </div>
        <div class="nd-err" id="err-client">Selecione um cliente</div>
      </div>
      <div>
        <label class="nd-label">Responsável <span class="nd-req">*</span></label>
        <div class="nd-sel-wrap">
          <select id="nd-resp" class="nd-sel" required>
            <option value="">Selecionar…</option>
            <option value="ana">Ana</option>
            <option value="nicole">Nicole</option>
          </select>
        </div>
        <div class="nd-err" id="err-resp">Selecione o responsável</div>
      </div>
    </div>

    <!-- Título -->
    <div>
      <label class="nd-label">Título / descrição curta <span class="nd-req">*</span></label>
      <input id="nd-title" type="text" class="nd-input" placeholder="Ex: Post 01 — Promoção de Verão" maxlength="200" required />
      <div class="nd-err" id="err-title">Título obrigatório</div>
    </div>

    <!-- ROW: Tipo + Status -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div>
        <label class="nd-label">Tipo de conteúdo <span class="nd-req">*</span></label>
        <div class="nd-sel-wrap">
          <select id="nd-tipo" class="nd-sel" required>
            <option value="">Selecionar…</option>
            <option value="estatico">Estático</option>
            <option value="carrossel">Carrossel</option>
            <option value="reels">Reels</option>
            <option value="story">Story</option>
            <option value="yt">YouTube</option>
            <option value="short">Short</option>
            <option value="news">News</option>
            <option value="demanda">Sob demanda</option>
          </select>
        </div>
        <div class="nd-err" id="err-tipo">Selecione o tipo</div>
      </div>
      <div>
        <label class="nd-label">Status inicial <span class="nd-req">*</span></label>
        <div class="nd-sel-wrap">
          <select id="nd-status" class="nd-sel" required>
            <option value="briefing" selected>Briefing</option>
            <option value="producao">Produção</option>
            <option value="aprovacao">Aprovação</option>
            <option value="correcao">Correção</option>
            <option value="agendado">Agendado</option>
            <option value="publicado">Publicado</option>
          </select>
        </div>
      </div>
    </div>

    <!-- ROW: Prioridade -->
    <div>
      <label class="nd-label">Prioridade <span class="nd-req">*</span></label>
      <div style="display:flex;gap:8px;flex-wrap:wrap;" id="nd-prio-group">
        <label class="nd-radio"><input type="radio" name="prio" value="hoje"><span>🔥 Hoje</span></label>
        <label class="nd-radio"><input type="radio" name="prio" value="semana" checked><span>📅 Semana</span></label>
        <label class="nd-radio"><input type="radio" name="prio" value="calmo"><span>✓ Sem urgência</span></label>
      </div>
    </div>

    <!-- ROW: Prazo interno + Data publicação -->
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
      <div>
        <label class="nd-label">Prazo interno <span style="color:#818b9e;font-weight:600;font-size:12px">(recomendado)</span></label>
        <input id="nd-prazo" type="date" class="nd-input" />
      </div>
      <div>
        <label class="nd-label">Data de publicação <span style="color:#818b9e;font-weight:600;font-size:12px">(opcional)</span></label>
        <input id="nd-pub" type="date" class="nd-input" />
      </div>
    </div>

    <!-- Link arquivo -->
    <div>
      <label class="nd-label">Link do arquivo (opcional)</label>
      <input id="nd-link" type="url" class="nd-input" placeholder="https://drive.google.com/…" />
    </div>

    <!-- Observação -->
    <div>
      <label class="nd-label">Observação (opcional)</label>
      <textarea id="nd-obs" class="nd-input nd-textarea" placeholder="Informações adicionais para a equipe…" rows="3"></textarea>
    </div>

    <!-- Feedback area -->
    <div id="nd-feedback" style="display:none;"></div>

  </form>

  <!-- Footer fixo -->
  <div style="display:flex;align-items:center;gap:10px;padding:0 24px 22px;flex-shrink:0;border-top:1px solid #e9ebf2;padding-top:16px;margin-top:-4px;">
    <button type="button" onclick="NovaDemanda.close()" style="flex:1;border:1px solid #e9ebf2;background:#f5f6fb;color:#4a546a;font-family:inherit;font-size:14px;font-weight:700;padding:13px;border-radius:12px;cursor:pointer;">Cancelar</button>
    <button type="button" id="nd-submit" onclick="NovaDemanda.submit()" style="flex:2;border:none;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;font-family:inherit;font-size:14.5px;font-weight:800;padding:13px;border-radius:12px;cursor:pointer;box-shadow:0 8px 22px rgba(99,102,241,.3);display:flex;align-items:center;justify-content:center;gap:9px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>
      <span id="nd-submit-txt">Criar demanda</span>
    </button>
  </div>
</div>
</div>`;

const CSS = `<style id="nd-styles">
.nd-label { display:block; font-size:13px; font-weight:700; color:#4a546a; margin-bottom:6px; letter-spacing:.1px; }
.nd-req { color:#e0453f; }
.nd-input {
  width:100%; border:1.5px solid #e9ebf2; background:#fff; border-radius:11px;
  padding:11px 13px; font-family:inherit; font-size:14px; font-weight:500; color:#1a2236;
  outline:none; transition:border-color .15s,box-shadow .15s; -webkit-appearance:none;
}
.nd-input:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,.1); }
.nd-input.nd-invalid { border-color:#e0453f; box-shadow:0 0 0 4px rgba(224,69,63,.08); }
.nd-textarea { resize:vertical; min-height:80px; }
.nd-sel-wrap { position:relative; }
.nd-sel { width:100%; border:1.5px solid #e9ebf2; background:#fff; border-radius:11px; padding:11px 32px 11px 13px; font-family:inherit; font-size:14px; font-weight:600; color:#1a2236; -webkit-appearance:none; outline:none; cursor:pointer; }
.nd-sel:focus { border-color:#6366f1; box-shadow:0 0 0 4px rgba(99,102,241,.1); }
.nd-sel-wrap::after { content:''; position:absolute; right:13px; top:50%; width:7px; height:7px; border-right:2px solid #818b9e; border-bottom:2px solid #818b9e; transform:translateY(-65%) rotate(45deg); pointer-events:none; }
.nd-err { display:none; font-size:12px; font-weight:700; color:#e0453f; margin-top:5px; }
.nd-err.show { display:block; }
.nd-radio { display:inline-flex; align-items:center; gap:8px; padding:9px 14px; border:1.5px solid #e9ebf2; border-radius:10px; cursor:pointer; font-size:13.5px; font-weight:700; color:#4a546a; background:#fff; transition:border-color .12s,background .12s; }
.nd-radio:hover { border-color:#6366f1; background:#f5f5ff; }
.nd-radio input { position:absolute; opacity:0; width:0; height:0; }
.nd-radio.checked { border-color:#6366f1; background:#f0f0ff; color:#6366f1; }
.nd-spin { width:18px; height:18px; border:2.5px solid rgba(255,255,255,.3); border-top-color:#fff; border-radius:50%; animation:nd-spin .7s linear infinite; }
@keyframes nd-spin { to { transform:rotate(360deg); } }
.nd-success { display:flex; align-items:center; gap:10px; background:#e6f7ee; border:1px solid #c3e8d0; border-radius:12px; padding:14px 16px; font-size:14px; font-weight:700; color:#146c43; }
.nd-error-msg { display:flex; align-items:center; gap:10px; background:#fdebea; border:1px solid #f7d4d2; border-radius:12px; padding:14px 16px; font-size:14px; font-weight:700; color:#e0453f; }
@media (max-width:600px) {
  #nd-modal { border-radius:24px 24px 0 0!important; max-width:100%!important; }
}
</style>`;

let mounted = false;

function mount(){
  if(mounted) return;
  document.head.insertAdjacentHTML('beforeend', CSS);
  document.body.insertAdjacentHTML('beforeend', HTML);
  mounted = true;
  // radio group interactivity
  document.querySelectorAll('.nd-radio').forEach(lbl=>{
    lbl.addEventListener('click', ()=>{
      document.querySelectorAll('.nd-radio').forEach(l=>l.classList.remove('checked'));
      lbl.classList.add('checked');
    });
  });
  // default select "Semana"
  document.querySelector('.nd-radio input[value="semana"]')?.closest('.nd-radio')?.classList.add('checked');
}

function open(){
  mount();
  const bd = document.getElementById('nd-backdrop');
  bd.style.display = 'flex';
  setTimeout(()=>{
    const modal = document.getElementById('nd-modal');
    modal.style.transform = 'translateY(0)';
    modal.style.opacity = '1';
    document.getElementById('nd-title').focus();
  }, 10);
}

function close(e){
  if(e && e.target !== document.getElementById('nd-backdrop')) return;
  const bd = document.getElementById('nd-backdrop');
  if(bd) bd.style.display = 'none';
  reset();
}

function reset(){
  const form = document.getElementById('nd-form');
  if(!form) return;
  form.reset();
  document.querySelectorAll('.nd-err').forEach(e=>e.classList.remove('show'));
  document.querySelectorAll('.nd-input,.nd-sel').forEach(e=>e.classList.remove('nd-invalid'));
  document.getElementById('nd-feedback').style.display = 'none';
  const btn = document.getElementById('nd-submit');
  if(btn){ btn.disabled=false; document.getElementById('nd-submit-txt').textContent='Criar demanda'; btn.querySelector('.nd-spin')?.remove(); }
  document.querySelectorAll('.nd-radio').forEach(l=>l.classList.remove('checked'));
  document.querySelector('.nd-radio input[value="semana"]')?.closest('.nd-radio')?.classList.add('checked');
}

function validate(){
  let ok = true;
  const req = [{id:'nd-client',err:'err-client'},{id:'nd-resp',err:'err-resp'},{id:'nd-title',err:'err-title'},{id:'nd-tipo',err:'err-tipo'}];
  req.forEach(({id,err})=>{
    const el = document.getElementById(id);
    const errEl = document.getElementById(err);
    if(!el.value.trim()){
      el.classList.add('nd-invalid');
      if(errEl) errEl.classList.add('show');
      ok = false;
    } else {
      el.classList.remove('nd-invalid');
      if(errEl) errEl.classList.remove('show');
    }
  });
  return ok;
}

function submit(){
  if(!validate()) return;

  const btn = document.getElementById('nd-submit');
  const txt = document.getElementById('nd-submit-txt');
  btn.disabled = true;
  txt.textContent = 'Salvando…';
  const spin = document.createElement('span');
  spin.className = 'nd-spin';
  btn.insertBefore(spin, btn.querySelector('svg'));

  // Build payload (ready for Supabase insert)
  const priEl = document.querySelector('.nd-radio.checked input');
  const payload = {
    client_id:      document.getElementById('nd-client').value,
    responsible_id: document.getElementById('nd-resp').value,
    title:          document.getElementById('nd-title').value.trim(),
    type:           document.getElementById('nd-tipo').value,
    status:         document.getElementById('nd-status').value,
    priority:       priEl ? priEl.value : 'semana',
    internal_deadline: document.getElementById('nd-prazo').value || null,
    publish_date:   document.getElementById('nd-pub').value || null,
    drive_link:     document.getElementById('nd-link').value.trim() || null,
    note:           document.getElementById('nd-obs').value.trim() || null,
    created_at:     new Date().toISOString(),
  };

  console.log('[NovaDemanda] Payload para Supabase:', payload);

  // Simulate async save (replace with: await supabase.from('deliverables').insert(payload))
  setTimeout(()=>{
    spin.remove();
    const feedback = document.getElementById('nd-feedback');
    feedback.style.display = 'block';
    feedback.innerHTML = `<div class="nd-success">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>
      Demanda criada com sucesso! <b>${payload.title}</b>
    </div>`;
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg> Criado!`;
    btn.style.background = 'linear-gradient(135deg,#16a45f,#1db870)';
    btn.style.boxShadow = '0 8px 22px rgba(22,164,95,.3)';

    // Auto-close after 1.8s
    setTimeout(()=>{
      document.getElementById('nd-backdrop').style.display = 'none';
      reset();
      btn.style.background = '';
      btn.style.boxShadow = '';
      // Optional: refresh table / list
      if(typeof renderTable === 'function') renderTable();
      if(typeof AgenciaStates !== 'undefined') AgenciaStates.toast('Demanda criada com sucesso!');
    }, 1800);
  }, 1200);
}

global.NovaDemanda = { open, close, submit, reset };

// Auto-wire all "Nova Demanda" buttons after DOM loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', wireButtons);
} else {
  wireButtons();
}
function wireButtons(){
  document.querySelectorAll('button, .btn').forEach(btn => {
    if(btn.textContent.trim().includes('Nova Demanda') && !btn.dataset.ndWired){
      btn.dataset.ndWired = '1';
      btn.addEventListener('click', () => NovaDemanda.open());
    }
  });
}
})(window);
