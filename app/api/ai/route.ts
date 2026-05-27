import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `Você é o assistente financeiro do InvestAI, uma plataforma de análise do mercado brasileiro.

Você ajuda investidores a entender conceitos de análise técnica, fundamentalista e probabilística.
Você conhece profundamente o mercado brasileiro: ações B3, FIIs, ETFs, Tesouro Direto, CDBs.

Regras:
- Nunca faça recomendações específicas de compra ou venda
- Sempre deixe claro que as informações são educacionais
- Explique indicadores (RSI, MACD, Bollinger, etc.) de forma clara
- Quando mencionar probabilidades ou cenários, deixe claro que são baseados em dados históricos
- Use português brasileiro natural
- Responda de forma concisa mas completa — evite textos muito longos
- Quando apropriado, estruture com bullet points ou seções

Você pode discutir: indicadores técnicos, estratégias de investimento, fundamentos empresariais,
gestão de risco, diversificação, conceitos do mercado financeiro brasileiro.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "OPENROUTER_API_KEY não configurada" }, { status: 500 });
  }

  try {
    const { messages, ticker } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const systemWithContext = ticker
      ? `${SYSTEM_PROMPT}\n\nO usuário está atualmente analisando o ativo: ${ticker}`
      : SYSTEM_PROMPT;

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "anthropic/claude-haiku-4.5",
        max_tokens: 1024,
        stream: true,
        messages: [
          { role: "system", content: systemWithContext },
          ...messages,
        ],
      }),
    });

    if (!res.ok || !res.body) {
      const text = await res.text();
      console.error("OpenRouter error:", text);
      return NextResponse.json({ error: "Erro na API" }, { status: 500 });
    }

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readable = new ReadableStream({
      async start(controller) {
        const reader = res.body!.getReader();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const json = JSON.parse(data);
              const text = json.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(encoder.encode(text));
              }
            } catch {
              // skip malformed chunks
            }
          }
        }
        controller.close();
      },
    });

    return new Response(readable, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("AI route error:", error);
    return NextResponse.json({ error: "Falha ao processar solicitação" }, { status: 500 });
  }
}
