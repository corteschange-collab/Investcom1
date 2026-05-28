"use client";

import { useState } from "react";
import Link from "next/link";
import { TrendingUp, Mail, MessageSquare, Clock, Send, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ContatoPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/support/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });

      if (!res.ok) throw new Error("Falha ao enviar");
      setSent(true);
    } catch {
      setError("Não foi possível enviar sua mensagem. Tente novamente ou escreva diretamente para suporte@investai.com.br");
    } finally {
      setLoading(false);
    }
  };

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
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">Fale com a gente</h1>
          <p className="text-muted-foreground text-base max-w-lg">
            Tem uma dúvida, sugestão ou encontrou algum problema? Nossa equipe responde em até 1 dia útil.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          {[
            { icon: Mail, title: "E-mail", desc: "suporte@investai.com.br", sub: "Para dúvidas gerais" },
            { icon: MessageSquare, title: "Chat no app", desc: "Disponível no dashboard", sub: "Para usuários logados" },
            { icon: Clock, title: "Tempo de resposta", desc: "Até 1 dia útil", sub: "Segunda a sexta" },
          ].map(({ icon: Icon, title, desc, sub }) => (
            <div key={title} className="rounded-2xl border border-border/40 bg-card p-5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-3">
                <Icon size={18} />
              </div>
              <p className="text-sm font-semibold text-foreground">{title}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{desc}</p>
              <p className="text-xs text-muted-foreground/60 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        {sent ? (
          <div className="rounded-2xl border border-border/40 bg-card p-10 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-market-green/10 text-market-green">
              <CheckCircle size={28} />
            </div>
            <h2 className="text-xl font-bold mb-2">Mensagem enviada!</h2>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Recebemos sua mensagem e responderemos em até 1 dia útil no e-mail <strong>{email}</strong>.
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => { setSent(false); setName(""); setEmail(""); setSubject(""); setMessage(""); }}
            >
              Enviar outra mensagem
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/40 bg-card p-6 sm:p-8">
            <h2 className="text-lg font-semibold mb-6">Enviar mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">Nome</label>
                  <Input
                    placeholder="Seu nome" value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-10 bg-background border-border/60"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1.5 block">E-mail</label>
                  <Input
                    type="email" placeholder="seu@email.com" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-10 bg-background border-border/60"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Assunto</label>
                <Input
                  placeholder="Ex: Dúvida sobre indicadores" value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="h-10 bg-background border-border/60"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Mensagem</label>
                <textarea
                  placeholder="Descreva sua dúvida ou sugestão em detalhes..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  required
                  className="w-full rounded-lg border border-border/60 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              {error && (
                <p className="flex items-center gap-1.5 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                  <span className="shrink-0">⚠</span> {error}
                </p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto h-10 bg-primary hover:bg-primary/90 font-semibold gap-2 px-8"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : <><Send size={15} /> Enviar mensagem</>}
              </Button>
            </form>
          </div>
        )}
      </main>

      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        <div className="flex justify-center gap-4">
          <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
          <Link href="/termos" className="hover:text-foreground transition-colors">Termos</Link>
          <Link href="/privacidade" className="hover:text-foreground transition-colors">Privacidade</Link>
        </div>
        <p className="mt-2">© 2026 InvestAI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
