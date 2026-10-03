import React, { useState } from "react";
import {
  Code2,
  Play,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  FileCode,
  ShieldCheck,
  GitBranch,
  RefreshCw,
  Copy,
  Check,
  Zap,
  Github,
  Upload,
  FlaskConical,
  Terminal as TerminalIcon,
  AlertCircle,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { RUST_EXAMPLES } from "../data/rustExamples";
import { AuditResult, AuditIssue, DryRunCheckResult } from "../types";

interface VsCodeSidebarProps {
  onAudit: (code: string, fileName: string) => Promise<AuditResult | null>;
  onPatch: (code: string, issueTitle: string) => Promise<string | null>;
}

export const VsCodeSidebar: React.FC<VsCodeSidebarProps> = ({ onAudit, onPatch }) => {
  const [selectedExample, setSelectedExample] = useState<string>(RUST_EXAMPLES[0].id);
  const [code, setCode] = useState<string>(RUST_EXAMPLES[0].code);
  const [fileName, setFileName] = useState<string>("vault_deposit.rs");
  const [prNumber, setPrNumber] = useState<string>("PR #142 (Anchor Vault Fix)");
  const [loadingAudit, setLoadingAudit] = useState<boolean>(false);
  const [loadingPatch, setLoadingPatch] = useState<boolean>(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [patchedCode, setPatchedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewTab, setViewTab] = useState<"code" | "diff" | "report">("code");

  // Dry-run Linter & Compiler Check states
  const [dryRunResult, setDryRunResult] = useState<DryRunCheckResult | null>(null);
  const [loadingDryRun, setLoadingDryRun] = useState<boolean>(false);
  const [dryRunCommand, setDryRunCommand] = useState<string>("cargo check --color=never");
  const [dryRunBlockedError, setDryRunBlockedError] = useState<string | null>(null);
  const [showDryRunDetails, setShowDryRunDetails] = useState<boolean>(true);
  const [safePatchedBackup, setSafePatchedBackup] = useState<string | null>(null);

  // GitHub MCP Integration states
  const [githubToken, setGithubToken] = useState<string>("");
  const [githubOwner, setGithubOwner] = useState<string>("marcoantonio");
  const [githubRepo, setGithubRepo] = useState<string>("solana-anchor-vault");
  const [scanningGithub, setScanningGithub] = useState<boolean>(false);
  const [pushingPatch, setPushingPatch] = useState<boolean>(false);
  const [githubPrs, setGithubPrs] = useState<any[]>([]);
  const [commitSuccessUrl, setCommitSuccessUrl] = useState<string | null>(null);

  const handleScanGithubPrs = async () => {
    setScanningGithub(true);
    setCommitSuccessUrl(null);
    try {
      const res = await fetch("/api/github/scan-prs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: githubToken,
          owner: githubOwner,
          repo: githubRepo,
        }),
      });
      const data = await res.json();
      if (data.failedPRs) {
        setGithubPrs(data.failedPRs);
      }
    } catch (err) {
      console.error("Erro ao scanear PRs no GitHub:", err);
    } finally {
      setScanningGithub(false);
    }
  };

  const handleExecuteDryRun = async (codeToTest?: string, cmdToUse?: string) => {
    const targetCode = codeToTest !== undefined ? codeToTest : (patchedCode || code);
    const cmd = cmdToUse || dryRunCommand;
    setLoadingDryRun(true);
    setDryRunBlockedError(null);

    try {
      const res = await fetch("/api/agent/dry-run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: targetCode,
          filePath: fileName,
          command: cmd,
        }),
      });
      const data = await res.json();
      if (data.dryRunResult) {
        setDryRunResult(data.dryRunResult);
        if (!data.dryRunResult.passed) {
          setDryRunBlockedError(
            `[Dry-Run Reprovado] Detectados ${data.dryRunResult.errorsCount} erro(s) de compilação com '${data.dryRunResult.commandExecuted}'. O commit está estritamente bloqueado para proteger o repositório.`
          );
        } else {
          setDryRunBlockedError(null);
        }
      }
    } catch (err: any) {
      console.error("Erro ao executar Dry-run:", err);
    } finally {
      setLoadingDryRun(false);
    }
  };

  const handleSimulateSyntaxError = () => {
    if (!patchedCode) return;
    if (!safePatchedBackup) {
      setSafePatchedBackup(patchedCode);
    }
    // Injeta propositalmente um erro de sintaxe (chaves desbalanceadas e ponto e vírgula ausente)
    const brokenCode = patchedCode + "\n\n// [ERRO SINTÁTICO INJETADO PARA TESTE DE PRE-COMMIT DRY-RUN]\npub fn broken_syntax_probe() {\n    let unclosed_statement = 42\n";
    setPatchedCode(brokenCode);
    handleExecuteDryRun(brokenCode);
  };

  const handleRestoreSafePatch = () => {
    if (safePatchedBackup) {
      setPatchedCode(safePatchedBackup);
      handleExecuteDryRun(safePatchedBackup);
      setDryRunBlockedError(null);
    }
  };

  const handlePushPatchToGithub = async () => {
    if (!patchedCode) return;

    // Trava de segurança: Se o Dry-run tiver falhado, bloqueia o commit
    if (dryRunResult && !dryRunResult.passed) {
      setDryRunBlockedError(
        `Commit Bloqueado: O patch não passou no Dry-run ('${dryRunResult.commandExecuted}') com ${dryRunResult.errorsCount} erro(s) de compilação. Corrija o código antes de commitar.`
      );
      return;
    }

    setPushingPatch(true);
    setDryRunBlockedError(null);

    try {
      const res = await fetch("/api/github/push-patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: githubToken,
          owner: githubOwner,
          repo: githubRepo,
          branch: "fix/anchor-vault-cpi",
          filePath: `programs/solana-vault/src/${fileName}`,
          newContent: patchedCode,
          commitMessage: `[Rug Safe Patch] Auto-fix Anchor security vulnerability in ${fileName} (Dry-run: ${dryRunCommand} PASSED)`,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setDryRunBlockedError(data.error || "Falha ao enviar commit.");
        if (data.dryRunResult) {
          setDryRunResult(data.dryRunResult);
        }
        return;
      }

      if (data.commitUrl) {
        setCommitSuccessUrl(data.commitUrl);
      }
      if (data.dryRunResult) {
        setDryRunResult(data.dryRunResult);
      }
    } catch (err: any) {
      console.error("Erro ao enviar commit ao GitHub:", err);
      setDryRunBlockedError(`Erro ao enviar commit: ${err.message}`);
    } finally {
      setPushingPatch(false);
    }
  };

  const handleSelectExample = (id: string) => {
    const found = RUST_EXAMPLES.find((ex) => ex.id === id);
    if (found) {
      setSelectedExample(id);
      setCode(found.code);
      setFileName(found.name.split(" ")[0]);
      setAuditResult(null);
      setPatchedCode(null);
      setDryRunResult(null);
      setDryRunBlockedError(null);
    }
  };

  const handleRunAudit = async () => {
    setLoadingAudit(true);
    setPatchedCode(null);
    setDryRunResult(null);
    try {
      const res = await onAudit(code, fileName);
      setAuditResult(res);
      setViewTab("report");
    } finally {
      setLoadingAudit(false);
    }
  };

  const handleApplyRugPatch = async (issueTitle: string) => {
    setLoadingPatch(true);
    setDryRunBlockedError(null);
    try {
      const result = await onPatch(code, issueTitle);
      if (result) {
        setPatchedCode(result);
        setSafePatchedBackup(result);
        setViewTab("diff");
        // Executa imediatamente a etapa de Dry-run sobre o código modificado
        handleExecuteDryRun(result, dryRunCommand);
      }
    } finally {
      setLoadingPatch(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full p-4 bg-slate-900 text-slate-100 rounded-lg border border-slate-800">
      {/* Sidebar Panel - VS Code Extension Style */}
      <div className="lg:col-span-4 bg-slate-950 p-4 rounded-lg border border-slate-800 flex flex-col gap-4">
        {/* Extension Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-sky-500/10 border border-sky-500/30 rounded text-sky-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                SOLANA AUDITOR IDE
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300 font-mono">VS CODE</span>
              </h2>
              <p className="text-[11px] text-slate-400">Análise de PRs &amp; Segurança Rust</p>
            </div>
          </div>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" title="IDE Service Connected" />
        </div>

        {/* PR Selector & Presets */}
        <div className="space-y-3 text-xs">
          <div>
            <label className="block text-slate-400 font-medium mb-1">Carregar Exemplo Anchor / Rust:</label>
            <select
              id="select-rust-example"
              value={selectedExample}
              onChange={(e) => handleSelectExample(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-sky-500"
            >
              {RUST_EXAMPLES.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Nome do Arquivo:</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Target PR:</label>
              <input
                type="text"
                value={prNumber}
                onChange={(e) => setPrNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-xs"
              />
            </div>
          </div>

          {/* GitHub MCP Connector Section */}
          <div className="p-2.5 bg-slate-900 border border-slate-800 rounded space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-200 flex items-center gap-1.5">
                <Github className="w-4 h-4 text-purple-400" /> GitHub MCP Connector
              </span>
              <span className="text-[10px] text-purple-400 font-mono">Octokit REST</span>
            </div>

            <div className="space-y-1.5">
              <input
                type="password"
                value={githubToken}
                onChange={(e) => setGithubToken(e.target.value)}
                placeholder="Personal Access Token (PAT) - opcional para simulação"
                className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono"
              />
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="text"
                  value={githubOwner}
                  onChange={(e) => setGithubOwner(e.target.value)}
                  placeholder="Owner (ex: marcoantonio)"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono"
                />
                <input
                  type="text"
                  value={githubRepo}
                  onChange={(e) => setGithubRepo(e.target.value)}
                  placeholder="Repo (ex: solana-vault)"
                  className="w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 text-[11px] font-mono"
                />
              </div>
            </div>

            <button
              id="btn-scan-github-prs"
              onClick={handleScanGithubPrs}
              disabled={scanningGithub}
              className="w-full flex items-center justify-center gap-1.5 bg-purple-600/30 hover:bg-purple-600/40 text-purple-300 border border-purple-500/40 py-1.5 px-2 rounded text-[11px] font-medium transition-colors"
            >
              {scanningGithub ? (
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Github className="w-3.5 h-3.5" />
              )}
              <span>Varrer PRs Quebrados no CI/CD (Octokit)</span>
            </button>

            {githubPrs.length > 0 && (
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">
                  PRs com Falha no CI/CD ({githubPrs.length}):
                </span>
                {githubPrs.map((pr) => (
                  <div
                    key={pr.pullNumber}
                    className="p-2 bg-slate-950 border border-rose-900/60 rounded text-[11px] space-y-1"
                  >
                    <div className="flex items-center justify-between font-bold text-slate-200">
                      <span>PR #{pr.pullNumber}</span>
                      <span className="text-amber-400 font-mono text-[10px]">{pr.branch}</span>
                    </div>
                    <p className="text-slate-400 text-[10px] leading-tight">{pr.title}</p>
                    <button
                      onClick={() => {
                        setPrNumber(`PR #${pr.pullNumber} (${pr.branch})`);
                        handleRunAudit();
                      }}
                      className="text-[10px] text-sky-400 hover:underline flex items-center gap-1 mt-1"
                    >
                      <span>Auditar Arquivos Alterados ({pr.changedFiles.length})</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <button
            id="btn-run-audit"
            onClick={handleRunAudit}
            disabled={loadingAudit}
            className="w-full flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:bg-slate-800 text-white font-semibold py-2 px-3 rounded text-xs transition-colors shadow-sm"
          >
            {loadingAudit ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Auditando Grafo &amp; Ast Rust...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>EXECUTAR VARREDURA COMPLETA (AUDIT)</span>
              </>
            )}
          </button>
        </div>

        {/* Audit Metrics & Vulnerabilities Panel */}
        {auditResult && (
          <div className="mt-2 border-t border-slate-800 pt-3 space-y-3 flex-1 overflow-y-auto pr-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300">SECURITY SCORE</span>
              <span className={`font-mono text-sm font-bold px-2 py-0.5 rounded ${
                auditResult.metrics.securityScore >= 80
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : auditResult.metrics.securityScore >= 50
                  ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}>
                {auditResult.metrics.securityScore} / 100
              </span>
            </div>

            {/* Severity Counters */}
            <div className="grid grid-cols-3 gap-1.5 text-[11px] text-center font-mono">
              <div className="bg-rose-950/40 border border-rose-800/60 p-1.5 rounded">
                <span className="block text-rose-400 font-bold">{auditResult.metrics.critical}</span>
                <span className="text-slate-400 text-[10px]">CRÍTICOS</span>
              </div>
              <div className="bg-amber-950/40 border border-amber-800/60 p-1.5 rounded">
                <span className="block text-amber-400 font-bold">{auditResult.metrics.high}</span>
                <span className="text-slate-400 text-[10px]">ALTOS</span>
              </div>
              <div className="bg-sky-950/40 border border-sky-800/60 p-1.5 rounded">
                <span className="block text-sky-400 font-bold">{auditResult.metrics.medium}</span>
                <span className="text-slate-400 text-[10px]">MÉDIOS</span>
              </div>
            </div>

            {/* Found Issues List */}
            <div className="space-y-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Vulnerabilidades Encontradas ({auditResult.issues.length})
              </h3>
              {auditResult.issues.length === 0 ? (
                <div className="p-2.5 bg-emerald-950/20 border border-emerald-800/50 rounded text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Nenhum risco detectado no AST/Anchor atual.</span>
                </div>
              ) : (
                auditResult.issues.map((issue: AuditIssue) => (
                  <div
                    key={issue.id}
                    className="p-2.5 rounded bg-slate-900 border border-slate-800 space-y-1 hover:border-slate-700 transition-colors"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`px-1.5 py-0.2 rounded font-mono text-[10px] font-bold ${
                        issue.severity === "CRITICAL"
                          ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          : issue.severity === "HIGH"
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                          : "bg-sky-500/20 text-sky-300 border border-sky-500/40"
                      }`}>
                        {issue.severity}
                      </span>
                      {issue.line && (
                        <span className="text-slate-400 font-mono text-[11px]">Linha {issue.line}</span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-slate-100">{issue.title}</p>
                    <p className="text-[11px] text-slate-400 leading-tight">{issue.description}</p>
                    <div className="pt-1">
                      <button
                        id={`btn-apply-rug-${issue.id}`}
                        onClick={() => handleApplyRugPatch(issue.title)}
                        disabled={loadingPatch}
                        className="w-full flex items-center justify-center gap-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 py-1 px-2 rounded text-[11px] transition-colors"
                      >
                        <Wrench className="w-3 h-3 text-emerald-400" />
                        <span>Gerar Patch Rug Safe (1-Click Fix)</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Area (Code View, Diff, or AI Report) */}
      <div className="lg:col-span-8 bg-slate-950 rounded-lg border border-slate-800 flex flex-col">
        {/* Workspace Nav Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/60 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-300">
            <FileCode className="w-4 h-4 text-sky-400" />
            <span>src/{fileName}</span>
            <span className="text-slate-500">|</span>
            <GitBranch className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400">{prNumber}</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="view-tab-code"
              onClick={() => setViewTab("code")}
              className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                viewTab === "code"
                  ? "bg-sky-600 text-white"
                  : "text-slate-400 hover:bg-slate-800"
              }`}
            >
              Código Rust
            </button>
            {patchedCode && (
              <button
                id="view-tab-diff"
                onClick={() => setViewTab("diff")}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium flex items-center gap-1 ${
                  viewTab === "diff"
                    ? "bg-emerald-600 text-white"
                    : "text-emerald-400 hover:bg-slate-800"
                }`}
              >
                <Zap className="w-3 h-3" />
                <span>Patch Rug (Diff)</span>
              </button>
            )}
            {auditResult && (
              <button
                id="view-tab-report"
                onClick={() => setViewTab("report")}
                className={`px-3 py-1 rounded text-xs transition-colors font-medium ${
                  viewTab === "report"
                    ? "bg-purple-600 text-white"
                    : "text-purple-400 hover:bg-slate-800"
                }`}
              >
                Relatório IA
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {viewTab === "code" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span>Editor Rust / Anchor (Editável):</span>
                <button
                  onClick={() => copyToClipboard(code)}
                  className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copiado!" : "Copiar"}</span>
                </button>
              </div>
              <textarea
                id="editor-code-input"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                rows={22}
                className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-xs font-mono text-slate-200 focus:outline-none focus:border-sky-500 leading-relaxed shadow-inner"
              />
            </div>
          )}

          {viewTab === "diff" && patchedCode && (
            <div className="space-y-4">
              {commitSuccessUrl && (
                <div className="p-3 bg-purple-950/40 border border-purple-800 rounded text-xs text-purple-300 flex items-center justify-between font-mono">
                  <span>✔ Patch commitado com sucesso no GitHub!</span>
                  <a
                    href={commitSuccessUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-sky-400 hover:text-sky-300"
                  >
                    Ver Commit no GitHub ➔
                  </a>
                </div>
              )}

              {/* Error Block Alert if Dry-run fails */}
              {dryRunBlockedError && (
                <div className="p-3 bg-rose-950/60 border border-rose-600 rounded text-xs text-rose-200 flex items-start justify-between gap-3 shadow-lg">
                  <div className="flex items-start gap-2">
                    <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-rose-300 uppercase tracking-wide">
                        COMMIT BLOQUEADO PELO DRY-RUN
                      </h4>
                      <p className="text-[11px] text-rose-200 mt-1 leading-relaxed">
                        {dryRunBlockedError}
                      </p>
                    </div>
                  </div>
                  {safePatchedBackup && (
                    <button
                      onClick={handleRestoreSafePatch}
                      className="px-2.5 py-1 bg-rose-700 hover:bg-rose-600 text-white rounded text-[11px] font-semibold shrink-0 transition-colors"
                    >
                      Restaurar Patch Válido
                    </button>
                  )}
                </div>
              )}

              {/* Dry-run Verification & Linter Control Panel */}
              <div className={`p-3 rounded border text-xs transition-all ${
                dryRunResult?.passed
                  ? "bg-slate-900 border-emerald-500/50"
                  : dryRunResult && !dryRunResult.passed
                  ? "bg-rose-950/30 border-rose-500/70"
                  : "bg-slate-900 border-slate-800"
              }`}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${
                      dryRunResult?.passed
                        ? "bg-emerald-500/20 text-emerald-400"
                        : dryRunResult && !dryRunResult.passed
                        ? "bg-rose-500/20 text-rose-400"
                        : "bg-sky-500/20 text-sky-400"
                    }`}>
                      <FlaskConical className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-200">ETAPA DE DRY-RUN (PRE-COMMIT LINTER)</span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          loadingDryRun
                            ? "bg-sky-500/20 text-sky-300 animate-pulse"
                            : dryRunResult?.passed
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                            : dryRunResult && !dryRunResult.passed
                            ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {loadingDryRun
                            ? "Compilando..."
                            : dryRunResult?.passed
                            ? `✔ PASSED (${dryRunResult.commandExecuted})`
                            : dryRunResult && !dryRunResult.passed
                            ? `✖ ERRO (${dryRunResult.errorsCount} erros de compilação)`
                            : "Pendente"}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">
                        Executa linter/compiler estrito antes de commitar para garantir que o patch não introduza erros.
                      </p>
                    </div>
                  </div>

                  {/* Actions & Linter Command Selection */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <select
                      value={dryRunCommand}
                      onChange={(e) => {
                        const newCmd = e.target.value;
                        setDryRunCommand(newCmd);
                        handleExecuteDryRun(undefined, newCmd);
                      }}
                      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 text-slate-200 font-mono text-[11px] focus:outline-none focus:border-sky-500"
                    >
                      <option value="cargo check --color=never">cargo check</option>
                      <option value="cargo clippy --fix --allow-dirty">cargo clippy --fix</option>
                      <option value="npx eslint --fix">eslint --fix</option>
                      <option value="python -m py_compile">python py_compile</option>
                    </select>

                    <button
                      onClick={() => handleExecuteDryRun()}
                      disabled={loadingDryRun}
                      className="flex items-center gap-1 px-2.5 py-1 bg-sky-600/30 hover:bg-sky-600/40 text-sky-300 border border-sky-500/40 rounded text-[11px] transition-colors font-medium"
                    >
                      {loadingDryRun ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Play className="w-3 h-3 fill-current" />}
                      <span>Rodar Dry-Run</span>
                    </button>

                    <button
                      onClick={handleSimulateSyntaxError}
                      title="Injeta deliberadamente um erro sintático para testar a trava de segurança do commit"
                      className="flex items-center gap-1 px-2 py-1 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/40 rounded text-[10px] transition-colors"
                    >
                      <span>Simular Erro Sintático</span>
                    </button>

                    <button
                      onClick={() => setShowDryRunDetails(!showDryRunDetails)}
                      className="p-1 hover:bg-slate-800 rounded text-slate-400"
                    >
                      {showDryRunDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Dry-run Diagnostics & Compiler Log Output */}
                {showDryRunDetails && dryRunResult && (
                  <div className="mt-2.5 space-y-2">
                    {/* Error / Warning Badges */}
                    {dryRunResult.diagnostics.length > 0 && (
                      <div className="space-y-1">
                        {dryRunResult.diagnostics.map((diag, i) => (
                          <div
                            key={i}
                            className={`p-2 rounded text-[11px] font-mono flex items-start gap-2 ${
                              diag.severity === "ERROR"
                                ? "bg-rose-950/50 border border-rose-900 text-rose-300"
                                : "bg-amber-950/50 border border-amber-900 text-amber-300"
                            }`}
                          >
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-center justify-between font-bold">
                                <span>{diag.severity}: {diag.message}</span>
                                {diag.line && <span className="text-[10px] text-slate-400">Linha {diag.line}:{diag.column || 1}</span>}
                              </div>
                              {diag.snippet && (
                                <code className="block mt-0.5 text-[10px] text-slate-300 bg-slate-950 p-1 rounded">
                                  {diag.snippet}
                                </code>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Terminal Output */}
                    <div className="bg-slate-950 border border-slate-800 rounded p-2.5 font-mono text-[11px]">
                      <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-1 mb-1.5">
                        <span className="flex items-center gap-1">
                          <TerminalIcon className="w-3 h-3 text-slate-500" />
                          <span>Console de Saída: {dryRunResult.commandExecuted}</span>
                        </span>
                        <span>Tempo: {dryRunResult.executionTimeMs}ms | Código de Saída: {dryRunResult.passed ? "0" : "1"}</span>
                      </div>
                      <pre className={`whitespace-pre-wrap leading-relaxed ${
                        dryRunResult.passed ? "text-emerald-300" : "text-rose-300"
                      }`}>
                        {dryRunResult.stdout || dryRunResult.stderr}
                      </pre>
                    </div>
                  </div>
                )}
              </div>

              {/* Patch Actions */}
              <div className="p-3 bg-emerald-950/20 border border-emerald-800/60 rounded text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-bold">Patch Mutacional Determinístico Gerado pelo Rug Engine</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Substituídas declarações vulneráveis por abstrações tipadas de produção.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    id="btn-push-patch-github"
                    onClick={handlePushPatchToGithub}
                    disabled={pushingPatch || (dryRunResult ? !dryRunResult.passed : false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-white text-xs font-medium rounded transition-colors ${
                      dryRunResult && !dryRunResult.passed
                        ? "bg-rose-900/60 cursor-not-allowed text-rose-300 border border-rose-700/50"
                        : "bg-purple-600 hover:bg-purple-500"
                    }`}
                    title={
                      dryRunResult && !dryRunResult.passed
                        ? "Commit bloqueado: O Dry-run detectou erros de compilação"
                        : "Commita o patch na branch isolada e abre o PR"
                    }
                  >
                    {pushingPatch ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Upload className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {dryRunResult && !dryRunResult.passed
                        ? "Commit Bloqueado (Erros no Dry-Run)"
                        : "Push Commit ao GitHub (Dry-Run ✔)"}
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      setCode(patchedCode);
                      setViewTab("code");
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded transition-colors"
                  >
                    Aplicar ao Editor Principal
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <h4 className="text-xs font-bold text-rose-400 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Código Original (Com Riscos)
                  </h4>
                  <pre className="p-3 bg-slate-900 border border-slate-800 rounded text-[11px] font-mono text-slate-300 overflow-x-auto h-[440px]">
                    {code}
                  </pre>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Código Refatorado (Rug Patch)
                  </h4>
                  <pre className="p-3 bg-slate-900 border border-emerald-900/50 rounded text-[11px] font-mono text-emerald-200 overflow-x-auto h-[440px]">
                    {patchedCode}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {viewTab === "report" && auditResult && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
                    PARECER TÉCNICO DE SEGURANÇA E ENGENHARIA
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{auditResult.timestamp}</span>
                </div>
                <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                  {auditResult.aiExpertSummary}
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                <h4 className="text-xs font-bold text-slate-200">Rastreabilidade &amp; Métricas do GraphRAG:</h4>
                <ul className="text-xs text-slate-400 space-y-1 font-mono">
                  <li>• Nós de dependência mapeados: {auditResult.metrics.graphRagNodes}</li>
                  <li>• Score Clippy Linter: {auditResult.metrics.clippyScore} / 100</li>
                  <li>• Validação de Contas Solana/Anchor: {auditResult.metrics.critical === 0 ? "PASSED" : "FAILED (Ação Necessária)"}</li>
                  <li>• Status CI/CD: Ready for Patch Injection</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
