import Link from "next/link";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "Termos de Uso — InvestAI",
  description: "Termos de uso da plataforma InvestAI.",
};

export default function TermosPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 py-4 px-4 sm:px-6">
        <div className="mx-auto max-w-4xl flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-sm">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp size={14} />
            </div>
            InvestAI
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Termos de Uso</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: 1º de janeiro de 2026</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Aceitação dos termos</h2>
            <p>
              Ao acessar ou usar a plataforma InvestAI, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, não utilize nossa plataforma. O uso continuado após alterações constitui aceite das novas condições.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Natureza do serviço</h2>
            <p>
              A InvestAI é uma plataforma de análise técnica e educacional de ativos financeiros. Todas as análises, scores, indicadores e cenários probabilísticos fornecidos são baseados em dados históricos e modelos matemáticos — <strong className="text-foreground">não constituem recomendações de investimento</strong>, assessoria financeira ou promessa de resultados futuros.
            </p>
            <p className="mt-3">
              A InvestAI não é uma corretora de valores, gestora de ativos ou instituição financeira regulada pela CVM. As informações disponíveis na plataforma têm caráter exclusivamente educacional e informativo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Elegibilidade e cadastro</h2>
            <p>
              Para criar uma conta, você deve ter pelo menos 18 anos de idade e capacidade legal para contratar. Você é responsável por manter a confidencialidade de suas credenciais de acesso e por todas as atividades realizadas em sua conta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Planos e pagamentos</h2>
            <p>
              A InvestAI oferece um plano gratuito com funcionalidades básicas e planos pagos com recursos avançados. Os valores e condições dos planos pagos estão descritos na página de Preços. O plano gratuito permanece disponível sem prazo de expiração.
            </p>
            <p className="mt-3">
              Cancelamentos de planos pagos podem ser realizados a qualquer momento pelo painel da conta. O acesso às funcionalidades premium é mantido até o fim do período já pago.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Uso aceitável</h2>
            <p>É proibido usar a InvestAI para:</p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Atividades ilegais ou fraudulentas</li>
              <li>Reprodução ou redistribuição não autorizada de dados da plataforma</li>
              <li>Tentativas de acesso não autorizado a sistemas ou contas de terceiros</li>
              <li>Engenharia reversa, scraping automatizado ou uso abusivo da API</li>
              <li>Difundir informações falsas sobre investimentos usando dados da plataforma</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Dados de mercado</h2>
            <p>
              Os dados de cotações, indicadores fundamentais e histórico de preços são obtidos de fontes públicas (Brapi, Yahoo Finance) e podem apresentar atraso ou imprecisões. A InvestAI não garante a exatidão, completude ou atualidade desses dados.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Limitação de responsabilidade</h2>
            <p>
              A InvestAI não se responsabiliza por perdas financeiras, lucros cessantes ou quaisquer danos resultantes do uso das análises e informações disponíveis na plataforma. Toda decisão de investimento é de responsabilidade exclusiva do usuário.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Propriedade intelectual</h2>
            <p>
              Todo o conteúdo da plataforma — incluindo código, design, textos, algoritmos de score e modelos de análise — é propriedade da InvestAI e protegido por leis de direitos autorais. É vedada a reprodução sem autorização expressa.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Alterações nos termos</h2>
            <p>
              Reservamos o direito de alterar estes Termos a qualquer momento, com aviso prévio de 30 dias para alterações materiais. O aviso será feito por e-mail ou notificação na plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contato</h2>
            <p>
              Dúvidas sobre estes Termos podem ser enviadas para{" "}
              <a href="mailto:suporte@investai.com.br" className="text-primary hover:underline">
                suporte@investai.com.br
              </a>{" "}
              ou pela nossa <Link href="/contato" className="text-primary hover:underline">página de contato</Link>.
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
          <Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
          <Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link>
        </div>
        <p className="mt-2">© 2026 InvestAI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
