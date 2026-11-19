"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle,
  HelpCircle,
  Save,
  RotateCcw,
} from "lucide-react";
import { api } from "@/services/api";
import { LawFingerPrinter } from "@/types/hr";

export default function AttendanceRulesPage() {
  const [law, setLaw] = useState<LawFingerPrinter | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.attendance.getLaws();
        setLaw(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (!law) return null;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/attendance" className="hover:text-[#5B21B6]">
          سجل الحضور
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">قوانين البصمة واللوائح</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#5B21B6]" />
            <span>قوانين البصمة وحساب التأخير والغياب</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إعداد فترات السماح، شروط احتساب التأخير والغياب، وإجراءات نسيان البصمة
          </p>
        </div>
      </div>

      {/* Rules Form */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-6">
        <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-800 text-base">{law.name}</h3>
            <p className="text-xs text-purple-700 font-semibold mt-0.5">
              فترة الدوام المرتبطة: {law.shift_name}
            </p>
          </div>
          {isSaved && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle className="w-4 h-4" />
              تم حفظ اللائحة بنجاح
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Entry Grace Period */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              فترة السماح عند الحضور (بالدقائق)
            </label>
            <p className="text-[11px] text-slate-400">
              الوقت المسموح به للتأخير بعد بداية الدوام الرسمي دون احتساب تأخير
            </p>
            <input
              type="text"
              defaultValue={law.entry_grace_period || "00:15:00"}
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            />
          </div>

          {/* Consider Absent */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              اعتبار الموظف غائباً إذا تأخر لأكثر من
            </label>
            <p className="text-[11px] text-slate-400">
              إذا تجاوز تأخير الموظف هذه المدة، يتم تسجيله كـ (غياب) بدلاً من (تأخير)
            </p>
            <input
              type="text"
              defaultValue={law.consider_absent_if_late_by || "01:30:00"}
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            />
          </div>

          {/* Early Departure Allowance */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              فترة السماح عند الانصراف المبكر
            </label>
            <p className="text-[11px] text-slate-400">
              الوقت المسموح به للموظف بالانصراف قبل نهاية الدوام الرسمي
            </p>
            <input
              type="text"
              defaultValue={law.early_departure_allowance || "00:10:00"}
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            />
          </div>

          {/* Interval between 2 fingerprints */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 space-y-2">
            <label className="block text-xs font-bold text-slate-800">
              الفترة الزمنية الفاصلة بين البصمتين
            </label>
            <p className="text-[11px] text-slate-400">
              المدة الزمنية الأدنى بين بصمتين لنفس الموظف لتفادي التكرار العرضي
            </p>
            <input
              type="text"
              defaultValue={law.last_time_to_accept_finger_print || "00:05:00"}
              className="w-full px-3.5 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            />
          </div>

          {/* Deduct Missing Check-in */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="deduct_in"
              defaultChecked={law.deduct_for_missing_check_in}
              className="w-4 h-4 rounded text-[#5B21B6] focus:ring-[#5B21B6] mt-1"
            />
            <label htmlFor="deduct_in" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-800">
                احتساب غياب عند نسيان بصمة الدخول؟
              </span>
              إذا كان لدى الموظف بصمة خروج فقط دون دخول، هل يتم اعتباره غائباً وتطبيق الخصم؟
            </label>
          </div>

          {/* Deduct Missing Check-out */}
          <div className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex items-start gap-3">
            <input
              type="checkbox"
              id="deduct_out"
              defaultChecked={law.deduct_for_missing_check_out}
              className="w-4 h-4 rounded text-[#5B21B6] focus:ring-[#5B21B6] mt-1"
            />
            <label htmlFor="deduct_out" className="text-xs text-slate-700 cursor-pointer">
              <span className="font-bold block text-slate-800">
                تطبيق إجراء عند نسيان بصمة الخروج؟
              </span>
              إذا كان لدى الموظف بصمة دخول فقط دون خروج، هل يتم تطبيق إجراء نسيان البصمة؟
            </label>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>حفظ وتطبيق القوانين</span>
          </button>
        </div>
      </form>
    </div>
  );
}
