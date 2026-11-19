import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  highlightColor?: "purple" | "emerald" | "amber" | "rose" | "blue";
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  highlightColor = "purple",
  onClick,
}) => {
  const colorStyles = {
    purple: {
      bgIcon: "bg-purple-100 text-[#5B21B6]",
      border: "hover:border-[#7C3AED]/40",
      accent: "from-[#5B21B6]/10 to-transparent",
    },
    emerald: {
      bgIcon: "bg-emerald-100 text-emerald-600",
      border: "hover:border-emerald-300",
      accent: "from-emerald-500/10 to-transparent",
    },
    amber: {
      bgIcon: "bg-amber-100 text-amber-600",
      border: "hover:border-amber-300",
      accent: "from-amber-500/10 to-transparent",
    },
    rose: {
      bgIcon: "bg-rose-100 text-rose-600",
      border: "hover:border-rose-300",
      accent: "from-rose-500/10 to-transparent",
    },
    blue: {
      bgIcon: "bg-blue-100 text-blue-600",
      border: "hover:border-blue-300",
      accent: "from-blue-500/10 to-transparent",
    },
  };

  const style = colorStyles[highlightColor];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm transition-all duration-200 hover:shadow-md ${
        style.border
      } ${onClick ? "cursor-pointer" : ""}`}
    >
      <div
        className={`absolute top-0 right-0 left-0 h-1 bg-gradient-to-r ${style.accent}`}
      />
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-800 mt-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-3.5 rounded-2xl ${style.bgIcon} shadow-sm`}>
          {icon}
        </div>
      </div>

      {trend && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs">
          <span
            className={`font-semibold ml-1.5 ${
              trend.isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {trend.value}
          </span>
          <span className="text-slate-400">مقارنة بالأسبوع الماضي</span>
        </div>
      )}
    </div>
  );
};
