# CLAUDE.md — GovMesh

Documento de referência para o Claude Code. Contém tudo que precisa saber sobre este projeto antes de qualquer ação.

---

## 1. O que é o GovMesh

Plataforma de gestão política e de campanha para o estado de **Sergipe**, voltada para a **campanha 2026 de José da Silva** (Governador). Desenvolvida e mantida pela **Fluid TI** (Mardo Carneiro — `mardo@fluid-ti.com`).

Cobre:
- CRM e mobilização de lideranças
- Distribuição e aprovação de kits de conteúdo
- Monitoramento de boatos/desinformação
- Fluxo jurídico/compliance eleitoral
- Gamificação de engajamento
- Radar territorial por região
- Agente WhatsApp inteligente (em desenvolvimento)

URL de produção prevista: `https://govmesh.fluid-ti.com/`

---

## 2. Tech Stack

### Frontend (implementado)
| Tecnologia | Versão | Uso |
|---|---|---|
| React | 18.3.1 | Framework de UI |
| TypeScript | 5.8 | Tipagem estática |
| Vite | 5.4 | Build tool / dev server (porta 8080) |
| Tailwind CSS | 3.4 | Estilização utilitária |
| Shadcn/UI + Radix UI | — | Componentes de UI (60+ componentes) |
| React Router | v6 | Roteamento client-side |
| Framer Motion | — | Animações e transições de página |
| React Hook Form + Zod | — | Formulários e validação |
| TanStack React Query | — | Data fetching e cache |
| Recharts | — | Gráficos e visualizações |
| Leaflet + React Leaflet | — | Mapa interativo (Sergipe) |
| Lucide React | — | Ícones SVG |
| Sonner | — | Toast notifications |
| Vite PWA Plugin | — | Progressive Web App (offline + instalação) |

### Estado / Dados (atual)
- **React Context API** (`GovMeshContext`) com dados completamente mockados em memória
- Sem backend real conectado — toda persistência é in-memory

### Backend planejado (não implementado ainda)
- **Supabase** — banco de dados e autenticação real
- **n8n** — orquestração de fluxos do agente WhatsApp
- **Evolution API** — envio/recebimento de mensagens WhatsApp
- **Claude API (Anthropic)** — geração de respostas do agente
- **Google Custom Search API** — busca de matérias em `se.gov.br/agencia`

---

## 3. Estrutura do Projeto

```
GovMesh/
├── src/
│   ├── pages/                    # 16 páginas de feature
│   │   ├── Dashboard.tsx         # KPIs e visão geral
│   │   ├── Login.tsx             # Autenticação (sem backend real)
│   │   ├── CRM.tsx               # Kanban de lideranças
│   │   ├── Kits.tsx              # Distribuição de conteúdo
│   │   ├── Boatos.tsx            # Monitoramento de desinformação
│   │   ├── Juridico.tsx          # Aprovações e compliance
│   │   ├── Assist.tsx            # Geração de argumentos com IA
│   │   ├── Auditoria.tsx         # Logs de auditoria
│   │   ├── Configuracoes.tsx     # Configurações e perfis
│   │   ├── RadarPage.tsx         # Radar de rede/monitoramento
│   │   ├── EscutaAtiva.tsx       # Sentimento em redes sociais
│   │   ├── Gamificacao.tsx       # Ranking e conquistas
│   │   ├── SimulatorPage.tsx     # Simulador do agente WhatsApp
│   │   ├── Suporte.tsx           # Documentação de ajuda
│   │   └── NotFound.tsx          # 404
│   │
│   ├── components/
│   │   ├── dashboard/            # Widgets do dashboard
│   │   ├── layout/               # AppLayout, Header, Sidebar
│   │   ├── ui/                   # 60+ componentes Shadcn/UI
│   │   ├── pwa/                  # InstallPrompt
│   │   └── NavLink.tsx
│   │
│   ├── contexts/
│   │   └── GovMeshContext.tsx    # Estado global + todos os dados mock
│   │
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   │
│   ├── data/
│   │   └── sergipeRegioes.ts     # 8 regiões geográficas de Sergipe
│   │
│   ├── lib/utils.ts
│   ├── App.tsx                   # Roteador principal
│   ├── main.tsx
│   └── index.css
│
├── Agente/
│   └── 08_AGENTE_WHATSAPP_PLANO.md  # Plano completo do agente n8n
│
├── stack_fluid.md                # Referência de infraestrutura Fluid TI
├── CLAUDE.md                     # Este arquivo
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── components.json               # Config Shadcn/UI
```

