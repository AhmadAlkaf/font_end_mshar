"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronRight,
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Briefcase,
  DollarSign,
  Fingerprint,
  FileText,
  Clock,
  Building,
  GraduationCap,
  Heart,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { AttendanceBadge, EmploymentBadge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Employee, Attendance, LeaveBalance } from "@/types/hr";

export default function EmployeeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params?.id);

  const [employee, setEmployee] = useState<Employee | null>(null);
  const [attendanceList, setAttendanceList] = useState<Attendance[]>([]);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [emp, att, bal] = await Promise.all([
          api.employees.getById(id),
          api.attendance.getRecords(),
          api.leaves.getBalances(),
        ]);
        setEmployee(emp);
        setAttendanceList(att.filter((a) => a.employee === id));
        setBalances(bal.filter((b) => b.employee === id));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="text-center py-24 text-slate-400 text-sm">
        جاري تحميل ملف الموظف...
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
        <User className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <p className="text-slate-700 font-bold">لم يتم العثور على الموظف</p>
        <Link
          href="/employees"
          className="mt-4 inline-flex items-center gap-1.5 text-xs text-[#5B21B6] font-bold"
        >
          <ChevronRight className="w-4 h-4" />
          <span>العودة لقائمة الموظفين</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/employees" className="hover:text-[#5B21B6] transition-colors">
          شؤون الموظفين
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">{employee.name}</span>
      </div>

      {/* Profile Header Hero */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#4C1D95] to-[#7C3AED] text-white flex items-center justify-center font-black text-3xl shadow-lg shadow-purple-950/20">
            {employee.name.charAt(0)}
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-800">{employee.name}</h1>
              <EmploymentBadge type={employee.type_of_employee} />
              {employee.active ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  نشط
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                  غير نشط
                </span>
              )}
            </div>
            <p className="text-sm text-purple-700 font-semibold mt-1">
              {employee.job_title_name || "المسمى الوظيفي لم يحدد بعد"} - {employee.department_name || "الإدارة"}
            </p>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              رقم الموظف: {employee.number_employee || "غير محدد"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/employees"
            className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold text-xs transition-colors"
          >
            الرجوع للقائمة
          </Link>
        </div>
      </div>

      {/* Main Grid: Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1 & 2: Personal & Financial info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-5 h-5 text-[#5B21B6]" />
              <span>البيانات الشخصية وبيانات الاتصال</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-xs">
              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">رقم الهاتف الأساسي</span>
                <span className="font-mono font-bold text-slate-700 text-sm">
                  {employee.phone}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">رقم الهاتف الثاني</span>
                <span className="font-mono text-slate-700 text-sm">
                  {employee.phone1 || "—"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">البريد الإلكتروني</span>
                <span className="text-slate-700 font-medium text-sm">
                  {employee.email || "—"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">المستوى التعليمي</span>
                <span className="text-slate-700 font-medium text-sm">
                  {employee.educational_level_name || "—"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">تاريخ الميلاد</span>
                <span className="font-mono text-slate-700 text-sm">
                  {employee.data_of_birth || "—"}
                </span>
              </div>

              <div className="p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">الحالة الاجتماعية</span>
                <span className="text-slate-700 font-medium text-sm">
                  {employee.marital_status_display || (employee.marital_status === 1 ? "متزوج" : "عازب")}
                </span>
              </div>

              <div className="sm:col-span-2 p-3 bg-slate-50/70 rounded-2xl">
                <span className="text-slate-400 block mb-1">العنوان الوطني / السكن</span>
                <span className="text-slate-700 font-medium text-sm">
                  {employee.address || "—"}
                </span>
              </div>

              {employee.note && (
                <div className="sm:col-span-2 p-3 bg-purple-50/40 border border-purple-100 rounded-2xl">
                  <span className="text-purple-900 font-bold block mb-1">ملاحظات</span>
                  <span className="text-slate-700">{employee.note}</span>
                </div>
              )}
            </div>
          </div>

          {/* Attendance History */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#5B21B6]" />
              <span>سجل الحضور والبصمة للموظف</span>
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="pb-3 pr-2">التاريخ</th>
                    <th className="pb-3">فترة الدوام</th>
                    <th className="pb-3">وقت الدخول</th>
                    <th className="pb-3">وقت الخروج</th>
                    <th className="pb-3">الحالة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {attendanceList.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        لا يوجد سجلات حضور سابقة لهذا الموظف
                      </td>
                    </tr>
                  ) : (
                    attendanceList.map((att) => (
                      <tr key={att.id} className="hover:bg-slate-50/70">
                        <td className="py-3 pr-2 font-mono">{att.date}</td>
                        <td className="py-3 font-medium">{att.shift_name || "الدوام الرسمي"}</td>
                        <td className="py-3 font-mono">{att.time_in || "—"}</td>
                        <td className="py-3 font-mono">{att.time_out || "—"}</td>
                        <td className="py-3">
                          <AttendanceBadge status={att.is_present1} />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Col 3: Financial & Leave Balances */}
        <div className="space-y-6">
          {/* Financial Info */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#5B21B6]" />
              <span>البيانات المالية والراتب</span>
            </h3>

            <div className="mt-4 space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">الراتب الأساسي</span>
                <span className="text-sm font-black text-slate-800 font-mono">
                  {Number(employee.basic_salary).toLocaleString()} ريال
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">الراتب الثانوي / البدلات</span>
                <span className="text-sm font-black text-slate-800 font-mono">
                  {Number(employee.secondary_salary).toLocaleString()} ريال
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-gradient-to-l from-purple-50 to-indigo-50 border border-purple-200/80 flex items-center justify-between">
                <span className="text-xs font-bold text-[#4C1D95]">
                  إجمالي الاستحقاق الشهري
                </span>
                <span className="text-base font-black text-[#4C1D95] font-mono">
                  {(
                    Number(employee.basic_salary) +
                    Number(employee.secondary_salary)
                  ).toLocaleString()}{" "}
                  ريال
                </span>
              </div>
            </div>
          </div>

          {/* Leave Balances Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
            <h3 className="font-bold text-slate-800 text-base pb-3 border-b border-slate-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#5B21B6]" />
              <span>أرصدة الإجازات المتاحة</span>
            </h3>

            <div className="mt-4 space-y-3">
              {balances.length === 0 ? (
                <p className="text-xs text-slate-400 py-3 text-center">
                  لا توجد أرصدة إجازات مسجلة
                </p>
              ) : (
                balances.map((bal) => (
                  <div
                    key={bal.id}
                    className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center justify-between"
                  >
                    <span className="text-xs font-semibold text-slate-700">
                      {bal.leave_type_name}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-[#4C1D95]">
                      {bal.balance} يوم
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
