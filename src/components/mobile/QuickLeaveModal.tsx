"use client";

import React, { useState } from "react";
import { X, Calendar, Send, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import { LeaveRequest, Employee, LeaveType } from "@/types/hr";

interface QuickLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReq: LeaveRequest) => void;
  employee: Employee;
  leaveTypes: LeaveType[];
}

export const QuickLeaveModal: React.FC<QuickLeaveModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employee,
  leaveTypes,
}) => {
  const [leaveTypeId, setLeaveTypeId] = useState<number>(leaveTypes[0]?.id || 1);
  const [startDay, setStartDay] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [endDay, setEndDay] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split("T")[0]
  );
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const calculateDays = () => {
    const s = new Date(startDay);
    const e = new Date(endDay);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const selectedType = leaveTypes.find((t) => t.id === leaveTypeId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.leaves.createRequest({
        employee: employee.id,
        employee_name: employee.name,
        department_name: employee.department_name,
        leave_type: leaveTypeId,
        leave_type_name: selectedType?.name || "إجازة سنوية",
        start_day: startDay,
        end_day: endDay,
        days_count: calculateDays(),
      });
      onSuccess(created);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm p-0 sm:p-4 animate-fadeIn">
      <div
        className="relative w-full max-w-md bg-white rounded-t-[2.5rem] sm:rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all p-6 text-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle bar on mobile */}
        <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-4 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-base font-black text-slate-800 flex items-center gap-2">
              <span>طلب إجازة سريعة</span>
              <Sparkles className="w-4 h-4 text-purple-600" />
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              سيتم إرسال الطلب لمديرك لاعتماده
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نوع الإجازة المطلوبة *
            </label>
            <select
              value={leaveTypeId}
              onChange={(e) => setLeaveTypeId(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 text-xs font-semibold border border-slate-200 rounded-2xl focus:outline-none focus:border-[#5B21B6] bg-slate-50 text-slate-800"
            >
              {leaveTypes
                .filter((t) => !t.due)
                .map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} (طلب مسبق قبل {t.minimum_request} أيام)
                  </option>
                ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                من تاريخ *
              </label>
              <input
                type="date"
                required
                value={startDay}
                onChange={(e) => setStartDay(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-2xl focus:outline-none focus:border-[#5B21B6] bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                إلى تاريخ *
              </label>
              <input
                type="date"
                required
                value={endDay}
                onChange={(e) => setEndDay(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-200 rounded-2xl focus:outline-none focus:border-[#5B21B6] bg-slate-50"
              />
            </div>
          </div>

          {/* Days count highlight */}
          <div className="p-3 bg-purple-50 border border-purple-100 rounded-2xl flex items-center justify-between text-xs">
            <span className="font-bold text-purple-900">إجمالي مدة الإجازة:</span>
            <span className="font-black text-[#5B21B6] text-sm font-mono">
              {calculateDays()} يوم
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظة أو سبب الإجازة (اختياري)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="مثال: ظرف عائلي طارئ / إجازة سنوية مجدولة..."
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-2xl focus:outline-none focus:border-[#5B21B6] bg-slate-50 text-slate-800"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-2xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs shadow-lg shadow-purple-950/20 hover:opacity-95 flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "جاري الإرسال..." : "إرسال طلب الإجازة للمدير"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
