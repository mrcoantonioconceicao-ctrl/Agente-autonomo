import React, { useState } from "react";
import {
  X,
  RefreshCw,
  Smartphone,
  Globe,
  ArrowLeftRight,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Settings,
  Clock,
  RotateCcw,
  Layers,
  Save,
  Check,
  Copy,
} from "lucide-react";
import { BidirectionalSyncState, TermuxSyncConfig, SolanaCluster } from "../types";

interface TermuxSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncState: BidirectionalSyncState;
  loading: boolean;
  onUpdateConfig: (
    partial: Partial<TermuxSyncConfig>,
    source: "web-ui" | "termux-cli",
    action?: string
  ) => Promise<any>;
  onTriggerSync: () => Promise<void>;
  onResetConfig: () => Promise<void>;
}

export const TermuxSyncModal: React.FC<TermuxSyncModalProps> = ({
  isOpen,
  onClose,
  syncState,
  loading,
  onUpdateConfig,
  onTriggerSync,
  onResetConfig,
}) => {
  const [activeTab, setActiveTab] = useState<"settings" | "events" | "cli">("settings");
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Form local state
  const [formConfig, setFormConfig] = useState<TermuxSyncConfig>({ ...syncState.config });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  // Keep form in sync when modal opens or syncState revision changes
  React.useEffect(() => {
    setFormConfig({ ...syncState.config });
  }, [syncState.revision]);

  if (!isOpen) return null;

  const handleSave = async (source: "web-ui" | "termux-cli") => {
    const res = await onUpdateConfig(
      formConfig,
      source,
      source === "web-ui"
        ? "Configurações sincronizadas a partir do painel Web"
        : "Configurações sincronizadas simulando Termux CLI local"
    );
    if (res) {
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <ArrowLeftRight className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base">
                  Sincronização Bidirecional Termux ⇄ Web
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Rev #{syncState.revision}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Manutenção de coerência em tempo real entre o ambiente móvel (Android) e a estação Web
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Synchrony Hero Ribbon */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between text-xs gap-3 font-mono">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-300">
              <Smartphone className="w-4 h-4" />
              <span>{syncState.config.termuxDeviceId}</span>
            </span>
            <span className="text-slate-600">⇄</span>
            <span className="flex items-center gap-1.5 text-sky-300">
              <Globe className="w-4 h-4" />
              <span>EGC Web Platform</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">
              Latência: <strong className="text-emerald-400">{syncState.latencyMs}ms</strong>
            </span>
            <span className="text-slate-400">
              Última Origem:{" "}
              <strong className="text-amber-300 uppercase">{syncState.lastSyncSource}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onTriggerSync}
              disabled={loading}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-amber-400" : ""}`} />
              <span>Forçar Sincronia</span>
            </button>
            <button
              onClick={onResetConfig}
              disabled={loading}
              className="flex items-center gap-1 px-2.5 py-1 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/50 text-rose-300 rounded text-xs transition-colors"
              title="Restaurar padrões de fábrica do EGC"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/50 px-5 text-xs">
          <button
            onClick={() => setActiveTab("settings")}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "settings"
                ? "border-amber-400 text-amber-300 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurações Unificadas</span>
          </button>
          <button
            onClick={() => setActiveTab("events")}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "events"
                ? "border-amber-400 text-amber-300 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Histórico de Sincronia ({syncState.events.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("cli")}
            className={`py-2.5 px-3 font-medium border-b-2 flex items-center gap-1.5 transition-colors ${
              activeTab === "cli"
                ? "border-amber-400 text-amber-300 bg-slate-800/40"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Comandos Termux CLI</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 text-xs text-slate-200 space-y-4">
          {saveSuccess && (
            <div className="p-3 bg-emerald-950/60 border border-emerald-800 rounded-lg text-emerald-300 flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Configurações salvas e propagadas bidirecionalmente em tempo real!</span>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Solana Cluster */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Cluster Solana</span>
                    <span className="text-[10px] text-amber-400 uppercase font-mono">
                      {formConfig.solanaCluster}
                    </span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Define o endpoint RPC e cluster nos testes e simulações tanto no Termux quanto no Web UI.
                  </p>
                  <select
                    value={formConfig.solanaCluster}
                    onChange={(e) =>
                      setFormConfig({ ...formConfig, solanaCluster: e.target.value as SolanaCluster })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  >
                    <option value="devnet">devnet (Padrão de Validação)</option>
                    <option value="mainnet-beta">mainnet-beta (Produção Segura)</option>
                    <option value="testnet">testnet (Staging Solana)</option>
                    <option value="localnet">localnet (127.0.0.1:8899)</option>
                  </select>
                </div>

                {/* Active Rust File Path */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Arquivo Alvo Ativo</span>
                    <span className="text-[10px] text-sky-400 font-mono">Rust/Anchor</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Arquivo monitorado para auditorias de segurança e geração cirúrgica de patch.
                  </p>
                  <input
                    type="text"
                    value={formConfig.activeFilePath}
                    onChange={(e) => setFormConfig({ ...formConfig, activeFilePath: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="programs/solana-vault/src/lib.rs"
                  />
                </div>

                {/* Dry-Run Pre-Commit Verification */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Comando Linter Pré-Commit (Dry-Run)</span>
                    <span className="text-[10px] text-emerald-400 font-mono">Strict Check</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Comando executado sobre o código antes de autorizar qualquer commit.
                  </p>
                  <input
                    type="text"
                    value={formConfig.dryRunCommand}
                    onChange={(e) => setFormConfig({ ...formConfig, dryRunCommand: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                    placeholder="cargo check --color=never"
                  />
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="enforceDryRunCheckbox"
                      type="checkbox"
                      checked={formConfig.enforceDryRun}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, enforceDryRun: e.target.checked })
                      }
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="enforceDryRunCheckbox" className="text-[11px] text-slate-300 cursor-pointer">
                      Bloquear commit se o linter encontrar erros de compilação
                    </label>
                  </div>
                </div>

                {/* Auto Remediate Rug Patch */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300 flex items-center justify-between">
                    <span>Auto-Remediação Rug</span>
                    <span className="text-[10px] text-purple-400 font-mono">AST Engine</span>
                  </label>
                  <p className="text-[11px] text-slate-400">
                    Habilita mutação e correção cirúrgica automática ao detectar falhas de segurança.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="autoRemediateCheckbox"
                      type="checkbox"
                      checked={formConfig.autoRemediate}
                      onChange={(e) =>
                        setFormConfig({ ...formConfig, autoRemediate: e.target.checked })
                      }
                      className="rounded border-slate-700 text-amber-500 focus:ring-amber-500"
                    />
                    <label htmlFor="autoRemediateCheckbox" className="text-[11px] text-slate-300 cursor-pointer">
                      Ativar auto-remediação de vulnerabilidades de segurança Anchor
                    </label>
                  </div>
                </div>

                {/* GitHub Target Repo & Branch */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300">Repositório & Branch GitHub</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formConfig.githubRepo}
                      onChange={(e) => setFormConfig({ ...formConfig, githubRepo: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="solana-anchor-vault"
                    />
                    <input
                      type="text"
                      value={formConfig.githubBranch}
                      onChange={(e) => setFormConfig({ ...formConfig, githubBranch: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="main"
                    />
                  </div>
                </div>

                {/* Termux Local Device & Workspace */}
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800 space-y-1.5">
                  <label className="font-semibold text-slate-300">Identificador do Termux (Android)</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={formConfig.termuxDeviceId}
                      onChange={(e) => setFormConfig({ ...formConfig, termuxDeviceId: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="termux-mobile-arm64"
                    />
                    <input
                      type="text"
                      value={formConfig.termuxLocalDir}
                      onChange={(e) => setFormConfig({ ...formConfig, termuxLocalDir: e.target.value })}
                      className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
                      placeholder="~/egc-workspace"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons to test Bidirectional Propagation */}
              <div className="pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="text-slate-400 text-[11px]">
                  Pressione o botão correspondente à origem da alteração para testar o fluxo bidirecional.
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSave("termux-cli")}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold px-3 py-2 rounded text-xs transition-colors"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Aplicar como Termux CLI ➔ Web</span>
                  </button>
                  <button
                    onClick={() => handleSave("web-ui")}
                    disabled={loading}
                    className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold px-3 py-2 rounded text-xs transition-colors"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Aplicar como Web UI ➔ Termux</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "events" && (
            <div className="space-y-2">
              <p className="text-slate-400 text-xs">
                Log cronológico e auditável de eventos de sincronização bidirecional entre o cliente Termux e a interface Web:
              </p>
              <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/70 font-mono text-[11px]">
                {syncState.events.length === 0 ? (
                  <div className="p-4 text-center text-slate-500">Nenhum evento registrado ainda.</div>
                ) : (
                  <div className="divide-y divide-slate-800/80 max-h-[380px] overflow-y-auto">
                    {[...syncState.events].reverse().map((evt) => (
                      <div key={evt.id} className="p-2.5 flex items-start justify-between gap-3 hover:bg-slate-900/50">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                                evt.source === "termux-cli"
                                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                                  : evt.source === "web-ui"
                                  ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                                  : "bg-slate-700/40 text-slate-300"
                              }`}
                            >
                              {evt.source}
                            </span>
                            <span className="text-white font-sans text-xs">{evt.action}</span>
                          </div>
                          {evt.changedKeys.length > 0 && evt.changedKeys[0] !== "all" && (
                            <div className="text-[10px] text-slate-400">
                              Chaves modificadas:{" "}
                              <span className="text-amber-400">{evt.changedKeys.join(", ")}</span>
                            </div>
                          )}
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-slate-500 text-[10px]">
                            {new Date(evt.timestamp).toLocaleTimeString()}
                          </span>
                          <div className="text-[9px] text-slate-400">Rev #{evt.revision}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "cli" && (
            <div className="space-y-3">
              <p className="text-slate-400 text-xs">
                Execute estes comandos diretamente no terminal móvel do Termux para inspecionar ou alterar as configurações. As alterações são sincronizadas com a interface Web instantaneamente via Barramento MCP:
              </p>

              <div className="space-y-2">
                {[
                  {
                    desc: "Listar todas as configurações e verificar coerência com o Web UI",
                    cmd: "solana-agent config",
                  },
                  {
                    desc: "Forçar sincronização bidirecional imediata",
                    cmd: "solana-agent sync",
                  },
                  {
                    desc: "Alterar cluster Solana para mainnet-beta (propaga para o painel Web)",
                    cmd: "solana-agent config set cluster mainnet-beta",
                  },
                  {
                    desc: "Ativar bloqueio estrito de dry-run pré-commit",
                    cmd: "solana-agent config set dry-run true",
                  },
                  {
                    desc: "Definir novo arquivo ativo para auditoria",
                    cmd: "solana-agent config set file programs/solana-vault/src/lib.rs",
                  },
                  {
                    desc: "Consultar valor de uma chave específica",
                    cmd: "solana-agent config get cluster",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div>
                      <div className="text-[11px] text-slate-400 font-sans">{item.desc}</div>
                      <div className="text-xs font-mono text-amber-300 font-bold">$ {item.cmd}</div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(item.cmd)}
                      className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                      title="Copiar comando"
                    >
                      {copiedCmd === item.cmd ? (
                        <Check className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
            <span>Motor de Sincronia EGC Ativo</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
