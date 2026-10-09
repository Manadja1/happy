import React from "react";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { DashboardHeader } from "@/components/layout/dashboard-header";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FAF8F5]">
      {/* Desktop Sidebar */}
      <DashboardSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-x-hidden">
        {/* Header with active event switcher & profile */}
        <DashboardHeader />

        {/* Dynamic Page Content with bottom nav safe area on mobile */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-safe-nav">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>

        {/* Mobile Tactile Bottom Navigation */}
        <MobileBottomNav />
      </div>
    </div>
  );
}
