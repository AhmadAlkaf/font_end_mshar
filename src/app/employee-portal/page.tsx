"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Clock,
  CalendarCheck2,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ChevronLeft,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Fingerprint,
  Wallet,
  ShieldAlert,
} from "lucide-react";
import { MobileHeader } from "@/components/mobile/MobileHeader";
import { LateAlertBanner } from "@/components/mobile/LateAlertBanner";
import { QuickLeaveModal } from "@/components/mobile/QuickLeaveModal";
import { api } from "@/services/api";
import {
  Employee,
  Attendance,
  LeaveBalance,
  LeaveType,
  Shift,
  AttendanceStatus,
  LeaveRequest,
} from "@/types/hr";

export default function EmployeePortalHomePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const [emps, atts, bals, types, shfs] = await Promise.all([
          api.employees.getAll(),
          api.attendance.getRecords(),
          api.leaves.getBalances(),
          api.leaves.getTypes(),
          api.attendance.getShifts(),
        ]);
        setEmployees(emps);
        // Default to employee 1 (عبدالله) or 3 (فهد who is late)
        const current = emps[0];
        setSelectedEmployee(current);

        const currentAtt = atts.find((a) => a.employee === current.id) || null;
        setTodayAttendance(currentAtt);

        setBalances(bals.filter((b) => b.employee === current.id));
        setLeaveTypes(types);
        setShifts(shfs);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const handleSwitchEmployee = (emp: Employee) => {
    setSelectedEmployee(emp);
    api.attendance.getRecords().then((atts) => {
      const match = atts.find((a) => a.employee === emp.id) || null;
      setTodayAttendance(match);
    });
    api.leaves.getBalances().then((bals) => {
      setBalances(bals.filter((b) => b.employee === emp.id));
    });
  };

  const handleLeaveCreated = (newReq: LeaveRequest) => {
    alert("تم إرسال طلب الإجازة بنجاح إلى الإدارة!");
  };

  if (!selectedEmployee) {
    return (
      <div className="text-center py-20 text-slate-400 text-xs">
        جاري تحميل بيانات الموظف...
      </div>
    );
  }

  const annualBalance = balances.find((b) => b.leave_type === 1)?.balance || 22;
  const emergencyBalance = balances.find((b) => b.leave_type === 3)?.balance || 5;

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Mobile Top Header */}
      <MobileHeader
        currentEmployee={selectedEmployee}
        onSelectEmployee={handleSwitchEmployee}
        allEmployees={employees}
      />

      <div className="px-5 space-y-5">
        {/* 1. LATE ALERT BANNER (يعرف الموظف هل تأخر اليوم) */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs px-1">
            <span className="font-bold text-slate-700">حالة دوامك اليوم</span>
            <span className="text-[11px] text-slate-400">
              {new Date().toLocaleDateString("ar-SA", {
                weekday: "long",
                day: "numeric",
                month: "short",
              })}
            </span>
          </div>

          <LateAlertBanner
            todayAttendance={todayAttendance}
            shiftStartTime="08:00:00"
            gracePeriodMinutes={15}
          />
        </div>

        {/* 2. TODAY'S TIMELINE CARD */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-800 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#5B21B6]" />
              <span>تسجيلات البصمة المقررة اليوم</span>
            </h4>
            <span className="text-[10px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full">
              الفترة الصباحية
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Clock-in */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                بصمة الدخول
              </span>
              <span className="text-base font-black font-mono text-slate-800 block">
                {todayAttendance?.time_in || "لم تُسجل"}
              </span>
              <span className="text-[10px] text-slate-400 block">
                بداية الدوام: 08:00 ص
              </span>
            </div>

            {/* Clock-out */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-[11px] text-slate-400 block font-medium">
                بصمة الخروج
              </span>
              <span className="text-base font-black font-mono text-slate-800 block">
                {todayAttendance?.time_out || "في الانتظار"}
              </span>
              <span className="text-[10px] text-slate-400 block">
                نهاية الدوام: 04:00 م
              </span>
            </div>
          </div>
        </div>

        {/* 3. LEAVE BALANCES WIDGET (كم رصيدي واطلب اجازة) */}
        <div className="bg-gradient-to-br from-purple-900 to-[#5B21B6] rounded-3xl p-5 text-white shadow-lg shadow-purple-950/20 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-purple-300" />
              <h4 className="font-bold text-sm">رصيد الإجازات المتاح</h4>
            </div>
            <Link
              href="/employee-portal/leaves"
              className="text-[11px] text-purple-200 hover:text-white flex items-center gap-0.5"
            >
              <span>تفاصيل أكثر</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Balance Cards Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200 block">
                الإجازة السنوية
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono">
                  {annualBalance}
                </span>
                <span className="text-xs text-purple-200">يوم متبقي</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
              <span className="text-[11px] text-purple-200 block">
                إجازة طارئة / عارضة
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black font-mono">
                  {emergencyBalance}
                </span>
                <span className="text-xs text-purple-200">يوم متبقي</span>
              </div>
            </div>
          </div>

          {/* Quick Request Button */}
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="w-full py-3 rounded-2xl bg-white text-[#4C1D95] font-black text-xs shadow-md hover:bg-purple-50 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4 text-[#5B21B6]" />
            <span>تقديم طلب إجازة جديد الآن</span>
          </button>
        </div>

        {/* 4. QUICK SHIFT & ATTENDANCE SUMMARY */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h4 className="font-bold text-xs text-slate-800">
              ملخص الالتزام الشهري
            </h4>
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              95% نسبة الالتزام
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-slate-50">
              <span className="text-[10px] text-slate-400 block">أيام الحضور</span>
              <span className="font-black text-slate-800 text-sm font-mono mt-0.5 block">
                21 يوم
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50">
              <span className="text-[10px] text-slate-400 block">مرات التأخير</span>
              <span className="font-black text-amber-600 text-sm font-mono mt-0.5 block">
                1 مرة
              </span>
            </div>

            <div className="p-2.5 rounded-2xl bg-slate-50">
              <span className="text-[10px] text-slate-400 block">الغياب</span>
              <span className="font-black text-emerald-600 text-sm font-mono mt-0.5 block">
                0
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Leave Modal */}
      <QuickLeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={handleLeaveCreated}
        employee={selectedEmployee}
        leaveTypes={leaveTypes}
      />
    </div>
  );
}
