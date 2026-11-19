"use client";

import React, { useState } from "react";
import Link from "next/link";
import { BottomNav } from "@/components/mobile/BottomNav";
import { Smartphone, Monitor, ChevronLeft } from "lucide-react";

export default function MobilePortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isPhoneFrame, setIsPhoneFrame] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900/90 text-slate-800 antialiased font-sans selection:bg-purple-200 selection:text-[#4C1D95] flex flex-col items-center justify-start py-0 sm:py-6 sm:px-4">
      {/* Top Bar for Desktop Preview */}
      <div className="w-full max-w-md hidden sm:flex items-center justify-between pb-3 text-xs text-purple-200">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>الرجوع إلى لوحة تحكم الإدارة</span>
        </Link>

        <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/15">
          <Smartphone className="w-3.5 h-3.5 text-amber-300" />
          <span>معاينة تطبيق الجوال (بوابة الموظف)</span>
        </div>
      </div>

      {/* Mobile Device Frame */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[844px] bg-[#F8FAFC] sm:rounded-[3rem] sm:shadow-2xl sm:shadow-purple-950/40 sm:border-[8px] sm:border-slate-800 overflow-hidden relative flex flex-col">
        {/* Notch on simulated mobile */}
        <div className="hidden sm:block absolute top-0 left-1/2 -translate-x-1/2 w-40 h-5 bg-slate-800 rounded-b-2xl z-50 pointer-events-none" />

        {/* Content Viewport */}
        <div className="flex-1 pb-24 overflow-y-auto">{children}</div>

        {/* Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
}
