"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Network,
  Fingerprint,
  Clock,
  CalendarRange,
  FileCheck2,
  Wallet,
  Tags,
  CalendarDays,
  Settings,
  ChevronDown,
  ShieldCheck,
  Radio,
  Smartphone,
} from "lucide-react";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
}

interface NavGroup {
  groupTitle: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const navGroups: NavGroup[] = [
    {
      groupTitle: "الرئيسية",
      items: [
        {
          title: "لوحة التحكم",
          href: "/",
          icon: <LayoutDashboard className="w-5 h-5" />,
        },
      ],
    },
    {
      groupTitle: "الموارد البشرية",
      items: [
        {
          title: "الموظفون",
          href: "/employees",
          icon: <Users className="w-5 h-5" />,
        },
        {
          title: "الهيكل الإداري",
          href: "/organization",
          icon: <Network className="w-5 h-5" />,
        },
      ],
    },
    {
      groupTitle: "البصمة والدوام",
      items: [
        {
          title: "أجهزة البصمة",
          href: "/devices",
          icon: <Fingerprint className="w-5 h-5" />,
        },
        {
          title: "سجل الحضور والغياب",
          href: "/attendance",
          icon: <Clock className="w-5 h-5" />,
        },
        {
          title: "فترات الدوام (Shifts)",
          href: "/attendance/shifts",
          icon: <CalendarRange className="w-5 h-5" />,
        },
        {
          title: "قوانين البصمة",
          href: "/attendance/rules",
          icon: <ShieldCheck className="w-5 h-5" />,
        },
      ],
    },
    {
      groupTitle: "إدارة الإجازات",
      items: [
        {
          title: "طلبات الإجازات",
          href: "/leaves",
          icon: <FileCheck2 className="w-5 h-5" />,
        },
        {
          title: "أرصدة الموظفين",
          href: "/leaves/balances",
          icon: <Wallet className="w-5 h-5" />,
        },
        {
          title: "أنواع وقوانين الإجازة",
          href: "/leaves/types",
          icon: <Tags className="w-5 h-5" />,
        },
        {
          title: "العطل الرسمية",
          href: "/leaves/holidays",
          icon: <CalendarDays className="w-5 h-5" />,
        },
      ],
    },
    {
      groupTitle: "تطبيق الجوال (الموظف)",
      items: [
        {
          title: "بوابة الموظف (Mobile App)",
          href: "/employee-portal",
          icon: <Smartphone className="w-5 h-5 text-amber-300" />,
        },
      ],
    },
    {
      groupTitle: "النظام",
      items: [
        {
          title: "إعدادات الربط مع Django",
          href: "/settings",
          icon: <Settings className="w-5 h-5" />,
        },
      ],
    },
  ];

  return (
    <aside className="w-72 bg-gradient-to-b from-[#4C1D95] via-[#5B21B6] to-[#2E1065] text-white flex flex-col h-screen sticky top-0 shadow-2xl z-40 select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-purple-800/60 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
            <Fingerprint className="w-6 h-6 text-purple-200 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wider text-white flex items-center gap-1.5">
              مَـسَـار
              <span className="text-[10px] font-medium bg-purple-400/30 text-purple-200 px-2 py-0.5 rounded-full border border-purple-300/20">
                HR v1.0
              </span>
            </h1>
            <p className="text-xs text-purple-200/80 font-normal">نظام الدوام والبصمة المتكامل</p>
          </div>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {navGroups.map((group, idx) => (
          <div key={idx} className="space-y-1">
            <p className="px-3 text-[11px] font-bold text-purple-300/70 tracking-wider uppercase">
              {group.groupTitle}
            </p>
            <div className="space-y-1 pt-1">
              {group.items.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "bg-white text-[#4C1D95] shadow-lg shadow-purple-950/20 font-bold"
                        : "text-purple-100/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`${
                        isActive ? "text-[#5B21B6]" : "text-purple-200/80"
                      }`}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1">{item.title}</span>
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5B21B6]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-purple-800/60 bg-[#2E1065]/40 backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-purple-200/90">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>بث البصمة المباشر</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[11px] font-medium border border-emerald-400/20">
            نشط
          </span>
        </div>
        <p className="text-[11px] text-purple-300/60 mt-1">
          Django API: <span className="text-white font-mono">127.0.0.1:8000</span>
        </p>
      </div>
    </aside>
  );
};
