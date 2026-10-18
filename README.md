# 🛡️ EGC Solana Security & SecOps Agent
### *Enterprise Governance Cognitive (EGC) Ecosystem & Autonomous DevSecOps Engine*

[![EGC Architecture](https://img.shields.io/badge/Architecture-EGC%20Cognitive%20Governance-blue.svg)](https://github.com/marcoantonio/solana-security-agent)
[![Solana Anchor](https://img.shields.io/badge/Solana-Anchor%200.30%20%2F%20Rust-black?logo=solana)](https://solana.com)
[![GitHub MCP](https://img.shields.io/badge/MCP-GitHub%20Octokit%20Connector-purple?logo=github)](https://github.com)
[![Termux Android](https://img.shields.io/badge/Termux-Bidirectional%20Sync-22c55e?logo=android)](https://termux.dev)
[![Gemini AI Engine](https://img.shields.io/badge/AI%20Engine-Gemini%20Interactions%20API-orange)](https://ai.google.dev)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Sumário Executivo & Papel

O **EGC Solana Security & SecOps Agent** atua como o **Arquiteto Chefe de Software e Líder Técnico Autônomo** do ecossistema **EGC (Enterprise Governance Cognitive)**. 

Concebido para operações contínuas de **DevSecOps e Engenharia Confiável**, o agente opera como um motor inteligente para **monitorizar, diagnosticar, auditar, verificar sintática e compilação em dry-run e auto-remediar cirurgicamente falhas de código, testes de unidade e pipelines de CI/CD** diretamente no repositório GitHub do ecossistema EGC, com suporte simultâneo a ambientes de desenvolvimento em **VS Code (Desktop)** e **Termux CLI (Android Móvel)** através de **sincronização de estado bidirecional determinística**.

---

## 🏛️ Visão Geral da Arquitetura

```
+====================================================================================================+
|                                  ECOSSISTEMA EGC - CAMADA DE ENTRADA                               |
+====================================================================================================+
         |                                                                        |
         v                                                                        v
+-----------------------------------+                 +----------------------------------------------+
|     📱 TERMINAL MÓVEL TERMUX      |                 |           💻 IDE EXTENSION (VS CODE)         |
|   - CLI nativo Android (`bash`)   |                 | - Editor Side-by-Side com Diff Viewer        |
|   - Comandos `solana-agent *`     |                 | - Painel de Inspeção de AST e Linters        |
|   - Configurações locais persist. |                 | - 1-Click Commit & Deploy para GitHub        |
+-----------------------------------+                 +----------------------------------------------+
         ^                                                                        ^
         |                                                                        |
         +------------------- [ BARRAMENTO DE SINCRONIA BIDIRECIONAL ] ----------+
         |                    - Eventos de Alteração em Tempo Real                |
         |                    - Controle de Revisões & Resolução de Conflitos     |
         |                    - Telemetria de Latência & Auditoria de Estado      |
         v                                                                        v
+====================================================================================================+
|                                CORE ENGINE & ORQUESTRADOR BACKEND (Express / Node.js)              |
+====================================================================================================+
                                                  |
     +--------------------------------------------+--------------------------------------------+
     |                                            |                                            |
     v                                            v                                            v
+---------------------------+        +---------------------------+        +----------------------------+
| 🔍 AUDIT & RUG PATCH      |        | 🛡️ DRY-RUN GATEKEEPER     |        | 🐙 GITHUB MCP CONNECTOR    |
| - Detector de Falhas Rust |        | - Validação Pré-Commit    |        | - @octokit/rest Integration|
| - Signer & CPI Checks     |        | - `cargo check` & Clippy  |        | - Varredura de PRs & Checks|
| - Geração de Patch Limpo  |        | - Bloqueador de Quebras   |        | - Push para Branches Fixes |
+---------------------------+        +---------------------------+        +----------------------------+
     |                                            |                                            |
     v                                            v                                            v
+---------------------------+        +---------------------------+        +----------------------------+
| 🕸️ GRAPHRAG & AST HYBRID  |        | ⚙️ BPMN 2.0 ORCHESTRATOR  |        | 🔌 MCP BUS (7 SERVICES)    |
| - Grafo de Contas & CPIs  |        | - Processos DDD Rígidos   |        | - AST, Rust, Octokit, Sync |
| - Respostas Sem Alucinação|        | - Fallback e Rollback     |        | - Telemetria Graf / SLA    |
+---------------------------+        +---------------------------+        +----------------------------+
```

---

## ⚡ Principais Componentes e Capacidades

### 1. 🐙 GitHub MCP Connector (`@octokit/rest`)
- **Varredura Contínua de PRs e CI/CD:** Interage via MCP/REST com o GitHub para inspecionar Pull Requests abertos e execuções de Check Runs com falha (`failure`, `timed_out`, `action_required`).
- **Extração Cirúrgica de Erros:** Mapeia arquivos alterados em TypeScript/Node.js e Rust/Anchor, extraindo logs de compilação, falhas em testes unitários e stack traces.
- **Push Automatizado com Selo de Auditoria:** Submete commits de remediação para branches dedicadas (e.g. `solana-security-patch/fix-...`), anexando relatório completo de auditoria e logs de validação prévia ao corpo do PR.

### 2. 🛡️ Rug Patch Engine (Auto-Remediação de Código)
- **Remediação Determinística:** Diagnostica a causa raiz de vulnerabilidades e gera patches cirúrgicos limpos (sem adicionar dívida técnica).
- **Padrão Zero-Unwrap:** Garante código Rust/Anchor seguro, eliminando chamadas inseguras de `.unwrap()`, substituindo-as por propagação tipada via `Result<T, ProgramError>` e erros customizados Anchor (`#[error_code]`).
- **Resolução de Concorrência & Worktrees:** Projetado com estratégias de mitigação para travamentos de I/O em Windows (`EBUSY`), gestão concorrente de git worktrees e isolamento de branches.

### 3. ✅ Validador Estrito Pré-Commit (Dry-Run Gatekeeper)
- **Compilação e Linter Mandatórios:** Antes de autorizar qualquer commit ou submissão ao GitHub, o motor executa verificadores estritos:
  - `cargo check --tests --benches`
  - `cargo clippy -- -D warnings`
  - `eslint --fix` / `tsc --noEmit`
  - `python -m py_compile` (em scripts de suporte)
- **Bloqueio Absoluto de Falhas:** Se qualquer aviso crítico ou erro de compilação for acusado no dry-run, a submissão é abortada imediatamente com relatório detalhado de diagnósticos.

### 4. 📱 Infraestrutura Multi-Ambiente: Termux CLI ⇄ Web Interface
- **Terminal Interativo Móvel:** Shell completo simulado e integrável com ambientes Android via Termux (`solana-agent`).
- **Sincronização Bidirecional de Estado:**
  - Alterações realizadas via CLI Termux (`solana-agent config set <chave> <valor>`) propagam-se instantaneamente para a interface Web (VS Code, BPMN, Telemetria).
  - Alterações feitas na interface gráfica Web refletem imediatamente nas variáveis e parâmetros do terminal móvel.
  - Controle formal de número de revisão (`rev`), timestamp ISO e histórico de eventos auditáveis.
- **Comandos Nativos do Termux CLI:**
  ```bash
  solana-agent config                  # Exibe tabela unificada de configurações
  solana-agent config set <key> <val>  # Altera: cluster, file, repo, branch, dry-run, auto-remediate
  solana-agent sync                    # Dispara harmonização forçada e mede latência MCP
  solana-agent audit [arquivo]         # Executa auditoria estática completa
  solana-agent dry-run                 # Roda verificação estrita de compilação
  solana-agent patch                   # Aplica patch cirúrgico gerado
  solana-agent status                  # Status consolidado do agente e dos nós
  solana-agent bpmn                    # Exibe pipeline determinístico ativo
  solana-agent mcp                     # Diagnóstico de serviços do barramento MCP
  ```
- **Interface Visual de Sincronia (`TermuxSyncModal`):** Permite inspeção lado a lado dos estados local e remoto, diff de configurações, reversão com um clique e exportação de relatórios.

### 5. 🕸️ GraphRAG Híbrido (Vetores + Grafo AST)
- **Árvore de Sintaxe Abstrata (AST):** Decomposição sintática de programas Anchor/Rust em nós de instruções (`instructions`), estruturas de contas (`AccountInfo`, `Signer`, `UncheckedAccount`) e chamadas de invocação cruzada (`invoke_signed` CPI).
- **Mitigação de Alucinações:** Busca semântica combinada com navegação dirigida no grafo de dependências, garantindo que o agente só sugira correções factíveis e compiláveis.

### 6. ⚙️ Orquestração Determinística BPMN 2.0 & DDD
- **Pipelines Confiáveis:** Cada processo de auto-remediação segue um diagrama BPMN 2.0 determinístico, com etapas de verificação de segurança, validação de SLA, caminhos de contingência e rollback.
- **Contextos Delimitados (DDD):** Separação estrita entre *Security Analysis Context*, *Patch Engineering Context* e *Release & Git Ops Context*.

### 7. 🔌 Barramento MCP (Microservices Architecture)
- Comunicação padronizada JSON-RPC / HTTP entre 7 serviços especialistas:
  1. `mcp://rust-ast-parser` — Parser de sintaxe e de estruturas Rust.
  2. `mcp://anchor-safety-inspector` — Verificador de regras de negócio Anchor.
  3. `mcp://rug-mutator-engine` — Gerador de patches e mutações de teste.
  4. `mcp://github-octokit-mcp` — Conector REST com a API do GitHub.
  5. `mcp://bpmn-workflow-agent` — Orquestrador de processos determinísticos.
  6. `mcp://graf-telemetry-exporter` — Exportador de métricas e observabilidade.
  7. `mcp://termux-sync-bus` — Barramento de estado para sincronização Termux ⇄ Web.

### 8. 🎨 Graphic Hack (Visual Design Lab)
- Visualizador e gerador de infográficos técnicos de segurança e diagramas de arquitetura, facilitando o diagnóstico executivo de fluxos de contratos inteligentes e mitigação de ataques.

---

## 📂 Estrutura do Repositório

```
├── .env.example                     # Modelo de variáveis de ambiente seguras
├── metadata.json                    # Metadados e capabilities do agente
├── package.json                     # Dependências do frontend e backend
├── README.md                        # Documentação técnica unificada do ecossistema EGC
├── server.ts                        # Servidor Express Full-Stack, APIs REST e MCP Bus
├── src/
│   ├── App.tsx                      # Componente raiz, layout e roteamento de modos
│   ├── types.ts                     # Definições estritas de TypeScript (Sync, Audit, PRs)
│   ├── components/
│   │   ├── BpmnOrchestratorView.tsx # Visualizador interativo de pipelines BPMN 2.0
│   │   ├── GrafTelemetryDashboard.tsx# Painel de métricas e observabilidade do agente
│   │   ├── GraphicHackVisualizer.tsx# Design lab de infográficos de segurança e diagramas
│   │   ├── GraphRagVisualizer.tsx   # Grafo AST interativo e busca híbrida de código
│   │   ├── LeftSidebar.tsx          # Menu de navegação lateral com status ao vivo
│   │   ├── McpBusInspector.tsx      # Inspetor de microserviços do barramento MCP
│   │   ├── TermuxCliTerminal.tsx    # Terminal interativo simulado do Termux CLI
│   │   ├── TermuxSyncModal.tsx      # Modal de gestão da sincronização bidirecional
│   │   └── VsCodeSidebar.tsx        # Extensão IDE VS Code (Auditoria, Diff, Dry-run)
│   ├── data/
│   │   └── rustExamples.ts          # Contratos vulneráveis de teste (Vault, CPI, Signer)
│   └── services/
│       ├── agent.ts                 # Cliente para endpoints de auditoria e dry-run
│       ├── githubMcpConnector.ts    # Cliente do conector GitHub MCP
│       └── termuxSync.ts            # Hook reativo useTermuxSync para sincronização
```

---

## 🛠️ Instalação e Execução

### Pré-requisitos
- **Node.js** v18.0.0 ou superior
- **NPM** ou **Bun**
- Dispositivo Android com **Termux** (opcional, para execução de comandos remotos)

### 1. Clonar o Repositório
```bash
git clone https://github.com/marcoantonio/solana-security-agent.git
cd solana-security-agent
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Configurar Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto a partir do exemplo fornecido:
```bash
cp .env.example .env
```

Edite `.env` conforme necessário:
```env
# Chave da API Google Gemini (para análise cognitiva avançada e patches inteligentes)
GEMINI_API_KEY="AIzaSy..."

# URL da aplicação (gerada automaticamente em ambiente Cloud Run ou localhost)
APP_URL="http://localhost:3000"

# Token de Acesso Pessoal (PAT) do GitHub para varredura e push de PRs ao vivo
GITHUB_TOKEN="ghp_..."
```

> **Nota de Segurança:** Caso nenhuma chave seja inserida, o sistema entra automaticamente no modo **Autônomo / Simulação Determinística**, permitindo demonstração, auditoria e dry-run com dados locais.

### 4. Iniciar o Ambiente de Desenvolvimento
```bash
npm run dev
```
Acesse a aplicação no navegador em: **`http://localhost:3000`**

### 5. Compilação para Produção
```bash
npm run build
npm start
```

---

## 📡 Referência dos Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| `POST` | `/api/audit` | Executa auditoria estática completa em código Rust/Anchor. |
| `POST` | `/api/patch` | Aciona o Rug Patch Engine e devolve o código refatorado com diff. |
| `POST` | `/api/dry-run` | Executa o validador pré-commit (`cargo check`, clippy, linter). |
| `POST` | `/api/github-check` | Varre PRs e Check Runs quebrados no GitHub via Octokit MCP. |
| `POST` | `/api/github-push` | Aplica o patch na branch remota e atualiza o Pull Request. |
| `POST` | `/api/cli-command` | Processa comandos do terminal Termux (`solana-agent ...`). |
| `GET`  | `/api/sync/config` | Consulta o estado consolidado da sincronização Termux ⇄ Web. |
| `POST` | `/api/sync/config` | Atualiza parâmetros sincronizados (cluster, arquivos, regras). |
| `POST` | `/api/sync/reset`  | Restaura as configurações padrão do ecossistema EGC. |
| `POST` | `/api/graphrag/query` | Executa busca semântica guiada por AST no código fonte. |
| `POST` | `/api/bpmn/execute` | Executa transições de etapas no orquestrador BPMN 2.0. |
| `GET`  | `/api/mcp/services`| Retorna métricas de saúde e latência dos 7 microserviços MCP. |

---

## 🔒 Diretrizes de Qualidade e Segurança Enterprise

1. **Proteção Total de Credenciais:** Tokens do GitHub e chaves de API nunca são expostos no frontend; todas as requisições autenticadas são intermediadas com segurança pelo backend (`server.ts`).
2. **Prevenção de Regressões CI/CD:** O validador de dry-run atua como barreira intransponível: nenhum patch com erros de compilação ou advertências de linters pode ser comitado.
3. **Resiliência Multiplataforma:** Código e scripts testados para garantir compatibilidade com ambientes POSIX (Linux, Android/Termux, macOS) e Windows NT (mitigando bloqueios de `EBUSY`).

---

## 👨‍💻 Autor & Manutenção

- **Líder Técnico & Engenheiro Responsável:** Marco Antônio Conceição
- **Ecossistema:** EGC — Enterprise Governance Cognitive
- **IA Co-Pilot:** Gemini AI & Solana SecOps Autonomous Engine
