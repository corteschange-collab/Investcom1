import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AlertType = "price_above" | "price_below" | "rsi_above" | "rsi_below";

export interface Alert {
  id: string;
  ticker: string;
  type: AlertType;
  value: number;
  active: boolean;
  createdAt: string;
}

interface AlertsStore {
  alerts: Alert[];
  add: (alert: Omit<Alert, "id" | "createdAt">) => void;
  remove: (id: string) => void;
  toggle: (id: string) => void;
  setItems: (alerts: Alert[]) => void;
}

export const ALERT_LABELS: Record<AlertType, string> = {
  price_above: "Preço acima de",
  price_below: "Preço abaixo de",
  rsi_above: "RSI acima de",
  rsi_below: "RSI abaixo de",
};

export const useAlertsStore = create<AlertsStore>()(
  persist(
    (set) => ({
      alerts: [],
      add: (alert) =>
        set((s) => ({
          alerts: [
            ...s.alerts,
            {
              ...alert,
              id: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
            },
          ],
        })),
      remove: (id) => set((s) => ({ alerts: s.alerts.filter((a) => a.id !== id) })),
      toggle: (id) =>
        set((s) => ({
          alerts: s.alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a)),
        })),
      setItems: (alerts) => set({ alerts }),
    }),
    { name: "investai-alerts" }
  )
);
