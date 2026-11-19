"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Clock,
  CalendarCheck2,
  User,
} from "lucide-react";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();

  const tabs = [
    {
      title: "الرئيسية",
      href: "/employee-portal",
      icon: <Home className="w-5 h-5" />,
      exact: true,
    },
    {
      title: "حضوري",
      href: "/employee-portal/attendance",
      icon: <Clock className="w-5 h-5" />,
      exact: false,
    },
    {
      title: "إجازاتي",
      href: "/employee-portal/leaves",
      icon: <CalendarCheck2 className="w-5 h-5" />,
      exact: false,
    },
    {
      title: "حسابي",
      href: "/employee-portal/profile",
      icon: <User className="w-5 h-5" />,
      exact: false,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-6 py-2 pb-5 sm:pb-3 max-w-md mx-auto shadow-2xl">
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-1 py-1 transition-all relative ${
                isActive
                  ? "text-[#5B21B6] font-bold scale-105"
                  : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              {isActive && (
                <span className="absolute -top-2 w-5 h-1 rounded-full bg-[#5B21B6]" />
              )}
              {tab.icon}
              <span className="text-[10px] tracking-tight">{tab.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
