/* ============================================================
   ADMIN / CONFIGURAÇÕES — centro de controle e escalabilidade
   Consome assets/data.js para estrutura (clientes/tipos/status…)
   ============================================================ */
const $ = s => document.querySelector(s);
let toastT;
function toast(msg){ const t=$('#toast'); $('#toast-msg').textContent=msg; t.classList.add('show'); clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove('show'),2000); }

/* ---------- dados de configuração ---------- */
const MODULES = {
  on: [
    ['Dashboard','Visão geral da operação'], ['Hoje','Foco do dia'], ['Produção','Base operacional'],
    ['Ana','Área individual'], ['Nicole','Área individual'], ['Financeiro','Cobranças e receita'],
    ['Clientes','Cadastro operacional'], ['Arquivos / Drive','Central de links'], ['Aprovações','Fila com SLA'],
    ['Calendário','Entregas por data'], ['Calendário Sazonal','Datas e campanhas'], ['Admin / Configurações','Centro de controle'],
  ],
  off: [
    ['Telegram','Notificações no Telegram'], ['Metas','Metas por responsável'],
    ['Métricas','Desempenho das publicações'], ['Teste A/B','Teste de criativos e conteúdo'],
  ],
  blocked: [
    ['Biblioteca','Acervo de criativos'], ['CRM','Funil e relacionamento'], ['Portal Cliente','Acesso externo do cliente'],
    ['Relatórios Avançados','BI e exportações'], ['Financeiro Avançado','DRE, fluxo de caixa, comissões'], ['Publicações Automáticas','Agendamento e posting automático'],
  ],
};
const FLAGS = [
  ['edicao_inline','Edição rápida de status', true],
  ['kanban_drag','Arrastar no Kanban', true],
  ['tweaks','Tweaks visuais por tela', true],
  ['export_pdf','Exportar relatórios em PDF', false],
  ['dark_mode','Modo escuro', false],
];
const ALERTS = [
  ['atraso','Entrega atrasada', true],
  ['aprov_parada','Aprovação parada (+48h)', true],
  ['venc_fin','Vencimento financeiro', true],
  ['sla_critico','SLA crítico (+72h)', true],
  ['resumo','Resumo diário', false],
];
const AUTOS = [
  ['lembrete','Lembrete de prazo', 'on'],
  ['recap','Resumo diário por e-mail', 'off'],
  ['posting','Publicação automática', 'blocked'],
];
const MENU = ['Dashboard','Hoje','Produção','Calendário','Clientes','Metas','Financeiro','Aprovações','Arquivos','Relatórios','Configurações'];
const MENU_OFF = ['Metas','Relatórios']; // itens existentes porém ocultos
const USERS = [
  { n:'Você', role:'Owner / Admin', email:'admin@connect.com', av:'CC', bg:'var(--grad)', perms:{aprovar:true,financeiro:true,clientes:true,admin:true} },
  { n:'Ana Souza', role:'Gestora de Conteúdo', email:'ana@connect.com', av:'A', bg:'var(--tile-orange)', perms:{aprovar:true,financeiro:true,clientes:true,admin:false} },
  { n:'Nicole', role:'Audiovisual', email:'nicole@connect.com', av:'N', bg:'var(--tile-blue)', perms:{aprovar:false,financeiro:false,clientes:true,admin:false} },
];

/* ---------- helpers ---------- */
function tgl(id, on, locked){
  if (locked) return `<span class="lockpill"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Preview</span>`;
  return `<button class="sw ${on?'on':''}" data-tgl="${id}" role="switch" aria-checked="${on}"><span class="kn"></span></button>`;
}
function statePill(s){
  if (s==='on') return '<span class="stp on">ON</span>';
  if (s==='off') return '<span class="stp off">OFF</span>';
  return '<span class="stp lk">BLOQUEADO</span>';
}

