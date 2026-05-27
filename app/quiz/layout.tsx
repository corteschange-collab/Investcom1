import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Descubra seu Perfil — InvestAI",
  description: "Quiz de perfil do investidor. 10 perguntas, 3 minutos, resultado personalizado.",
};

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
}
