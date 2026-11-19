"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  DollarSign,
  Fingerprint,
  Building,
  GraduationCap,
  Shield,
  ExternalLink,
} from "lucide-react";
import { EmploymentBadge } from "@/components/ui/Badge";
import { api } from "@/services/api";
import { Employee } from "@/types/hr";

export default function MobileProfilePage() {
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const emps = await api.employees.getAll();
        setEmployee(emps[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  if (!employee) return null;

  return (
    <div className="space-y-5 animate-fadeIn p-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-black text-slate-800 flex items-center gap-2">
          <User className="w-6 h-6 text-[#5B21B6]" />
          <span>ملفي الشخصي والوظيفي</span>
        </h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 left-0 h-16 bg-gradient-to-l from-[#4C1D95] to-[#5B21B6]" />

        <div className="relative pt-4">
          <div className="w-20 h-20 rounded-3xl bg-white text-[#4C1D95] font-black text-2xl flex items-center justify-center mx-auto shadow-md border-4 border-white mb-3">
            {employee.name.charAt(0)}
          </div>

          <h2 className="text-lg font-black text-slate-800">{employee.name}</h2>
          <p className="text-xs text-purple-700 font-semibold mt-0.5">
            {employee.job_title_name} • {employee.department_name}
          </p>

          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-[11px] font-mono bg-purple-50 text-[#4C1D95] px-2.5 py-0.5 rounded-full font-bold">
              {employee.number_employee || "EMP-1001"}
            </span>
            <EmploymentBadge type={employee.type_of_employee} />
          </div>
        </div>
      </div>

      {/* Info List */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3.5 text-xs">
        <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Briefcase className="w-4 h-4 text-[#5B21B6]" />
          <span>بيانات التواصل والوظيفة</span>
        </h3>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>رقم الهاتف:</span>
          </span>
          <span className="font-mono font-bold text-slate-800">{employee.phone}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" />
            <span>البريد:</span>
          </span>
          <span className="text-slate-800 font-medium">{employee.email || "—"}</span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <Fingerprint className="w-3.5 h-3.5 text-[#5B21B6]" />
            <span>رقمك في جهاز البصمة:</span>
          </span>
          <span className="font-mono font-black text-[#5B21B6] bg-purple-50 px-2 py-0.5 rounded-md">
            ID: 1001
          </span>
        </div>

        <div className="flex items-center justify-between py-1">
          <span className="text-slate-400 flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>المستوى التعليمي:</span>
          </span>
          <span className="text-slate-800 font-medium">
            {employee.educational_level_name || "بكالوريوس"}
          </span>
        </div>
      </div>

      {/* Financial Details */}
      <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-sm space-y-3 text-xs">
        <h3 className="font-bold text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <DollarSign className="w-4 h-4 text-[#5B21B6]" />
          <span>المعلومات المالية والراتب</span>
        </h3>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">الراتب الأساسي:</span>
          <span className="font-bold font-mono text-slate-800">
            {Number(employee.basic_salary).toLocaleString()} ريال
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-slate-500">الراتب الثانوي / البدلات:</span>
          <span className="font-bold font-mono text-slate-800">
            {Number(employee.secondary_salary).toLocaleString()} ريال
          </span>
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-bold text-purple-900">
          <span>إجمالي الراتب:</span>
          <span className="font-black font-mono text-[#4C1D95] text-sm">
            {(
              Number(employee.basic_salary) + Number(employee.secondary_salary)
            ).toLocaleString()}{" "}
            ريال
          </span>
        </div>
      </div>

      {/* Switch to Admin link */}
      <div className="pt-2">
        <Link
          href="/"
          className="w-full py-3 rounded-2xl border border-slate-200 text-slate-600 hover:text-[#5B21B6] hover:bg-slate-50 font-bold text-xs flex items-center justify-center gap-2 transition-all"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>الرجوع إلى لوحة الإدارة العامة</span>
        </Link>
      </div>
    </div>
  );
}
