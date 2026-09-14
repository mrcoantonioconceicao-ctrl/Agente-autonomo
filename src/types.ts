export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type IssueCategory = "Security" | "BorrowChecker" | "Lifetime" | "Anchor" | "Clippy";

export interface AuditIssue {
  id: string;
  severity: Severity;
  category: IssueCategory;
  line?: number;
  title: string;
  description: string;
  recommendation: string;
}

export interface AuditMetrics {
  securityScore: number;
  totalIssues: number;
  critical: number;
  high: number;
  medium: number;
  clippyScore: number;
  graphRagNodes: number;
}

export interface AuditResult {
  timestamp: string;
  file: string;
  prNumber?: string | null;
  metrics: AuditMetrics;
  issues: AuditIssue[];
  aiExpertSummary: string;
}

export interface BpmnStep {
  id: string;
  name: string;
  domain: "Engine" | "Rust" | "Web3" | "Graphic";
  status: "idle" | "running" | "completed" | "error";
  latencyMs: number;
  fallbackTriggered: boolean;
  description: string;
}

export interface GraphNode {
  id: string;
  name: string;
  type: "module" | "struct" | "account" | "cpi" | "vector_embedding";
  score: number;
  connections: string[];
}

export interface McpService {
  name: string;
  protocol: string;
  status: "online" | "degraded" | "offline";
  requestsProcessed: number;
  latencyAvgMs: number;
  tools: string[];
}

export interface GrafMetrics {
  bpmnSuccessRate: number;
  avgLatencyMs: number;
  zeroHallucinationRate: number;
  cargoClippyPassRate: number;
  solanaSecurityIndex: number;
  tokenConsumptionCost: string;
}

export interface TerminalLine {
  id: string;
  type: "input" | "output" | "error" | "system";
  text: string;
  timestamp: string;
}

export type InterfaceMode = "vscode" | "termux" | "bpmn" | "graphrag" | "mcp" | "graf" | "graphic_hack";
