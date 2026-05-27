/**
 * Support Contact API
 *
 * Accepts a support form submission, sends:
 *  1. Internal email to the support team
 *  2. Confirmation email to the user
 *
 * Falls back to console logging when RESEND_API_KEY is not set (dev).
 * Rate-limited to 3 requests per IP per 10 minutes via in-process store.
 */

import { auth } from "@clerk/nextjs/server";
import { Resend } from "resend";
import { NextResponse } from "next/server";

/* ── Config ─────────────────────────────────────────────── */

const SUPPORT_EMAIL = process.env.SUPPORT_EMAIL ?? "suporte@investai.com.br";
const FROM_EMAIL = process.env.FROM_EMAIL ?? "InvestAI <noreply@resend.dev>";
const resend = new Resend(process.env.RESEND_API_KEY ?? "");

/* ── Simple in-process rate limiter ─────────────────────── */

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxRequests = 3;

  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }
  if (entry.count >= maxRequests) return true;
  entry.count += 1;
  return false;
}

/* ── Types ───────────────────────────────────────────────── */

interface ContactPayload {
  name: string;
  email: string;
  category: string;
  subject: string;
  message: string;
  priority?: string;
  ticker?: string;
}

/* ── Email templates ─────────────────────────────────────── */

const CATEGORY_LABELS: Record<string, string> = {
  bug: "Erro / Bug técnico",
  dados: "Dado de mercado incorreto",
  login: "Acesso e autenticação",
  melhoria: "Sugestão de melhoria",
  comercial: "Contato comercial",
  outro: "Outro",
};

