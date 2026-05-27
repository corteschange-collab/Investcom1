import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <Link href="/" className="mb-8 flex items-center gap-2 font-bold text-lg">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary">
          <TrendingUp size={18} />
        </div>
        InvestAI
      </Link>
      {children}
    </div>
  );
}
