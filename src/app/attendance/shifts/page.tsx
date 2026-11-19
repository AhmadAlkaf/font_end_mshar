"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  CalendarRange,
  Clock,
  Users,
  Plus,
  ChevronRight,
  Calendar,
  Check,
} from "lucide-react";
import { api } from "@/services/api";
import { Shift, DayLabels, DayChoice } from "@/types/hr";

export default function ShiftsPage() {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.attendance.getShifts();
        setShifts(data);
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
        <Link href="/attendance" className="hover:text-[#5B21B6]">
          سجل الحضور
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">فترات الدوام (Shifts)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <CalendarRange className="w-7 h-7 text-[#5B21B6]" />
            <span>فترات الدوام وجداول الورديات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تحديد مواعيد بدء وانتهاء الدوام، أيام العمل، وتوزيع الموظفين على الفترات
          </p>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shifts.map((shift) => (
          <div
            key={shift.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold">
                    <Clock className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{shift.name}</h3>
                    <p className="text-xs text-purple-700 font-semibold font-mono mt-0.5">
                      {shift.start_time} - {shift.end_time}
                    </p>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-[#5B21B6] border border-purple-200">
                  {shift.employee_count || shift.employee.length} موظف مسجل
                </span>
              </div>

              {/* Working Days */}
              <div className="py-4">
                <h4 className="text-xs font-bold text-slate-700 mb-2.5 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>أيام العمل المقررة للفترة:</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {(["sat", "sun", "mon", "tue", "wed", "thu", "fri"] as DayChoice[]).map(
                    (dayKey) => {
                      const isWorkingDay =
                        shift.days_display?.includes(DayLabels[dayKey]) ||
                        (shift.id === 1 && dayKey !== "fri" && dayKey !== "sat") ||
                        (shift.id === 2 && dayKey !== "fri");

                      return (
                        <span
                          key={dayKey}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
                            isWorkingDay
                              ? "bg-purple-50 text-[#4C1D95] border border-purple-200 font-bold"
                              : "bg-slate-50 text-slate-300 border border-slate-100 line-through"
                          }`}
                        >
                          {DayLabels[dayKey]}
                        </span>
                      );
                    }
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
              <span>الفترة رقم: #{shift.id}</span>
              <span className="text-[#5B21B6] font-semibold">نشطة في حساب البصمات</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
