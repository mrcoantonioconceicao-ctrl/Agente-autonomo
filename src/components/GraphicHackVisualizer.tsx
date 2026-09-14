import React, { useState } from "react";
import { GitPullRequest, Image, Layers, RefreshCw, ShieldCheck, Zap } from "lucide-react";

export const GraphicHackVisualizer: React.FC = () => {
  const [diagramType, setDiagramType] = useState<"architecture" | "state" | "security">("architecture");
  const [generating, setGenerating] = useState<boolean>(false);

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
    }, 800);
  };

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 p-5 space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400">
            <GitPullRequest className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              GRAPHIC HACK (MÍDIA HÍBRIDA VISUAL &amp; INFOGRÁFICOS DE SEGURANÇA)
              <span className="text-xs px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 font-mono">
                VISUAL DESIGN LAB
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Geração de Diagramas de Estado de Smart Contracts, Fluxos de Validação e Ativos de Auditoria
            </p>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-sm"
        >
          {generating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Image className="w-4 h-4" />}
          <span>GERAR NOVO ATIVO VISUAL</span>
        </button>
      </div>

      {/* Select Diagram Type */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 text-xs">
        <span className="text-slate-400">Selecione o Ativo Visual:</span>
        <button
          onClick={() => setDiagramType("architecture")}
          className={`px-3 py-1 rounded transition-colors ${
            diagramType === "architecture"
              ? "bg-teal-600 text-white font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Arquitetura Cliente-Servidor (VS Code / Termux)
        </button>
        <button
          onClick={() => setDiagramType("state")}
          className={`px-3 py-1 rounded transition-colors ${
            diagramType === "state"
              ? "bg-teal-600 text-white font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Transição de Estado Solana Vault
        </button>
        <button
          onClick={() => setDiagramType("security")}
          className={`px-3 py-1 rounded transition-colors ${
            diagramType === "security"
              ? "bg-teal-600 text-white font-bold"
              : "bg-slate-900 text-slate-400 hover:bg-slate-800"
          }`}
        >
          Matriz de Vulnerabilidade Anchor Guard
        </button>
      </div>

      {/* Canvas Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[360px] relative overflow-hidden">
        {diagramType === "architecture" && (
          <div className="w-full max-w-3xl space-y-4 text-center">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest font-mono">
              DIAGRAMA DE ARQUITETURA HÍBRIDA CLIENTE-SERVIDOR
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 text-xs font-mono">
              <div className="p-4 bg-slate-950 border border-sky-500/40 rounded-lg space-y-2">
                <span className="px-2 py-0.5 rounded bg-sky-500/20 text-sky-300 text-[10px]">CLIENT 1</span>
                <h4 className="font-bold text-white text-sm">VS Code Sidebar</h4>
                <p className="text-[11px] text-slate-400">Side-by-side Diff, Inline Security Diagnostics, PR Patches</p>
              </div>

              <div className="p-4 bg-slate-950 border border-purple-500/40 rounded-lg space-y-2 relative">
                <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px]">BACKEND SERVER</span>
                <h4 className="font-bold text-white text-sm">MCP Bus &amp; BPMN Engine</h4>
                <p className="text-[11px] text-slate-400">GraphRAG Node Search, Cargo AST, Rug Mutator, Gemini AI</p>
              </div>

              <div className="p-4 bg-slate-950 border border-amber-500/40 rounded-lg space-y-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px]">CLIENT 2</span>
                <h4 className="font-bold text-white text-sm">Termux CLI (Android)</h4>
                <p className="text-[11px] text-slate-400">Terminal Móvel Ultrarrápido, Comandos 'solana-agent'</p>
              </div>
            </div>
          </div>
        )}

        {diagramType === "state" && (
          <div className="w-full max-w-2xl space-y-4 text-center text-xs font-mono">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest">
              TRANSIÇÃO DE ESTADO ANCHOR VAULT
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-4">
              <div className="p-3 bg-slate-950 border border-slate-800 rounded w-full">
                <span className="text-slate-400 block text-[10px]">Estado Inicial</span>
                <span className="text-amber-400 font-bold">VaultState::Uninitialized</span>
              </div>
              <span className="text-teal-400 font-bold text-lg">➔</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded w-full">
                <span className="text-slate-400 block text-[10px]">Mutacional (Checked)</span>
                <span className="text-sky-400 font-bold">deposit(amount) + checked_add</span>
              </div>
              <span className="text-teal-400 font-bold text-lg">➔</span>
              <div className="p-3 bg-slate-950 border border-slate-800 rounded w-full">
                <span className="text-slate-400 block text-[10px]">Estado Final Seguro</span>
                <span className="text-emerald-400 font-bold">VaultState::Deposited</span>
              </div>
            </div>
          </div>
        )}

        {diagramType === "security" && (
          <div className="w-full max-w-2xl space-y-3 text-xs font-mono">
            <h3 className="text-sm font-bold text-teal-300 uppercase tracking-widest text-center">
              MATRIZ DE PROTEÇÃO ANCHOR GUARD
            </h3>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="p-3 bg-slate-950 border border-rose-900/60 rounded space-y-1">
                <span className="text-rose-400 font-bold">Missing Account Validation</span>
                <p className="text-[11px] text-slate-400">Bloqueado por Signer&lt;'info&gt; constraint mandatory.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-amber-900/60 rounded space-y-1">
                <span className="text-amber-400 font-bold">Arbitrary CPI Execution</span>
                <p className="text-[11px] text-slate-400">Bloqueado por validation Program&lt;'info, Token&gt;.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-sky-900/60 rounded space-y-1">
                <span className="text-sky-400 font-bold">Type Cosplay</span>
                <p className="text-[11px] text-slate-400">Bloqueado por 8-byte Anchor discriminator check.</p>
              </div>
              <div className="p-3 bg-slate-950 border border-purple-900/60 rounded space-y-1">
                <span className="text-purple-400 font-bold">Arithmetic Overflow</span>
                <p className="text-[11px] text-slate-400">Bloqueado por checked_add() e checked_sub().</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
