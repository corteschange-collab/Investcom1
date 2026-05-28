"use client";

import { useState, useCallback } from "react";
import { useSignIn, useSignUp } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, TrendingUp, Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Mode = "options" | "email-login" | "email-register" | "verify";

function clerkError(err: unknown): string {
  if (!err) return "Algo deu errado. Tente novamente.";
  const e = err as { code?: string; message?: string };
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
  return map[e.code ?? ""] ?? e.message ?? "Algo deu errado. Tente novamente.";
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

export function LoginModal({ open, onClose }: Props) {
  const router = useRouter();
  const { signIn } = useSignIn();
  const { signUp } = useSignUp();

  const [mode, setMode] = useState<Mode>("options");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setMode("options");
    setName(""); setEmail(""); setPassword(""); setCode("");
    setLoading(false); setError("");
  };
  const handleClose = () => { reset(); onClose(); };

  /* ── Google OAuth ─────────────────────────────── */
  const handleGoogle = useCallback(async () => {
    if (!signIn) return;
    setLoading(true);
    const { error: ssoError } = await signIn.sso({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectCallbackUrl: "/dashboard",
    });
    if (ssoError) { setError(clerkError(ssoError)); setLoading(false); }
  }, [signIn]);

  /* ── Email sign-in ────────────────────────────── */
  const handleSignIn = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signIn) return;
    setLoading(true); setError("");

    const { error: createError } = await signIn.create({ identifier: email });
    if (createError) { setError(clerkError(createError)); setLoading(false); return; }

    const { error: passError } = await signIn.password({ password });
    if (passError) { setError(clerkError(passError)); setLoading(false); return; }

    if (signIn.status === "complete") {
      const { error: finalError } = await signIn.finalize();
      if (finalError) { setError(clerkError(finalError)); setLoading(false); return; }
      handleClose();
      router.push("/dashboard");
    } else {
      setError("Algo deu errado. Tente novamente.");
      setLoading(false);
    }
  }, [signIn, email, password, router]);

  /* ── Email sign-up ────────────────────────────── */
  const handleSignUp = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true); setError("");

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

    setMode("verify");
    setLoading(false);
  }, [signUp, name, email, password]);

  /* ── Verify email code ────────────────────────── */
  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!signUp) return;
    setLoading(true); setError("");

    const { error: verifyError } = await signUp.verifications.verifyEmailCode({ code });
    if (verifyError) { setError(clerkError(verifyError)); setLoading(false); return; }

    if (signUp.status === "complete") {
      const { error: finalError } = await signUp.finalize();
      if (finalError) { setError(clerkError(finalError)); setLoading(false); return; }
      handleClose();
      router.push("/onboarding");
    } else {
      setError("Algo deu errado. Tente novamente.");
      setLoading(false);
    }
  }, [signUp, code, router]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="rounded-2xl border border-border/60 bg-card shadow-2xl shadow-black/40 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-0">
                <div className="flex items-center gap-2">
                  <div className="h-7 w-7 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                    <TrendingUp size={14} />
                  </div>
                  <span className="font-bold text-sm">InvestAI</span>
                </div>
                <button
                  onClick={handleClose}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6 pt-5">
                <AnimatePresence mode="wait">

                  {/* ── Options screen ── */}
                  {mode === "options" && (
                    <motion.div
                      key="options"
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 12 }}
                      transition={{ duration: 0.18 }}
                    >
                      <h2 className="text-lg font-bold mb-1">Bem-vindo ao InvestAI</h2>
                      <p className="text-sm text-muted-foreground mb-6">
                        Crie sua conta grátis e comece a analisar o mercado agora.
                      </p>

                      <button
                        onClick={handleGoogle}
                        disabled={loading || !signIn}
                        className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-medium hover:bg-muted/60 transition-all active:scale-[0.98] disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : <GoogleIcon />}
                        Continuar com Google
                      </button>

                      <div className="my-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-xs text-muted-foreground">ou</span>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>

                      <div className="space-y-2">
                        <button
                          onClick={() => setMode("email-register")}
                          className="flex w-full items-center justify-between rounded-xl border border-primary/40 bg-primary/8 px-4 py-3 text-sm font-medium text-primary hover:bg-primary/15 transition-all"
                        >
                          <span>Criar conta com e-mail</span>
                          <ArrowRight size={14} />
                        </button>
                        <button
                          onClick={() => setMode("email-login")}
                          className="flex w-full items-center justify-between rounded-xl border border-border/60 px-4 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-all"
                        >
                          <span>Entrar com e-mail</span>
                          <ArrowRight size={14} />
                        </button>
                      </div>

                      <p className="mt-5 text-center text-[10px] text-muted-foreground/60 leading-relaxed">
                        Ao criar conta você concorda com os Termos de Uso e Política de Privacidade do InvestAI.
                      </p>
                    </motion.div>
                  )}

                  {/* ── Email login ── */}
                  {mode === "email-login" && (
                    <motion.div
                      key="email-login"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        onClick={() => { setMode("options"); setError(""); }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3 transition-colors"
                      >
                        ← Voltar
                      </button>
                      <h2 className="text-lg font-bold mb-4">Entrar na sua conta</h2>

                      <form onSubmit={handleSignIn} className="space-y-3">
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
                          <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
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
                          {loading ? <Loader2 size={15} className="animate-spin" /> : <><Mail size={15} /> Entrar</>}
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {/* ── Email register ── */}
                  {mode === "email-register" && (
                    <motion.div
                      key="email-register"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                    >
                      <button
                        onClick={() => { setMode("options"); setError(""); }}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3 transition-colors"
                      >
                        ← Voltar
                      </button>
                      <h2 className="text-lg font-bold mb-4">Criar sua conta</h2>

                      <form onSubmit={handleSignUp} className="space-y-3">
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</label>
                          <Input
                            placeholder="Seu nome" value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="h-10 bg-background border-border/60"
                            required autoComplete="name"
                          />
                        </div>
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
                          <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
                          <div className="relative">
                            <Input
                              type={showPass ? "text" : "password"} placeholder="mínimo 8 caracteres"
                              value={password} onChange={(e) => setPassword(e.target.value)}
                              className="h-10 bg-background border-border/60 pr-10"
                              required minLength={8} autoComplete="new-password"
                            />
                            <button type="button" onClick={() => setShowPass(!showPass)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                              {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <Button type="submit" disabled={loading} className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
                          {loading ? <Loader2 size={15} className="animate-spin" /> : <><Mail size={15} /> Criar conta grátis</>}
                        </Button>
                      </form>
                    </motion.div>
                  )}

                  {/* ── Email verification ── */}
                  {mode === "verify" && (
                    <motion.div
                      key="verify"
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                    >
                      <div className="text-center mb-5">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                          <CheckCircle size={24} />
                        </div>
                        <h2 className="text-lg font-bold">Confirme seu e-mail</h2>
                        <p className="mt-1.5 text-sm text-muted-foreground">
                          Enviamos um código de 6 dígitos para <strong>{email}</strong>
                        </p>
                      </div>

                      <form onSubmit={handleVerify} className="space-y-3">
                        <Input
                          placeholder="000000" value={code}
                          onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                          className="h-12 bg-background border-border/60 text-center text-xl font-mono tracking-widest"
                          maxLength={6} required autoComplete="one-time-code"
                        />
                        {error && <ErrorMsg>{error}</ErrorMsg>}
                        <Button type="submit" disabled={loading || code.length < 6}
                          className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
                          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Verificar e continuar <ArrowRight size={15} /></>}
                        </Button>
                      </form>

                      <p className="mt-4 text-center text-xs text-muted-foreground">
                        Não recebeu?{" "}
                        <button
                          onClick={async () => { if (signUp) await signUp.verifications.sendEmailCode(); }}
                          className="text-primary hover:underline"
                        >
                          Reenviar código
                        </button>
                      </p>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ErrorMsg({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
      <span className="shrink-0">⚠</span> {children}
    </p>
  );
}
