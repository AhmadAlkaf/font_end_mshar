"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarDays,
  Calendar,
  Sparkles,
  ChevronRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { api } from "@/services/api";
import { LeaveDay, TypeDate } from "@/types/hr";

export default function HolidaysPage() {
  const [holidays, setHolidays] = useState<LeaveDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.leaves.getHolidays();
        setHolidays(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/leaves" className="hover:text-[#5B21B6]">
          إدارة الإجازات
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">العطل والأعياد الرسمية (Leave Days)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CalendarDays className="w-7 h-7 text-[#5B21B6]" />
            <span>العطل والمناسبات الرسمية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            جدول الإجازات الرسمية بنوعيها الهجري والميلادي المعفاة من تسجيل الحضور
          </p>
        </div>
      </div>

      {/* Holidays Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {holidays.map((h) => (
          <div
            key={h.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold mb-4">
                <Calendar className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-slate-800 text-base">{h.name}</h3>
              <p className="text-xs text-purple-700 font-semibold mt-1">
                {h.type_date === TypeDate.HIJRI ? "التقويم الهجري" : "التقويم الميلادي"}
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between font-mono text-xs">
                <span className="text-slate-400 font-sans">تاريخ المناسبة:</span>
                <span className="font-bold text-slate-800">
                  {h.day} / {h.month}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>{h.annual ? "عطلة سنوية متكررة" : "لمرة واحدة"}</span>
              <span className="text-emerald-600 font-bold">معتمد</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
