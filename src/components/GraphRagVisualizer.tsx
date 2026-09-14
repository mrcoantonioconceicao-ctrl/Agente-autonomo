import React, { useState } from "react";
import { Network, Database, Search, ShieldCheck, Cpu, Code2 } from "lucide-react";
import { GraphNode } from "../types";

export const GraphRagVisualizer: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("AccountInfo");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  const nodes: GraphNode[] = [
    {
      id: "node-1",
      name: "solana_vault::deposit",
      type: "module",
      score: 0.98,
      connections: ["node-2", "node-3", "node-5"],
    },
    {
      id: "node-2",
      name: "AccountInfo<'info, VaultState>",
      type: "account",
      score: 0.94,
      connections: ["node-1", "node-4"],
    },
    {
      id: "node-3",
      name: "spl_token::instruction::transfer",
      type: "cpi",
      score: 0.91,
      connections: ["node-1"],
    },
    {
      id: "node-4",
      name: "Discriminator Check (Anchor AST)",
      type: "struct",
      score: 0.89,
      connections: ["node-2"],
    },
    {
      id: "node-5",
      name: "Vector Embedding: missing_account_validation",
      type: "vector_embedding",
      score: 0.96,
      connections: ["node-1", "node-2"],
    },
  ];

  const filteredNodes = nodes.filter(
    (n) =>
      n.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      n.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-slate-950 rounded-lg border border-slate-800 p-5 space-y-6 text-slate-100">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400">
            <Network className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              GRAPHRAG HÍBRIDO (VETORES + GRAFO DE CONHECIMENTO)
              <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono">
                ZERO ALUCINAÇÕES
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Mapeamento de Dependências Globais, Tipos Rust e Vulnerabilidades Conhecidas Solana/Anchor
            </p>
          </div>
        </div>

        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Pesquisar nós do grafo..."
            className="w-full bg-slate-900 border border-slate-700 rounded pl-9 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Main Grid: Visual Graph Topology + Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Node Topology Canvas */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-indigo-400" />
            TOPOLOGIA DE CONECTIVIDADE DO PROJETO ANCHOR
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 min-h-[320px]">
            {filteredNodes.map((node) => (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                  selectedNode?.id === node.id
                    ? "bg-indigo-950/60 border-indigo-500 shadow-md ring-1 ring-indigo-500"
                    : "bg-slate-950 border-slate-800 hover:border-slate-700"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                    node.type === "module"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/30"
                      : node.type === "account"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : node.type === "cpi"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      : "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                  }`}>
                    {node.type.toUpperCase()}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Relevância: {Math.round(node.score * 100)}%
                  </span>
                </div>

                <p className="text-xs font-mono font-bold text-slate-100 mt-2 truncate">
                  {node.name}
                </p>

                <p className="text-[11px] text-slate-400 mt-1 font-mono">
                  Conexões diretas: {node.connections.length} nós
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Node Inspector Panel */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-4">
          <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            INSPECIONADOR DO GRAFO DE CONHECIMENTO
          </h3>

          {selectedNode ? (
            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Identificador do Nó:</span>
                <span className="font-mono font-bold text-indigo-300">{selectedNode.id}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Nome da Entidade Rust/Solana:</span>
                <span className="font-mono font-bold text-white text-sm">{selectedNode.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Tipo de Estrutura:</span>
                <span className="font-mono text-slate-200">{selectedNode.type}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Score de Busca Híbrida Vector+Graph:</span>
                <span className="font-mono font-bold text-emerald-400">{selectedNode.score}</span>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-slate-400 block text-[11px] mb-1">Arestas do Grafo (Relacionamentos):</span>
                <ul className="space-y-1 font-mono text-[11px] text-slate-300">
                  {selectedNode.connections.map((cId) => (
                    <li key={cId} className="flex items-center gap-1">
                      <span className="text-indigo-400">➔</span>
                      <span>{nodes.find((n) => n.id === cId)?.name || cId}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-slate-400">
              <Code2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <span>Selecione um nó da topologia para visualizar metadados e dependências AST.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
