/* Redes sociais — métricas do Metricool (sincronizadas no Supabase) e fila de postagens para revisão. */
(function () {
  const $ = id => document.getElementById(id);
  const fmt = n => n == null ? '—' : Number(n).toLocaleString('pt-BR');
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const STATUS = {
    rascunho: ['Rascunho', 'st-gray'],
    pronto: ['Aguardando envio', 'st-amber'],
    enviado_revisao: ['Em revisão no Metricool', 'st-blue'],
    erro: ['Erro no envio', 'st-red'],
    cancelado: ['Cancelado', 'st-gray'],
  };
  const TIPO = { POST: 'Post', REEL: 'Reel', STORY: 'Story' };

  let marcas = [];
  let linhas = [];

  function toast(msg) {
    const t = $('toast');
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2600);
  }

  // Abas
  document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    document.querySelectorAll('.panel').forEach(p => p.classList.toggle('on', p.id === 'p-' + b.dataset.tab));
  }));

  // ---------- Métricas ----------
  function resumo(rows) {
    const ord = rows.slice().sort((a, b) => a.data.localeCompare(b.data));
    const comSeg = ord.filter(r => r.seguidores != null);
    const soma = k => ord.reduce((s, r) => s + (r[k] || 0), 0);
    return {
      seguidores: comSeg.length ? comSeg[comSeg.length - 1].seguidores : null,
      seguidoresIni: comSeg.length ? comSeg[0].seguidores : null,
      novos: soma('novos_seguidores'),
      alcance: soma('alcance'),
      visualizacoes: soma('visualizacoes'),
      interacoes: soma('interacoes'),
      publicacoes: soma('publicacoes'),
    };
  }

  function variacao(atual, anterior) {
    if (!anterior) return ['sem período anterior', ''];
    const p = Math.round((atual - anterior) / anterior * 100);
    return [(p >= 0 ? '+' : '') + p + '% vs. período anterior', p >= 0 ? 'up' : 'down'];
  }

  function setSub(id, [txt, cls]) {
    const el = $(id);
    el.textContent = txt;
    el.className = 'fsub ' + cls;
  }

  function desenhaGrafico(rows, dias) {
    const svg = $('chart');
    const ord = rows.slice().sort((a, b) => a.data.localeCompare(b.data));
    if (!ord.length) { svg.innerHTML = '<text x="400" y="100" text-anchor="middle" fill="currentColor" font-size="14">Sem dados no período</text>'; return; }
    const max = Math.max(1, ...ord.map(r => r.alcance || 0));
    const w = 800, h = 200, pad = 8, bw = (w - pad * 2) / ord.length;
    svg.innerHTML = ord.map((r, i) => {
      const v = r.alcance || 0, bh = Math.max(2, (v / max) * (h - 24));
      const d = r.data.split('-').reverse().slice(0, 2).join('/');
      return `<rect x="${pad + i * bw + bw * 0.15}" y="${h - bh}" width="${bw * 0.7}" height="${bh}" rx="3" fill="var(--violet)"><title>${d}: ${fmt(v)}</title></rect>`;
    }).join('');
    $('chartSub').textContent = `Pessoas alcançadas por dia · pico de ${fmt(max)} · ${dias} dias`;
  }

  function renderMetricas() {
    const dias = Number($('fPeriodo').value);
    const marca = $('fMarca').value;
    const hoje = new Date();
    const ini = new Date(hoje); ini.setDate(hoje.getDate() - dias);
    const iniAnt = new Date(ini); iniAnt.setDate(ini.getDate() - dias);
    const iso = d => d.toISOString().slice(0, 10);
    const noPeriodo = (r, a, b) => r.data >= iso(a) && r.data < iso(b);

    const daMarca = linhas.filter(r => !marca || String(r.brand_id) === marca);
    const atual = daMarca.filter(r => noPeriodo(r, ini, hoje));
    const ant = daMarca.filter(r => noPeriodo(r, iniAnt, ini));

    // KPIs: soma das marcas (ou da marca escolhida)
    const porMarca = m => resumo(atual.filter(r => r.brand_id === m.brand_id));
    const lista = marcas.filter(m => !marca || String(m.brand_id) === marca);
    const tot = lista.map(porMarca).reduce((t, r) => {
      ['novos', 'alcance', 'visualizacoes', 'interacoes', 'publicacoes'].forEach(k => t[k] += r[k] || 0);
      t.seguidores += r.seguidores || 0;
      return t;
    }, { seguidores: 0, novos: 0, alcance: 0, visualizacoes: 0, interacoes: 0, publicacoes: 0 });
    const totAnt = resumo(ant);

    $('kSeg').textContent = fmt(tot.seguidores);
    $('kSegSub').textContent = (tot.novos >= 0 ? '+' : '') + fmt(tot.novos) + ' novos no período';
    $('kSegSub').className = 'fsub up';
    $('kAlc').textContent = fmt(tot.alcance); setSub('kAlcSub', variacao(tot.alcance, totAnt.alcance));
    $('kVis').textContent = fmt(tot.visualizacoes); setSub('kVisSub', variacao(tot.visualizacoes, totAnt.visualizacoes));
    $('kInt').textContent = fmt(tot.interacoes); setSub('kIntSub', variacao(tot.interacoes, totAnt.interacoes));
    $('kPub').textContent = fmt(tot.publicacoes);

    // Gráfico: alcance diário somado
    const porDia = {};
    atual.forEach(r => { porDia[r.data] = (porDia[r.data] || 0) + (r.alcance || 0); });
    desenhaGrafico(Object.entries(porDia).map(([data, alcance]) => ({ data, alcance })), dias);

    // Tabela por marca
    $('tbMarcas').innerHTML = lista.length ? lista.map(m => {
      const r = porMarca(m);
      return `<tr class="click" data-brand="${m.brand_id}">
        <td><b>${esc(m.nome)}</b><br><small style="color:var(--muted);font-weight:600">@${esc(m.instagram)}</small></td>
        <td class="num">${fmt(r.seguidores)}</td><td class="num up">+${fmt(r.novos)}</td><td class="num">${fmt(r.alcance)}</td>
        <td class="num">${fmt(r.visualizacoes)}</td><td class="num">${fmt(r.interacoes)}</td><td class="num">${fmt(r.publicacoes)}</td></tr>`;
    }).join('') : '<tr><td colspan="7" class="t-empty">Nenhuma marca sincronizada ainda.</td></tr>';
    document.querySelectorAll('#tbMarcas tr.click').forEach(tr => tr.addEventListener('click', () => {
      $('fMarca').value = tr.dataset.brand; renderMetricas();
    }));
  }

  async function carregarMetricas() {
    const desde = new Date(); desde.setDate(desde.getDate() - 182);
    const [mk, mt, lg] = await Promise.all([
      sb.from('metricool_marcas').select('*').order('nome'),
      sb.from('metricool_metricas_diarias').select('*').gte('data', desde.toISOString().slice(0, 10)).limit(5000),
      sb.from('metricool_sync_log').select('rodado_em, ok').order('rodado_em', { ascending: false }).limit(1),
    ]);
    if (mk.error || mt.error) { $('tbMarcas').innerHTML = '<tr><td colspan="7" class="t-empty">Não foi possível carregar as métricas.</td></tr>'; return; }
    marcas = mk.data; linhas = mt.data;
    const opts = marcas.map(m => `<option value="${m.brand_id}">${esc(m.nome)}</option>`).join('');
    $('fMarca').innerHTML = '<option value="">Todas as marcas</option>' + opts;
    $('pMarca').innerHTML = opts;
    const ult = lg.data && lg.data[0];
    $('upd').textContent = ult ? 'Sincronizado em ' + new Date(ult.rodado_em).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) + (ult.ok ? '' : ' (com erro)') : 'Aguardando a primeira sincronização';
    renderMetricas();
  }
  $('fMarca').addEventListener('change', renderMetricas);
  $('fPeriodo').addEventListener('change', renderMetricas);

  // ---------- Postagens ----------
  async function carregarFila() {
    const { data, error } = await sb.from('fila_postagens').select('*').order('agendar_para', { ascending: false }).limit(100);
    if (error) { $('tbFila').innerHTML = '<tr><td colspan="7" class="t-empty">Não foi possível carregar a fila.</td></tr>'; return; }
    const nome = id => (marcas.find(m => m.brand_id === id) || {}).nome || id;
    $('tbFila').innerHTML = data.length ? data.map(p => {
      const [l, c] = STATUS[p.status] || [p.status, 'st-gray'];
      const quando = new Date(p.agendar_para).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
      const midia = p.midia_url ? (/\.(mp4|mov|webm)(\?|$)/i.test(p.midia_url) ? '<span class="thumb" style="display:grid;place-items:center;font-size:11px;font-weight:800">VÍDEO</span>' : `<img class="thumb" src="${esc(p.midia_url)}" alt="" />`) : '—';
      const acoes = [];
      if (p.status === 'rascunho' || p.status === 'erro') acoes.push(`<button class="mini" data-act="pronto" data-id="${p.id}">Enviar para revisão</button>`);
      if (['rascunho', 'pronto', 'erro'].includes(p.status)) acoes.push(`<button class="mini" data-act="cancelado" data-id="${p.id}">Cancelar</button>`);
      if (p.metricool_url) acoes.push(`<a class="lnk" href="${esc(p.metricool_url)}" target="_blank" rel="noopener">Abrir no Metricool</a>`);
      return `<tr><td>${midia}</td><td><b>${esc(nome(p.brand_id))}</b></td><td>${TIPO[p.tipo] || p.tipo}</td><td class="num">${quando}</td>
        <td><div class="txt" title="${esc(p.texto)}">${esc(p.texto) || '<span style="color:var(--muted)">sem legenda</span>'}</div>${p.erro ? `<small style="color:var(--red);font-weight:700">${esc(p.erro)}</small>` : ''}</td>
        <td><span class="badge-status ${c}">${l}</span></td><td>${acoes.join(' ')}</td></tr>`;
    }).join('') : '<tr><td colspan="7" class="t-empty">Nenhum post na fila.</td></tr>';
  }

  $('tbFila').addEventListener('click', async e => {
    const b = e.target.closest('button[data-act]');
    if (!b) return;
    b.disabled = true;
    const { error } = await sb.from('fila_postagens').update({ status: b.dataset.act, erro: null }).eq('id', b.dataset.id);
    toast(error ? 'Não foi possível atualizar o post.' : b.dataset.act === 'pronto' ? 'Post na fila para revisão.' : 'Post cancelado.');
    carregarFila();
  });

  async function salvarPost(status) {
    const err = $('pErr');
    err.style.display = 'none';
    const file = $('pMidia').files[0];
    const quando = $('pData').value ? new Date($('pData').value) : null;
    const falha = msg => { err.textContent = msg; err.style.display = 'block'; };
    if (!$('pMarca').value) return falha('Escolha a marca.');
    if (!quando || quando < new Date(Date.now() + 30 * 60000)) return falha('Escolha uma data pelo menos 30 minutos no futuro.');
    if (!file) return falha('O Instagram exige uma imagem ou vídeo.');
    if ($('pTipo').value === 'REEL' && !file.type.startsWith('video/')) return falha('Reel precisa de vídeo.');

    $('btnEnviar').disabled = $('btnRascunho').disabled = true;
    try {
      const nomeArq = `${Date.now()}-${file.name.normalize('NFD').replace(/[^\w.-]+/g, '_')}`;
      const up = await sb.storage.from('midias-posts').upload(nomeArq, file, { contentType: file.type });
      if (up.error) return falha('Não foi possível enviar a mídia: ' + up.error.message);
      const midia_url = sb.storage.from('midias-posts').getPublicUrl(nomeArq).data.publicUrl;
      const { error } = await sb.from('fila_postagens').insert({
        brand_id: Number($('pMarca').value), tipo: $('pTipo').value, texto: $('pTexto').value.trim(),
        midia_url, agendar_para: quando.toISOString(), status, criado_por: currentUser.id,
      });
      if (error) return falha('Não foi possível salvar o post: ' + error.message);
      $('postForm').reset();
      toast(status === 'pronto' ? 'Post na fila para revisão.' : 'Rascunho salvo.');
      carregarFila();
    } finally {
      $('btnEnviar').disabled = $('btnRascunho').disabled = false;
    }
  }
  $('postForm').addEventListener('submit', e => { e.preventDefault(); salvarPost('pronto'); });
  $('btnRascunho').addEventListener('click', () => salvarPost('rascunho'));

  // Espera a sessão do auth.js antes de consultar
  (function iniciar() {
    if (!window.currentUser) return setTimeout(iniciar, 100);
    carregarMetricas().then(carregarFila);
  })();
})();
