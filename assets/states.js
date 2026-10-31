/* ============================================================
   STATES.JS — Estados compartilhados do Agência OS
   Skeleton · Empty · Error · NoPermission · Saving · Saved
   ============================================================
   Uso:
     AgenciaStates.skeleton(container, rows, cols)
     AgenciaStates.empty(container, { title, desc, action, onAction })
     AgenciaStates.error(container, { msg, onRetry })
     AgenciaStates.noPermission(container)
     AgenciaStates.saving(btnEl)
     AgenciaStates.saved(btnEl, label)
     AgenciaStates.resetBtn(btnEl, label)
   ============================================================ */

(function(global){
  const ICONS = {
    empty: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>`,
    error: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><path d="M12 9v4M12 17h.01"/></svg>`,
    noperm: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    offline: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M1 6s4-4 11-4 11 4 11 4"/><path d="M5 10s2.5-2.5 7-2.5 7 2.5 7 2.5"/><path d="M9 14s1-1 3-1 3 1 3 1"/><path d="M12 18h.01"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`,
    check: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>`,
    reload: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0 1 15-6.7L21 8"/><path d="M3 22v-6h6"/><path d="M21 12a9 9 0 0 1-15 6.7L3 16"/></svg>`,
  };

  /* ---------- SKELETON ---------- */
  function skeleton(container, rows=5, cols=4){
    if(!container) return;
    const lines = Array.from({length:rows}, (_,i)=>`
      <div class="sk-row" style="animation-delay:${i*80}ms">
        ${Array.from({length:cols}, (_,c)=>`
          <div class="sk-cell" style="width:${[30,50,20,15,10][c%5]||25}%;animation-delay:${(i*cols+c)*40}ms"></div>`).join('')}
      </div>`).join('');
    container.innerHTML = `<div class="sk-wrap">${lines}</div>`;
  }

  /* ---------- SKELETON CARD (para páginas card-based) ---------- */
  function skeletonCards(container, count=4){
    if(!container) return;
    const cards = Array.from({length:count}, (_,i)=>`
      <div class="sk-card" style="animation-delay:${i*100}ms">
        <div class="sk-card-head"><div class="sk-logo"></div><div class="sk-lines"><div class="sk-line w60"></div><div class="sk-line w35"></div></div></div>
        <div class="sk-line w90 mt12"></div>
        <div class="sk-tags"><div class="sk-tag"></div><div class="sk-tag"></div><div class="sk-tag"></div></div>
      </div>`).join('');
    container.innerHTML = `<div class="sk-cards-wrap">${cards}</div>`;
  }

  /* ---------- EMPTY ---------- */
  function empty(container, opts={}){
    if(!container) return;
    const { title='Nada por aqui', desc='Não há itens para exibir com os filtros aplicados.', action='', onAction=null, icon='empty' } = opts;
    container.innerHTML = `
      <div class="state-empty">
        <div class="state-ico">${ICONS[icon]||ICONS.empty}</div>
        <div class="state-title">${title}</div>
        <div class="state-desc">${desc}</div>
        ${action ? `<button class="state-btn" id="stateActionBtn">${action}</button>` : ''}
      </div>`;
    if(onAction){
      const btn = container.querySelector('#stateActionBtn');
      if(btn) btn.addEventListener('click', onAction);
    }
  }

  /* ---------- ERROR ---------- */
  function error(container, opts={}){
    if(!container) return;
    const { msg='Algo deu errado ao carregar os dados.', onRetry=null, details='' } = opts;
    container.innerHTML = `
      <div class="state-error">
        <div class="state-ico error">${ICONS.error}</div>
        <div class="state-title">Erro ao carregar</div>
        <div class="state-desc">${msg}${details ? `<br><small>${details}</small>` : ''}</div>
        ${onRetry ? `<button class="state-btn retry" id="stateRetryBtn">${ICONS.reload} Tentar novamente</button>` : ''}
      </div>`;
    if(onRetry){
      const btn = container.querySelector('#stateRetryBtn');
      if(btn) btn.addEventListener('click', onRetry);
    }
  }

  /* ---------- NO PERMISSION ---------- */
  function noPermission(container, opts={}){
    if(!container) return;
    const { msg='Você não tem permissão para acessar este conteúdo.' } = opts;
    container.innerHTML = `
      <div class="state-noperm">
        <div class="state-ico noperm">${ICONS.noperm}</div>
        <div class="state-title">Acesso restrito</div>
        <div class="state-desc">${msg}</div>
      </div>`;
  }

  /* ---------- OFFLINE ---------- */
  function offline(container){
    if(!container) return;
    container.innerHTML = `
      <div class="state-offline">
        <div class="state-ico offline">${ICONS.offline}</div>
        <div class="state-title">Sem conexão</div>
        <div class="state-desc">Verifique sua internet e tente novamente.</div>
        <button class="state-btn retry" onclick="location.reload()">${ICONS.reload} Tentar novamente</button>
      </div>`;
  }

  /* ---------- SAVING / SAVED (button states) ---------- */
  function saving(btnEl, label='Salvando…'){
    if(!btnEl) return;
    btnEl._origHTML = btnEl.innerHTML;
    btnEl.innerHTML = `<span class="btn-spin"></span>${label}`;
    btnEl.disabled = true;
    btnEl.classList.add('is-saving');
  }
  function saved(btnEl, label='Salvo'){
    if(!btnEl) return;
    btnEl.innerHTML = `${ICONS.check}${label}`;
    btnEl.disabled = false;
    btnEl.classList.remove('is-saving');
    btnEl.classList.add('is-saved');
  }
  function resetBtn(btnEl, label){
    if(!btnEl) return;
    btnEl.innerHTML = label || btnEl._origHTML || 'Salvar';
    btnEl.disabled = false;
    btnEl.classList.remove('is-saving','is-saved');
  }

  /* ---------- TOAST (standalone) ---------- */
  function toast(msg, type='success', duration=2200){
    let t = document.getElementById('__ag_toast');
    if(!t){
      t = document.createElement('div');
      t.id = '__ag_toast';
      t.className = 'ag-toast';
      document.body.appendChild(t);
    }
    t.innerHTML = `<span class="ag-toast-ico">${type==='error'?ICONS.error:ICONS.check}</span><span>${msg}</span>`;
    t.className = `ag-toast ${type} show`;
    clearTimeout(t._timer);
    t._timer = setTimeout(()=>{ t.classList.remove('show'); }, duration);
  }

  global.AgenciaStates = { skeleton, skeletonCards, empty, error, noPermission, offline, saving, saved, resetBtn, toast };
})(window);
