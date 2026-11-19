"use client";

import React, { useState, useEffect } from "react";
import {
  CalendarCheck2,
  Plus,
  Wallet,
  Clock,
  Sparkles,
  ChevronLeft,
} from "lucide-react";
import { LeaveStatusBadge } from "@/components/ui/Badge";
import { QuickLeaveModal } from "@/components/mobile/QuickLeaveModal";
import { api } from "@/services/api";
import {
  LeaveBalance,
  LeaveRequest,
  LeaveType,
  Employee,
  StatusRequest,
} from "@/types/hr";

export default function MobileLeavesPage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [emps, bals, reqs, types] = await Promise.all([
        api.employees.getAll(),
        api.leaves.getBalances(),
        api.leaves.getRequests(),
        api.leaves.getTypes(),
      ]);
      const current = emps[0];
      setEmployee(current);
      setBalances(bals.filter((b) => b.employee === current.id));
      setRequests(reqs.filter((r) => r.employee === current.id));
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

  const handleCreated = (newReq: LeaveRequest) => {
    setRequests((prev) => [newReq, ...prev]);
  };

  return (
    <div className="space-y-5 animate-fadeIn p-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <CalendarCheck2 className="w-6 h-6 text-[#5B21B6]" />
            <span>إجازاتي وأرصدتي</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            معرفة رصيدك المتبقي وتقديم ومتابعة طلبات الإجازة
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="p-2.5 rounded-2xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white shadow-md active:scale-95 transition-all"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Balances Carousel / Cards */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-700 px-1">الأرصدة المتاحة</h3>
        <div className="grid grid-cols-2 gap-3">
          {balances.map((bal) => (
            <div
              key={bal.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-1.5"
            >
              <span className="text-[11px] text-slate-400 font-medium block">
                {bal.leave_type_name}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-[#5B21B6] font-mono">
                  {bal.balance}
                </span>
                <span className="text-xs text-slate-500 font-bold">يوم متاح</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Request Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full py-3.5 rounded-3xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs shadow-lg shadow-purple-950/20 hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>تقديم طلب إجازة جديد</span>
      </button>

      {/* Requests History */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold text-slate-700 px-1">
          سجل طلباتي السابقة ({requests.length})
        </h3>

        {requests.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center text-slate-400 text-xs border border-slate-100">
            لا توجد طلبات إجازة مسجلة مسبقاً
          </div>
        ) : (
          requests.map((req) => (
            <div
              key={req.id}
              className="bg-white rounded-3xl p-4 border border-slate-200/80 shadow-sm space-y-2.5"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-[#4C1D95]">
                  {req.leave_type_name}
                </span>
                <LeaveStatusBadge status={req.status} />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <div>
                  <span className="text-[10px] text-slate-400 block">فترة الإجازة</span>
                  <span className="font-mono text-slate-700 font-medium">
                    {req.start_day} إلى {req.end_day}
                  </span>
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 block">المدة</span>
                  <span className="font-mono font-bold text-[#5B21B6]">
                    {req.days_count || 1} يوم
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {employee && (
        <QuickLeaveModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleCreated}
          employee={employee}
          leaveTypes={leaveTypes}
        />
      )}
    </div>
  );
}
