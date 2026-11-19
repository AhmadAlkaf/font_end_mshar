"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ChevronLeft,
  GraduationCap,
  Download,
  Building2,
  DollarSign,
} from "lucide-react";
import { EmploymentBadge } from "@/components/ui/Badge";
import { EmployeeFormModal } from "@/components/employees/EmployeeFormModal";
import { api } from "@/services/api";
import { Employee } from "@/types/hr";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await api.employees.getAll();
      setEmployees(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleCreated = (newEmp: Employee) => {
    setEmployees((prev) => [newEmp, ...prev]);
  };

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (emp.number_employee &&
        emp.number_employee.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (emp.department_name &&
        emp.department_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      selectedType === "all" || String(emp.type_of_employee) === selectedType;

    return matchesSearch && matchesType;
  });

  const totalSalaries = employees.reduce(
    (acc, curr) => acc + (Number(curr.basic_salary) || 0),
    0
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Users className="w-7 h-7 text-[#5B21B6]" />
            <span>شؤون الموظفين (الموارد البشرية)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة سجلات الموظفين، العقود، الرواتب والبيانات الوظيفية
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all hover:scale-105 active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>إضافة موظف جديد</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">إجمالي الموظفين</p>
            <p className="text-2xl font-black text-slate-800 mt-0.5">
              {employees.length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">على رأس العمل (نشط)</p>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {employees.filter((e) => e.active).length}
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium">إجمالي الرواتب الأساسية</p>
            <p className="text-2xl font-black text-[#4C1D95] mt-0.5 font-mono">
              {totalSalaries.toLocaleString()} <span className="text-xs font-sans">ريال</span>
            </p>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-purple-100/60 text-[#4C1D95] flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="بحث بالاسم، الرقم الوظيفي، أو الإدارة..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 text-xs font-semibold border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] bg-slate-50 text-slate-700"
            >
              <option value="all">جميع أنواع التوظيف</option>
              <option value="1">موظف رسمي</option>
              <option value="2">متعاقد</option>
              <option value="3">يومي</option>
            </select>
          </div>
        </div>
      </div>

      {/* Employees Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEmployees.map((emp) => (
          <div
            key={emp.id}
            className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#4C1D95] to-[#7C3AED] text-white flex items-center justify-center font-black text-base shadow-sm">
                    {emp.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{emp.name}</h3>
                    <p className="text-xs text-purple-700 font-medium">
                      {emp.job_title_name || "موظف مسار"}
                    </p>
                  </div>
                </div>
                <EmploymentBadge type={emp.type_of_employee} />
              </div>

              {/* Card Meta Details */}
              <div className="py-3.5 space-y-2 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 font-medium">
                    {emp.department_name || "المقر الرئيسي"}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono text-slate-700">{emp.phone}</span>
                </div>

                {emp.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-slate-500">{emp.email}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 truncate">
                    {emp.educational_level_name || "مؤهل جامعي"}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block">الراتب الأساسي</span>
                <span className="text-xs font-bold text-slate-800 font-mono">
                  {Number(emp.basic_salary).toLocaleString()} ريال
                </span>
              </div>

              <Link
                href={`/employees/${emp.id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-bold text-xs transition-colors"
              >
                <span>الملف الكامل</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filteredEmployees.length === 0 && (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-bold">لا يوجد موظفين يطابقون معايير البحث</p>
          <p className="text-xs text-slate-400 mt-1">جرّب تغيير كلمات البحث أو الفلاتر</p>
        </div>
      )}

      {/* Modal */}
      <EmployeeFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCreated}
      />
    </div>
  );
}