---

## 4. Módulos Implementados

| Módulo | Status | Observações |
|---|---|---|
| Dashboard + KPIs | ✅ | Cards, gráficos Recharts, widgets |
| CRM / Lideranças | ✅ | Kanban: Novo → Contatado → Engajado → Multiplicador |
| Kits de Conteúdo | ✅ | Vídeo, áudio, cards, memes. Status: pendente/aprovado/bloqueado |
| Boatos / Desinformação | ✅ | Criticidade, viralizacao, resposta oficial |
| Jurídico / Aprovações | ✅ | Checklist de compliance, aprovação/rejeição com log |
| Assist (IA) | ✅ | Geração de argumentos, fact-checking, fila de aprovação |
| Gamificação | ✅ | Ranking, pontos, conquistas por região |
| Radar / Mapa | ✅ | Leaflet com regiões de Sergipe, sentimento |
| Escuta Ativa | ✅ | Monitoramento de redes sociais, tendências |
| Simulador WhatsApp | 🔄 | Em desenvolvimento ativo |
| Auditoria / Logs | ✅ | Filtros por tipo de ação e usuário |
| Configurações | ✅ | Perfis de acesso, kill-switch, modo eleitoral |
| Backend real | ❌ | Planejado — Supabase não integrado |
| Auth real | ❌ | Tela existe, sem backend |
| Agente WhatsApp real | ❌ | Plano documentado, não implementado |

---

## 5. Perfis de Acesso (RBAC)

4 perfis implementados no sistema:
- **Admin** — acesso total
- **Jurídico** — foco em aprovações e compliance
- **Liderança** — operações de campo e CRM
- **Apoiador** — acesso restrito

---

## 6. Dados Mock (GovMeshContext)

Todos os dados são em memória — sem persistência:
- **Leads:** ~20 lideranças distribuídas nos 4 status do kanban
- **Kits:** 10 itens de conteúdo (vídeo, áudio, card, meme)
- **Boatos:** 6 casos com viralizacao e respostas
- **Logs:** Trilha de auditoria de ações
- **Aprovações:** Fila de compliance jurídico

---

## 7. Regiões de Sergipe

8 regiões configuradas no sistema:
`Capital` · `Grande Aracaju` · `Lagarto` · `Itabaiana` · `Estância` · `Propriá` · `Nossa Senhora do Socorro` + mais 1

---

## 8. Agente WhatsApp — Plano

Documentado em `/Agente/08_AGENTE_WHATSAPP_PLANO.md`. Pipeline:

```
Evolution API (webhook) → n8n (orquestração) → Claude API (LLM) → Google CSE (busca)
```

**4 workflows n8n:**
- **WF-01** — Recepcionista: valida se número está na tabela VIP
- **WF-02** — Onboarding: estados NOVO → AGUARDANDO_REGIAO → ATIVO
- **WF-03** — Assistente: classifica tema → busca matéria → gera resposta → envia
- **WF-04** — Fallback: erros, tema desconhecido, áudio

**Temas cobertos:** SAUDE | OBRAS | EDUCACAO | SEGURANCA | OUTRO

**Fonte de conteúdo:** `site:se.gov.br/agencia` via Google Custom Search

**Banco de imagens:** Cloudflare R2 ou Google Drive (a hospedar)

**Premissa desta fase:** Evolution API (demo/mockup). Produção futura: Meta Cloud API oficial.

---

## 9. Infraestrutura de Deploy

Detalhes completos em `stack_fluid.md`.

### VPS de Produção
| Item | Valor |
|---|---|
| IP | `168.231.90.114` |
| SO | Ubuntu 20.04 LTS |
| Hostname | `CoachAIGym` |
| SSH | `ssh root@168.231.90.114` |
| Portainer | `https://portainer.heymax.fit` |

### Arquitetura
```
Internet → Cloudflare (DNS + Proxy) → VPS :80/443 → Traefik (Docker Swarm) → Nginx containers
```