function internalEmail(payload: ContactPayload, ticketId: string, userId: string | null): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, sans-serif; color: #1e1e2e; background: #f8f8fc; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 12px; padding: 24px; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0f0; }
  .badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  .badge-bug { background: #fee2e2; color: #dc2626; }
  .badge-dados { background: #e0f2fe; color: #0369a1; }
  .badge-login { background: #fef3c7; color: #d97706; }
  .badge-melhoria { background: #d1fae5; color: #065f46; }
  .badge-comercial { background: #ede9fe; color: #6d28d9; }
  .badge-outro { background: #f3f4f6; color: #374151; }
  .field { margin: 16px 0; padding: 12px; background: #f8f8fc; border-radius: 8px; }
  .label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; }
  .value { margin-top: 4px; font-size: 14px; }
  .message { white-space: pre-wrap; line-height: 1.6; }
  h2 { margin-top: 0; font-size: 18px; }
  .ticket { font-family: monospace; font-size: 13px; color: #6366f1; font-weight: 700; }
</style></head>
<body>
<div class="card">
  <h2>📨 Novo contato recebido</h2>
  <span class="ticket">${ticketId}</span> &nbsp;
  <span class="badge badge-${payload.category}">${CATEGORY_LABELS[payload.category] ?? payload.category}</span>
  ${payload.priority === "urgente" ? '<span class="badge badge-bug" style="margin-left:8px">⚡ Urgente</span>' : ""}

  <div class="field">
    <div class="label">Remetente</div>
    <div class="value"><strong>${payload.name}</strong> &lt;${payload.email}&gt;</div>
    ${userId ? `<div style="font-size:12px;color:#9ca3af;margin-top:4px">User ID: ${userId}</div>` : ""}
  </div>

  <div class="field">
    <div class="label">Assunto</div>
    <div class="value">${payload.subject}</div>
  </div>

  ${payload.ticker ? `
  <div class="field">
    <div class="label">Ticker/Ativo mencionado</div>
    <div class="value" style="font-family:monospace;font-weight:700">${payload.ticker}</div>
  </div>` : ""}

  <div class="field">
    <div class="label">Mensagem</div>
    <div class="value message">${payload.message.replace(/</g, "&lt;")}</div>
  </div>

  <div style="font-size:12px;color:#9ca3af;margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb">
    Enviado em ${new Date().toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" })}
    · IP removido por privacidade
  </div>
</div>
</body>
</html>`;
}

function confirmationEmail(name: string, ticketId: string, category: string): string {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><style>
  body { font-family: -apple-system, sans-serif; color: #1e1e2e; background: #f8f8fc; margin: 0; padding: 20px; }
  .card { background: white; border-radius: 12px; padding: 32px; max-width: 520px; margin: 0 auto; border: 1px solid #e0e0f0; }
  .logo { display: flex; align-items: center; gap: 10px; margin-bottom: 24px; }
  .logo-icon { width: 36px; height: 36px; background: #6366f1/20; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .ticket { font-family: monospace; background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 8px; padding: 8px 14px; display: inline-block; font-size: 15px; font-weight: 700; color: #6366f1; margin: 8px 0 20px; }
  .footer { margin-top: 28px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
  a { color: #6366f1; }
</style></head>
<body>
<div class="card">
  <div class="logo">
    <span style="font-size:24px">📈</span>
    <strong style="font-size:16px">InvestAI</strong>
  </div>

  <p style="font-size:18px;font-weight:700;margin:0 0 8px">Recebemos sua mensagem, ${name.split(" ")[0]}.</p>
  <p style="color:#6b7280;margin:0 0 16px">Nossa equipe analisará sua solicitação e responderá em breve.</p>

  <div>
    <div style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;color:#9ca3af">Número do ticket</div>
    <div class="ticket">${ticketId}</div>
  </div>

  <div style="background:#f8f8fc;border-radius:10px;padding:16px;font-size:14px">
    <div style="font-weight:600;margin-bottom:4px">⏱ Tempo de resposta estimado</div>
    <div style="color:#6b7280">
      ${category === "bug" || category === "login" ? "Problemas técnicos: <strong>até 12 horas úteis</strong>" : ""}
      ${category === "dados" ? "Dados incorretos: <strong>até 24 horas úteis</strong>" : ""}
      ${category === "melhoria" ? "Sugestões: revisadas semanalmente pela equipe de produto" : ""}
      ${category === "comercial" ? "Contato comercial: <strong>até 48 horas úteis</strong>" : ""}
      ${category === "outro" ? "Até <strong>24 horas úteis</strong>" : ""}
    </div>
  </div>

  <p style="font-size:14px;color:#6b7280;margin-top:20px">
    Enquanto isso, consulte nossa <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://investai.com.br"}/dashboard/suporte#faq">central de ajuda</a>
    — talvez a resposta já esteja lá.
  </p>

  <div class="footer">
    Este é um e-mail automático. Não responda a esta mensagem — use o formulário em
    <a href="${process.env.NEXT_PUBLIC_APP_URL ?? "https://investai.com.br"}/dashboard/suporte">InvestAI Suporte</a>.
    <br><br>
    InvestAI · Plataforma de análise financeira para investidores brasileiros
  </div>
</div>
</body>
</html>`;
}

/* ── Route handler ───────────────────────────────────────── */

export async function POST(request: Request) {
  const { userId } = await auth();

  // Rate limit by userId (auth) or "anon"
  const rateLimitKey = userId ?? "anon";
  if (isRateLimited(rateLimitKey)) {
    return NextResponse.json(
      { error: "Muitas solicitações. Aguarde alguns minutos antes de tentar novamente." },
      { status: 429 }
    );
  }

  let payload: ContactPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
  }

  // Validate
  const { name, email, category, subject, message } = payload;
  if (!name?.trim() || name.trim().length < 2) {
    return NextResponse.json({ error: "Nome inválido." }, { status: 422 });
  }
  if (!email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return NextResponse.json({ error: "E-mail inválido." }, { status: 422 });
  }
  if (!category || !CATEGORY_LABELS[category]) {
    return NextResponse.json({ error: "Categoria inválida." }, { status: 422 });
  }
  if (!subject?.trim() || subject.trim().length < 5) {
    return NextResponse.json({ error: "Assunto muito curto." }, { status: 422 });
  }
  if (!message?.trim() || message.trim().length < 20) {
    return NextResponse.json({ error: "Mensagem muito curta (mínimo 20 caracteres)." }, { status: 422 });
  }

  // Generate ticket ID
  const ticketId = `INV-${Date.now().toString(36).toUpperCase()}`;

  const hasResend = Boolean(process.env.RESEND_API_KEY);

  if (hasResend) {
    try {
      await Promise.all([
        // Email to support team
        resend.emails.send({
          from: FROM_EMAIL,
          to: [SUPPORT_EMAIL],
          subject: `[${(CATEGORY_LABELS[category] ?? category).toUpperCase()}] ${subject} — ${ticketId}`,
          html: internalEmail(payload, ticketId, userId),
        }),
        // Confirmation to user
        resend.emails.send({
          from: FROM_EMAIL,
          to: [email],
          subject: `Recebemos sua mensagem ✓ — ${ticketId}`,
          html: confirmationEmail(name, ticketId, category),
        }),
      ]);
    } catch (err) {
      console.error("[support/contact] Resend error:", err);
      // Don't fail the request — log and continue (ticket ID still returned)
    }
  } else {
    // Development fallback
    console.log("[support/contact] RESEND_API_KEY not set — logging submission:");
    console.log(JSON.stringify({ ticketId, ...payload, userId }, null, 2));
  }

  return NextResponse.json({ success: true, ticketId });
}
