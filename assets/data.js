/* ============================================================
   DADOS REAIS — Connect OS
   Fonte: Sistema_Final_v2.xlsx (_BD + METAS)
   Importado em 30/05/2026 · 97 entregas · Referência: 05/06/2025
   ============================================================ */

/* -------- Clientes -------- */
const CLIENTS = {
  bells:    { name:'Bells',               logo:'BL',  bg:'linear-gradient(135deg,#2b3556,#161d33)' },
  brasa:    { name:'Brasa Meat',          logo:'BM',  bg:'var(--tile-red)' },
  casa:     { name:'Casa de Pedra',       logo:'CP',  bg:'linear-gradient(135deg,#a3886a,#6f5a42)' },
  igreja:   { name:'Igreja',             logo:'IG',  bg:'linear-gradient(135deg,#5b6b86,#3a4660)' },
  lcs:      { name:'LCS',                logo:'LCS', bg:'linear-gradient(135deg,#2bc4c4,#159c9c)' },
  trinitas: { name:'Trinitas',           logo:'TR',  bg:'linear-gradient(135deg,#9b6cf0,#6d4fd6)' },
  unique:   { name:'Unique',             logo:'UN',  bg:'var(--tile-orange)' },
  outdoors: { name:'Outofdoors Travel',  logo:'OT',  bg:'linear-gradient(135deg,#3fb98a,#1f8f68)' },
  vinicius: { name:'Vinicius Cortazio',  logo:'VC',  bg:'linear-gradient(135deg,#3b6fe0,#2451c4)' },
};

/* -------- Equipe -------- */
const PEOPLE = {
  ana:    { n:'Ana',    av:'A', bg:'var(--tile-orange)', role:'Gestora de Conteúdo' },
  nicole: { n:'Nicole', av:'N', bg:'var(--tile-blue)',   role:'Audiovisual' },
};

/* -------- Tipos -------- */
const TYPES = {
  estatico:  { l:'Post',         c:'gray'   },
  carrossel: { l:'Carrossel',    c:'gray'   },
  reels:     { l:'Reels',        c:'violet' },
  story:     { l:'Story',        c:'gray'   },
  yt:        { l:'YouTube',      c:'red'    },
  short:     { l:'Short',        c:'violet' },
  news:      { l:'News',         c:'gray'   },
  demanda:   { l:'Sob demanda',  c:'amber'  },
};

/* -------- Status -------- */
const STATUS = {
  briefing:  { l:'Briefing',  cls:'st-gray'   },
  producao:  { l:'Produção',  cls:'st-blue'   },
  aprovacao: { l:'Aprovação', cls:'st-amber'  },
  correcao:  { l:'Correção',  cls:'st-coral'  },
  agendado:  { l:'Agendado',  cls:'st-violet' },
  publicado: { l:'Publicado', cls:'st-green'  },
};
const STATUS_ORDER = ['briefing','producao','aprovacao','correcao','agendado','publicado'];

/* -------- Prioridade -------- */
const PRIO = {
  hoje:   { l:'Hoje',         cls:'hoje'   },
  semana: { l:'Semana',       cls:'semana' },
  calmo:  { l:'Sem urgência', cls:'calmo'  },
};

/* -------- Helpers -------- */
const TODAY = 5;  // referência: 05/06/2025
const pad = n => String(n).padStart(2,'0');
const brl = v => {
  if(v===null||v===undefined||v==='') return '<span class="placeholder-val" title="Valor pendente de confirmação">—</span>';
  return 'R$\u00a0' + (+v).toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
};
function flame(){ return '<svg viewBox="0 0 24 24" fill="currentColor" style="width:12px;height:12px"><path d="M12 2c1 3-2 4-2 7a4 4 0 0 0 8 0c0-1-.3-2-.8-3 .3 4-2.2 5-2.2 2 0-2 .5-4-3-6z"/></svg>'; }

/* -------- Construtor de linha -------- */
function mkRow(id,rawId,cl,ty,title,resp,pd,prazo,pub,st,note='',updatedBy){
  const late = pd<TODAY && !['publicado','agendado'].includes(st);
  const prio = (late||pd===TODAY)?'hoje':pd<=TODAY+7?'semana':'calmo';
  const who  = resp==='ana'?'Ana':'Nicole';
  return {id,rawId,client:cl,type:ty,title,sub:'',resp,
    prazoDay:pd,prazo:prazo||'—',pub:pub||'—',
    status:st,prio,late,file:false,note,
    history:[{txt:'Status: '+STATUS[st].l,who,when:'02/06'},{txt:'Registrado',who:'Ana',when:'02/06'}]};
}
/* dateNum: DD/MM → comparable int (June=day, July=30+day, else=99) */
function dateNum(s){ if(!s||s==='—') return 99; const[d,m]=s.split('/'); return +m===6?+d:+m===7?30+(+d):99; }

