"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bug,
  BarChart2,
  KeyRound,
  Lightbulb,
  Briefcase,
  MessageCircle,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

/* ── Subject categories ─────────────────────────────────── */

const CATEGORIES = [
  {
    id: "bug",
    label: "Erro ou bug técnico",
    icon: Bug,
    color: "text-market-red",
    bg: "bg-market-red/10",
    border: "border-market-red/30",
    placeholder: "Ex: O gráfico do PETR4 não está carregando",
    hint: "Descreva o que aconteceu, em qual ativo e o que você esperava ver.",
    showPriority: true,
    showTicker: false,
  },
  {
    id: "dados",
    label: "Dado de mercado incorreto",
    icon: BarChart2,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    placeholder: "Ex: O P/L do WEGE3 está aparecendo como zero",
    hint: "Informe o ticker e qual dado parece incorreto. Ajuda muito!",
    showPriority: false,
    showTicker: true,
  },
  {
    id: "login",
    label: "Problema de acesso",
    icon: KeyRound,
    color: "text-market-yellow",
    bg: "bg-market-yellow/10",
    border: "border-market-yellow/30",
    placeholder: "Ex: Não consigo redefinir minha senha",
    hint: "Informe o e-mail cadastrado e o que está acontecendo.",
    showPriority: true,
    showTicker: false,
  },
  {
    id: "melhoria",
    label: "Sugestão de melhoria",
    icon: Lightbulb,
    color: "text-market-green",
    bg: "bg-market-green/10",
    border: "border-market-green/30",
    placeholder: "Ex: Gostaria de ver comparação entre dois ativos",
    hint: "Sua sugestão vai direto para o roadmap do produto.",
    showPriority: false,
    showTicker: false,
  },
  {
    id: "comercial",
    label: "Contato comercial",
    icon: Briefcase,
    color: "text-primary",
    bg: "bg-primary/10",
    border: "border-primary/30",
    placeholder: "Ex: Parceria de dados, integração com corretora",
    hint: "Para parcerias, integrações ou propostas comerciais.",
    showPriority: false,
    showTicker: false,
  },
  {
    id: "outro",
    label: "Outro assunto",
    icon: MessageCircle,
    color: "text-muted-foreground",
    bg: "bg-muted/20",
    border: "border-border/50",
    placeholder: "Assunto da mensagem",
    hint: null,
    showPriority: false,
    showTicker: false,
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

interface FormState {
  name: string;
  email: string;
  category: CategoryId | "";
  subject: string;
  message: string;
  priority: "normal" | "urgente";
  ticker: string;
}

type Phase = "form" | "submitting" | "success" | "error";

const CHAR_LIMIT = 1500;

/* ── Component ───────────────────────────────────────────── */

export function ContactForm({ id }: { id?: string }) {
  const { user } = useUser();
  const searchParams = useSearchParams();

  const presetCategory = (searchParams.get("categoria") ?? "") as CategoryId | "";
  const validPreset = CATEGORIES.some((c) => c.id === presetCategory) ? presetCategory : "";

  const [form, setForm] = useState<FormState>({
    name: user?.fullName ?? "",
    email: user?.primaryEmailAddress?.emailAddress ?? "",
    category: validPreset,
    subject: "",
    message: "",
    priority: "normal",
    ticker: "",
  });
  const [phase, setPhase] = useState<Phase>("form");
  const [ticketId, setTicketId] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [categoryOpen, setCategoryOpen] = useState(false);

  // Sync Clerk user data once loaded (user may be null on first render)
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || user.fullName || "",
        email: prev.email || user.primaryEmailAddress?.emailAddress || "",
      }));
    }
  }, [user]);

  const selectedCat = CATEGORIES.find((c) => c.id === form.category);

  const set = (field: keyof FormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  function validate(): boolean {
    const next: typeof errors = {};
    if (!form.name.trim() || form.name.trim().length < 2) next.name = "Informe seu nome.";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) next.email = "E-mail inválido.";
    if (!form.category) next.category = "Selecione um assunto.";
    if (!form.subject.trim() || form.subject.trim().length < 5) next.subject = "Assunto muito curto.";
    if (!form.message.trim() || form.message.trim().length < 20) next.message = "Mínimo 20 caracteres.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setPhase("submitting");

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          category: form.category,
          subject: form.subject.trim(),
          message: form.message.trim(),
          priority: form.priority,
          ticker: form.ticker.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Erro desconhecido.");
        setPhase("error");
        return;
      }

      setTicketId(data.ticketId);
      setPhase("success");
    } catch {
      setErrorMsg("Sem conexão. Verifique sua internet e tente novamente.");
      setPhase("error");
    }
  }

  return (
    <div id={id} className="rounded-2xl border border-border/50 bg-card p-6">
      <AnimatePresence mode="wait">

        {/* ── Success ───────────────────────────────────────── */}
        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8 space-y-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 18, delay: 0.05 }}
              className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-market-green/10"
            >
              <CheckCircle size={32} className="text-market-green" />
            </motion.div>
            <div>
              <p className="text-lg font-bold">Mensagem enviada!</p>
              <p className="text-sm text-muted-foreground mt-1">
                Respondemos em até 24 horas úteis. Verifique seu e-mail.
              </p>
            </div>
            <div className="inline-block rounded-xl border border-border/60 bg-background px-4 py-2">
              <p className="text-xs text-muted-foreground mb-0.5">Número do ticket</p>
              <p className="font-mono font-bold text-primary">{ticketId}</p>
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmação enviada para <strong>{form.email}</strong>
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPhase("form");
                setForm((f) => ({ ...f, category: "", subject: "", message: "", ticker: "" }));
              }}
            >
              Enviar outra mensagem
            </Button>
          </motion.div>
        )}

        {/* ── Error ─────────────────────────────────────────── */}
        {phase === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-6 space-y-4"
          >
            <div className="flex items-start gap-3 rounded-xl border border-market-red/20 bg-market-red/5 p-4">
              <AlertCircle size={18} className="text-market-red mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-market-red">Não foi possível enviar</p>
                <p className="text-xs text-muted-foreground mt-0.5">{errorMsg}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Se o problema persistir, escreva diretamente para{" "}
              <a
                href="mailto:suporte@investai.com.br"
                className="text-primary hover:underline font-medium"
              >
                suporte@investai.com.br
              </a>
            </p>
            <Button variant="outline" size="sm" onClick={() => setPhase("form")}>
              Tentar novamente
            </Button>
          </motion.div>
        )}

        {/* ── Form ──────────────────────────────────────────── */}
        {(phase === "form" || phase === "submitting") && (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-base font-bold">Fale com a equipe</h2>
              <p className="text-sm text-muted-foreground mt-0.5">
                Respondemos toda mensagem. Nenhum formulário vai para o vazio.
              </p>
            </div>

            {/* Name + Email */}
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  Nome
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Seu nome"
                  className={cn("h-10 bg-background", errors.name && "border-market-red/60")}
                />
                {errors.name && <p className="text-xs text-market-red mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                  E-mail de resposta
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  placeholder="seu@email.com"
                  className={cn("h-10 bg-background", errors.email && "border-market-red/60")}
                />
                {errors.email && <p className="text-xs text-market-red mt-1">{errors.email}</p>}
              </div>
            </div>

            {/* Category selector */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Assunto
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen((v) => !v)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all",
                    selectedCat
                      ? `${selectedCat.border} ${selectedCat.bg}`
                      : "border-border/60 bg-background",
                    errors.category && "border-market-red/60",
                    "hover:border-border"
                  )}
                >
                  {selectedCat ? (
                    <>
                      <selectedCat.icon size={15} className={selectedCat.color} />
                      <span className="flex-1 font-medium">{selectedCat.label}</span>
                    </>
                  ) : (
                    <span className="flex-1 text-muted-foreground">Selecione o tipo de contato…</span>
                  )}
                  <ChevronDown
                    size={14}
                    className={cn("text-muted-foreground transition-transform", categoryOpen && "rotate-180")}
                  />
                </button>

                <AnimatePresence>
                  {categoryOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.12 }}
                      className="absolute top-full left-0 right-0 z-20 mt-1 rounded-xl border border-border/60 bg-popover shadow-xl overflow-hidden"
                    >
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            set("category", cat.id);
                            setCategoryOpen(false);
                          }}
                          className={cn(
                            "flex w-full items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors",
                            "hover:bg-muted/40",
                            form.category === cat.id && "bg-muted/30"
                          )}
                        >
                          <cat.icon size={14} className={cat.color} />
                          <span>{cat.label}</span>
                          {form.category === cat.id && (
                            <CheckCircle size={13} className="ml-auto text-primary" />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {errors.category && <p className="text-xs text-market-red mt-1">{errors.category}</p>}
            </div>

            {/* Context hint */}
            <AnimatePresence>
              {selectedCat?.hint && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-xs text-muted-foreground -mt-2 pl-1 overflow-hidden"
                >
                  💡 {selectedCat.hint}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Ticker (for "dados" category) */}
            <AnimatePresence>
              {selectedCat?.showTicker && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                    Ticker ou ativo com dado incorreto
                  </label>
                  <Input
                    value={form.ticker}
                    onChange={(e) => set("ticker", e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                    placeholder="Ex: PETR4, MXRF11"
                    className="h-10 bg-background font-mono uppercase max-w-[180px]"
                    maxLength={8}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Subject line */}
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Título curto
              </label>
              <Input
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                placeholder={selectedCat?.placeholder ?? "Resumo em uma linha"}
                className={cn("h-10 bg-background", errors.subject && "border-market-red/60")}
                maxLength={120}
              />
              {errors.subject && <p className="text-xs text-market-red mt-1">{errors.subject}</p>}
            </div>

            {/* Message */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground">Mensagem</label>
                <span className={cn(
                  "text-xs",
                  form.message.length > CHAR_LIMIT * 0.9 ? "text-market-yellow" : "text-muted-foreground"
                )}>
                  {form.message.length}/{CHAR_LIMIT}
                </span>
              </div>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value.slice(0, CHAR_LIMIT))}
                rows={5}
                placeholder="Descreva com detalhes. Quanto mais contexto, mais rápido conseguimos ajudar."
                className={cn(
                  "w-full resize-none rounded-xl border bg-background px-3 py-2.5 text-sm outline-none transition-colors",
                  "placeholder:text-muted-foreground/50",
                  "focus:border-primary/60 focus:ring-1 focus:ring-primary/20",
                  errors.message ? "border-market-red/60" : "border-border/60"
                )}
              />
              {errors.message && <p className="text-xs text-market-red mt-1">{errors.message}</p>}
            </div>

            {/* Priority (for bug/login) */}
            <AnimatePresence>
              {selectedCat?.showPriority && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <label className="text-xs font-medium text-muted-foreground mb-2 block">
                    Prioridade
                  </label>
                  <div className="flex gap-2">
                    {(["normal", "urgente"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        onClick={() => set("priority", p)}
                        className={cn(
                          "flex-1 rounded-xl border py-2 text-xs font-medium capitalize transition-all",
                          form.priority === p
                            ? p === "urgente"
                              ? "border-market-red/40 bg-market-red/10 text-market-red"
                              : "border-primary/40 bg-primary/10 text-primary"
                            : "border-border/50 text-muted-foreground hover:border-border"
                        )}
                      >
                        {p === "urgente" ? "⚡ Urgente" : "Normal"}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button
              type="submit"
              disabled={phase === "submitting"}
              className="w-full h-11 bg-primary hover:bg-primary/90 font-semibold gap-2 shadow-lg shadow-primary/20"
            >
              {phase === "submitting" ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Enviando…
                </>
              ) : (
                "Enviar mensagem"
              )}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Confirmação será enviada para o seu e-mail. Respondemos todo contato.
            </p>
          </motion.form>
        )}

      </AnimatePresence>
    </div>
  );
}
