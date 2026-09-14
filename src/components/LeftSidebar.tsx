import React from "react";
import {
  Code2,
  Terminal,
  Activity,
  Network,
  Cpu,
  CheckCircle2,
  GitPullRequest,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { InterfaceMode } from "../types";

interface LeftSidebarProps {
  currentMode: InterfaceMode;
  onSelectMode: (mode: InterfaceMode) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  geminiConfigured: boolean;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  currentMode,
  onSelectMode,
  collapsed,
  onToggleCollapse,
  geminiConfigured,
}) => {
  const menuItems = [
    {
      id: "vscode" as InterfaceMode,
      label: "VS Code Extension",
      shortLabel: "IDE",
      icon: Code2,
      color: "text-sky-400",
      activeBg: "bg-sky-950/60 border-sky-500 text-sky-400",
      badge: "v1.4.2",
      badgeColor: "bg-sky-500/20 text-sky-300 border-sky-500/30",
    },
    {
      id: "termux" as InterfaceMode,
      label: "Termux CLI (Android)",
      shortLabel: "CLI",
      icon: Terminal,
      color: "text-amber-400",
      activeBg: "bg-amber-950/60 border-amber-500 text-amber-400",
      badge: "Mobile",
      badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    },
    {
      id: "bpmn" as InterfaceMode,
      label: "BPMN & DDD Orchestrator",
      shortLabel: "BPMN",
      icon: Activity,
      color: "text-emerald-400",
      activeBg: "bg-emerald-950/60 border-emerald-500 text-emerald-400",
      badge: "Clean",
      badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    },
    {
      id: "graphrag" as InterfaceMode,
      label: "GraphRAG Híbrido",
      shortLabel: "GraphRAG",
      icon: Network,
      color: "text-indigo-400",
      activeBg: "bg-indigo-950/60 border-indigo-500 text-indigo-400",
      badge: "AST",
      badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    },
    {
      id: "mcp" as InterfaceMode,
      label: "MCP Bus Services",
      shortLabel: "MCP",
      icon: Cpu,
      color: "text-purple-400",
      activeBg: "bg-purple-950/60 border-purple-500 text-purple-400",
      badge: "6 Micro",
      badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    },
    {
      id: "graf" as InterfaceMode,
      label: "Graf Telemetria",
      shortLabel: "Graf",
      icon: CheckCircle2,
      color: "text-rose-400",
      activeBg: "bg-rose-950/60 border-rose-500 text-rose-400",
      badge: "Live KPIs",
      badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    },
    {
      id: "graphic_hack" as InterfaceMode,
      label: "Graphic Hack Visual",
      shortLabel: "Design",
      icon: GitPullRequest,
      color: "text-teal-400",
      activeBg: "bg-teal-950/60 border-teal-500 text-teal-400",
      badge: "Diagrams",
      badgeColor: "bg-teal-500/20 text-teal-300 border-teal-500/30",
    },
  ];

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
                className={`w-full flex items-center gap-3 px-2.5 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                  isActive
                    ? `${item.activeBg} font-bold shadow-sm`
                    : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
                title={collapsed ? item.label : undefined}
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

      {/* Bottom Status Footer */}
      {!collapsed ? (
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/80 space-y-2 text-[11px] font-mono">
          <div className="flex items-center justify-between text-slate-400">
            <span>Status da Engine:</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block"></span>
              ONLINE
            </span>
          </div>

          <div className="flex items-center justify-between text-slate-400">
            <span>Gemini AI:</span>
            <span className={geminiConfigured ? "text-purple-400" : "text-slate-400"}>
              {geminiConfigured ? "Ativo" : "Static"}
            </span>
          </div>

          <div className="pt-1 text-[10px] text-slate-500 border-t border-slate-900 text-center">
            Anchor 0.30 | Rust 1.85
          </div>
        </div>
      ) : (
        <div className="p-2 border-t border-slate-800 text-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" title="System Online"></span>
        </div>
      )}
    </aside>
  );
};
