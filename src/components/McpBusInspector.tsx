import React from "react";
import { Cpu, CheckCircle2, Server, Shield, Terminal, Zap } from "lucide-react";
import { McpService } from "../types";

export const McpBusInspector: React.FC = () => {
  const services: McpService[] = [
    {
      name: "mcp://rust-ast-parser",
      protocol: "JSON-RPC / stdio",
      status: "online",
      requestsProcessed: 1420,
      latencyAvgMs: 8,
      tools: ["parse_cargo_toml", "extract_anchor_program", "check_lifetimes"],
    },
    {
      name: "mcp://solana-anchor-inspector",
      protocol: "JSON-RPC / WebSockets",
      status: "online",
      requestsProcessed: 3890,
      latencyAvgMs: 14,
      tools: ["validate_account_constraints", "check_cpi_target", "detect_type_cosplay"],
    },
    {
      name: "mcp://graphrag-hybrid-retriever",
      protocol: "REST / gRPC",
      status: "online",
      requestsProcessed: 2150,
      latencyAvgMs: 28,
      tools: ["query_vector_index", "traverse_knowledge_graph", "fetch_rust_doc_snippets"],
    },
    {
      name: "mcp://rug-scaffolding-engine",
      protocol: "JSON-RPC / stdio",
      status: "online",
      requestsProcessed: 940,
      latencyAvgMs: 19,
      tools: ["inject_safe_account_constraint", "checked_math_rewriter", "apply_boilerplate_patch"],
    },
    {
      name: "mcp://graf-telemetry-collector",
      protocol: "Prometheus / OpenTelemetry",
      status: "online",
      requestsProcessed: 12400,
      latencyAvgMs: 4,
      tools: ["emit_bpmn_metric", "record_latency_sla", "track_token_budget"],
    },
    {
      name: "mcp://graphic-hack-designer",
      protocol: "HTTP / Canvas Engine",
      status: "online",
      requestsProcessed: 420,
      latencyAvgMs: 45,
      tools: ["generate_state_diagram", "render_security_infographic"],
    },
  ];

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 p-5 space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              SOA &amp; MCP (MODEL CONTEXT PROTOCOL) BUS
              <span className="text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 font-mono">
                MICROSSERVIÇOS DESACOPLADOS
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Barramento de Ferramentas Estruturadas Conectando VS Code, CLI Termux e Repositórios Locais
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="px-3 py-1 bg-emerald-950/40 border border-emerald-800 text-emerald-300 rounded flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>6/6 Microsserviços Operacionais</span>
          </span>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((svc) => (
          <div
            key={svc.name}
            className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-mono text-xs font-bold text-purple-300 truncate">{svc.name}</span>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400 px-1.5 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                ONLINE
              </span>
            </div>

            <div className="space-y-1 text-xs text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Protocolo:</span>
                <span className="text-slate-200">{svc.protocol}</span>
              </div>
              <div className="flex justify-between">
                <span>Requisições:</span>
                <span className="text-emerald-400 font-bold">{svc.requestsProcessed}</span>
              </div>
              <div className="flex justify-between">
                <span>Latência Média:</span>
                <span className="text-sky-400 font-bold">{svc.latencyAvgMs}ms</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <span className="text-[11px] text-slate-500 font-mono uppercase block mb-1">
                Ferramentas Expostas no MCP:
              </span>
              <div className="flex flex-wrap gap-1">
                {svc.tools.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800 text-[10px] font-mono"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
