"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  CheckCircle,
  AlertCircle,
  Fingerprint,
  CalendarCheck,
  ArrowUpRight,
  Clock,
  Plus,
  RefreshCw,
  ExternalLink,
  ChevronLeft,
  Wifi,
  Sparkles,
} from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import { AttendanceBadge, LeaveStatusBadge, DeviceStatusBadge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import {
  Employee,
  Attendance,
  DataReception,
  DeviceFingerPrint,
  LeaveRequest,
  AttendanceStatus,
  StatusRequest,
} from "@/types/hr";

export default function DashboardPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [receptions, setReceptions] = useState<DataReception[]>([]);
  const [devices, setDevices] = useState<DeviceFingerPrint[]>([]);
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [empData, attData, recData, devData, lveData] = await Promise.all([
        api.employees.getAll(),
        api.attendance.getRecords(),
        api.devices.getLiveReceptions(),
        api.devices.getAll(),
        api.leaves.getRequests(),
      ]);
      setEmployees(empData);
      setAttendance(attData);
      setReceptions(recData);
      setDevices(devData);
      setLeaves(lveData);
    } catch (err) {
      console.error("Error loading dashboard data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleLeaveAction = async (id: number, status: StatusRequest) => {
    await api.leaves.updateStatus(id, status);
    setLeaves((prev) =>
      prev.map((l) => (l.id === id ? { ...l, status } : l))
    );
  };

  // Calculations
  const totalEmployees = employees.length;
  const presentCount = attendance.filter(
    (a) => a.is_present1 === AttendanceStatus.PRESENT
  ).length;
  const lateCount = attendance.filter(
    (a) => a.is_present1 === AttendanceStatus.LATE
  ).length;
  const absentCount = attendance.filter(
    (a) => a.is_present1 === AttendanceStatus.ABSENT
  ).length;
  const vacationCount = attendance.filter(
    (a) => a.is_present1 === AttendanceStatus.VACATION
  ).length;
  const onlineDevices = devices.filter((d) => d.is_online).length;
  const pendingLeaves = leaves.filter((l) => l.status === StatusRequest.Pending);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] p-8 text-white shadow-xl shadow-purple-950/15">
        <div className="absolute top-0 -left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-purple-200 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>لوحة التحكم والمتابعة المباشرة</span>
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight">
              أهلاً بك في نظام مسار لإدارة الموارد البشرية والدوام
            </h2>
            <p className="text-purple-200/90 text-sm max-w-2xl leading-relaxed">
              متابعة آنية لأجهزة البصمة، تسجيل الحضور والانصراف، مراجعة طلبات الإجازات وإدارة الهيكل التنظيمي للموظفين بكل سهولة ودقة.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/employees"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-[#4C1D95] font-bold text-sm shadow-md hover:bg-purple-50 transition-all hover:scale-105 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>إضافة موظف</span>
            </Link>
            <Link
              href="/leaves"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-900/40 text-white font-semibold text-sm border border-purple-300/30 hover:bg-purple-900/60 transition-all"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>طلبات الإجازة</span>
            </Link>
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all"
              title="تحديث البيانات"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Primary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="إجمالي الموظفين"
          value={totalEmployees}
          subtitle={`${employees.filter((e) => e.active).length} موظف نشط في النظام`}
          icon={<Users className="w-6 h-6" />}
          highlightColor="purple"
          trend={{ value: "+2 موظف جديد", isPositive: true }}
        />
        <StatCard
          title="الحضور اليومي"
          value={presentCount}
          subtitle={`من أصل ${totalEmployees} مسجلين بفترات الدوام`}
          icon={<CheckCircle className="w-6 h-6" />}
          highlightColor="emerald"
          trend={{ value: "92% نسبة الالتزام", isPositive: true }}
        />
        <StatCard
          title="التأخير والغياب اليوم"
          value={lateCount + absentCount}
          subtitle={`${lateCount} متأخر | ${absentCount} غائب | ${vacationCount} إجازة`}
          icon={<AlertCircle className="w-6 h-6" />}
          highlightColor="amber"
          trend={{ value: "-4% تحسن عن الأمس", isPositive: true }}
        />
        <StatCard
          title="أجهزة البصمة النشطة"
          value={`${onlineDevices} / ${devices.length}`}
          subtitle="الأجهزة المتصلة والمتزامنة الآن"
          icon={<Fingerprint className="w-6 h-6" />}
          highlightColor="blue"
        />
      </div>

      {/* Main Grid: Live Feed & Attendance Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Live Biometric Reception Feed */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Biometric Reception Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center font-bold">
                  <Fingerprint className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    حركات البصمة الحية (Data Reception)
                  </h3>
                  <p className="text-xs text-slate-400">
                    استقبال بيانات البصمة اللحظية مباشرة من الأجهزة
                  </p>
                </div>
              </div>
              <Link
                href="/devices"
                className="text-xs font-semibold text-[#5B21B6] hover:text-[#4C1D95] flex items-center gap-1"
              >
                <span>جميع الأجهزة</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100 mt-2 overflow-x-auto">
              {receptions.length === 0 ? (
                <p className="text-center py-8 text-slate-400 text-sm">
                  لا توجد حركات بصمة مسجلة حالياً
                </p>
              ) : (
                receptions.map((rec) => (
                  <div
                    key={rec.id}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-9 h-9 rounded-xl bg-purple-100/70 text-[#4C1D95] flex items-center justify-center font-bold text-xs">
                        {rec.user_id}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">
                          {rec.user_name || `المستخدم ${rec.user_id}`}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <Wifi className="w-3 h-3 text-slate-400" />
                          <span>{rec.device_name}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-left">
                      <span className="text-xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                        {rec.timestamp}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {rec.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pending Leave Requests */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
                  <CalendarCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">
                    طلبات الإجازة بانتظار الاعتماد
                  </h3>
                  <p className="text-xs text-slate-400">
                    مراجعة واعتماد إجازات الموظفين المقدمة
                  </p>
                </div>
              </div>
              <Link
                href="/leaves"
                className="text-xs font-semibold text-[#5B21B6] hover:text-[#4C1D95] flex items-center gap-1"
              >
                <span>إدارة الإجازات</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {pendingLeaves.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-sm">
                  <CheckCircle className="w-8 h-8 text-emerald-500 mx-auto mb-1 opacity-70" />
                  لا توجد طلبات إجازة معلقة حالياً
                </div>
              ) : (
                pendingLeaves.map((req) => (
                  <div
                    key={req.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-800 text-sm">
                          {req.employee_name}
                        </span>
                        <span className="text-xs text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md font-medium">
                          {req.leave_type_name}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        من تاريخ <span className="font-semibold text-slate-700">{req.start_day}</span> إلى{" "}
                        <span className="font-semibold text-slate-700">{req.end_day}</span> ({req.days_count} أيام)
                      </p>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <button
                        onClick={() => handleLeaveAction(req.id, StatusRequest.Approved)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-sm"
                      >
                        قبول الطلب
                      </button>
                      <button
                        onClick={() => handleLeaveAction(req.id, StatusRequest.Rejected)}
                        className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs border border-rose-200 transition-colors"
                      >
                        رفض
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Status Breakdown & Devices Health */}
        <div className="space-y-8">
          {/* Today's Attendance Breakdown */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base mb-1">
              توزيع الحالات اليوم
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              حالات حضور الموظفين المسجلين اليوم
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-emerald-700">حاضر في الموعد</span>
                  <span>{presentCount} موظف</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{
                      width: `${totalEmployees ? (presentCount / totalEmployees) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-amber-700">متأخر عن الدوام</span>
                  <span>{lateCount} موظف</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${totalEmployees ? (lateCount / totalEmployees) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-sky-700">في إجازة رسمية</span>
                  <span>{vacationCount} موظف</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sky-500 rounded-full"
                    style={{
                      width: `${totalEmployees ? (vacationCount / totalEmployees) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1.5">
                  <span className="text-rose-700">غائب بدون إذن</span>
                  <span>{absentCount} موظف</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{
                      width: `${totalEmployees ? (absentCount / totalEmployees) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-100">
              <Link
                href="/attendance"
                className="w-full py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-bold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <span>عرض سجل الحضور الكامل</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Biometric Devices Health */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-800 text-base">
                حالة أجهزة البصمة
              </h3>
              <span className="text-xs font-semibold text-purple-700">
                {onlineDevices} متصل
              </span>
            </div>

            <div className="space-y-3 mt-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 hover:bg-white transition-all space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-xs text-slate-800">
                      {device.name}
                    </p>
                    <DeviceStatusBadge isOnline={device.is_online} />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>IP: {device.ip_address}</span>
                    <span>Port: {device.port}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span>الموقع: {device.location}</span>
                    <span>ساعة الجهاز: {device.device_last_time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100">
              <Link
                href="/devices"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:border-[#5B21B6] text-slate-700 hover:text-[#5B21B6] font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <span>إدارة ومزامنة الأجهزة</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