### Serviços Docker Swarm relevantes
- `traefik_traefik` — proxy reverso (NUNCA matar com `fuser -k 80/tcp`)
- `fluid-site` — serve `/opt/fluid-ti` no host → `fluid-ti.com`
- `n8n_n8n_editor` — workflows do agente WhatsApp

### Fluxo de deploy do GovMesh
```bash
npm run build                          # gera dist/
node deploy.js                         # SFTP para /var/www/fluidti/dist
ssh root@168.231.90.114 "cp -r /var/www/fluidti/dist/* /opt/govmesh/"
ssh root@168.231.90.114 "chmod -R 755 /opt/govmesh"
```

> O deploy.js envia para `/var/www/fluidti/dist` mas o Docker Swarm lê de `/opt/govmesh/`. Sempre copiar após o SFTP.

### ATENÇÃO crítica — Traefik
**NUNCA** rodar `fuser -k 80/tcp` ou `killall nginx` na VPS. Isso derruba todos os sites e o Portainer.
Para reiniciar Traefik com segurança:
```bash
docker service scale traefik_traefik=0 && sleep 5 && docker service scale traefik_traefik=1
```

---

## 10. Comandos de Desenvolvimento

```bash
npm run dev       # Dev server em localhost:8080
npm run build     # Build de produção → dist/
npm run preview   # Preview do build local
```

---

## 11. Design System

Tema escuro com paleta política. Cores customizadas no Tailwind:

| Token | Uso |
|---|---|
| `primary` | Ações principais, CTAs |
| `accent` | Destaques e glows |
| `success` | Status aprovado |
| `warning` | Alertas e médio |
| `destructive` | Erros, crítico, bloqueado |

Componentes: Shadcn/UI com Radix primitives. Animações: Framer Motion para transições de página.

---

## 12. Contexto de Negócio

- **Cliente:** Campanha 2026 do Governador de Sergipe
- **Empresa:** Fluid TI — `fluid-ti.com`
- **Contato:** Mardo Carneiro — `mardo@fluid-ti.com` / WhatsApp `+55 81 99989-7501`
- **Produto:** GovMesh é um dos produtos da Fluid TI (junto com AuditIA, HeyMax, MedIA, Best Before)
- **Fase atual:** Demo/mockup funcional para validação comercial. Backend real vem depois.
- **Prazo:** Apresentações ao vivo em andamento (checklist pré-apresentação em `/Agente/08_AGENTE_WHATSAPP_PLANO.md`)

---

## 13. Credenciais e APIs Externas

### Google Custom Search
- **API Key:** `AIzaSyBIoGLpfMZel3xOrsztDq_XTlp5IUoqa-A`
- **Search Engine ID (cx):** `c71a0fb049b3f40b0`
- **Site indexado:** `se.gov.br/agencia/*`
- **Projeto Google Cloud:** GovMesh
- **Limite gratuito:** 100 buscas/dia

### n8n — Workflows GovMesh (IDs atuais após recriação — Março 2026)
- **WF-01 Recepcionista:** `Fr7Qd6FSjkVy3Q26`
- **WF-02 Onboarding:** `fIRzwo62ZhLzV1KD`
- **WF-03 Assistente Inteligente:** `6UcedZbsjlIdUJnV`
- **WF-04 Fallback:** `nqkgnZagUPks2qVl`

### LLM usado nos workflows
- **Provider:** OpenAI GPT-4o-mini (substituiu Anthropic Claude após configuração inicial)
- **Credencial:** reutiliza credencial OpenAI já existente no n8n

### Instância Evolution API
- **Nome:** `govmesh`
- **URL base:** `https://evo.heymax.fit`
- **Webhook configurado:** `https://webhook.heymax.fit/webhook/govmesh/receive`
- **Evento:** `MESSAGES_UPSERT`

### Números VIP cadastrados
- **Mardo Carneiro** (CEO Fluid TI): `5581999897501`
- **Júlio Filgueiras** (Secretário de Planejamento SE): `5548988663773`

### Lição aprendida — n8n via MCP
Workflows criados via MCP não registram webhook corretamente.
**Solução:** Download JSON → Archive → Recriar na ordem WF-04→WF-03→WF-02→WF-01 → Publish cada um antes do próximo.
