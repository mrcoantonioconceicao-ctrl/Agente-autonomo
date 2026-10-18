import { useState, useEffect, useCallback } from "react";
import { BidirectionalSyncState, TermuxSyncConfig, SyncEvent } from "../types";

const INITIAL_SYNC_STATE: BidirectionalSyncState = {
  config: {
    solanaCluster: "devnet",
    activeFilePath: "programs/solana-vault/src/lib.rs",
    githubOwner: "marcoantonio",
    githubRepo: "solana-anchor-vault",
    githubBranch: "main",
    anchorVersion: "0.30.1",
    dryRunCommand: "cargo check --color=never",
    enforceDryRun: true,
    autoRemediate: true,
    telemetryLogLevel: "info",
    termuxDeviceId: "termux-mobile-arm64",
    termuxLocalDir: "~/egc-workspace/solana-anchor-vault",
    autoSyncIntervalSec: 5,
    syncEnabled: true,
  },
  revision: 1,
  lastSyncTimestamp: new Date().toISOString(),
  lastSyncSource: "system-reset",
  status: "synchronized",
  events: [],
  latencyMs: 14,
};

export function useTermuxSync() {
  const [syncState, setSyncState] = useState<BidirectionalSyncState>(INITIAL_SYNC_STATE);
  const [loading, setLoading] = useState<boolean>(false);
  const [lastNotification, setLastNotification] = useState<string | null>(null);

  // Buscar estado de sincronização atualizado do servidor
  const fetchSyncState = useCallback(async () => {
    try {
      const res = await fetch("/api/sync/config");
      if (!res.ok) return;
      const data: BidirectionalSyncState = await res.json();
      setSyncState((prev) => {
        // Se a revisão aumentou por causa do Termux CLI, notificar
        if (data.revision > prev.revision && data.lastSyncSource === "termux-cli") {
          setLastNotification(
            `[Termux CLI ➔ Web] Configurações sincronizadas (Rev #${data.revision}): ${data.events[data.events.length - 1]?.action || "Atualização local aplicada"}`
          );
        }
        return data;
      });
    } catch (err) {
      console.warn("Falha no polling de sincronização Termux ⇄ Web:", err);
    }
  }, []);

  // Polling regular a cada 4 segundos
  useEffect(() => {
    fetchSyncState();
    const interval = setInterval(fetchSyncState, 4000);
    return () => clearInterval(interval);
  }, [fetchSyncState]);

  // Atualizar configurações a partir de qualquer lado (Web UI ou Termux)
  const updateConfig = async (
    partialConfig: Partial<TermuxSyncConfig>,
    source: "web-ui" | "termux-cli" = "web-ui",
    action?: string
  ) => {
    setLoading(true);
    try {
      const res = await fetch("/api/sync/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          config: partialConfig,
          source,
          action,
        }),
      });
      if (!res.ok) throw new Error("Erro na API de sincronização");
      const data = await res.json();
      if (data.config) {
        setSyncState({
          config: data.config,
          revision: data.revision,
          lastSyncTimestamp: data.lastSyncTimestamp,
          lastSyncSource: data.lastSyncSource,
          status: data.status || "synchronized",
          events: data.events || [],
          latencyMs: data.latencyMs || 15,
        });
        setLastNotification(
          `[${source === "web-ui" ? "Web UI ➔ Termux" : "Termux ➔ Web UI"}] Sincronizado com sucesso (Rev #${data.revision})`
        );
      }
      return data;
    } catch (err) {
      console.error("Falha ao atualizar configurações de sincronização:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Forçar sincronização imediata
  const triggerSync = async () => {
    setLoading(true);
    try {
      await fetchSyncState();
    } finally {
      setLoading(false);
    }
  };

  // Resetar para as configurações padrão do EGC
  const resetConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sync/reset", { method: "POST" });
      if (!res.ok) throw new Error("Erro ao resetar");
      const data = await res.json();
      setSyncState({
        config: data.config,
        revision: data.revision,
        lastSyncTimestamp: data.lastSyncTimestamp,
        lastSyncSource: data.lastSyncSource,
        status: data.status,
        events: data.events,
        latencyMs: data.latencyMs,
      });
      setLastNotification("Configurações resetadas e sincronizadas para o padrão EGC");
    } catch (err) {
      console.error("Falha ao resetar configurações:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearNotification = () => setLastNotification(null);

  return {
    syncState,
    loading,
    lastNotification,
    clearNotification,
    updateConfig,
    triggerSync,
    resetConfig,
  };
}
