"use client";

import { useState, useCallback } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  TrendingUp, Eye, EyeOff, ArrowRight, ShieldCheck,
  BarChart2, Zap, CheckCircle, Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ── tipos ─────────────────────────────────────────── */
type Tab = "entrar" | "cadastrar";
type Step = "form" | "verify" | "forgot" | "reset-sent";

/* ── utilidade: mensagens de erro humanizadas ───────── */
function clerkError(err: unknown): string {
  if (!err) return "Algo deu errado. Tente novamente.";
  const e = err as { code?: string; message?: string };
  const code = e.code ?? "";
  const map: Record<string, string> = {
    form_identifier_not_found: "E-mail não encontrado. Verifique ou crie uma conta.",
    form_password_incorrect: "Senha incorreta. Tente novamente.",
    form_param_format_invalid: "E-mail inválido. Verifique o formato.",
    session_exists: "Você já está autenticado.",
    too_many_requests: "Muitas tentativas. Aguarde alguns minutos.",
    form_code_incorrect: "Código inválido. Verifique e tente novamente.",
    verification_expired: "Código expirado. Reenvie um novo.",
    form_identifier_exists: "Este e-mail já está cadastrado. Faça login.",
    form_password_pwned: "Esta senha foi comprometida em vazamentos. Use outra.",
    form_password_length_too_short: "A senha precisa ter pelo menos 8 caracteres.",
  };
  return map[code] ?? e.message ?? "Algo deu errado. Tente novamente.";
}

/* ── ícone Google ───────────────────────────────────── */
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

/* ── value props (lado esquerdo) ────────────────────── */
const VALUE_PROPS = [
  { icon: BarChart2, text: "Indicadores RSI, MACD e Bollinger em tempo real" },
  { icon: Zap, text: "Score proprietário para cada ativo da B3" },
  { icon: ShieldCheck, text: "Dados seguros — nunca repassados a terceiros" },
  { icon: CheckCircle, text: "Grátis para sempre no plano básico" },
];