/* ============================================================
   ROWS — 97 entregas reais da aba _BD
   ============================================================ */
const ROWS = [
  /* ─────────────── TRINITAS ─────────────── */
  mkRow( 1,'T-01','trinitas','estatico','Segurança jurídica começa na rotina',                              'ana',4,'04/06','04/06','publicado'),
  mkRow( 2,'T-02','trinitas','estatico','O primeiro passo não é escrever, é diagnosticar',                 'ana',5,'05/06','06/06','publicado'),
  mkRow( 3,'T-03','trinitas','estatico','Modelo pronto não resolve realidade complexa',                    'ana',6,'06/06','10/06','agendado'),
  mkRow( 4,'T-04','trinitas','estatico','5 pontos que normativa do município precisa de revisão',          'ana',6,'06/06','12/06','agendado'),
  mkRow( 5,'T-05','trinitas','estatico','Antes de corrigir é preciso entender',                            'ana',6,'06/06','17/06','agendado'),
  mkRow( 6,'T-06','trinitas','estatico','Consultoria técnica não é só um parecer',                         'ana',6,'06/06','19/06','agendado'),
  mkRow( 7,'T-07','trinitas','estatico','Nem toda norma pode ser adaptada sem diagnóstico',                'ana',6,'06/06','24/06','agendado'),
  mkRow( 8,'T-08','trinitas','estatico','Muitas leis. Pouca organização.',                                 'ana',6,'06/06','26/06','agendado'),
  mkRow( 9,'T-09','trinitas','estatico','Norma espalhada gera dúvida. Norma organizada gera eficiência.','ana',6,'06/06','—','agendado','9º post — agendar'),

  /* ─────────────── LCS · Planejamento v3 (30 posts · concluído) ─────────────── */
  mkRow(301,'EST 01','lcs','estatico','Posicionamento premium','ana',1,'—','—','publicado','Objetivo: Abrir o mês posicionando a LCS como empresa premium'),
  mkRow(302,'VIS 02','lcs','estatico','Lifestyle / Percepção premium','ana',1,'—','—','publicado','Objetivo: Criar respiro visual e desejo com fachada high-end'),
  mkRow(303,'EST 03','lcs','estatico','Confiança / Processo','ana',1,'—','—','publicado','Objetivo: Reforçar que luxo é clareza, não confusão'),
  mkRow(304,'VIS 04','lcs','estatico','Interior premium','ana',1,'—','—','publicado','Objetivo: Fortalecer estética high-end no feed'),
  mkRow(305,'INST 05','lcs','estatico','Padrão LCS','ana',1,'—','—','publicado','Objetivo: Consolidar os valores da marca com o LCS Standard'),
  mkRow(306,'VIS 06','lcs','estatico','Craftsmanship','ana',1,'—','—','publicado','Objetivo: Mostrar sofisticação e atenção ao detalhe sem texto'),
  mkRow(307,'CAR 07','lcs','carrossel','Processo / Autoridade','ana',1,'—','—','publicado','Objetivo: Explicar que obra premium começa antes da construção'),
  mkRow(308,'EST 08','lcs','estatico','Design-Build','ana',1,'—','—','publicado','Objetivo: Explicar o diferencial da LCS de forma simples'),
  mkRow(309,'VIS 09','lcs','estatico','Planejamento','ana',1,'—','—','publicado','Objetivo: Criar respiro visual com clima de processo premium'),
  mkRow(310,'EST 10','lcs','estatico','Permits / Autoridade local','ana',1,'—','—','publicado','Objetivo: Mostrar maturidade técnica e domínio de permits'),
  mkRow(311,'VIS 11','lcs','estatico','South Florida lifestyle','ana',1,'—','—','publicado','Objetivo: Deixar o feed mais aspiracional com outdoor living'),
  mkRow(312,'EST 12','lcs','estatico','South Florida expertise','ana',1,'—','—','publicado','Objetivo: Posicionar a LCS como especialista no mercado local'),
  mkRow(313,'VIS 13','lcs','estatico','Materiais / Durabilidade','ana',1,'—','—','publicado','Objetivo: Reforçar sofisticação com moodboard de materiais'),
  mkRow(314,'CAR 14','lcs','carrossel','Educação / Lead qualificado','ana',1,'—','—','publicado','Objetivo: Educar o homeowner antes de reformar'),
  mkRow(315,'EST 15','lcs','estatico','Qualidade / Craftsmanship','ana',1,'—','—','publicado','Objetivo: Reforçar o valor do trabalho invisível por trás do acabamento'),
  mkRow(316,'VIS 16','lcs','estatico','Interior premium','ana',1,'—','—','publicado','Objetivo: Respiro visual com cozinha ou banheiro sofisticado'),
  mkRow(317,'EST 17','lcs','estatico','Materiais / South Florida','ana',1,'—','—','publicado','Objetivo: Ensinar sobre materiais sem precisar de carrossel'),
  mkRow(318,'VIS 18','lcs','estatico','Lifestyle / Hosting','ana',1,'—','—','publicado','Objetivo: Gerar desejo com casa feita para receber'),
  mkRow(319,'EST 19','lcs','estatico','Autoridade / Risco','ana',1,'—','—','publicado','Objetivo: Mostrar que visual bonito não basta sem processo premium'),
  mkRow(320,'VIS 20','lcs','estatico','Fachada / Percepção premium','ana',1,'—','—','publicado','Objetivo: Respiro visual antes do próximo conteúdo profundo'),
  mkRow(321,'CAR 21','lcs','carrossel','Remodel vs Rebuild','ana',1,'—','—','publicado','Objetivo: Ajudar o homeowner a tomar uma decisão estratégica'),
  mkRow(322,'EST 22','lcs','estatico','Agosto / Hurricane season','ana',1,'—','—','publicado','Objetivo: Criar urgência qualificada em agosto sem alarmismo'),
  mkRow(323,'VIS 23','lcs','estatico','Hurricane readiness','ana',1,'—','—','publicado','Objetivo: Reforçar prevenção de forma visual sem alarmismo'),
  mkRow(324,'EST 24','lcs','estatico','Planejamento / Fim de ano','ana',1,'—','—','publicado','Objetivo: Gerar leads de quem quer reformar antes do fim do ano'),
  mkRow(325,'VIS 25','lcs','estatico','Planejamento premium','ana',1,'—','—','publicado','Objetivo: Respiro visual com sensação de organização'),
  mkRow(326,'EST 26','lcs','estatico','Confiança / Valor','ana',1,'—','—','publicado','Objetivo: Mostrar que o cliente compra segurança, não só construção'),
  mkRow(327,'INST 27','lcs','estatico','Marca / Autoridade','ana',1,'—','—','publicado','Objetivo: Reforçar LCS como design-build premium no sul da Flórida'),
  mkRow(328,'CAR 28','lcs','carrossel','Contratação / Lead qualificado','ana',1,'—','—','publicado','Objetivo: Qualificar o lead antes da consulta'),
  mkRow(329,'VIS 29','lcs','estatico','Fechamento visual / Lifestyle','ana',1,'—','—','publicado','Objetivo: Deixar o feed premium antes do post final de conversão'),
  mkRow(330,'INST 30','lcs','estatico','Conversão','ana',1,'—','—','publicado','Objetivo: Encerrar o mês com CTA claro e premium'),

  /* ─────────────── BELLS ─────────────── */
  mkRow(22,'B-01','bells','estatico','Post Bells — Terça 10/06',   'ana',7,'07/06','10/06','agendado'),
  mkRow(23,'B-02','bells','estatico','Post Bells — Quarta 11/06',  'ana',7,'07/06','11/06','agendado'),
  mkRow(24,'B-03','bells','estatico','Post Bells — Quinta 12/06',  'ana',7,'07/06','12/06','agendado'),
  mkRow(25,'B-04','bells','estatico','Post Bells — Sexta 13/06',   'ana',7,'07/06','13/06','agendado'),
  mkRow(26,'B-05','bells','estatico','Post Bells — Sábado 14/06',  'ana',7,'07/06','14/06','agendado'),
  mkRow(27,'B-06','bells','estatico','Post Bells — Terça 17/06',   'ana',7,'07/06','17/06','briefing'),
  mkRow(28,'B-07','bells','estatico','Post Bells — Quarta 18/06',  'ana',7,'07/06','18/06','briefing'),
  mkRow(29,'B-08','bells','estatico','Post Bells — Quinta 19/06',  'ana',7,'07/06','19/06','briefing'),
  mkRow(30,'B-09','bells','estatico','Post Bells — Sexta 20/06',   'ana',7,'07/06','20/06','briefing'),
  mkRow(31,'B-10','bells','estatico','Post Bells — Sábado 21/06',  'ana',7,'07/06','21/06','briefing'),
  mkRow(32,'B-11','bells','estatico','Post Bells — Terça 24/06',   'ana',21,'21/06','24/06','briefing'),
  mkRow(33,'B-12','bells','estatico','Post Bells — Quarta 25/06',  'ana',21,'21/06','25/06','briefing'),
  mkRow(34,'B-13','bells','estatico','Post Bells — Quinta 26/06',  'ana',21,'21/06','26/06','briefing'),
  mkRow(35,'B-14','bells','estatico','Post Bells — Sexta 27/06',   'ana',21,'21/06','27/06','briefing'),
  mkRow(36,'B-15','bells','estatico','Post Bells — Sábado 28/06',  'ana',21,'21/06','28/06','briefing'),
  mkRow(37,'B-16','bells','estatico','Post Bells — Terça 01/07',   'ana',28,'28/06',31+1+'?','briefing'),
  mkRow(38,'B-17','bells','estatico','Post Bells — Quarta 02/07',  'ana',28,'28/06','02/07','briefing'),
  mkRow(39,'B-18','bells','estatico','Post Bells — Quinta 03/07',  'ana',28,'28/06','03/07','briefing'),
  mkRow(40,'B-19','bells','estatico','Post Bells — Sexta 04/07',   'ana',28,'28/06','04/07','briefing'),
  mkRow(41,'B-20','bells','estatico','Post Bells — Sábado 05/07',  'ana',28,'28/06','05/07','briefing'),

  /* ─────────────── IGREJA — YouTube (Ana) — CORRIGIDO: 2ª e 4ª (segunda e quarta) ─────────────── */
  mkRow(42,'IG-YT-01','igreja','yt','Culto Segunda 02/06',  'ana',3,'03/06','03/06','publicado'),
  mkRow(43,'IG-YT-02','igreja','yt','Culto Quarta 04/06',   'ana',5,'05/06','05/06','publicado'),
  mkRow(44,'IG-YT-03','igreja','yt','Culto Segunda 09/06',  'ana',10,'10/06','10/06','briefing'),
  mkRow(45,'IG-YT-04','igreja','yt','Culto Quarta 11/06',   'ana',12,'12/06','12/06','briefing'),
  mkRow(46,'IG-YT-05','igreja','yt','Culto Segunda 16/06',  'ana',17,'17/06','17/06','briefing'),
  mkRow(47,'IG-YT-06','igreja','yt','Culto Quarta 18/06',   'ana',19,'19/06','19/06','briefing'),
  mkRow(48,'IG-YT-07','igreja','yt','Culto Segunda 23/06',  'ana',24,'24/06','24/06','briefing'),
  mkRow(49,'IG-YT-08','igreja','yt','Culto Quarta 25/06',   'ana',26,'26/06','26/06','briefing'),

  /* ─────────────── IGREJA — News (Nicole) ─────────────── */
  mkRow(50,'IG-NW-01','igreja','news','News Semana 08/06',  'nicole',8,'08/06','08/06','briefing'),
  mkRow(51,'IG-NW-02','igreja','news','News Semana 15/06',  'nicole',15,'15/06','15/06','briefing'),
  mkRow(52,'IG-NW-03','igreja','news','News Semana 22/06',  'nicole',22,'22/06','22/06','briefing'),
  mkRow(53,'IG-NW-04','igreja','news','News Semana 29/06',  'nicole',29,'29/06','29/06','briefing'),

  /* ─────────────── IGREJA — Shorts (Nicole) ─────────────── */
  mkRow(54,'IG-SH-01','igreja','short','Short Culto 04/06',  'nicole',5,'05/06','06/06','publicado'),
  mkRow(55,'IG-SH-02','igreja','short','Short Culto 11/06',  'nicole',12,'12/06','13/06','briefing'),
  mkRow(56,'IG-SH-03','igreja','short','Short Culto 18/06',  'nicole',19,'19/06','20/06','briefing'),
  mkRow(57,'IG-SH-04','igreja','short','Short Culto 25/06',  'nicole',26,'26/06','27/06','briefing'),

  /* ─────────────── BRASA MEAT ─────────────── */
  mkRow(58,'BM-01','brasa','estatico','Post Brasa — Sem2/1',              'ana',12,'12/06','16/06','briefing'),
  mkRow(59,'BM-02','brasa','estatico','Post Brasa — Sem2/2',              'ana',12,'12/06','19/06','briefing'),
  mkRow(60,'BM-03','brasa','estatico','Post Brasa — Sem3/1',              'ana',19,'19/06','23/06','briefing'),
  mkRow(61,'BM-04','brasa','estatico','Post Brasa — Sem3/2',              'ana',19,'19/06','26/06','briefing'),
  mkRow(62,'BM-05','brasa','estatico','Post Brasa — Sem4/1',              'ana',26,'26/06','30/06','briefing'),
  mkRow(63,'BM-06','brasa','estatico','Post Brasa — Sem4/2',              'ana',26,'26/06','03/07','briefing'),
  mkRow(64,'BM-07','brasa','reels','Reels Brasa — Sob demanda 1',         'nicole',12,'12/06','14/06','briefing'),
  mkRow(65,'BM-08','brasa','reels','Reels Brasa — Sob demanda 2',         'nicole',19,'19/06','21/06','briefing'),

  /* ─────────────── UNIQUE · Jun–Ago 2026 v3 (20 posts) ─────────────── */
  mkRow(401,'EST 01','unique','estatico','Posicionamento','ana',10,'10/06','10/06','aprovacao','Objetivo: Abrir o ciclo posicionando a Unique como referência em eventos RJ'),
  mkRow(402,'VIS 02','unique','estatico','Bastidores / Atmosfera','ana',11,'11/06','11/06','aprovacao','Objetivo: Criar respiro visual e desejo com cena de evento premium'),
  mkRow(403,'CAR 03','unique','carrossel','Decisões / Valor','ana',12,'12/06','12/06','aprovacao','Objetivo: Mostrar inteligência operacional — o erro que quase comprometeu o evento'),
  mkRow(404,'EST 04','unique','estatico','Experiência de Marca','ana',13,'13/06','13/06','aprovacao','Objetivo: Conexão emocional — Dia dos Namorados'),
  mkRow(405,'VIS 05','unique','estatico','Bastidores / Detalhe','ana',16,'16/06','16/06','briefing','Objetivo: Fortalecer percepção de acabamento e atenção ao detalhe'),
  mkRow(406,'CAR 06','unique','carrossel','Decisões / Valor','ana',18,'18/06','18/06','briefing','Objetivo: 3 decisões que evitaram problemas'),
  mkRow(407,'EST 07','unique','estatico','Posicionamento','ana',25,'25/06','25/06','briefing','Objetivo: Quando o evento não pode falhar — branding de método'),
  mkRow(408,'VIS 08','unique','estatico','Bastidores / Equipe','ana',23,'23/06','23/06','briefing','Objetivo: Humanizar a marca mostrando equipe em operação real'),
  mkRow(409,'CAR 09','unique','carrossel','Educação / Lead','ana',2,'02/07','02/07','briefing','Objetivo: Educar o cliente antes de contratar — por que eventos falham'),
  mkRow(410,'EST 10','unique','estatico','Case / Adaptação','ana',7,'07/07','07/07','briefing','Objetivo: O cliente pediu mudança 48h antes — capacidade de adaptação'),
  mkRow(411,'CAR 11','unique','carrossel','Case Decodificado','ana',9,'09/07','09/07','briefing','Objetivo: Case Casa Clima / COP30 decodificado com dados reais'),
  mkRow(412,'VIS 12','unique','estatico','Experiência / Transformação','ana',14,'14/07','14/07','briefing','Objetivo: Antes e depois da abertura — transformação do espaço'),
  mkRow(413,'EST 13','unique','estatico','Posicionamento','ana',16,'16/07','16/07','briefing','Objetivo: Eventos não são sobre estrutura — são sobre percepção'),
  mkRow(414,'VIS 14','unique','estatico','Bastidores / Operação','ana',21,'21/07','21/07','briefing','Objetivo: O momento em que tudo precisa funcionar — operação crítica'),
  mkRow(415,'CAR 15','unique','carrossel','Método Unique','ana',23,'23/07','23/07','briefing','Objetivo: Como transformamos uma ideia em experiência — Método Unique'),
  mkRow(416,'EST 16','unique','estatico','Sazonalidade / Urgência','ana',25,'25/07','25/07','briefing','Objetivo: Janela de fechamento — eventos de novembro contratados agora'),
  mkRow(417,'VIS 17','unique','estatico','Equipe / Humanização','ana',25,'25/07','25/07','briefing','Objetivo: Mostrar quem faz tudo acontecer — equipe real'),
  mkRow(418,'CAR 18','unique','carrossel','Bastidores / Processo','ana',30,'30/07','30/07','briefing','Objetivo: Os bastidores que ninguém vê — processo completo da Unique'),
  mkRow(419,'EST 19','unique','estatico','Conversão / Lead','ana',3,'03/08','03/08','briefing','Objetivo: Seu próximo evento pode fortalecer sua marca — CTA direto'),
  mkRow(420,'VIS 20','unique','estatico','Encerramento / Prova','ana',6,'06/08','06/08','briefing','Objetivo: Experiência entregue — encerramento do ciclo com resultado'),

  /* ─────────────── VINICIUS CORTAZIO ─────────────── */
  mkRow(73,'V-01','vinicius','estatico','Post Vinicius — Sem2/1',         'ana',12,'12/06','16/06','briefing'),
  mkRow(74,'V-02','vinicius','estatico','Post Vinicius — Sem2/2',         'ana',12,'12/06','19/06','briefing'),
  mkRow(75,'V-03','vinicius','estatico','Post Vinicius — Sem3/1',         'ana',19,'19/06','23/06','briefing'),
  mkRow(76,'V-04','vinicius','estatico','Post Vinicius — Sem3/2',         'ana',19,'19/06','26/06','briefing'),
  mkRow(77,'V-05','vinicius','estatico','Post Vinicius — Sem4/1',         'ana',26,'26/06','30/06','briefing'),
  mkRow(78,'V-06','vinicius','estatico','Post Vinicius — Sem4/2',         'ana',26,'26/06','03/07','briefing'),
  mkRow(79,'V-07','vinicius','reels','Reels Vinicius — Sob demanda',      'nicole',19,'19/06','21/06','briefing'),

  /* ─────────────── OUTOFDOORS TRAVEL (2 posts/semana) ─────────────── */
  mkRow(80,'OT-01','outdoors','estatico','Post Outofdoors — Sem2/1',      'ana',12,'12/06','16/06','briefing'),
  mkRow(81,'OT-02','outdoors','estatico','Post Outofdoors — Sem2/2',      'ana',12,'12/06','19/06','briefing'),
  mkRow(82,'OT-03','outdoors','estatico','Post Outofdoors — Sem3/1',      'ana',19,'19/06','23/06','briefing'),
  mkRow(83,'OT-04','outdoors','estatico','Post Outofdoors — Sem3/2',      'ana',19,'19/06','26/06','briefing'),
  mkRow(84,'OT-05','outdoors','estatico','Post Outofdoors — Sem4/1',      'ana',26,'26/06','30/06','briefing'),
  mkRow(85,'OT-06','outdoors','estatico','Post Outofdoors — Sem4/2',      'ana',26,'26/06','03/07','briefing'),

  /* ─────────────── CASA DE PEDRA ─────────────── */
  mkRow(86,'P-01','casa','reels','Reels CDP — Sem2/1',  'nicole',12,'12/06','13/06','briefing'),
  mkRow(87,'P-02','casa','reels','Reels CDP — Sem2/2',  'nicole',12,'12/06','14/06','briefing'),
  mkRow(88,'P-03','casa','reels','Reels CDP — Sem2/3',  'nicole',12,'12/06','15/06','briefing'),
  mkRow(89,'P-04','casa','estatico','Post CDP — Sem2',  'nicole',12,'12/06','16/06','briefing'),
  mkRow(90,'P-05','casa','reels','Reels CDP — Sem3/1',  'nicole',19,'19/06','20/06','briefing'),
  mkRow(91,'P-06','casa','reels','Reels CDP — Sem3/2',  'nicole',19,'19/06','21/06','briefing'),
  mkRow(92,'P-07','casa','reels','Reels CDP — Sem3/3',  'nicole',19,'19/06','22/06','briefing'),
  mkRow(93,'P-08','casa','estatico','Post CDP — Sem3',  'nicole',19,'19/06','23/06','briefing'),
  mkRow(94,'P-09','casa','reels','Reels CDP — Sem4/1',  'nicole',26,'26/06','27/06','briefing'),
  mkRow(95,'P-10','casa','reels','Reels CDP — Sem4/2',  'nicole',26,'26/06','28/06','briefing'),
  mkRow(96,'P-11','casa','reels','Reels CDP — Sem4/3',  'nicole',26,'26/06','29/06','briefing'),
  mkRow(97,'P-12','casa','estatico','Post CDP — Sem4',  'nicole',26,'26/06','30/06','briefing'),
];

