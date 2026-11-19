"use client";

import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Employee, EmploymentTypeChoice, MaritalStatusChoice } from "@/types/hr";
import { api } from "@/services/api";

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newEmployee: Employee) => void;
  initialData?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    number_employee: initialData?.number_employee || "",
    phone: initialData?.phone || "",
    phone1: initialData?.phone1 || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    educational_level: initialData?.educational_level || 1,
    type_of_employee: initialData?.type_of_employee || EmploymentTypeChoice.EMPLOYEE,
    marital_status: initialData?.marital_status || MaritalStatusChoice.MARRIED,
    basic_salary: initialData?.basic_salary || "",
    secondary_salary: initialData?.secondary_salary || "",
    data_of_birth: initialData?.data_of_birth || "",
    active: initialData?.active ?? true,
    note: initialData?.note || "",
    department_name: initialData?.department_name || "إدارة الموارد البشرية",
    job_title_name: initialData?.job_title_name || "موظف",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const created = await api.employees.create({
        ...formData,
        basic_salary: Number(formData.basic_salary) || 0,
        secondary_salary: Number(formData.secondary_salary) || 0,
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
      title={initialData ? "تعديل بيانات الموظف" : "إضافة موظف جديد"}
      subtitle="إدخال كافة البيانات الشخصية والوظيفية والمالية حسب نموذج Django"
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-5 text-right">
        {/* Basic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم الموظف الكامل *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: عبدالله سالم القحطاني"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الرقم الوظيفي
            </label>
            <input
              type="text"
              value={formData.number_employee}
              onChange={(e) =>
                setFormData({ ...formData, number_employee: e.target.value })
              }
              placeholder="EMP-1007"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] focus:ring-1 focus:ring-[#5B21B6]"
            />
          </div>
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم الهاتف الأساسي *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+966500000000"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              رقم الهاتف الثاني
            </label>
            <input
              type="tel"
              value={formData.phone1}
              onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
              placeholder="+966550000000"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="emp@masar.local"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>
        </div>

        {/* Employment and marital status */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              نوع التوظيف
            </label>
            <select
              value={formData.type_of_employee}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  type_of_employee: e.target.value as EmploymentTypeChoice,
                })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            >
              <option value={EmploymentTypeChoice.EMPLOYEE}>موظف رسمي</option>
              <option value={EmploymentTypeChoice.CONTRACTOR}>متعاقد</option>
              <option value={EmploymentTypeChoice.DAILY}>يومي</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الحالة الاجتماعية
            </label>
            <select
              value={formData.marital_status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  marital_status: e.target.value as MaritalStatusChoice,
                })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            >
              <option value={MaritalStatusChoice.MARRIED}>متزوج</option>
              <option value={MaritalStatusChoice.SINGLE}>عازب</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              المستوى التعليمي
            </label>
            <select
              value={formData.educational_level}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  educational_level: Number(e.target.value),
                })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-white"
            >
              <option value={1}>بكالوريوس علوم حاسوب</option>
              <option value={2}>بكالوريوس إدارة أعمال</option>
              <option value={3}>بكالوريوس محاسبة ومالية</option>
              <option value={4}>ماجستير إدارة مشاريع</option>
              <option value={5}>دبلوم تقني عالي</option>
            </select>
          </div>
        </div>

        {/* Salary & Birth */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الراتب الأساسي (ريال) *
            </label>
            <input
              type="number"
              required
              value={formData.basic_salary}
              onChange={(e) =>
                setFormData({ ...formData, basic_salary: e.target.value })
              }
              placeholder="12000"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              الراتب الثانوي / البدلات (ريال)
            </label>
            <input
              type="number"
              value={formData.secondary_salary}
              onChange={(e) =>
                setFormData({ ...formData, secondary_salary: e.target.value })
              }
              placeholder="2500"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              تاريخ الميلاد
            </label>
            <input
              type="date"
              value={formData.data_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, data_of_birth: e.target.value })
              }
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>
        </div>

        {/* Address & Note */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              العنوان الوطني / السكن
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="الرياض - حي النخيل"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ملاحظات إضافية
            </label>
            <input
              type="text"
              value={formData.note}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              placeholder="أي تفاصيل خاصة بالموظف..."
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>
        </div>

        {/* Active Toggle */}
        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="active-toggle"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
            className="w-4 h-4 rounded text-[#5B21B6] focus:ring-[#5B21B6] border-slate-300"
          />
          <label htmlFor="active-toggle" className="text-xs font-bold text-slate-700">
            الموظف على رأس العمل (نشط)
          </label>
        </div>

        {/* Submit Buttons */}
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
            {isSubmitting ? "جاري الحفظ..." : "حفظ الموظف في النظام"}
          </button>
        </div>
      </form>
    </Modal>
  );
};