/* ---------- metadados de módulos OFF / BLOQUEADO ---------- */
const POSTING_MSG = 'Este módulo será ativado em uma fase futura. Ele permitirá agendamento e publicação automática em redes sociais com validação, logs e controle de erros.';
const MODULE_META = {
  // ---- OFF ----
  'Telegram': { state:'off', preview:'chat',
    desc:'Envia avisos da operação (prazos, aprovações, atrasos) direto no Telegram da equipe.',
    deps:[['Bot do Telegram (token)',false],['Permissão de envio ao grupo',false],['Webhook configurado',false]] },
  'Metas': { state:'off', preview:'goals',
    desc:'Metas mensais por responsável e por cliente, com acompanhamento de ritmo.',
    deps:[['Histórico de entregas',true],['Definição de metas por responsável',false]] },
  'Métricas': { state:'off', preview:'chart',
    desc:'Desempenho das publicações: alcance, engajamento e crescimento por cliente.',
    deps:[['Conexão com Instagram Insights',false],['Conexão com YouTube Analytics',false]] },
  'Teste A/B': { state:'off', preview:'ab',
    desc:'Compara variações de criativo e copy para descobrir o que performa melhor.',
    deps:[['Módulo Métricas ativo',false],['Volume mínimo de publicações',true]] },
  // ---- BLOQUEADO ----
  'Biblioteca': { state:'blocked', preview:'grid', future:'Disponível em uma fase futura.',
    desc:'Acervo central de criativos aprovados, pesquisável e reutilizável por toda a equipe.',
    deps:[['Arquivos / Drive (ON)',true],['Indexação de criativos',false]] },
  'CRM': { state:'blocked', preview:'pipeline', future:'Disponível em uma fase futura.',
    desc:'Funil comercial e relacionamento com leads e clientes da agência.',
    deps:[['Cadastro de clientes (ON)',true],['Pipeline comercial',false],['Integração de e-mail',false]] },
  'Portal Cliente': { state:'blocked', preview:'portal', future:'Disponível em uma fase futura.',
    desc:'Acesso externo para o cliente acompanhar e aprovar entregas com a marca da agência.',
    deps:[['Aprovações (ON)',true],['Autenticação externa',false],['Permissões por cliente',false]] },
  'Relatórios Avançados': { state:'blocked', preview:'report', future:'Disponível em uma fase futura.',
    desc:'BI da operação: dashboards customizáveis e exportações para clientes e gestão.',
    deps:[['Módulo Métricas',false],['Motor de BI',false],['Exportação PDF / Excel',false]] },
  'Financeiro Avançado': { state:'blocked', preview:'report', future:'Disponível em uma fase futura.',
    desc:'DRE, fluxo de caixa, conciliação bancária e comissões da equipe.',
    deps:[['Financeiro (ON)',true],['Conciliação bancária',false],['Regras de comissão',false]] },
  'Publicações Automáticas': { state:'blocked', preview:'schedule', sensitive:true, future:POSTING_MSG,
    desc:'Agendamento e publicação automática nas redes sociais — módulo sensível, ativado só com segurança completa.',
    deps:[['Tokens das redes sociais',false],['Permissões das plataformas',false],['Logs de publicação',false],['Validação humana',false],['Controle de erro',false],['Confirmação antes de publicar',false],['Segurança e criptografia',false]] },
};