/* ============================================================
   METAS reais — Junho 2025
   ============================================================ */
const METAS_REAIS = [
  { client:'bells',    name:'Bells',              meta:'20 posts estáticos/mês', meta_posts:20, meta_videos:0,  resp:'Ana' },
  { client:'brasa',    name:'Brasa Meat',          meta:'8 posts + vídeos sob demanda', meta_posts:8, meta_videos:2, resp:'Ana/Nicole' },
  { client:'unique',   name:'Unique',              meta:'8 posts + vídeos sob demanda', meta_posts:8, meta_videos:1, resp:'Ana/Nicole' },
  { client:'lcs',      name:'LCS',                 meta:'[PENDENTE] 8 ou 12 posts?', meta_posts:12, meta_videos:0, resp:'Ana', status:'pending' },
  { client:'trinitas', name:'Trinitas',            meta:'8 posts',               meta_posts:8,  meta_videos:0, resp:'Ana' },
  { client:'vinicius', name:'Vinicius Cortazio',   meta:'8 posts + vídeos sob demanda', meta_posts:8, meta_videos:1, resp:'Ana/Nicole' },
  { client:'outdoors', name:'Outofdoors Travel',   meta:'8 posts (2/semana)',    meta_posts:8,  meta_videos:0, resp:'Ana' },
  { client:'casa',     name:'Casa de Pedra',       meta:'12 vídeos/posts',       meta_posts:3,  meta_videos:9, resp:'Nicole' },
  { client:'igreja',   name:'Igreja',              meta:'8 YouTube + 4-8 News + 4 Shorts', meta_posts:0, meta_videos:16, resp:'Ana/Nicole' },
];

