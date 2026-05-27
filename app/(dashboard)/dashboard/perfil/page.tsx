import { User, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PerfilPage() {
  return (
    <div className="max-w-xl mx-auto space-y-5">
      <h1 className="text-xl font-bold flex items-center gap-2">
        <User size={22} className="text-primary" />
        Meu Perfil
      </h1>

      <div className="rounded-2xl border border-border/50 bg-card p-5 flex items-center gap-4">
        <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <User size={28} />
        </div>
        <div>
          <p className="font-semibold">Usuário InvestAI</p>
          <p className="text-sm text-muted-foreground">Plano Gratuito</p>
        </div>
        <Button variant="outline" size="sm" className="ml-auto">
          Editar
        </Button>
      </div>

      <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex items-start gap-3">
        <Zap size={20} className="text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-sm">Upgrade para Premium</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Desbloqueie IA assistente, indicadores avançados e alertas ilimitados por R$29/mês.
          </p>
          <Button size="sm" className="mt-3 bg-primary hover:bg-primary/90">
            Ver planos
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-card p-5">
        <h2 className="text-sm font-semibold flex items-center gap-2 mb-3">
          <Shield size={15} className="text-muted-foreground" />
          Perfil de investidor
        </h2>
        <div className="grid grid-cols-3 gap-2">
          {["Conservador", "Moderado", "Agressivo"].map((p) => (
            <button
              key={p}
              className={`rounded-xl border p-3 text-xs font-medium text-center transition-all ${
                p === "Moderado"
                  ? "border-primary/50 bg-primary/10 text-primary"
                  : "border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
