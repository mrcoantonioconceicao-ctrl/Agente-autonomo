import React, { useState, useEffect } from "react";
import { InterfaceMode, AuditResult } from "./types";
import { LeftSidebar } from "./components/LeftSidebar";
import { HeaderBanner } from "./components/HeaderBanner";
import { VsCodeSidebar } from "./components/VsCodeSidebar";
import { TermuxCliTerminal } from "./components/TermuxCliTerminal";
import { BpmnOrchestratorView } from "./components/BpmnOrchestratorView";
import { GraphRagVisualizer } from "./components/GraphRagVisualizer";
import { McpBusInspector } from "./components/McpBusInspector";
import { GrafTelemetryDashboard } from "./components/GrafTelemetryDashboard";
import { GraphicHackVisualizer } from "./components/GraphicHackVisualizer";

export default function App() {
  const [currentMode, setCurrentMode] = useState<InterfaceMode>("vscode");
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        setGeminiConfigured(!!data.geminiConfigured);
      })
      .catch((err) => {
        console.warn("Health check error:", err);
      });
  }, []);

  const handleAudit = async (code: string, fileName: string): Promise<AuditResult | null> => {
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, fileName }),
      });
      if (!res.ok) throw new Error("Erro na requisição de auditoria");
      return await res.json();
    } catch (err) {
      console.error("Audit error:", err);
      return null;
    }
  };

  const handlePatch = async (code: string, issueTitle: string): Promise<string | null> => {
    try {
      const res = await fetch("/api/rug-patch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, issueTitle }),
      });
      if (!res.ok) throw new Error("Erro na requisição de patch Rug");
      const data = await res.json();
      return data.patchedCode || null;
    } catch (err) {
      console.error("Patch error:", err);
      return null;
    }
  };

  const handleExecuteCliCommand = async (command: string): Promise<string> => {
    try {
      const res = await fetch("/api/cli-command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command }),
      });
      if (!res.ok) throw new Error("Erro no comando CLI");
      const data = await res.json();
      return data.output || "Comando executado.";
    } catch (err) {
      return `[ERRO CLI] Falha ao comunicar com o servidor: ${err}`;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-100 font-sans flex overflow-hidden">
      {/* Left Vertical Navigation Menu */}
      <LeftSidebar
        currentMode={currentMode}
        onSelectMode={(mode) => setCurrentMode(mode)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        geminiConfigured={geminiConfigured}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <HeaderBanner
          currentMode={currentMode}
          geminiConfigured={geminiConfigured}
        />

        {/* Dynamic Workspace Content */}
        <main className="flex-1 overflow-y-auto p-3 md:p-5 bg-slate-950">
          {currentMode === "vscode" && (
            <VsCodeSidebar onAudit={handleAudit} onPatch={handlePatch} />
          )}

          {currentMode === "termux" && (
            <TermuxCliTerminal onExecuteCommand={handleExecuteCliCommand} />
          )}

          {currentMode === "bpmn" && <BpmnOrchestratorView />}

          {currentMode === "graphrag" && <GraphRagVisualizer />}

          {currentMode === "mcp" && <McpBusInspector />}

          {currentMode === "graf" && <GrafTelemetryDashboard />}

          {currentMode === "graphic_hack" && <GraphicHackVisualizer />}
        </main>

        {/* Footer Status Bar */}
        <footer className="bg-slate-950 border-t border-slate-900 py-2 px-4 text-[11px] font-mono text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-1 shrink-0">
          <div className="flex items-center gap-3">
            <span>Agente Híbrido v2.4.0</span>
            <span>•</span>
            <span>Co-Piloto: <strong className="text-slate-200">Marco Antônio Conceição</strong></span>
          </div>
          <div className="flex items-center gap-3 text-[10px]">
            <span className="text-emerald-400">● BPMN Active</span>
            <span>● GraphRAG Mapped</span>
            <span>● Octokit MCP Connected</span>
          </div>
        </footer>
      </div>
    </div>
  );
};
