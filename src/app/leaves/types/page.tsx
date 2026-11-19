"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Tags,
  FileText,
  ShieldAlert,
  Percent,
  Calendar,
  Layers,
  ChevronRight,
  Info,
} from "lucide-react";
import { api } from "@/services/api";
import { LeaveType } from "@/types/hr";

export default function LeaveTypesPage() {
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.leaves.getTypes();
        setTypes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/leaves" className="hover:text-[#5B21B6]">
          إدارة الإجازات
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">أنواع وقوانين الإجازات (Leave Types & Laws)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Tags className="w-7 h-7 text-[#5B21B6]" />
            <span>أنواع وقوانين الإجازات</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            اللوائح المعتمدة لأنواع الإجازات، مهلة الطلب المسبق، وقوانين الاستحقاق حسب العمر ونوع التوظيف
          </p>
        </div>
      </div>

      {/* Types List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {types.map((type) => (
          <div
            key={type.id}
            className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{type.name}</h3>
                    <span className="text-[11px] text-purple-700 font-semibold font-mono">
                      كود: LVT-00{type.id}
                    </span>
                  </div>
                </div>

                {type.due ? (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                    خاصة بالإدارة
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    متاحة للموظفين
                  </span>
                )}
              </div>

              <div className="py-4 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  {type.descrptions}
                </p>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px] mb-0.5">
                      مهلة الطلب المسبق
                    </span>
                    <span className="font-bold text-[#4C1D95]">
                      {type.minimum_request > 0
                        ? `قبل ${type.minimum_request} أيام على الأقل`
                        : "فوري / بدون مهلة مسبقة"}
                    </span>
                  </div>

                  <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-xl">
                    <span className="text-slate-400 block text-[10px] mb-0.5">
                      ظهور الإجازة في النماذج
                    </span>
                    <span className="font-bold text-slate-700">
                      {type.due ? "مخفية عن الموظفين" : "ظاهرة في القائمة"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Age & Deportation Law Info banner */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1 text-purple-900 font-semibold">
                <Percent className="w-3.5 h-3.5 text-[#5B21B6]" />
                <span>ترحيل الرصيد السنوي: مفعل (حسب فئة الموظف والعمر)</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
