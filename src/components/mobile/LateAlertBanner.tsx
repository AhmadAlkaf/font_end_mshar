"use client";

import React from "react";
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  CalendarCheck,
  XCircle,
  HelpCircle,
} from "lucide-react";
import { Attendance, AttendanceStatus } from "@/types/hr";

interface LateAlertBannerProps {
  todayAttendance?: Attendance | null;
  shiftStartTime?: string;
  gracePeriodMinutes?: number;
}

export const LateAlertBanner: React.FC<LateAlertBannerProps> = ({
  todayAttendance,
  shiftStartTime = "08:00:00",
  gracePeriodMinutes = 15,
}) => {
  if (!todayAttendance) {
    return (
      <div className="bg-amber-50 border border-amber-200/80 rounded-3xl p-4 text-amber-900 shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-2xl bg-amber-100 text-amber-700">
          <Clock className="w-5 h-5 animate-pulse" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xs">لم تُسجل بصمة الدخول بعد</h4>
          <p className="text-[11px] text-amber-800/80 mt-0.5 leading-relaxed">
            يبدأ دوامك الرسمي الساعة{" "}
            <span className="font-bold font-mono">{shiftStartTime.slice(0, 5)}</span>. يُرجى التوجه لجهاز البصمة لتسجيل الحضور.
          </p>
        </div>
      </div>
    );
  }

  // 1) Present on time
  if (todayAttendance.is_present1 === AttendanceStatus.PRESENT) {
    return (
      <div className="bg-gradient-to-l from-emerald-50 to-teal-50 border border-emerald-200/80 rounded-3xl p-4 text-emerald-900 shadow-sm flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-emerald-500 text-white shadow-sm">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-emerald-800">
              حضورك منتظم اليوم في الموعد!
            </h4>
            <span className="text-[10px] font-bold bg-emerald-200/70 text-emerald-900 px-2 py-0.5 rounded-full">
              في الموعد
            </span>
          </div>
          <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
            تم تسجيل بصمة الدخول في الساعة{" "}
            <span className="font-bold font-mono text-emerald-900">
              {todayAttendance.time_in}
            </span>{" "}
            بنجاح دون أي تأخير مسجل.
          </p>
        </div>
      </div>
    );
  }

  // 2) Late
  if (todayAttendance.is_present1 === AttendanceStatus.LATE) {
    return (
      <div className="bg-gradient-to-l from-amber-50 to-orange-50 border border-amber-300 rounded-3xl p-4 text-amber-950 shadow-sm flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-amber-500 text-white shadow-sm">
          <AlertTriangle className="w-5 h-5 animate-bounce" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="font-black text-xs text-amber-900">
              تنبيه: تم تسجيل حضورك متأخراً!
            </h4>
            <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
              متأخر
            </span>
          </div>
          <p className="text-[11px] text-amber-800 mt-1 leading-relaxed">
            سجلت الدخول الساعة{" "}
            <span className="font-mono font-bold text-amber-950">
              {todayAttendance.time_in}
            </span>
            . تجاوزت فترة السماح ({gracePeriodMinutes} دقيقة) عن بداية الفترة المقررة (
            {shiftStartTime.slice(0, 5)}).
          </p>
          <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-amber-700 font-medium">
            <span>ملاحظة النظام: {todayAttendance.note || "تأخير مسجل في البصمة"}</span>
          </div>
        </div>
      </div>
    );
  }

  // 3) Vacation
  if (todayAttendance.is_present1 === AttendanceStatus.VACATION) {
    return (
      <div className="bg-sky-50 border border-sky-200 rounded-3xl p-4 text-sky-900 shadow-sm flex items-start gap-3.5">
        <div className="p-2.5 rounded-2xl bg-sky-500 text-white">
          <CalendarCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-xs text-sky-900">أنت في إجازة معتمدة اليوم</h4>
          <p className="text-[11px] text-sky-700 mt-0.5">
            إجازتك سارية ومعتمدة رسمياً في النظام. نتمنى لك إجازة سعيدة!
          </p>
        </div>
      </div>
    );
  }

  // 4) Absent
  return (
    <div className="bg-rose-50 border border-rose-200 rounded-3xl p-4 text-rose-900 shadow-sm flex items-start gap-3.5">
      <div className="p-2.5 rounded-2xl bg-rose-500 text-white">
        <XCircle className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h4 className="font-bold text-xs text-rose-900">غياب مسجل اليوم</h4>
        <p className="text-[11px] text-rose-700 mt-0.5">
          لم يتم رصد أي بصمة حتى الآن وتجاوزت الحد الأقصى للتأخير.
        </p>
      </div>
    </div>
  );
};
