# Agência OS — Dashboard

Sistema operacional interno da agência: acompanhamento de entregas, produção, aprovações, calendário editorial, clientes e financeiro.

Aplicação estática (HTML/CSS/JS puro, sem build), pronta para abrir direto no navegador ou hospedar em qualquer servidor estático.

## Estrutura

- `index.html` — redireciona para a tela de login
- `Login.html` — autenticação (demo)
- `Dashboard.html` — visão geral e KPIs
- `Hoje.html` — entregas do dia
- `Producao.html` — pipeline de produção
- `Calendario.html` — calendário editorial
- `Clientes.html` — gestão de clientes
- `Financeiro.html` — faturamento
- `Aprovacoes.html` — fila de aprovações
- `Arquivos.html` — arquivos e links por cliente
- `Configuracoes.html` — configurações
- `Ana.html` / `Nicole.html` — páginas de equipe
- `States.html` — guia de estados de UI
- `Mobile.html` — visão mobile
- `assets/` — estilos (`app.css`), dados mock (`data.js`, `real_rows.json`) e scripts de cada tela

## Rodando localmente

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000/`.
