import React from "react";
import {
  AttendanceStatus,
  AttendanceStatusLabels,
  AttendanceStatusColors,
  StatusRequest,
  StatusRequestLabels,
  StatusRequestColors,
  EmploymentTypeChoice,
  EmploymentTypeLabels,
  TypeOfEmployee,
} from "@/types/hr";

interface AttendanceBadgeProps {
  status: AttendanceStatus | null | undefined;
}

export const AttendanceBadge: React.FC<AttendanceBadgeProps> = ({ status }) => {
  if (!status) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
        غير محدد
      </span>
    );
  }

  const label = AttendanceStatusLabels[status] || "غير معروف";
  const colors = AttendanceStatusColors[status] || {
    bg: "bg-slate-50",
    text: "text-slate-700",
    border: "border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5 opacity-70"></span>
      {label}
    </span>
  );
};

interface LeaveStatusBadgeProps {
  status: StatusRequest;
}

export const LeaveStatusBadge: React.FC<LeaveStatusBadgeProps> = ({ status }) => {
  const label = StatusRequestLabels[status] || "في الانتظار";
  const colors = StatusRequestColors[status] || StatusRequestColors[StatusRequest.Pending];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colors.bg} ${colors.text} ${colors.border}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current ml-1.5"></span>
      {label}
    </span>
  );
};

interface DeviceStatusBadgeProps {
  isOnline: boolean | undefined;
}

export const DeviceStatusBadge: React.FC<DeviceStatusBadgeProps> = ({ isOnline }) => {
  if (isOnline) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1.5 animate-pulse"></span>
        متصل الآن
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
      <span className="w-2 h-2 rounded-full bg-rose-400 ml-1.5"></span>
      غير متصل
    </span>
  );
};

interface EmploymentBadgeProps {
  type: string | number | TypeOfEmployee | null | undefined;
}

export const EmploymentBadge: React.FC<EmploymentBadgeProps> = ({ type }) => {
  const raw =
    type !== null && typeof type === "object" && "type_of_employee" in type
      ? type.type_of_employee
      : type;
  const choice = String(raw ?? "") as EmploymentTypeChoice;
  const label = EmploymentTypeLabels[choice] || "موظف";

  const colorMap: Record<string, string> = {
    [EmploymentTypeChoice.EMPLOYEE]: "bg-purple-50 text-brand-900 border-purple-200",
    [EmploymentTypeChoice.CONTRACTOR]: "bg-blue-50 text-blue-700 border-blue-200",
    [EmploymentTypeChoice.DAILY]: "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${
        colorMap[choice] || "bg-slate-50 text-slate-700 border-slate-200"
      }`}
    >
      {label}
    </span>
  );
};
