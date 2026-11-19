"use client";

import React from "react";
import { Bell, Fingerprint, Sparkles, User } from "lucide-react";
import { Employee } from "@/types/hr";

interface MobileHeaderProps {
  currentEmployee: Employee;
  onSelectEmployee?: (emp: Employee) => void;
  allEmployees?: Employee[];
}

export const MobileHeader: React.FC<MobileHeaderProps> = ({
  currentEmployee,
  onSelectEmployee,
  allEmployees = [],
}) => {
  return (
    <div className="bg-gradient-to-l from-[#4C1D95] via-[#5B21B6] to-[#7C3AED] text-white px-5 pt-6 pb-6 rounded-b-[2rem] shadow-lg shadow-purple-950/20">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20">
            <Fingerprint className="w-4 h-4 text-purple-200" />
          </div>
          <span className="font-black text-sm tracking-wide text-white">
            مَـسَـار <span className="text-[10px] text-purple-200 font-normal">| بوابة الموظف</span>
          </span>
        </div>

        {/* Employee Switcher (for testing demo) */}
        {allEmployees.length > 0 && onSelectEmployee && (
          <div className="relative">
            <select
              value={currentEmployee.id}
              onChange={(e) => {
                const found = allEmployees.find(
                  (emp) => emp.id === Number(e.target.value)
                );
                if (found) onSelectEmployee(found);
              }}
              className="text-[11px] font-bold bg-white/20 border border-white/30 text-white rounded-xl px-2.5 py-1 focus:outline-none appearance-none cursor-pointer"
            >
              {allEmployees.map((emp) => (
                <option key={emp.id} value={emp.id} className="text-slate-800">
                  تبديل: {emp.name.split(" ")[0]} ({emp.job_title_name})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Greeting & Avatar */}
      <div className="flex items-center justify-between mt-2">
        <div className="space-y-0.5">
          <p className="text-xs text-purple-200 font-medium flex items-center gap-1">
            <span>مرحباً بك مجدداً</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          </p>
          <h2 className="text-xl font-black text-white">{currentEmployee.name}</h2>
          <p className="text-xs text-purple-200/80 font-medium">
            {currentEmployee.job_title_name || "موظف مسار"} •{" "}
            <span className="text-purple-300">{currentEmployee.department_name}</span>
          </p>
        </div>

        <div className="w-13 h-13 rounded-2xl bg-white text-[#4C1D95] font-black text-lg flex items-center justify-center shadow-md p-3">
          {currentEmployee.name.charAt(0)}
        </div>
      </div>
    </div>
  );
};
