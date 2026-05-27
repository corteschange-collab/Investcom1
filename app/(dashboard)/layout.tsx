import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";
import { CommandPalette } from "@/components/layout/command-palette";
import { TickerTape } from "@/components/dashboard/ticker-tape";
import { HelpButton } from "@/components/support/help-button";
import { DbSyncProvider } from "@/components/layout/db-sync-provider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <DbSyncProvider>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />
          <TickerTape />
          <main className="flex-1 overflow-y-auto p-4 sm:p-6">
            {children}
          </main>
        </div>
        <CommandPalette />
        <HelpButton />
      </div>
    </DbSyncProvider>
  );
}
