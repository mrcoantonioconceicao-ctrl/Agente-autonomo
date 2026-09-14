import React from "react";
import {
  Code2,
  Terminal,
  Activity,
  Network,
  Cpu,
  CheckCircle2,
  GitPullRequest,
  ChevronLeft,
  ChevronRight,
  Zap,
  Lock,
  Github,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { InterfaceMode } from "../types";

export type GitHubStatus = "connected" | "error" | "simulated" | "checking";

interface LeftSidebarProps {
  currentMode: InterfaceMode;
  onSelectMode: (mode: InterfaceMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  geminiConfigured: boolean;
  githubMcpStatus?: GitHubStatus;
  githubMcpMessage?: string;
  onRefreshGithubStatus?: () => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentMode,
  onSelectMode,
  collapsed,
  onToggleCollapse,
  geminiConfigured,
  githubMcpStatus = "connected",
  githubMcpMessage = "Conectado e Operacional",
  onRefreshGithubStatus,
}) => {
  const menuItems = [
    {
      id: "vscode" as InterfaceMode,
      label: "VS Code Extension",
      subtitle: "Auditoria Anchor/Rust & Diff de Patches",
      icon: Code2,
      color: "text-sky-400",
      activeBg: "bg-sky-950/60 border-sky-500 text-sky-400",
      badge: "v1.4.2",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      id: "termux" as InterfaceMode,
      label: "Termux CLI (Android)",
      subtitle: "Terminal Móvel de Auditoria e Comandos",
      icon: Terminal,
      color: "text-amber-400",
      activeBg: "bg-amber-950/60 border-amber-500 text-amber-400",
      badge: "Mobile",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "bpmn" as InterfaceMode,
      label: "BPMN Orchestrator",
      subtitle: "Fluxo Determinístico com SLA e Fallback",
      icon: Activity,
      color: "text-emerald-400",
      activeBg: "bg-emerald-950/60 border-emerald-500 text-emerald-400",
      badge: "Clean",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "graphrag" as InterfaceMode,
      label: "GraphRAG Híbrido",
      subtitle: "Grafo AST e Busca Vetorial Zero-Alucinação",
      icon: Network,
      color: "text-indigo-400",
      activeBg: "bg-indigo-950/60 border-indigo-500 text-indigo-400",
      badge: "AST",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "mcp" as InterfaceMode,
      label: "MCP Bus Services",
      subtitle: "Barramento SOA e Microsserviços JSON-RPC",
      icon: Cpu,
      color: "text-purple-400",
      activeBg: "bg-purple-950/60 border-purple-500 text-purple-400",
      badge: "6 Micro",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "graf" as InterfaceMode,
      label: "Graf Telemetria",
      subtitle: "Métricas de Produção & KPIs em Tempo Real",
      icon: CheckCircle2,
      color: "text-rose-400",
      activeBg: "bg-rose-950/60 border-rose-500 text-rose-400",
      badge: "KPIs",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      id: "graphic_hack" as InterfaceMode,
      label: "Graphic Hack",
      subtitle: "Ativos Visuais e Diagramas de Estado",
      icon: GitPullRequest,
      color: "text-teal-400",
      activeBg: "bg-teal-950/60 border-teal-500 text-teal-400",
      badge: "Design",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
  ];

  const currentItem = menuItems.find((item) => item.id === currentMode) || menuItems[0];

  const getGitHubStatusDisplay = () => {
    if (githubMcpStatus === "connected") {
      return {
        text: "Conectado",
        colorClass: "text-emerald-400 font-bold",
        bgBadgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
        dotClass: "bg-emerald-500 animate-pulse",
        icon: <Github className="w-3.5 h-3.5 text-emerald-400 shrink-0" />,
        tooltip: "Conector Octokit MCP operando normalmente.",
      };
    }
    if (githubMcpStatus === "simulated") {
      return {
        text: "Modo Simulação",
        colorClass: "text-emerald-300 font-bold",
        bgBadgeClass: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
        dotClass: "bg-emerald-400",
        icon: <Github className="w-3.5 h-3.5 text-emerald-300 shrink-0" />,
        tooltip: "Ambiente sandbox ativo. Forneça um PAT no painel VS Code para acesso ao vivo.",
      };
    }
    if (githubMcpStatus === "error") {
      return {
        text: "Erro de Conexão",
        colorClass: "text-rose-400 font-bold",
        bgBadgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        dotClass: "bg-rose-500 animate-ping",
        icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />,
        tooltip: "Falha na comunicação com a API do GitHub.",
      };
    }
    return {
      text: "Verificando...",
      colorClass: "text-amber-400 font-bold",
      bgBadgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      dotClass: "bg-amber-400 animate-spin",
      icon: <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />,
      tooltip: "Testando conectividade com o repositório...",
    };
  };

  const ghInfo = getGitHubStatusDisplay();

  return (
    <aside
      className={`bg-slate-950 border-r border-slate-800 flex flex-col justify-between transition-all duration-200 z-20 shrink-0 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Top Agent Identity & Toggle */}
      <div>
        <div className="p-3 border-b border-slate-800/80 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400 shrink-0">
                <Zap className="w-4 h-4 animate-pulse" />
              </div>
              <div className="truncate">
                <h1 className="text-xs font-bold text-white font-mono tracking-tight leading-none truncate">
                  SOLANA AGENT
                </h1>
                <p className="text-[10px] text-slate-400 mt-1 truncate">
                  Co-piloto: <span className="text-slate-200 font-semibold">Marco Antônio</span>
                </p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="mx-auto p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-400">
              <Zap className="w-4 h-4 animate-pulse" />
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-auto"
            title={collapsed ? "Expandir Menu" : "Recolher Menu"}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Active Mode Info Card in Sidebar */}
        {!collapsed && (
          <div className="mx-2 mt-2 p-2 bg-slate-900 border border-slate-800 rounded-lg space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">Modo Ativo</span>
              <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ${currentItem.badgeColor}`}>
                {currentItem.badge}
              </span>
            </div>
            <p className={`text-xs font-bold truncate ${currentItem.color}`}>{currentItem.label}</p>
            <p className="text-[10px] text-slate-400 leading-tight">{currentItem.subtitle}</p>
          </div>
        )}

        {/* Menu Navigation Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentMode === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-item-${item.id}`}
                onClick={() => onSelectMode(item.id)}
                className={`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg border text-xs font-medium transition-all ${
                  isActive
                    ? `${item.activeBg} font-bold shadow-sm`
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title={collapsed ? `${item.label} - ${item.subtitle}` : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? item.color : "text-slate-400"}`} />

                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 truncate">
                    <span className="truncate">{item.label}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.2 rounded font-mono border ml-1 ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Status Footer with Real-Time GitHub MCP Connector Indicator */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2 text-[11px] font-mono">
          {/* GitHub MCP Status Indicator */}
          <div
            className="p-2 rounded bg-slate-900/90 border border-slate-800 space-y-1"
            title={ghInfo.tooltip}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-slate-300 font-sans text-xs">
                {ghInfo.icon}
                <span>GitHub MCP</span>
              </span>
              <span className={`px-1.5 py-0.2 rounded text-[9px] border font-mono ${ghInfo.bgBadgeClass}`}>
                {ghInfo.text}
              </span>
            </div>
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>Status Conexão:</span>
              <span className="flex items-center gap-1 text-slate-200">
                <span className={`w-1.5 h-1.5 rounded-full inline-block ${ghInfo.dotClass}`}></span>
                <span className={ghInfo.colorClass}>{githubMcpStatus === "error" ? "Falha" : "Ativo"}</span>
              </span>
            </div>
            {githubMcpStatus === "error" && (
              <p className="text-[9px] text-rose-400 leading-tight pt-0.5">
                Sugestão: Verifique as credenciais ou insira um PAT válido.
              </p>
            )}
            {githubMcpStatus === "simulated" && (
              <p className="text-[9px] text-slate-400 leading-tight pt-0.5">
                Sugestão: Insira seu PAT no painel VS Code para sincronizar PRs ao vivo.
              </p>
            )}
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Status Engine:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Gemini AI:</span>
            <span className={`flex items-center gap-1 font-bold ${geminiConfigured ? "text-purple-400" : "text-slate-400"}`}>
              <Lock className="w-3 h-3 text-purple-400" />
              {geminiConfigured ? "Ativo" : "Static Engine"}
            </span>
          </div>

          <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-900 text-center">
            Anchor 0.30 | Rust 1.85
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800 text-center space-y-2">
          {/* Collapsed Icon with Status Dot */}
          <div className="relative inline-block" title={`GitHub MCP: ${ghInfo.text}`}>
            <Github className="w-5 h-5 text-slate-400 mx-auto" />
            <span
              className={`absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full border border-slate-950 ${ghInfo.dotClass}`}
            ></span>
          </div>
        </div>
      )}
    </aside>
  );
};