/* ============================================================
   CLIENTS_INFO — cadastro operacional
   ============================================================ */
const CLIENTS_INFO = [
  { key:'bells',    name:'Bells',             logo:'BL',  bg:'linear-gradient(135deg,#2b3556,#161d33)', status:'ativo', resp:'ana',    meta:20, valor:null, venc:10, regras:['20 posts estáticos/mês','Todos os dias úteis'], obs:'5 posts/semana (Ter–Sáb).', mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'brasa',    name:'Brasa Meat',        logo:'BM',  bg:'var(--tile-red)',                         status:'ativo', resp:'ana',    meta:10, valor:500, venc:10, regras:['8 posts/mês','Reels sob demanda'], obs:'',        mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'unique',   name:'Unique',            logo:'UN',  bg:'var(--tile-orange)',                      status:'ativo', resp:'ana',    meta:9,  valor:700, venc:20, regras:['8 posts/mês','Reels sob demanda'], obs:'',        mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'lcs',      name:'LCS',               logo:'LCS', bg:'linear-gradient(135deg,#2bc4c4,#159c9c)', status:'ativo', resp:'ana',    meta:12, valor:600, venc:25, regras:['12 posts/mês','Conteúdo em PT e EN'], obs:'Posts em inglês e português.', mod:{aprovacoes:true,calendario:false,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'trinitas', name:'Trinitas',          logo:'TR',  bg:'linear-gradient(135deg,#9b6cf0,#6d4fd6)', status:'ativo', resp:'ana',    meta:9,  valor:300, venc:10, regras:['8 posts/mês','Tom jurídico/consultivo'], obs:'',   mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'vinicius', name:'Vinicius Cortazio', logo:'VC',  bg:'linear-gradient(135deg,#3b6fe0,#2451c4)', status:'ativo', resp:'ana',    meta:9,  valor:300, venc:12, regras:['8 posts/mês','Reels sob demanda'], obs:'Marca pessoal.', mod:{aprovacoes:false,calendario:false,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'outdoors', name:'Outofdoors Travel', logo:'OT',  bg:'linear-gradient(135deg,#3fb98a,#1f8f68)', status:'ativo', resp:'ana',    meta:8,  valor:400, venc:28, regras:['2 posts/semana','Turismo / viagem'], obs:'', mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'casa',     name:'Casa de Pedra',     logo:'CP',  bg:'linear-gradient(135deg,#a3886a,#6f5a42)', status:'ativo', resp:'nicole', meta:12, valor:750, venc:15, regras:['9 Reels/mês','3 Posts/mês'], obs:'Foco total em vídeo.', mod:{aprovacoes:true,calendario:true,financeiro:true,arquivos:true,publicacoes:'locked'} },
  { key:'igreja',   name:'Igreja',            logo:'IG',  bg:'linear-gradient(135deg,#5b6b86,#3a4660)', status:'ativo', resp:'ana',    meta:16, valor:1400, venc:10, regras:['8 YouTube/mês','4 News/mês','4 Shorts/mês'], obs:'Entregas por culto (Qua e Dom).', mod:{aprovacoes:true,calendario:false,financeiro:true,arquivos:true,publicacoes:'locked'} },
];

/* ============================================================
   FINANCEIRO — cobranças Junho 2025
   (dados financeiros não constam na planilha — valores estimados)
   ============================================================ */
const FIN_STATUS = {
  previsto:  { l:'Previsto',      cls:'st-gray'   },
  a_vencer:  { l:'A vencer',      cls:'st-blue'   },
  vencendo:  { l:'Vencendo hoje', cls:'st-coral'  },
  vencido:   { l:'Vencido',       cls:'st-red'    },
  pago:      { l:'Pago',          cls:'st-green'  },
  cancelado: { l:'Cancelado',     cls:'st-gray'   },
};
const COMPETENCIAS = { mai:'Maio/25', jun:'Junho/25', jul:'Julho/25' };
const BILLING = [
  /* Valores mensais confirmados — atualizado 30/05/2025 */
  { id:1, client:'bells',    comp:'jun', titulo:'Permuta', venc:'—', valor:null, pago:'—', status:'pago', obs:'Permuta — sem cobrança financeira' },
  { id:2, client:'brasa',    comp:'jun', titulo:'Mensalidade', venc:'10/06', valor:500,   pago:'—',     status:'vencendo', obs:'' },
  { id:3, client:'unique',   comp:'jun', titulo:'Mensalidade', venc:'20/06', valor:700,   pago:'—',     status:'a_vencer', obs:'' },
  { id:4, client:'lcs',      comp:'jun', titulo:'Mensalidade', venc:'25/06', valor:600,   pago:'—',     status:'a_vencer', obs:'' },
  { id:5, client:'trinitas', comp:'jun', titulo:'Mensalidade', venc:'10/06', valor:300,   pago:'—',     status:'vencendo', obs:'' },
  { id:6, client:'vinicius', comp:'jun', titulo:'Mensalidade', venc:'12/06', valor:300,   pago:'—',     status:'a_vencer', obs:'' },
  { id:7, client:'outdoors', comp:'jun', titulo:'Mensalidade', venc:'28/06', valor:400,   pago:'—',     status:'a_vencer', obs:'' },
  { id:8, client:'casa',     comp:'jun', titulo:'Mensalidade', venc:'15/06', valor:750,   pago:'—',     status:'a_vencer', obs:'' },
  { id:9, client:'igreja',   comp:'jun', titulo:'Mensalidade', venc:'10/06', valor:1400,  pago:'—',     status:'vencendo', obs:'' },
  { id:10,client:'brasa',    comp:'mai', titulo:'Mensalidade', venc:'10/05', valor:500,   pago:'09/05', status:'pago',     obs:'' },
  { id:11,client:'trinitas', comp:'mai', titulo:'Mensalidade', venc:'10/05', valor:300,   pago:'10/05', status:'pago',     obs:'' },
  { id:12,client:'lcs',      comp:'jul', titulo:'Mensalidade', venc:'25/07', valor:600,   pago:'—',     status:'previsto', obs:'' },
];

/* ============================================================
   APROVAÇÕES — derivado de ROWS
   (Junho/2025: nenhuma entrega em status Aprovação/Correção)
   ============================================================ */
const APR_STATUS = {
  aguardando: { l:'Aguardando',          cls:'st-amber'  },
  aprovado:   { l:'Aprovado',            cls:'st-green'  },
  correcao:   { l:'Correção solicitada', cls:'st-coral'  },
  reenviado:  { l:'Reenviado',           cls:'st-blue'   },
  vencido:    { l:'Vencido',             cls:'st-red'    },
};
const APPROVALS = ROWS
  .filter(r => r.status === 'aprovacao' || r.status === 'correcao')
  .map((r,i) => ({
    id: i+1, client: r.client, entrega: r.title, sub: r.sub, tipo: r.type, resp: r.resp,
    versao: 'v1', enviadoEm: r.prazo+' · 09h00', horas: 2, status: 'aguardando',
    prazoDay: r.prazoDay, feedback: '',
  }));

/* ============================================================
   ARQUIVOS / LINKS — estrutura por cliente
   (links reais não constam na planilha — estrutura preparada)
   ============================================================ */
const FILE_TYPES = {
  pasta:      { l:'Pasta do cliente',    cls:'st-violet' },
  identidade: { l:'Identidade visual',   cls:'st-blue'   },
  editavel:   { l:'Arquivo editável',    cls:'st-amber'  },
  final:      { l:'Arquivo final',       cls:'st-green'  },
  referencia: { l:'Referência',          cls:'st-gray'   },
  briefing:   { l:'Briefing',            cls:'st-coral'  },
  recorrente: { l:'Material recorrente', cls:'st-gray'   },
  externo:    { l:'Link externo',        cls:'st-gray'   },
};
function _dt(d){ return d; }
const LINKS = [];
let _lid = 0;
function addLink(client, tipo, nome, resp, obs){ LINKS.push({ id:++_lid, client, tipo, nome, resp, atualizacao:'05/06', obs:obs||'' }); }
CLIENTS_INFO.forEach(c => {
  addLink(c.key, 'pasta',      'Pasta principal — '+c.name,      c.resp, 'Raiz no Google Drive');
  addLink(c.key, 'identidade', 'Identidade visual',              c.resp);
  addLink(c.key, 'briefing',   'Briefing e diretrizes da marca', c.resp);
  // Link para entrega real publicada
  const pub = ROWS.filter(r => r.client===c.key && r.status==='publicado').slice(0,1);
  if(pub.length) addLink(c.key, 'final', pub[0].title+' (final)', pub[0].resp, 'Publicado em '+pub[0].pub);
});

/* ============================================================
   PERSISTÊNCIA LOCAL — clientes adicionados/editados no protótipo
   (chave própria; merge em CLIENTS_INFO + CLIENTS para valer
    em TODAS as telas que carregam data.js)
   ============================================================ */
const AGOS_LS_KEY = 'agos_clients_custom_v1';
function agosSaveClients(mutator){
  try{
    const saved = JSON.parse(localStorage.getItem(AGOS_LS_KEY) || '{}');
    saved.added = saved.added || [];
    saved.edits = saved.edits || {};
    mutator(saved);
    localStorage.setItem(AGOS_LS_KEY, JSON.stringify(saved));
  }catch(e){ console.warn('AGOS: falha ao persistir clientes', e); }
}
(function agosMergeClients(){
  try{
    const saved = JSON.parse(localStorage.getItem(AGOS_LS_KEY) || '{}');
    (saved.added || []).forEach(c => {
      if(!c || !c.key) return;
      if(!CLIENTS_INFO.some(x => x.key === c.key)) CLIENTS_INFO.push(c);
      if(!CLIENTS[c.key]) CLIENTS[c.key] = { name:c.name, logo:c.logo, bg:c.bg };
    });
    Object.entries(saved.edits || {}).forEach(([key, patch]) => {
      const c = CLIENTS_INFO.find(x => x.key === key);
      if(!c) return;
      Object.assign(c, patch);
      if(CLIENTS[key]){ CLIENTS[key].name = c.name; CLIENTS[key].logo = c.logo; CLIENTS[key].bg = c.bg; }
    });
  }catch(e){ console.warn('AGOS: estado local inválido — ignorado', e); }
})();
