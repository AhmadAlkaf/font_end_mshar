"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileCheck2,
  CalendarCheck,
  Plus,
  Filter,
  CheckCircle,
  XCircle,
  Clock,
  Wallet,
  Tags,
  CalendarDays,
  Search,
} from "lucide-react";
import { LeaveStatusBadge } from "@/components/ui/Badge";
import { LeaveRequestModal } from "@/components/leaves/LeaveRequestModal";
import { api } from "@/services/api";
import {
  LeaveRequest,
  Employee,
  LeaveType,
  StatusRequest,
} from "@/types/hr";

export default function LeavesPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [reqs, emps, types] = await Promise.all([
        api.leaves.getRequests(),
        api.employees.getAll(),
        api.leaves.getTypes(),
      ]);
      setRequests(reqs);
      setEmployees(emps);
      setLeaveTypes(types);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (id: number, status: StatusRequest) => {
    await api.leaves.updateStatus(id, status);
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleCreated = (newReq: LeaveRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  const filteredRequests = requests.filter((r) => {
    const matchesTab =
      activeTab === "all" || String(r.status) === activeTab;
    const matchesSearch =
      (r.employee_name &&
        r.employee_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.leave_type_name &&
        r.leave_type_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const pendingCount = requests.filter(
    (r) => r.status === StatusRequest.Pending
  ).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <FileCheck2 className="w-7 h-7 text-[#5B21B6]" />
            <span>إدارة ومتابعة طلبات الإجازات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            مراجعة طلبات الإجازات السنوية والمرضية والطارئة، واعتمادها
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/leaves/balances"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-semibold text-xs border border-purple-200 transition-colors"
          >
            <Wallet className="w-4 h-4" />
            <span>أرصدة الموظفين</span>
          </Link>
          <Link
            href="/leaves/types"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-semibold text-xs border border-purple-200 transition-colors"
          >
            <Tags className="w-4 h-4" />
            <span>أنواع وقوانين الإجازة</span>
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>تقديم طلب إجازة</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar & Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white text-[#4C1D95] shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            الكل ({requests.length})
          </button>

          <button
            onClick={() => setActiveTab(String(StatusRequest.Pending))}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === String(StatusRequest.Pending)
                ? "bg-white text-amber-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>في الانتظار</span>
            {pendingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab(String(StatusRequest.Approved))}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === String(StatusRequest.Approved)
                ? "bg-white text-emerald-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المقبولة
          </button>

          <button
            onClick={() => setActiveTab(String(StatusRequest.Rejected))}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === String(StatusRequest.Rejected)
                ? "bg-white text-rose-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            المرفوضة
          </button>
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم أو نوع الإجازة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
          />
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3.5 pr-2">الموظف</th>
                <th className="pb-3.5">الإدارة</th>
                <th className="pb-3.5">نوع الإجازة</th>
                <th className="pb-3.5">تاريخ البداية</th>
                <th className="pb-3.5">تاريخ النهاية</th>
                <th className="pb-3.5">المدة (أيام)</th>
                <th className="pb-3.5">الحالة</th>
                <th className="pb-3.5 text-center">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    لا توجد طلبات إجازة بهذه المعايير
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-4 pr-2 font-bold text-slate-800">
                      {req.employee_name}
                    </td>
                    <td className="py-4 text-slate-500">
                      {req.department_name || "المقر الرئيسي"}
                    </td>
                    <td className="py-4">
                      <span className="font-semibold text-[#4C1D95] bg-purple-50 px-2.5 py-1 rounded-lg">
                        {req.leave_type_name}
                      </span>
                    </td>
                    <td className="py-4 font-mono font-medium">{req.start_day}</td>
                    <td className="py-4 font-mono font-medium">{req.end_day}</td>
                    <td className="py-4 font-bold font-mono text-[#5B21B6]">
                      {req.days_count || 1} يوم
                    </td>
                    <td className="py-4">
                      <LeaveStatusBadge status={req.status} />
                    </td>
                    <td className="py-4 text-center">
                      {req.status === StatusRequest.Pending ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() =>
                              handleStatusChange(req.id, StatusRequest.Approved)
                            }
                            className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="قبول الطلب"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleStatusChange(req.id, StatusRequest.Rejected)
                            }
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors"
                            title="رفض الطلب"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[11px]">مكتمل</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <LeaveRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
        employees={employees}
        leaveTypes={leaveTypes}
      />
    </div>
  );
}
