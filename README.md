# 🛡️ Solana Security Agent & Anchor Vulnerability Auditor

Plataforma autônoma e orquestrada para **auditoria estática de contratos inteligentes Solana (Anchor/Rust)**, **refatoração de segurança automatizada (Rug Patch Engine)**, **varredura de Pull Requests quebrados no GitHub via MCP (`@octokit/rest`)** e **orquestração determinística de processos via BPMN 2.0 & DDD**.

---

## 🚀 Principais Funcionalidades

### 1. 💻 IDE Extension (VS Code View)
- **Auditoria de Código Rust/Anchor:** Detecta vulnerabilidades críticas em programas Solana, tais como:
  - *Missing Signer Check* (Falta de verificação de assinatura)
  - *Account Validation Vulnerability* (Falta de validação de proprietário/owner do AccountInfo)
  - *Missing CPI Program Check* (Execução de CPI vulnerável sem checar o Program ID)
  - *Reentrancy / Unchecked Account Modifications*
  - *Integer Overflow / Unchecked Math Operations*
- **Rug Patch Engine (Refatorador de Código):** Gera automaticamente correções cirúrgicas com código Rust/Anchor seguro e gera uma comparação lado a lado (`Diff View`).
- **Etapa de Dry-Run Pré-Commit (Garantia de Compilação):** Executa linters e verificadores de compilação estritos (`cargo check`, `cargo clippy --fix`, `eslint --fix`, `python -m py_compile`) sobre o código modificado **antes** de autorizar qualquer commit. Se forem detectados erros sintáticos ou de compilação, o commit é estritamente bloqueado.
- **Push Direct Commit to GitHub:** Aplica os patches de segurança gerados na branch isolada via API do GitHub, anexando o selo de auditoria e os logs do Dry-run ao corpo do Pull Request.

### 2. 🐙 GitHub MCP Connector (`GitHubMcpConnector`)
- **Varredura de PRs no CI/CD:** Varre Pull Requests abertos no repositório buscando execuções de Check Runs com status de falha (`failure`, `timed_out`, `action_required`).
- **Extração de Contexto de Erro:** Mapeia arquivos Rust alterados nos PRs com falhas e envia para análise do pipeline de segurança.
- **Indicador de Status em Tempo Real:** Exibe o status da conexão (`Conectado`, `Modo Simulação`, `Erro de Conexão`) em tempo real no menu lateral (`LeftSidebar`).

### 3. 📱 Termux CLI (Android Mobile Terminal)
- **Terminal Interativo Móvel:** Simulação e execução de linha de comando para auditoria de contratos Solana diretamente em dispositivos móveis Android.
- **Comandos Nativos:** `audit <arquivo>`, `patch <issue>`, `status`, `prs`, `scan-github`, `help` e `clear`.

### 4. ⚙️ Orquestrador BPMN 2.0 & DDD
- **Orquestração Determinística de Processos:** Fluxograma visual de pipelines de auditoria com garantia de SLA e rotas de Fallback.
- **Domínio DDD Rígido:** Isolamento de contextos delimitados (*Security Context*, *Patching Context*, *Deployment Context*).

### 5. 🕸️ GraphRAG Híbrido (Vetores + Grafo AST)
- **Grafo de Dependências de Código:** Mapeia estruturas, chamadas de instruções (`CPI`), contas e tipos em um grafo visual interativo.
- **Respostas Zero-Alucinação:** Combinação de busca por similaridade vetorial com navegação estruturada na Árvore de Sintaxe Abstrata (AST) do Rust.

### 6. 🔌 MCP Bus Services (SOA Microservices)
- **Barramento de Ferramentas Estruturadas:** Comunicação padronizada entre microsserviços via JSON-RPC.
- Inspectores visuais para 6 serviços ativos: *Rust AST Parser*, *Anchor Safety Inspector*, *Rug Mutator Engine*, *GitHub Octokit MCP*, *BPMN Workflow Agent* e *Graf Telemetry Exporter*.

### 7. 📊 Graf Telemetria & Observabilidade
- **Painel de Métricas em Tempo Real:** Monitoramento de tempo de varredura, taxa de patches aplicados com sucesso, uso da API Gemini e saúde dos microsserviços.

---

## 🏗️ Arquitetura do Sistema

```
                         +-----------------------------------+
                         |    Solana Agent UI (React + TS)   |
                         +-----------------------------------+
                                           |
                                           v
     +---------------------------------------------------------------------------+
     |                         LeftSidebar (Navegação & Status)                  |
     +---------------------------------------------------------------------------+
     | [IDE VS Code] | [Termux CLI] | [BPMN Engine] | [GraphRAG] | [MCP Bus] | ...  |
     +---------------------------------------------------------------------------+
                                           |
                                           v
                         +-----------------------------------+
                         |      Servidor Express (`server.ts`) |
                         +-----------------------------------+
                                   /       |       \
                                  /        |        \
                                 v         v         v
                     +---------------+ +-------+ +-------------------------+
                     | Gemini AI SDK | | AST   | | GitHub MCP Connector    |
                     |  (Server-Side)| | Engine| | (@octokit/rest)         |
                     +---------------+ +-------+ +-------------------------+
                                                             |
                                                             v
                                                   +-------------------+
                                                   | GitHub REST API   |
                                                   +-------------------+
```

---

## 📦 Tecnologias Utilizadas

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide React Icons, Motion.
- **Backend:** Node.js, Express, TSX.
- **Build System:** Vite, ESBuild.
- **Integrações de API:** `@octokit/rest` (GitHub REST / MCP), `@google/genai` (Google Gemini AI SDK).
- **Estilo & UI:** Design profissional de alto contraste em tema escuro (Deep Slate / Obsidian UI), layout responsivo desktop e mobile.

---

## 🛠️ Configuração e Execução Local

### Pré-requisitos
- Node.js (versão 18 ou superior)
- NPM

### Passos para Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/marcoantonio/solana-security-agent.git
   cd solana-security-agent
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Copie o arquivo `.env.example` para `.env` e preencha suas credenciais:
   ```bash
   cp .env.example .env
   ```

   *Exemplo de `.env`:*
   ```env
   GEMINI_API_KEY="Sua_Chave_Gemini_Aqui"
   GITHUB_TOKEN="Seu_GitHub_Personal_Access_Token_Aqui"
   ```

4. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   npm run dev
   ```
   A aplicação estará acessível na porta `3000`: `http://localhost:3000`.

5. **Compilação de Produção:**
   ```bash
   npm run build
   npm start
   ```

---

## 🔒 Segurança e Privacidade

- **Chaves de API Protegidas:** A chave da API Gemini e o Token do GitHub nunca são expostos ao navegador do cliente, permanecendo estritamente no lado do servidor (`server.ts`).
- **Modo Simulação Autônoma:** Caso nenhuma chave do GitHub seja configurada, o sistema opera de forma autônoma no modo *Sandbox / Simulação*, permitindo testar todas as funcionalidades sem credenciais externas.

---

## 👤 Autor

- **Desenvolvedor & Co-Piloto:** Marco Antônio Conceição
- **Engine de IA:** Powered by Gemini AI & Antigravity Agent Engine
