"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, ArrowRight, TrendingUp, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Mode = "options" | "email-login" | "email-register";

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
  const [mode, setMode] = useState<Mode>("options");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const reset = () => { setMode("options"); setEmail(""); setPassword(""); };
  const handleClose = () => { reset(); onClose(); };

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

                      {/* Google */}
                      <button className="flex w-full items-center justify-center gap-3 rounded-xl border border-border/60 bg-background px-4 py-3 text-sm font-medium hover:bg-muted/60 transition-all active:scale-[0.98]">
                        <GoogleIcon />
                        Continuar com Google
                      </button>

                      <div className="my-4 flex items-center gap-3">
                        <div className="flex-1 h-px bg-border/50" />
                        <span className="text-xs text-muted-foreground">ou</span>
                        <div className="flex-1 h-px bg-border/50" />
                      </div>

                      {/* Email options */}
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

                  {(mode === "email-login" || mode === "email-register") && (
                    <motion.div
                      key={mode}
                      initial={{ opacity: 0, x: 12 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -12 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-4"
                    >
                      <div>
                        <button
                          onClick={() => setMode("options")}
                          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 mb-3 transition-colors"
                        >
                          ← Voltar
                        </button>
                        <h2 className="text-lg font-bold">
                          {mode === "email-register" ? "Criar sua conta" : "Entrar na sua conta"}
                        </h2>
                      </div>

                      {mode === "email-register" && (
                        <div>
                          <label className="text-xs text-muted-foreground mb-1.5 block">Nome completo</label>
                          <Input placeholder="Seu nome" className="h-10 bg-background border-border/60" />
                        </div>
                      )}

                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                        <Input
                          type="email"
                          placeholder="seu@email.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="h-10 bg-background border-border/60"
                        />
                      </div>

                      <div>
                        <label className="text-xs text-muted-foreground mb-1.5 block">Senha</label>
                        <div className="relative">
                          <Input
                            type={showPass ? "text" : "password"}
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-10 bg-background border-border/60 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                          >
                            {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </div>

                      <Button className="w-full h-10 bg-primary hover:bg-primary/90 font-semibold gap-2">
                        <Mail size={15} />
                        {mode === "email-register" ? "Criar conta grátis" : "Entrar"}
                      </Button>

                      {mode === "email-login" && (
                        <p className="text-center text-xs text-muted-foreground">
                          <button className="text-primary hover:underline">Esqueceu sua senha?</button>
                        </p>
                      )}
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
