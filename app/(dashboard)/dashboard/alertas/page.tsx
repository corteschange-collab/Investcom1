"use client";

import { useState } from "react";
import { Bell, Plus, Trash2, ToggleLeft, ToggleRight, AlertCircle } from "lucide-react";
import { useAlertsStore, ALERT_LABELS, type AlertType } from "@/store/alerts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const ALERT_TYPES: { value: AlertType; label: string; unit: string }[] = [
  { value: "price_above", label: "Preço acima de", unit: "R$" },
  { value: "price_below", label: "Preço abaixo de", unit: "R$" },
  { value: "rsi_above", label: "RSI acima de", unit: "" },
  { value: "rsi_below", label: "RSI abaixo de", unit: "" },
];

export default function AlertasPage() {
  const { alerts, add, remove, toggle } = useAlertsStore();
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState("");
  const [type, setType] = useState<AlertType>("price_above");
  const [value, setValue] = useState("");

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticker.trim() || !value.trim()) return;
    const num = parseFloat(value.replace(",", "."));
    if (isNaN(num)) return;
    add({ ticker: ticker.toUpperCase().trim(), type, value: num, active: true });
    setTicker("");
    setValue("");
    setShowForm(false);
  };

  const activeCount = alerts.filter((a) => a.active).length;

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Bell size={22} className="text-primary" />
            Alertas
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeCount > 0
              ? `${activeCount} alerta${activeCount !== 1 ? "s" : ""} ativo${activeCount !== 1 ? "s" : ""}`
              : "Nenhum alerta configurado"}
          </p>
        </div>
        <Button
          size="sm"
          className="gap-1.5 bg-primary hover:bg-primary/90"
          onClick={() => setShowForm((v) => !v)}
        >
          <Plus size={15} />
          Novo alerta
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form
          onSubmit={handleAdd}
          className="rounded-2xl border border-primary/30 bg-primary/5 p-5 space-y-4"
        >
          <h2 className="text-sm font-semibold">Criar novo alerta</h2>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Ticker</label>
              <Input
                placeholder="PETR4"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="h-9 bg-background border-border/60 uppercase font-mono"
                required
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1.5 block">Valor</label>
              <Input
                placeholder={type.startsWith("rsi") ? "70" : "40,00"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="h-9 bg-background border-border/60 font-mono-nums"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-muted-foreground mb-2 block">Tipo de alerta</label>
            <div className="grid grid-cols-2 gap-2">
              {ALERT_TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={cn(
                    "rounded-xl border px-3 py-2 text-xs font-medium text-left transition-all",
                    type === t.value
                      ? "border-primary/60 bg-primary/15 text-primary"
                      : "border-border/50 text-muted-foreground hover:border-border"
                  )}
                >
                  {t.label}
                  {t.unit && <span className="text-muted-foreground"> ({t.unit})</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary/90">
              Criar alerta
            </Button>
          </div>
        </form>
      )}

      {/* Alert list */}
      {alerts.length === 0 ? (
        <div className="rounded-2xl border border-border/50 bg-card p-10 text-center">
          <Bell size={32} className="mx-auto mb-3 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Você ainda não tem alertas configurados.</p>
          <p className="text-xs text-muted-foreground/60 mt-1">
            Crie alertas de preço ou RSI para os ativos que você monitora.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {alerts.map((alert) => {
            const typeInfo = ALERT_TYPES.find((t) => t.value === alert.type);
            const isPrice = alert.type.startsWith("price");

            return (
              <div
                key={alert.id}
                className={cn(
                  "flex items-center gap-3 rounded-xl border px-4 py-3 transition-all",
                  alert.active
                    ? "border-border/50 bg-card"
                    : "border-border/30 bg-muted/30 opacity-60"
                )}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-[10px] font-bold font-mono shrink-0">
                  {alert.ticker.slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-semibold text-sm">{alert.ticker}</span>
                    <span className="text-xs text-muted-foreground">
                      {ALERT_LABELS[alert.type]}{" "}
                      <span className="font-mono-nums font-medium text-foreground">
                        {isPrice
                          ? `R$ ${alert.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                          : alert.value}
                      </span>
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground/60 mt-0.5">
                    Criado em {new Date(alert.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => toggle(alert.id)}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
                    aria-label={alert.active ? "Desativar alerta" : "Ativar alerta"}
                  >
                    {alert.active ? (
                      <ToggleRight size={18} className="text-primary" />
                    ) : (
                      <ToggleLeft size={18} />
                    )}
                  </button>
                  <button
                    onClick={() => remove(alert.id)}
                    className="text-muted-foreground hover:text-market-red transition-colors p-1.5 rounded-lg hover:bg-muted"
                    aria-label="Remover alerta"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="flex items-start gap-2 rounded-xl border border-border/40 bg-card px-4 py-3">
        <AlertCircle size={14} className="text-muted-foreground shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground">
          Os alertas são armazenados localmente. Para alertas em tempo real com notificações push,
          assine o plano Premium.
        </p>
      </div>
    </div>
  );
}