/* ---------- previews visuais (skeletons premium) ---------- */
function previewBlock(type, locked){
  const P = {
    chat: `<div class="pv-chat"><div class="bub in">Post 03 aprovado ✓</div><div class="bub in">⏰ Reels vence hoje</div><div class="bub out">Recebido!</div></div>`,
    goals: `<div class="pv-goals"><div class="pg"><span>Ana</span><div class="pgbar"><i style="width:76%"></i></div><b>76%</b></div><div class="pg"><span>Nicole</span><div class="pgbar"><i style="width:62%"></i></div><b>62%</b></div></div>`,
    chart: `<div class="pv-chart">${[40,68,52,80,60,90,72].map(h=>`<span style="height:${h}%"></span>`).join('')}</div>`,
    ab: `<div class="pv-ab"><div class="abc a"><b>A</b><div class="abl"></div><div class="abl sm"></div><span class="abp">+18%</span></div><div class="abc b"><b>B</b><div class="abl"></div><div class="abl sm"></div><span class="abp lo">+11%</span></div></div>`,
    grid: `<div class="pv-grid">${Array(8).fill(0).map(()=>'<span></span>').join('')}</div>`,
    pipeline: `<div class="pv-pipe">${['Lead','Proposta','Fechado'].map(c=>`<div class="ppc"><small>${c}</small><i></i><i></i></div>`).join('')}</div>`,
    portal: `<div class="pv-portal"><div class="ppt-h"><span class="ppt-logo">CC</span><div class="ppt-bars"><i></i><i class="sm"></i></div></div><div class="ppt-card"></div><div class="ppt-card"></div></div>`,
    report: `<div class="pv-report"><div class="rp-chart">${[50,72,60,85].map(h=>`<span style="height:${h}%"></span>`).join('')}</div><div class="rp-rows"><i></i><i></i><i></i></div></div>`,
    schedule: `<div class="pv-sched">${['09:00','12:30','18:00'].map(t=>`<div class="scr"><b>${t}</b><div class="scl"></div><span class="scd"></span></div>`).join('')}</div>`,
  };
  return `<div class="preview ${locked?'locked':''}">${P[type]||''}${locked?'<div class="pv-lock"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Preview · fase futura</div>':''}</div>`;
}

