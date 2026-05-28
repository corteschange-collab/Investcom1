// Teste da integração OpenRouter
// Rodar: npx tsx scripts/test-openrouter.ts

import { config } from "dotenv";
import { resolve } from "path";

// Carrega .env.local (Next.js não carrega automaticamente fora do servidor)
config({ path: resolve(process.cwd(), ".env.local") });

import { askAI } from "@/lib/openrouter";

async function main() {
  console.log("Testando OpenRouter...\n");

  // Teste 1 — pergunta simples
  const resposta = await askAI("Olá, tudo bem?");
  console.log("Resposta:", resposta);

  // Teste 2 — modelo diferente
  const respostaHaiku = await askAI("Explique RSI em uma frase.", {
    model: "anthropic/claude-haiku-4.5",
    systemPrompt: "Você é um especialista em análise técnica de ações.",
  });
  console.log("\nRSI:", respostaHaiku);
}

main().catch(console.error);