/* ══════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════════════ */
export default function AcessoPage() {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [tab, setTab] = useState<Tab>("entrar");
  const [step, setStep] = useState<Step>("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* form fields */
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");

  const clearError = () => setError("");
  const switchTab = (t: Tab) => { setTab(t); setStep("form"); clearError(); };

  /* ── Google OAuth ───────────────────────────────── */
  const handleGoogle = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    const { error: ssoError } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: tab === "cadastrar" ? "/onboarding" : "/dashboard",
    });
    if (ssoError) {
      setError(clerkError(ssoError));
      setLoading(false);
    }
    // On success the browser is redirected — no cleanup needed
  }, [signIn, tab]);

  /* ── Login com email ────────────────────────────── */
  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    clearError();

    const { error: createError } = await signIn.create({ identifier: email });
    if (createError) { setError(clerkError(createError)); setLoading(false); return; }

    const { error: passError } = await signIn.password({ password });
    if (passError) { setError(clerkError(passError)); setLoading(false); return; }

    if (signIn.status === "complete") {
      const { error: finalError } = await signIn.finalize();
      if (finalError) { setError(clerkError(finalError)); setLoading(false); return; }
      router.push("/dashboard");
    } else {
      setError("Algo deu errado. Tente novamente.");
      setLoading(false);
    }
  }, [signIn, email, password, router]);

  /* ── Cadastro com email ─────────────────────────── */
  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    clearError();

    const [firstName, ...rest] = name.trim().split(" ");
    const { error: createError } = await signUp.create({
      emailAddress: email,
      firstName,
      lastName: rest.join(" ") || undefined,
    });
    if (createError) { setError(clerkError(createError)); setLoading(false); return; }

    const { error: passError } = await signUp.password({ password });
    if (passError) { setError(clerkError(passError)); setLoading(false); return; }

    const { error: sendError } = await signUp.verifications.sendEmailCode();
    if (sendError) { setError(clerkError(sendError)); setLoading(false); return; }

    setStep("verify");
    setLoading(false);
  }, [signUp, name, email, password]);

  /* ── Verificar código de e-mail ─────────────────── */
  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true);
    clearError();

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) { setError(clerkError(verifyError)); setLoading(false); return; }

    if (signUp.status === "complete") {
      const { error: finalError } = await signUp.finalize();
      if (finalError) { setError(clerkError(finalError)); setLoading(false); return; }
      router.push("/onboarding");
    } else {
      setError("Algo deu errado. Tente novamente.");
      setLoading(false);
    }
  }, [signUp, code, router]);

  /* ── Recuperar senha ────────────────────────────── */
  const handleForgot = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true);
    clearError();

    const { error: createError } = await signIn.create({ identifier: email });
    if (createError) { setError(clerkError(createError)); setLoading(false); return; }

    const { error: sendError } = await signIn.resetPasswordEmailCode.sendCode();
    if (sendError) { setError(clerkError(sendError)); setLoading(false); return; }

    setStep("reset-sent");
    setLoading(false);
  }, [signIn, email]);

  /* ── UI ─────────────────────────────────────────── */
  return (
    <div className="flex min-h-screen">
      {/* ── Lado esquerdo: value prop ── */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-card border-r border-border/50 p-12">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-base">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
            <TrendingUp size={18} />
          </div>
          InvestAI
        </Link>

        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold leading-tight">
              Análise técnica real<br />
              <span className="bg-gradient-to-r from-primary to-primary/50 bg-clip-text text-transparent">
                para investidores sérios
              </span>
            </h1>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Indicadores, probabilidades e IA assistente para quem investe na B3.
              Sem complexidade. Sem achismo.
            </p>
          </div>

          <ul className="space-y-4">
            {VALUE_PROPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                  <Icon size={15} />
                </div>
                <span className="text-sm text-muted-foreground">{text}</span>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3 rounded-2xl border border-border/50 bg-background p-4">
            <div className="flex -space-x-2">
              {["P", "M", "A", "R"].map((l, i) => (
                <div
                  key={l}
                  className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-card text-[10px] font-bold text-white"
                  style={{ background: ["#6366f1","#10b981","#f59e0b","#ef4444"][i], zIndex: 4 - i }}
                >
                  {l}
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground">+14.000</span> investidores ativos hoje
            </p>
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50">
          © 2026 InvestAI · Uso educacional · Não é corretora
        </p>
      </div>

      {/* ── Lado direito: formulário ── */}
      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm space-y-6">
          {/* Logo mobile */}
          <Link href="/" className="flex items-center gap-2 font-bold text-sm lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary">
              <TrendingUp size={15} />
            </div>
            InvestAI
          </Link>

          {/* Tela de verificação de email */}
          {step === "verify" && (
            <VerifyEmailStep
              email={email}
              code={code}
              setCode={setCode}
              onSubmit={handleVerify}
              onResend={async () => {
                if (signUp) await signUp.verifications.sendEmailCode();
              }}
              loading={loading}
              error={error}
            />
          )}

          {/* Tela de recuperação enviada */}
          {step === "reset-sent" && (
            <div className="space-y-4 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <CheckCircle size={28} />
              </div>
              <h2 className="text-lg font-bold">Verifique seu e-mail</h2>
              <p className="text-sm text-muted-foreground">
                Enviamos um link de redefinição para <strong>{email}</strong>.
                Verifique sua caixa de entrada e spam.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setStep("form")}>
                Voltar ao login
              </Button>
            </div>
          )}

          {/* Tela de esqueci senha */}
          {step === "forgot" && (
            <ForgotStep
              email={email}
              setEmail={setEmail}
              onSubmit={handleForgot}
              onBack={() => setStep("form")}
              loading={loading}
              error={error}
            />
          )}

          {/* Formulário principal */}
          {step === "form" && (
            <>
              {/* Tabs */}
              <div>
                <div className="flex rounded-xl border border-border/50 bg-card p-1 gap-1">
                  {(["entrar", "cadastrar"] as Tab[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => switchTab(t)}
                      className={cn(
                        "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
                        tab === t
                          ? "bg-primary text-white shadow-md shadow-primary/20"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {t === "entrar" ? "Entrar" : "Criar conta"}
                    </button>
                  ))}
                </div>

                <p className="mt-3 text-center text-xs text-muted-foreground">
                  {tab === "entrar"
                    ? "Bem-vindo de volta. Acesse sua conta."
                    : "Grátis para sempre. Sem cartão de crédito."}
                </p>
              </div>

              {/* Google */}
              <button
                onClick={handleGoogle}
                disabled={loading || !signIn}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium hover:bg-muted/60 transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                Continuar com Google
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-border/40" />
                <span className="text-xs text-muted-foreground">ou</span>
                <div className="flex-1 h-px bg-border/40" />
              </div>

              {/* Formulário */}
              {tab === "entrar" ? (
                <SignInForm
                  email={email} setEmail={setEmail}
                  password={password} setPassword={setPassword}
                  showPass={showPass} setShowPass={setShowPass}
                  onSubmit={handleSignIn}
                  onForgot={() => { setStep("forgot"); clearError(); }}
                  loading={loading} error={error}
                />
              ) : (
                <SignUpForm
                  name={name} setName={setName}
                  email={email} setEmail={setEmail}
                  password={password} setPassword={setPassword}
                  showPass={showPass} setShowPass={setShowPass}
                  onSubmit={handleSignUp}
                  loading={loading} error={error}
                />
              )}

              <p className="text-center text-xs text-muted-foreground">
                {tab === "entrar" ? (
                  <>Não tem conta?{" "}
                    <button className="text-primary hover:underline" onClick={() => switchTab("cadastrar")}>
                      Criar grátis
                    </button>
                  </>
                ) : (
                  <>Já tem conta?{" "}
                    <button className="text-primary hover:underline" onClick={() => switchTab("entrar")}>
                      Entrar
                    </button>
                  </>
                )}
              </p>

              <p className="text-center text-[10px] text-muted-foreground/40 leading-relaxed">
                Ao continuar, você concorda com os Termos de Uso e Política de Privacidade.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   SUBCOMPONENTES
══════════════════════════════════════════════════════ */

function SignInForm({
  email, setEmail, password, setPassword,
  showPass, setShowPass, onSubmit, onForgot, loading, error,
}: {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgot: () => void;
  loading: boolean; error: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
        <Input
          type="email" placeholder="seu@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-background border-border/60"
          required autoComplete="email"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs text-muted-foreground">Senha</label>
          <button type="button" onClick={onForgot}
            className="text-[11px] text-primary hover:underline">
            Esqueceu?
          </button>
        </div>
        <div className="relative">
          <Input
            type={showPass ? "text" : "password"} placeholder="••••••••"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="h-10 bg-background border-border/60 pr-10"
            required autoComplete="current-password"
          />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Button type="submit" disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <>Entrar <ArrowRight size={15} /></>}
      </Button>
    </form>
  );
}

function SignUpForm({
  name, setName, email, setEmail, password, setPassword,
  showPass, setShowPass, onSubmit, loading, error,
}: {
  name: string; setName: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  showPass: boolean; setShowPass: (v: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean; error: string;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</label>
        <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)}
          className="h-10 bg-background border-border/60" required autoComplete="name" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
        <Input type="email" placeholder="seu@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-background border-border/60" required autoComplete="email" />
      </div>
      <div>
        <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
        <div className="relative">
          <Input type={showPass ? "text" : "password"} placeholder="mínimo 8 caracteres"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="h-10 bg-background border-border/60 pr-10"
            required minLength={8} autoComplete="new-password" />
          <button type="button" onClick={() => setShowPass(!showPass)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>
      {error && <ErrorMsg>{error}</ErrorMsg>}
      <Button type="submit" disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
        {loading ? <Loader2 size={15} className="animate-spin" /> : <>Criar conta grátis <ArrowRight size={15} /></>}
      </Button>
    </form>
  );
}

function VerifyEmailStep({
  email, code, setCode, onSubmit, onResend, loading, error,
}: {
  email: string; code: string; setCode: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onResend: () => void;
  loading: boolean; error: string;
}) {
  return (
    <div className="space-y-5">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <CheckCircle size={28} />
        </div>
        <h2 className="text-lg font-bold">Confirme seu e-mail</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Enviamos um código de 6 dígitos para <strong>{email}</strong>
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input
          placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
          className="h-12 bg-background border-border/60 text-center text-xl font-mono tracking-widest"
          maxLength={6} required autoComplete="one-time-code"
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading || code.length < 6}
          className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Verificar e continuar <ArrowRight size={15} /></>}
        </Button>
      </form>
      <p className="text-center text-xs text-muted-foreground">
        Não recebeu?{" "}
        <button onClick={onResend} className="text-primary hover:underline">Reenviar código</button>
      </p>
    </div>
  );
}

function ForgotStep({
  email, setEmail, onSubmit, onBack, loading, error,
}: {
  email: string; setEmail: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void; onBack: () => void;
  loading: boolean; error: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <button onClick={onBack} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4 transition-colors">
          ← Voltar
        </button>
        <h2 className="text-lg font-bold">Recuperar senha</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Informe seu e-mail e enviaremos um link de redefinição.
        </p>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <Input type="email" placeholder="seu@email.com" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-10 bg-background border-border/60" required />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <Button type="submit" disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Enviar link <ArrowRight size={15} /></>}
        </Button>
      </form>
    </div>
  );
}

function ErrorMsg({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-1.5 rounded-lg bg-market-red/10 border border-market-red/20 px-3 py-2 text-xs text-market-red">
      <span className="shrink-0">⚠</span> {children}
    </p>
  );
}
