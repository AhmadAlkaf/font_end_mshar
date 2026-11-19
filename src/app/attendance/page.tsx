"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  Calendar,
  Filter,
  Search,
  Download,
  CalendarRange,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";
import { AttendanceBadge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Attendance, AttendanceStatus, AttendanceStatusLabels } from "@/types/hr";

export default function AttendancePage() {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const records = await api.attendance.getRecords(selectedDate);
        setAttendance(records);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [selectedDate]);

  const filteredRecords = attendance.filter((rec) => {
    const matchesSearch =
      (rec.employee_name &&
        rec.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (rec.employee_number &&
        rec.employee_number.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || String(rec.is_present1) === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Clock className="w-7 h-7 text-[#5B21B6]" />
            <span>سجل الحضور والانصراف اليومي</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة البصمات، أوقات الدخول والخروج، وحالات الالتزام وفق لوائح الدوام
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/attendance/shifts"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-semibold text-xs border border-purple-200 transition-colors"
          >
            <CalendarRange className="w-4 h-4" />
            <span>فترات الدوام</span>
          </Link>
          <Link
            href="/attendance/rules"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-semibold text-xs border border-purple-200 transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>قوانين البصمة</span>
          </Link>
        </div>
      </div>

      {/* Filter and Date Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Date Selector */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
            <Calendar className="w-4 h-4 text-[#5B21B6]" />
            <span>تاريخ السجل:</span>
          </div>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3.5 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-slate-50 text-slate-700"
          />
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم أو الرقم الوظيفي..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-9 pl-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-slate-50 text-slate-700"
          >
            <option value="all">جميع الحالات</option>
            {Object.entries(AttendanceStatusLabels).map(([val, label]) => (
              <option key={val} value={val}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3.5 pr-2">الموظف</th>
                <th className="pb-3.5">الرقم الوظيفي</th>
                <th className="pb-3.5">فترة الدوام</th>
                <th className="pb-3.5">ساعة الدخول</th>
                <th className="pb-3.5">ساعة الخروج</th>
                <th className="pb-3.5">جهاز الدخول</th>
                <th className="pb-3.5">الحالة</th>
                <th className="pb-3.5">ملاحظات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    لا توجد سجلات حضور مسجلة لهذا اليوم بالمعايير المحددة
                  </td>
                </tr>
              ) : (
                filteredRecords.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold text-xs">
                          {rec.employee_name?.charAt(0) || "م"}
                        </div>
                        <span className="font-bold text-slate-800">
                          {rec.employee_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-slate-500">
                      {rec.employee_number || "—"}
                    </td>
                    <td className="py-3.5 font-medium text-slate-600">
                      {rec.shift_name || "الدوام الرسمي"}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-800">
                      {rec.time_in || "—"}
                    </td>
                    <td className="py-3.5 font-mono font-bold text-slate-800">
                      {rec.time_out || "—"}
                    </td>
                    <td className="py-3.5 text-slate-500 text-[11px]">
                      {rec.device_in_name || "—"}
                    </td>
                    <td className="py-3.5">
                      <AttendanceBadge status={rec.is_present1} />
                    </td>
                    <td className="py-3.5 text-slate-400 text-[11px]">
                      {rec.note || "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
