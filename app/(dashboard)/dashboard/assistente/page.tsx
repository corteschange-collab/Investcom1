"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Bot, Send, User, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const STARTERS = [
  "O que é RSI e como interpretar?",
  "Como funciona o MACD?",
  "O que são Bollinger Bands?",
  "Como calcular o Score InvestAI?",
  "O que é dividend yield?",
  "Como diversificar uma carteira?",
];

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: Message = { role: "user", content: text.trim() };
      const next = [...messages, userMsg];
      setMessages(next);
      setInput("");
      setLoading(true);

      const assistantMsg: Message = { role: "assistant", content: "" };
      setMessages([...next, assistantMsg]);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });

        if (!res.ok) throw new Error("Falha na resposta");

        const reader = res.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error("No reader");

        let acc = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: acc };
            return updated;
          });
        }
      } catch {
        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: "assistant",
            content:
              "Desculpe, ocorreu um erro ao processar sua mensagem. Verifique se a chave da API está configurada em `.env.local`.",
          };
          return updated;
        });
      } finally {
        setLoading(false);
        inputRef.current?.focus();
      }
    },
    [messages, loading]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  return (
    <div className="max-w-3xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5 shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/15 text-primary">
          <Sparkles size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold">IA Assistente</h1>
          <p className="text-xs text-muted-foreground">Tire dúvidas sobre o mercado financeiro</p>
        </div>
        <div className="ml-auto">
          <span className="inline-flex items-center gap-1.5 text-xs text-market-yellow bg-market-yellow/10 border border-market-yellow/30 rounded-full px-2.5 py-1">
            <AlertCircle size={11} />
            Uso educacional apenas
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-border/50 bg-card">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Bot size={32} />
            </div>
            <div>
              <h2 className="text-base font-semibold mb-1">Como posso te ajudar?</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Faça perguntas sobre indicadores técnicos, análise fundamentalista, estratégias ou conceitos do mercado financeiro.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-sm">
              {STARTERS.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-xl border border-border/50 bg-background px-3 py-2.5 text-xs text-left text-muted-foreground hover:border-primary/40 hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3",
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                <div
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-xs",
                    msg.role === "user"
                      ? "bg-primary/20 text-primary"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {msg.role === "user" ? <User size={13} /> : <TrendingUp size={13} />}
                </div>
                <div
                  className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "bg-primary/15 text-foreground rounded-tr-sm"
                      : "bg-background border border-border/40 text-foreground rounded-tl-sm"
                  )}
                >
                  {msg.content ? (
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                  ) : (
                    <div className="flex gap-1 items-center py-0.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-primary/60 animate-bounce" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3 shrink-0">
        <div className="flex items-end gap-2 rounded-2xl border border-border/60 bg-card p-2 focus-within:border-primary/40 transition-colors">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte sobre indicadores, estratégias, fundamentos..."
            rows={1}
            className="flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-muted-foreground/50 max-h-32"
            style={{ fieldSizing: "content" } as React.CSSProperties}
          />
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || loading}
            className="h-8 w-8 shrink-0 bg-primary hover:bg-primary/90 disabled:opacity-40"
          >
            <Send size={14} />
          </Button>
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground/50">
          Apenas fins educacionais. Não constitui recomendação de investimento.
        </p>
      </form>
    </div>
  );
}
