"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { AttendanceBadge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Attendance, AttendanceStatus, Employee } from "@/types/hr";

export default function MobileAttendancePage() {
  const [records, setRecords] = useState<Attendance[]>([]);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [emps, atts] = await Promise.all([
          api.employees.getAll(),
          api.attendance.getRecords(),
        ]);
        const current = emps[0];
        setEmployee(current);
        setRecords(atts.filter((a) => a.employee === current.id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const totalLate = records.filter(
    (r) => r.is_present1 === AttendanceStatus.LATE
  ).length;
  const totalPresent = records.filter(
    (r) => r.is_present1 === AttendanceStatus.PRESENT
  ).length;

  return (
    <div className="space-y-5 animate-fadeIn p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-6 h-6 text-[#5B21B6]" />
            <span>سجل حضوري ودوامي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            متابعة بصمات الدخول والخروج والتأخيرات المسجلة
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200/80 text-emerald-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800">حضور منتظم</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono">{totalPresent}</span>
            <span className="text-xs text-emerald-700">أيام</span>
          </div>
        </div>

        <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200/80 text-amber-950">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800">حالات التأخير</span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono">{totalLate}</span>
            <span className="text-xs text-amber-700">مرة</span>
          </div>
        </div>
      </div>

      {/* Attendance Records List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 px-1">سجل الأيام الأخيرة</h3>

        {records.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-xs border border-slate-100">
            لا توجد سجلات حضور مسجلة
          </div>
        ) : (
          records.map((rec) => (
            <div
              key={rec.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" />
                  <span className="text-xs font-mono font-bold text-slate-800">
                    {rec.date}
                  </span>
                </div>
                <AttendanceBadge status={rec.is_present1} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">وقت الدخول</span>
                  <span className="font-mono font-black text-slate-800 text-sm">
                    {rec.time_in || "—"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">وقت الخروج</span>
                  <span className="font-mono font-black text-slate-800 text-sm">
                    {rec.time_out || "—"}
                  </span>
                </div>
              </div>

              {rec.note && (
                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500">
                  <span className="font-semibold text-purple-900">ملاحظة: </span>
                  {rec.note}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