/* ---------- drawer de detalhe do módulo ---------- */
function openModule(name){
  const m = MODULE_META[name]; if(!m) return;
  const initial = name.replace('/','').trim().slice(0,2).toUpperCase();
  const isOff = m.state==='off';
  const depsDone = m.deps.filter(d=>d[1]).length;
  $('#mdTitle').textContent = name;
  $('#mdBody').innerHTML = `
    <div class="md-hero ${m.state}">
      <span class="md-ic">${initial}</span>
      <div><div class="md-name">${name}</div><div class="md-state">${statePill(m.state)}${m.sensitive?'<span class="sens"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>Módulo sensível</span>':''}</div></div>
    </div>
    <p class="md-desc">${m.desc}</p>
    ${m.future ? `<div class="md-future ${m.sensitive?'sens':''}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg><span>${m.future}</span></div>` : ''}
    <div class="md-sec">Preview</div>
    ${previewBlock(m.preview, !isOff)}
    <div class="md-sec">Dependências necessárias <span class="md-depcount">${depsDone}/${m.deps.length} prontas</span></div>
    <div class="md-deps">${m.deps.map(([l,ok])=>`<div class="dep ${ok?'ok':'pending'}">
      <span class="dep-ic">${ok
        ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="m20 6-11 11-5-5"/></svg>'
        : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 8v4M12 16h.01"/></svg>'}</span>
      <span class="dep-l">${l}</span>
      <span class="dep-t">${ok?'Pronta':'Pendente'}</span></div>`).join('')}</div>
    <div class="md-foot">
      ${isOff
        ? `<button class="btn-act" data-activate="${name}" ${depsDone<m.deps.length?'disabled':''}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>${depsDone<m.deps.length?'Resolva as dependências para ativar':'Ativar módulo'}</button>
           <button class="btn-cfg" data-toast="Abrindo configuração de ${name}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>Configurar</button>`
        : `<div class="md-locked"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>Sem ativação direta — entra pelo Roadmap quando as dependências estiverem prontas.</div>`}
    </div>`;
  $('#modDrawer').classList.add('open'); $('#modScrim').classList.add('show');
}
window.closeModDrawer = ()=>{ $('#modDrawer').classList.remove('open'); $('#modScrim').classList.remove('show'); };

/* ---------- panels ---------- */
function moduleCard([name,desc], state){
  const initial = name.replace('/','').trim().slice(0,2).toUpperCase();
  const opener = state!=='on' ? ` data-modopen="${name}"` : '';
  const cue = state==='off' ? '<span class="mod-cue">Detalhes →</span>' : state==='blocked' ? '<span class="mod-cue">Preview →</span>' : '';
  return `<div class="mod ${state}"${opener}>
    <div class="mod-ic">${initial}</div>
    <div class="mod-main"><b>${name}</b><small>${desc}</small>${cue}</div>
    ${statePill(state)}
    ${tgl('mod:'+name, state==='on', state==='blocked')}
  </div>`;
}

function panelModulos(){
  return `
  <div class="mod-summary">
    <div class="ms"><b id="msOn">${MODULES.on.length}</b><span>Ativos</span></div>
    <div class="ms"><b id="msOff">${MODULES.off.length}</b><span>Desligados</span></div>
    <div class="ms"><b>${MODULES.blocked.length}</b><span>Bloqueados (futuro)</span></div>
  </div>
  <div class="sub-h">Ativos <span class="hint">ON — visível e utilizável</span></div>
  <div class="mod-grid">${MODULES.on.map(m=>moduleCard(m,'on')).join('')}</div>
  <div class="sub-h">Desligados <span class="hint">OFF — existe, pode ser ativado</span></div>
  <div class="mod-grid">${MODULES.off.map(m=>moduleCard(m,'off')).join('')}</div>
  <div class="sub-h">Bloqueados <span class="hint">Futuro — desenhado como preview, sem ativação agora</span></div>
  <div class="mod-grid">${MODULES.blocked.map(m=>moduleCard(m,'blocked')).join('')}</div>

  <div class="sub-h" style="margin-top:30px">Feature flags</div>
  <div class="card-list">${FLAGS.map(([id,l,on])=>`<div class="row"><div class="row-main"><b>${l}</b></div>${tgl('flag:'+id,on,false)}</div>`).join('')}</div>`;
}

function panelUsuarios(){
  return `
  <div class="sub-h">Usuários <button class="mini-add" data-toast="Convidar novo usuário">+ Convidar</button></div>
  <div class="users">${USERS.map(u=>`
    <div class="user">
      <span class="u-av" style="background:${u.bg}">${u.av}</span>
      <div class="u-main"><b>${u.n}</b><small>${u.email}</small></div>
      <span class="u-role">${u.role}</span>
      <div class="u-perms">
        ${['aprovar','financeiro','clientes','admin'].map(p=>`
          <label class="perm"><span>${({aprovar:'Aprovar',financeiro:'Financeiro',clientes:'Clientes',admin:'Admin'})[p]}</span>${tgl('perm:'+u.n+':'+p, u.perms[p], false)}</label>`).join('')}
      </div>
    </div>`).join('')}</div>
  <div class="note">Permissões controlam o acesso por usuário (ON/OFF por usuário). Papéis adicionais e SSO entram na <b>Fase 3</b>.</div>`;
}

function chipList(title, items){
  return `<div class="struct-card">
    <div class="sc-h">${title}<button class="mini-add" data-toast="Adicionar em ${title}">+ Novo</button></div>
    <div class="chips">${items}</div>
  </div>`;
}
function panelEstrutura(){
  const tipos = Object.values(TYPES).map(t=>`<span class="chip">${t.l}</span>`).join('');
  const status = STATUS_ORDER.map(k=>`<span class="chip"><span class="cdot ${STATUS[k].cls}"></span>${STATUS[k].l}</span>`).join('');
  const prio = Object.values(PRIO).map(p=>`<span class="chip ${p.cls}">${p.l}</span>`).join('');
  const resp = Object.values(PEOPLE).map(p=>`<span class="chip"><span class="u-av sm" style="background:${p.bg}">${p.av}</span>${p.n} · ${p.role}</span>`).join('');
  const cli = CLIENTS_INFO.map(c=>`<span class="chip"><span class="u-av sm" style="background:${c.bg}">${c.logo}</span>${c.name}<span class="cstat ${c.status}">${c.status==='ativo'?'ON':'OFF'}</span></span>`).join('');
  return `
    ${chipList('Tipos de conteúdo', tipos)}
    ${chipList('Status', status)}
    ${chipList('Prioridades', prio)}
    ${chipList('Responsáveis', resp)}
    ${chipList('Clientes &amp; módulos por cliente', cli)}
    <div class="note">Regras recorrentes e módulos por cliente são geridos em cada ficha. <a href="Clientes.html">Abrir Clientes →</a></div>`;
}

function panelIntegracoes(){
  return `
  <div class="sub-h">Alertas <span class="hint">ON/OFF por alerta</span></div>
  <div class="card-list">${ALERTS.map(([id,l,on])=>`<div class="row"><div class="row-main"><b>${l}</b></div>${tgl('alert:'+id,on,false)}</div>`).join('')}</div>
  <div class="sub-h">Automações <span class="hint">ON/OFF por automação</span></div>
  <div class="card-list">${AUTOS.map(([id,l,st])=>`<div class="row"><div class="row-main"><b>${l}</b>${st==='blocked'?'<small>Disponível na Fase 3</small>':''}</div>${st==='blocked'?statePill('blocked'):''}${tgl('auto:'+id, st==='on', st==='blocked')}</div>`).join('')}</div>
  <div class="sub-h">Itens do menu <span class="hint">ON/OFF por menu</span></div>
  <div class="card-list">${MENU.map(m=>`<div class="row"><div class="row-main"><b>${m}</b></div>${tgl('menu:'+m, !MENU_OFF.includes(m), false)}</div>`).join('')}</div>
  <div class="sub-h">Dados &amp; integrações</div>
  <div class="card-list">
    <div class="row"><div class="row-main"><b>Financeiro</b><small>Cobranças e receita</small></div><span class="stp on">ON</span>${tgl('int:fin',true,false)}</div>
    <div class="row"><div class="row-main"><b>Links do Google Drive</b><small>Central de arquivos</small></div><span class="stp on">ON</span>${tgl('int:drive',true,false)}</div>
    <div class="row"><div class="row-main"><b>Telegram</b><small>Notificações da equipe</small></div><span class="stp off">OFF</span>${tgl('int:tg',false,false)}</div>
  </div>`;
}

function panelRoadmap(){
  const phase = (cls,tag,title,desc,items)=>`
    <div class="phase ${cls}">
      <div class="ph-dot"></div>
      <div class="ph-body">
        <div class="ph-h"><b>${title}</b><span class="ph-tag ${cls}">${tag}</span></div>
        <p>${desc}</p>
        <div class="chips">${items.map(i=>`<span class="chip">${i}</span>`).join('')}</div>
      </div>
    </div>`;
  return `<div class="timeline">
    ${phase('done','Concluída','Fase 1 — Operação','Tudo que está ON hoje: o núcleo operacional da agência.', MODULES.on.map(m=>m[0]))}
    ${phase('next','Parte 2 (desligada)','Parte 2 — Crescimento','Módulos prontos para ligar quando a agência precisar. É só ativar.', MODULES.off.map(m=>m[0]))}
    ${phase('future','Fase 3','Fase 3 — Escala','Desenhados como preview, sem ativação agora. Crescem sem redesenhar o sistema.', MODULES.blocked.map(m=>m[0]))}
  </div>`;
}

function panelSistema(){
  const logs = [
    ['Ana','aprovou “Post 03 — Promoção Chopp”','Hoje · 09:42','st-green'],
    ['Você','ativou o módulo Calendário Sazonal','Hoje · 08:10','st-blue'],
    ['Nicole','marcou “Reels Institucional” como Correção','Ontem · 17:25','st-coral'],
    ['Sistema','backup automático concluído','Ontem · 03:00','st-gray'],
    ['Ana','editou o cadastro de Casa de Pedra','22/05 · 14:03','st-violet'],
  ];
  return `
  <div class="sys-grid">
    <div class="sys-card">
      <div class="sc-ic" style="background:var(--tile-green)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.8 1 6.4 2.6"/><path d="M21 3v6h-6"/></svg></div>
      <b>Backups</b><small>Último: hoje 03:00 · diário automático</small>
      <button class="btn-sec" data-toast="Backup iniciado">Fazer backup agora</button>
    </div>
    <div class="sys-card">
      <div class="sc-ic" style="background:var(--tile-blue)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M9 13h6M9 17h4"/></svg></div>
      <b>Logs do sistema</b><small>Eventos técnicos e integrações</small>
      <button class="btn-sec" data-toast="Abrindo logs">Ver logs</button>
    </div>
    <div class="sys-card">
      <div class="sc-ic" style="background:var(--tile-purple)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg></div>
      <b>Auditoria</b><small>Quem fez o quê, e quando</small>
      <button class="btn-sec" data-toast="Exportando auditoria">Exportar</button>
    </div>
  </div>
  <div class="sub-h">Auditoria recente</div>
  <div class="audit">${logs.map(([who,act,when,c])=>`
    <div class="aud-row"><span class="aud-dot ${c}"></span><div class="aud-main"><b>${who}</b> ${act}</div><span class="aud-when">${when}</span></div>`).join('')}</div>`;
}

function panelGeral(){
  return `<div class="form-grid">
    <label class="fld"><span>Nome da agência</span><input type="text" value="Connect Comunicação" /></label>
    <label class="fld"><span>E-mail principal</span><input type="text" value="contato@connect.com" /></label>
    <label class="fld"><span>Fuso horário</span><div class="sel"><select><option>America/São_Paulo (GMT-3)</option><option>America/Recife</option></select></div></label>
    <label class="fld"><span>Idioma</span><div class="sel"><select><option>Português (BR)</option><option>English</option></select></div></label>
    <label class="fld"><span>Semana começa em</span><div class="sel"><select><option>Segunda-feira</option><option>Domingo</option></select></div></label>
    <label class="fld"><span>Moeda</span><div class="sel"><select><option>Real (R$)</option></select></div></label>
  </div>
  <div class="card-list" style="margin-top:18px">
    <div class="row"><div class="row-main"><b>Notificações por e-mail</b></div>${tgl('g:email',true,false)}</div>
    <div class="row"><div class="row-main"><b>Resumo semanal para o gestor</b></div>${tgl('g:weekly',true,false)}</div>
  </div>
  <button class="btn-save" data-toast="Configurações salvas">Salvar alterações</button>`;
}

const PANELS = {
  geral:        { t:'Configurações gerais', render:panelGeral },
  usuarios:     { t:'Usuários & Permissões', render:panelUsuarios },
  modulos:      { t:'Módulos & Feature flags', render:panelModulos },
  estrutura:    { t:'Estrutura', render:panelEstrutura },
  integracoes:  { t:'Integrações, alertas & menu', render:panelIntegracoes },
  roadmap:      { t:'Roadmap & Fases', render:panelRoadmap },
  sistema:      { t:'Sistema, backups & auditoria', render:panelSistema },
};

let current = 'modulos';
function show(key){
  current = key;
  document.querySelectorAll('.anav-item').forEach(b=>b.classList.toggle('on', b.dataset.k===key));
  $('#panelTitle').textContent = PANELS[key].t;
  $('#panel').innerHTML = PANELS[key].render();
}
window.adminNav = show;

/* ---------- toggles ---------- */
document.addEventListener('click', e=>{
  const modOpen = e.target.closest('[data-modopen]');
  if (modOpen && !e.target.closest('[data-tgl]')){ openModule(modOpen.dataset.modopen); return; }
  const act = e.target.closest('[data-activate]');
  if (act && !act.disabled){
    const name = act.dataset.activate;
    const i = MODULES.off.findIndex(m=>m[0]===name);
    if (i>=0){ const m=MODULES.off.splice(i,1)[0]; MODULES.on.push(m); MODULE_META[name].state='on'; }
    closeModDrawer(); show('modulos'); toast(name+' ativado ✓');
    return;
  }
  const sw = e.target.closest('[data-tgl]');
  if (sw){
    const on = !sw.classList.contains('on');
    sw.classList.toggle('on', on); sw.setAttribute('aria-checked', on);
    const id = sw.dataset.tgl;
    if (id.startsWith('mod:')){
      const name = id.slice(4);
      // mover entre on/off counts
      const onCount = document.querySelectorAll('.mod.on .sw.on, .mod.off .sw.on').length;
      $('#msOn') && ($('#msOn').textContent = document.querySelectorAll('#panel .mod.on .sw.on').length + document.querySelectorAll('#panel .mod.off .sw.on').length);
      toast(name + (on?' ativado':' desligado'));
    } else {
      toast('Preferência atualizada');
    }
    return;
  }
  const tb = e.target.closest('[data-toast]');
  if (tb){ toast(tb.dataset.toast); }
});

show('modulos');
