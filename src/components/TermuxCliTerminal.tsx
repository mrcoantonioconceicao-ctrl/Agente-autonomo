import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Send, Trash2, Smartphone, ShieldCheck, Cpu } from "lucide-react";
import { TerminalLine } from "../types";

interface TermuxCliTerminalProps {
  onExecuteCommand: (cmd: string) => Promise<string>;
}

export const TermuxCliTerminal: React.FC<TermuxCliTerminalProps> = ({ onExecuteCommand }) => {
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: "1",
      type: "system",
      text: `Welcome to Termux Android CLI (v2.1.0)
Solana/Rust Agent Co-Pilot for Marco Antônio Conceição
Type 'solana-agent help' or select a shortcut command below.`,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [inputCmd, setInputCmd] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
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

  const shortcuts = [
    { label: "solana-agent status", cmd: "solana-agent status" },
    { label: "solana-agent audit lib.rs", cmd: "solana-agent audit lib.rs" },
    { label: "solana-agent patch", cmd: "solana-agent patch" },
    { label: "solana-agent dry-run", cmd: "solana-agent dry-run" },
    { label: "solana-agent bpmn", cmd: "solana-agent bpmn" },
    { label: "solana-agent mcp", cmd: "solana-agent mcp" },
    { label: "solana-agent graph-rag", cmd: "solana-agent graph-rag" },
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
            </h2>
            <p className="text-[11px] text-slate-400 font-sans">
              Terminal de Alta Performance para Auditorias Rápidas no Celular
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
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
            placeholder="Digite solana-agent audit, status, patch..."
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
    </div>
  );
};
