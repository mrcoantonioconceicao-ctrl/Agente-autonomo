import React, { useState, useRef, useEffect } from "react";
import {
  Terminal as TerminalIcon,
  Send,
  Trash2,
  Smartphone,
  ShieldCheck,
  Cpu,
  RefreshCw,
  Settings,
  ArrowLeftRight,
  CheckCircle2,
  Sliders,
  Check,
} from "lucide-react";
import { TerminalLine, BidirectionalSyncState, TermuxSyncConfig, SolanaCluster } from "../types";
import { TermuxSyncModal } from "./TermuxSyncModal";

interface TermuxCliTerminalProps {
  onExecuteCommand: (cmd: string) => Promise<string>;
  syncState?: BidirectionalSyncState;
  loadingSync?: boolean;
  onTriggerSync?: () => Promise<void>;
  onUpdateConfig?: (
    partial: Partial<TermuxSyncConfig>,
    source: "web-ui" | "termux-cli",
    action?: string
  ) => Promise<any>;
  onResetConfig?: () => Promise<void>;
}

export const TermuxCliTerminal: React.FC<TermuxCliTerminalProps> = ({
  onExecuteCommand,
  syncState,
  loadingSync = false,
  onTriggerSync,
  onUpdateConfig,
  onResetConfig,
}) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: "1",
      type: "system",
      text: `Welcome to Termux Android CLI (v2.4.0)
Solana/Rust Agent Co-Pilot for Marco Antônio Conceição
Bidirectional State Sync: ACTIVE (Type 'solana-agent sync' or 'solana-agent config')
Type 'solana-agent help' or select a shortcut command below.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputCmd, setInputCmd] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isSyncModalOpen, setIsSyncModalOpen] = useState<boolean>(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  const handleSend = async (cmdToSend?: string) => {
    const text = (cmdToSend || inputCmd).trim();
    if (!text || loading) return;

    const userLine: TerminalLine = {
      id: Date.now().toString(),
      type: "input",
      text,
      timestamp: new Date().toLocaleTimeString(),
    };

    setHistory((prev) => [...prev, userLine]);
    setInputCmd("");
    setLoading(true);

    try {
      const output = await onExecuteCommand(text);
      const outputLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: "output",
        text: output,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, outputLine]);

      // Se o comando foi de sincronização ou config set, atualizar estado do Web UI
      if (
        text.includes("config set") ||
        text.includes("sync") ||
        text.includes("config")
      ) {
        if (onTriggerSync) {
          onTriggerSync();
        }
      }
    } catch (err) {
      const errLine: TerminalLine = {
        id: (Date.now() + 1).toString(),
        type: "error",
        text: `Error executing command: ${err}`,
        timestamp: new Date().toLocaleTimeString(),
      };
      setHistory((prev) => [...prev, errLine]);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setHistory([
      {
        id: Date.now().toString(),
        type: "system",
        text: "Terminal limpo. Digite 'solana-agent help' para ajuda.",
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  const handleQuickClusterChange = async (cluster: SolanaCluster) => {
    if (onUpdateConfig) {
      await onUpdateConfig({ solanaCluster: cluster }, "termux-cli", `Cluster alterado para ${cluster} via Termux`);
    }
  };

  const handleToggleDryRun = async () => {
    if (onUpdateConfig && syncState) {
      const newVal = !syncState.config.enforceDryRun;
      await onUpdateConfig(
        { enforceDryRun: newVal },
        "termux-cli",
        `Enforce Dry-Run alternado para ${newVal ? "ATIVO" : "DESATIVADO"} via Termux`
      );
    }
  };

  const shortcuts = [
    { label: "solana-agent config", cmd: "solana-agent config" },
    { label: "solana-agent sync", cmd: "solana-agent sync" },
    { label: "config set cluster mainnet", cmd: "solana-agent config set cluster mainnet-beta" },
    { label: "config set dry-run true", cmd: "solana-agent config set dry-run true" },
    { label: "solana-agent status", cmd: "solana-agent status" },
    { label: "solana-agent audit lib.rs", cmd: "solana-agent audit lib.rs" },
    { label: "solana-agent dry-run", cmd: "solana-agent dry-run" },
    { label: "solana-agent patch", cmd: "solana-agent patch" },
    { label: "solana-agent bpmn", cmd: "solana-agent bpmn" },
    { label: "solana-agent mcp", cmd: "solana-agent mcp" },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-950 rounded-lg border border-slate-800 p-4 gap-3 text-slate-100 font-mono text-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded text-amber-400">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              TERMUX ANDROID CLI
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                CLIENT MOBILE
              </span>
              {syncState && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Rev #{syncState.revision} Sync
                </span>
              )}
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Terminal de Alta Performance com Sincronização Bidirecional em Tempo Real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsSyncModalOpen(true)}
            className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 px-2.5 py-1 bg-amber-950/40 hover:bg-amber-900/50 border border-amber-700/60 rounded text-xs transition-colors"
            title="Abrir painel de sincronização bidirecional Termux ⇄ Web"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-sans text-[11px] font-semibold">Config Sync</span>
          </button>

          {onTriggerSync && (
            <button
              onClick={() => onTriggerSync()}
              disabled={loadingSync}
              className="flex items-center gap-1 text-slate-300 hover:text-white px-2 py-1 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded text-xs transition-colors"
              title="Sincronizar agora com o servidor e interface Web"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-sky-400 ${loadingSync ? "animate-spin" : ""}`} />
              <span className="font-sans text-[11px]">Sync</span>
            </button>
          )}

          <button
            onClick={handleClear}
            className="flex items-center gap-1 text-slate-400 hover:text-slate-200 px-2 py-1 bg-slate-900 border border-slate-800 rounded text-xs transition-colors"
            title="Limpar Terminal"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span className="font-sans text-[11px]">Clear</span>
          </button>
        </div>
      </div>

      {/* Bidirectional Sync Status Ribbon */}
      {syncState && (
        <div className="bg-slate-900/80 border border-slate-800/90 rounded-md p-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1 text-slate-400 font-sans">
              <ArrowLeftRight className="w-3.5 h-3.5 text-amber-400" />
              <span>Sincronia:</span>
            </span>

            {/* Quick Cluster Selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              <span className="text-slate-400 text-[10px]">Cluster:</span>
              <select
                value={syncState.config.solanaCluster}
                onChange={(e) => handleQuickClusterChange(e.target.value as SolanaCluster)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-[10px]"
              >
                <option value="devnet" className="bg-slate-900 text-slate-200">devnet</option>
                <option value="mainnet-beta" className="bg-slate-900 text-slate-200">mainnet-beta</option>
                <option value="testnet" className="bg-slate-900 text-slate-200">testnet</option>
                <option value="localnet" className="bg-slate-900 text-slate-200">localnet</option>
              </select>
            </div>

            {/* Dry-run Toggle Pill */}
            <button
              onClick={handleToggleDryRun}
              className={`flex items-center gap-1 px-2 py-0.5 rounded border text-[10px] transition-colors ${
                syncState.config.enforceDryRun
                  ? "bg-emerald-950/50 border-emerald-700/60 text-emerald-300"
                  : "bg-slate-950 border-slate-800 text-slate-400"
              }`}
              title="Clique para alternar o bloqueio de commit por linter"
            >
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Dry-Run Strict: {syncState.config.enforceDryRun ? "ATIVO" : "OFF"}</span>
            </button>

            {/* Active File Pill */}
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-slate-300 truncate max-w-[220px]" title={syncState.config.activeFilePath}>
              <span className="text-slate-500 text-[10px]">Alvo: </span>
              <span className="text-sky-300">{syncState.config.activeFilePath.split("/").pop()}</span>
            </div>

            {/* Auto Remediate Pill */}
            <div className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-purple-300 text-[10px]">
              Rug Auto-Fix: {syncState.config.autoRemediate ? "ON" : "OFF"}
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono">
            Última Sincronia: {new Date(syncState.lastSyncTimestamp).toLocaleTimeString()} ({syncState.lastSyncSource})
          </div>
        </div>
      )}

      {/* Quick Shortcut Pills */}
      <div className="flex items-center gap-2 overflow-x-auto py-1 border-b border-slate-800/60 scrollbar-none">
        <span className="text-slate-500 text-[11px] font-sans shrink-0">Shortcuts:</span>
        {shortcuts.map((sc) => (
          <button
            key={sc.cmd}
            onClick={() => handleSend(sc.cmd)}
            disabled={loading}
            className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded text-[11px] text-amber-300 shrink-0 transition-colors"
          >
            $ {sc.label}
          </button>
        ))}
      </div>

      {/* Terminal Screen Body */}
      <div className="flex-1 bg-slate-900/90 border border-slate-800 rounded p-3 overflow-y-auto space-y-2 min-h-[360px] max-h-[520px]">
        {history.map((line) => (
          <div key={line.id} className="space-y-1">
            {line.type === "input" && (
              <div className="flex items-start gap-2 text-emerald-400">
                <span className="text-slate-500">[{line.timestamp}]</span>
                <span className="font-bold text-amber-400">marco@termux:~ $</span>
                <span className="text-slate-100">{line.text}</span>
              </div>
            )}
            {line.type === "output" && (
              <pre className="text-slate-300 bg-slate-950/60 p-2.5 rounded border border-slate-800/80 leading-relaxed whitespace-pre-wrap">
                {line.text}
              </pre>
            )}
            {line.type === "error" && (
              <div className="text-rose-400 bg-rose-950/30 p-2 rounded border border-rose-900/50">
                {line.text}
              </div>
            )}
            {line.type === "system" && (
              <div className="text-sky-300 bg-sky-950/20 p-2.5 rounded border border-sky-900/40 text-[11px]">
                {line.text}
              </div>
            )}
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-amber-400 text-xs animate-pulse">
            <Cpu className="w-4 h-4 animate-spin" />
            <span>Processando via MCP Server Bus...</span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Terminal Input Controls */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative flex items-center">
          <span className="absolute left-3 font-bold text-amber-400 pointer-events-none">
            marco@termux:~$
          </span>
          <input
            id="termux-cmd-input"
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
            placeholder="Digite solana-agent config, sync, audit, status..."
            className="w-full bg-slate-900 border border-slate-700 rounded pl-36 pr-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
          />
        </div>
        <button
          id="btn-send-cli-cmd"
          onClick={() => handleSend()}
          disabled={loading || !inputCmd.trim()}
          className="flex items-center justify-center gap-1.5 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 text-slate-950 font-bold px-4 py-2.5 rounded text-xs transition-colors"
        >
          <Send className="w-4 h-4" />
          <span className="font-sans">Enviar</span>
        </button>
      </div>

      {/* Termux Sync Modal Drawer */}
      {syncState && (
        <TermuxSyncModal
          isOpen={isSyncModalOpen}
          onClose={() => setIsSyncModalOpen(false)}
          syncState={syncState}
          loading={loadingSync}
          onUpdateConfig={
            onUpdateConfig ||
            (async () => {
              return null;
            })
          }
          onTriggerSync={
            onTriggerSync ||
            (async () => {
              return;
            })
          }
          onResetConfig={
            onResetConfig ||
            (async () => {
              return;
            })
          }
        />
      )}
    </div>
  );
};
