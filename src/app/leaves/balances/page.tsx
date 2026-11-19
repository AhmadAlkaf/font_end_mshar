"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Wallet, Search, Filter, Plus, ChevronRight, User } from "lucide-react";
import { api } from "@/services/api";
import { LeaveBalance } from "@/types/hr";

export default function LeaveBalancesPage() {
  const [balances, setBalances] = useState<LeaveBalance[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const data = await api.leaves.getBalances();
        setBalances(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const filteredBalances = balances.filter(
    (b) =>
      b.employee_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.leave_type_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link href="/leaves" className="hover:text-[#5B21B6]">
          إدارة الإجازات
        </Link>
        <span>/</span>
        <span className="text-slate-700 font-bold">أرصدة الموظفين (Leave Balances)</span>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Wallet className="w-7 h-7 text-[#5B21B6]" />
            <span>أرصدة إجازات الموظفين</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            متابعة الرصيد المستحق والمتبقي لكل موظف وفق لوائح الإجازات المعتمدة
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between max-w-md">
        <div className="relative w-full">
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

      {/* Grid of Balances */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBalances.map((bal) => (
          <div
            key={bal.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold text-base">
                {bal.employee_name?.charAt(0) || "م"}
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  {bal.employee_name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{bal.leave_type_name}</p>
              </div>
            </div>

            <div className="text-left">
              <span className="text-[10px] text-slate-400 block font-medium">
                الرصيد المتاح
              </span>
              <span className="text-xl font-black text-[#5B21B6] font-mono">
                {bal.balance}{" "}
                <span className="text-xs font-sans font-bold">يوم</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
