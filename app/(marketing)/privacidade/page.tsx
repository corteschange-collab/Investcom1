import Link from "next/link";
import { TrendingUp } from "lucide-react";

export const metadata = {
  title: "Política de Privacidade — InvestAI",
  description: "Política de privacidade e proteção de dados da plataforma InvestAI.",
};

export default function PrivacidadePage() {
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
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-2">Política de Privacidade</h1>
        <p className="text-sm text-muted-foreground mb-10">Última atualização: 1º de janeiro de 2026 · Em conformidade com a LGPD (Lei 13.709/2018)</p>

        <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8 text-muted-foreground leading-relaxed">

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">1. Quem somos</h2>
            <p>
              A InvestAI é uma plataforma de análise de ativos financeiros. Esta política descreve como coletamos, usamos, armazenamos e protegemos seus dados pessoais em conformidade com a Lei Geral de Proteção de Dados (LGPD).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">2. Dados que coletamos</h2>
            <p>Coletamos apenas os dados necessários para o funcionamento da plataforma:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">Dados de cadastro:</strong> nome, endereço de e-mail e, se aplicável, informações de pagamento (processadas pelo Stripe, nunca armazenadas por nós)</li>
              <li><strong className="text-foreground">Dados de uso:</strong> ativos consultados, watchlists criadas, alertas configurados e preferências de perfil de investidor</li>
              <li><strong className="text-foreground">Dados técnicos:</strong> endereço IP, tipo de navegador, páginas acessadas e tempo de sessão — usados para segurança e melhoria da plataforma</li>
            </ul>
            <p className="mt-3">
              Não coletamos dados financeiros pessoais (saldo, posições, CPF) nem comercializamos dados de usuários com terceiros.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">3. Como usamos seus dados</h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>Autenticação e manutenção da sua conta</li>
              <li>Personalização de análises com base no seu perfil de investidor</li>
              <li>Envio de alertas e notificações que você configurou</li>
              <li>Comunicações transacionais (confirmação de cadastro, alteração de senha)</li>
              <li>Melhoria contínua da plataforma com base em dados agregados e anonimizados</li>
              <li>Cumprimento de obrigações legais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">4. Compartilhamento de dados</h2>
            <p>Seus dados podem ser compartilhados apenas com:</p>
            <ul className="mt-3 space-y-2 list-disc list-inside">
              <li><strong className="text-foreground">Clerk:</strong> provedor de autenticação — gerencia login e segurança da conta</li>
              <li><strong className="text-foreground">Supabase:</strong> banco de dados — armazena suas watchlists, alertas e configurações</li>
              <li><strong className="text-foreground">Stripe:</strong> processador de pagamentos — para planos pagos</li>
              <li><strong className="text-foreground">Autoridades competentes:</strong> quando exigido por lei ou ordem judicial</li>
            </ul>
            <p className="mt-3">Todos os fornecedores são selecionados por cumprirem padrões equivalentes ou superiores à LGPD.</p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">5. Segurança</h2>
            <p>
              Adotamos medidas técnicas e organizacionais para proteger seus dados: criptografia em trânsito (TLS) e em repouso, autenticação multifator disponível para contas, controles de acesso internos e monitoramento contínuo de segurança.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">6. Retenção de dados</h2>
            <p>
              Mantemos seus dados enquanto sua conta estiver ativa. Após o cancelamento da conta, os dados são excluídos em até 90 dias, exceto quando a retenção for exigida por obrigação legal.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">7. Seus direitos (LGPD)</h2>
            <p>Você tem direito a:</p>
            <ul className="mt-3 space-y-1 list-disc list-inside">
              <li>Acessar os dados que temos sobre você</li>
              <li>Corrigir dados incompletos ou desatualizados</li>
              <li>Solicitar a exclusão dos seus dados</li>
              <li>Portabilidade dos seus dados em formato legível</li>
              <li>Revogar consentimentos dados anteriormente</li>
              <li>Opor-se a tratamentos baseados em interesse legítimo</li>
            </ul>
            <p className="mt-3">
              Para exercer qualquer um desses direitos, entre em <Link href="/contato" className="text-primary hover:underline">contato conosco</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">8. Cookies</h2>
            <p>
              Usamos cookies estritamente necessários para funcionamento da plataforma (autenticação de sessão) e cookies analíticos anônimos para entender o uso do produto. Não usamos cookies de rastreamento publicitário.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">9. Alterações nesta política</h2>
            <p>
              Notificaremos por e-mail sobre alterações materiais com antecedência mínima de 30 dias. O uso continuado da plataforma após a vigência das novas condições implica aceite.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-foreground mb-3">10. Contato do responsável pela proteção de dados</h2>
            <p>
              Para questões sobre privacidade e proteção de dados:{" "}
              <a href="mailto:privacidade@investai.com.br" className="text-primary hover:underline">
                privacidade@investai.com.br
              </a>
            </p>
          </section>

        </div>
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
          <Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link>
          <Link href="/contato" className="hover:text-foreground transition-colors">Contato</Link>
        </div>
        <p className="mt-2">© 2026 InvestAI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
