import Link from "next/link";
import { TrendingUp } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp size={15} />
            </div>
            InvestAI
          </Link>

          <p className="text-xs text-muted-foreground text-center max-w-sm">
            Esta plataforma não presta recomendações de investimento. Análises são
            baseadas em dados históricos e probabilidades — não garantem resultados futuros.
          </p>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">Termos</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Privacidade</Link>
            <Link href="#" className="hover:text-foreground transition-colors">Contato</Link>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          © 2025 InvestAI. Todos os direitos reservados. Dados fornecidos pela B3 via Brapi.
        </div>
      </div>
    </footer>
  );
}
