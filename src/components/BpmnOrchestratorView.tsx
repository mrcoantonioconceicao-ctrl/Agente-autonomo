import React, { useState } from "react";
import { Activity, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Play, RefreshCw, Layers } from "lucide-react";
import { BpmnStep } from "../types";

export const BpmnOrchestratorView: React.FC = () => {
  const [steps, setSteps] = useState<BpmnStep[]>([
    {
      id: "step-1",
      name: "1. Payload Ingestion & AST Parsing",
      domain: "Rust",
      status: "completed",
      latencyMs: 18,
      fallbackTriggered: false,
      description: "Captura de PR / buffer Rust e geração da Árvore de Sintaxe Abstrata (Cargo syn/quote).",
    },
    {
      id: "step-2",
      name: "2. GraphRAG Context Retrieval",
      domain: "Engine",
      status: "completed",
      latencyMs: 42,
      fallbackTriggered: false,
      description: "Combinação de busca vetorial e grafo de conhecimento de tipos Anchor.",
    },
    {
      id: "step-3",
      name: "3. Anchor Guard Security Inspection",
      domain: "Web3",
      status: "completed",
      latencyMs: 35,
      fallbackTriggered: false,
      description: "Verificação determinística de Missing Account Checks, Type Cosplay e CPI sem validação.",
    },
    {
      id: "step-4",
      name: "4. Rug Patch Generation & Verification",
      domain: "Engine",
      status: "completed",
      latencyMs: 65,
      fallbackTriggered: false,
      description: "Mutação segura do código e injeção de boilerplate defensivo.",
    },
    {
      id: "step-5",
      name: "5. Graf Telemetry Logging",
      domain: "Graphic",
      status: "completed",
      latencyMs: 12,
      fallbackTriggered: false,
      description: "Emissão de métricas de observabilidade e atualização de KPIs em tempo real.",
    },
  ]);

  const [executing, setExecuting] = useState<boolean>(false);

  const handleSimulateWorkflow = () => {
    setExecuting(true);
    setSteps((prev) => prev.map((s) => ({ ...s, status: "running" })));

    setTimeout(() => {
      setSteps((prev) =>
        prev.map((s) => ({
          ...s,
          status: "completed",
          latencyMs: Math.floor(10 + Math.random() * 50),
        }))
      );
      setExecuting(false);
    }, 1200);
  };

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 p-5 space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              BPMN 2.0 &amp; DDD PROCESS ORCHESTRATOR
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
                FLUXO DETERMINÍSTICO
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Mapeamento de Processos Auditáveis com Rotas de Fallback e Domínios Isolados (DDD)
            </p>
          </div>
        </div>

        <button
          onClick={handleSimulateWorkflow}
          disabled={executing}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-4 rounded text-xs transition-colors shadow-sm"
        >
          {executing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
          <span>DISPARAR PIPELINE BPMN DE AUDITORIA</span>
        </button>
      </div>

      {/* DDD Domains Architecture Badge */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Domínio 1</span>
          <span className="text-xs font-bold text-sky-400">Engine de Raciocínio</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Prompting, GraphRAG e Orquestração</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Domínio 2</span>
          <span className="text-xs font-bold text-amber-400">Domínio de Código (Rust)</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Cargo, Clippy, Lifetimes e AST</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Domínio 3</span>
          <span className="text-xs font-bold text-purple-400">Domínio Web3 (Solana)</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Anchor Guards, Accounts e CPI</p>
        </div>
        <div className="p-3 bg-slate-900 border border-slate-800 rounded">
          <span className="text-[10px] text-slate-500 uppercase font-mono block">Domínio 4</span>
          <span className="text-xs font-bold text-teal-400">Domínio Graphic Hack</span>
          <p className="text-[11px] text-slate-400 mt-0.5">Ativos Visuais e Observabilidade</p>
        </div>
      </div>

      {/* BPMN Step Workflow Visualizer */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          ESTÁGIOS DO FLUXO BPMN (SLA Total: {steps.reduce((acc, s) => acc + s.latencyMs, 0)}ms)
        </h3>

        <div className="space-y-3">
          {steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all hover:border-slate-700"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  {step.status === "completed" && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
                  {step.status === "running" && <RefreshCw className="w-5 h-5 text-amber-400 animate-spin" />}
                  {step.status === "error" && <AlertCircle className="w-5 h-5 text-rose-400" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs font-bold text-white">{step.name}</h4>
                    <span className="px-2 py-0.2 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {step.domain}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{step.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 font-mono text-xs text-right self-end md:self-center">
                <span className="text-slate-400">Latência: <strong className="text-emerald-400">{step.latencyMs}ms</strong></span>
                <span className="px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[10px]">
                  Fallback: OK
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
