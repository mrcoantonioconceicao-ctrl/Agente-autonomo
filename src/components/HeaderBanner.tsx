import React from "react";
import { Cpu, Code2, Terminal, Activity, Lock, ShieldCheck } from "lucide-react";
import { InterfaceMode } from "../types";

interface HeaderBannerProps {
  currentMode: InterfaceMode;
  geminiConfigured: boolean;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  currentMode,
  geminiConfigured,
}) => {
  const modeTitles: Record<InterfaceMode, { title: string; subtitle: string; iconTag: string }> = {
    vscode: {
      title: "VS Code Extension Sidebar",
      subtitle: "Varredura de Segurança Anchor/Rust, Análise de PRs & Diff de Patches",
      iconTag: "IDE MODE",
    },
    termux: {
      title: "Termux CLI (Android Terminal)",
      subtitle: "Linha de Comando Móvel para Auditorias e Comandos Rápidos",
      iconTag: "CLI MODE",
    },
    bpmn: {
      title: "BPMN 2.0 & DDD Process Orchestrator",
      subtitle: "Orquestração Determinística com Rotas de Fallback e SLA",
      iconTag: "BPMN ENGINE",
    },
    graphrag: {
      title: "GraphRAG Híbrido (Vetores + Grafo AST)",
      subtitle: "Mapeamento Global de Tipos, CPI e Respostas Zero-Alucinação",
      iconTag: "GRAPHRAG",
    },
    mcp: {
      title: "SOA & MCP Bus Microservices",
      subtitle: "Barramento de Ferramentas Estruturadas e Comunicação JSON-RPC",
      iconTag: "MCP BUS",
    },
    graf: {
      title: "Graf Telemetria & Observabilidade",
      subtitle: "Métricas de Produção em Tempo Real e KPIs de Segurança",
      iconTag: "GRAF TELEMETRY",
    },
    graphic_hack: {
      title: "Graphic Hack Visual Design Lab",
      subtitle: "Ativos Visuais, Diagramas de Estado e Relatórios Graficos",
      iconTag: "DESIGN LAB",
    },
  };

  const currentInfo = modeTitles[currentMode];

  return (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
      {/* Current Workspace Breadcrumb */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-sky-400">
          {currentInfo.iconTag}
        </span>
        <div>
          <h2 className="text-xs font-bold text-white leading-tight flex items-center gap-2">
            {currentInfo.title}
          </h2>
          <p className="text-[11px] text-slate-400 hidden sm:block">{currentInfo.subtitle}</p>
        </div>
      </div>

      {/* Quick Status Pills */}
      <div className="flex items-center gap-2 text-[11px] font-mono">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
          <Code2 className="w-3.5 h-3.5 text-sky-400" />
          <span>IDE: <strong className="text-emerald-400">v1.4.2</strong></span>
        </div>
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-slate-300">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span>Termux: <strong className="text-emerald-400">Android</strong></span>
        </div>
        <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border ${
          geminiConfigured
            ? "bg-purple-950/40 border-purple-800 text-purple-300"
            : "bg-slate-900 border-slate-800 text-slate-400"
        }`}>
          <Lock className="w-3 h-3 text-purple-400" />
          <span>Gemini: {geminiConfigured ? "Conectado" : "Static Engine"}</span>
        </div>
      </div>
    </header>
  );
};
