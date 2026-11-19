"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";
import { LeaveRequest, Employee, LeaveType } from "@/types/hr";

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newReq: LeaveRequest) => void;
  employees: Employee[];
  leaveTypes: LeaveType[];
}

export const LeaveRequestModal: React.FC<LeaveRequestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  employees,
  leaveTypes,
}) => {
  const [employeeId, setEmployeeId] = useState<number>(employees[0]?.id || 1);
  const [leaveTypeId, setLeaveTypeId] = useState<number>(leaveTypes[0]?.id || 1);
  const [startDay, setStartDay] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [endDay, setEndDay] = useState(
    new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0]
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateDays = () => {
    const s = new Date(startDay);
    const e = new Date(endDay);
    const diff = Math.ceil((e.getTime() - s.getTime()) / (1000 * 3600 * 24)) + 1;
    return diff > 0 ? diff : 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const selectedEmp = employees.find((emp) => emp.id === employeeId);
      const selectedType = leaveTypes.find((t) => t.id === leaveTypeId);

      const created = await api.leaves.createRequest({
        employee: employeeId,
        employee_name: selectedEmp?.name || "موظف مسار",
        department_name: selectedEmp?.department_name || "الموارد البشرية",
        leave_type: leaveTypeId,
        leave_type_name: selectedType?.name || "إجازة سنوية اعتيادية",
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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="تقديم طلب إجازة جديد"
      subtitle="تسجيل طلب إجازة للموظف واحتساب المدة تلقائياً"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-right">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            الموظف *
          </label>
          <select
            value={employeeId}
            onChange={(e) => setEmployeeId(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
          >
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.number_employee || "موظف"})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            نوع الإجازة *
          </label>
          <select
            value={leaveTypeId}
            onChange={(e) => setLeaveTypeId(Number(e.target.value))}
            className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
          >
            {leaveTypes
              .filter((t) => !t.due)
              .map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} (طلب مسبق: {t.minimum_request} أيام)
                </option>
              ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تاريخ البداية *
            </label>
            <input
              type="date"
              required
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تاريخ النهاية *
            </label>
            <input
              type="date"
              required
              value={endDay}
              onChange={(e) => setEndDay(e.target.value)}
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>
        </div>

        {/* Calculated Days Preview */}
        <div className="p-3 bg-purple-50 border border-purple-100 rounded-xl flex items-center justify-between text-xs">
          <span className="font-semibold text-purple-900">إجمالي مدة الإجازة:</span>
          <span className="font-bold text-[#4C1D95] text-sm">
            {calculateDays()} يوم
          </span>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
          >
            {isSubmitting ? "جاري الإرسال..." : "إرسال الطلب للاعتماد"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
