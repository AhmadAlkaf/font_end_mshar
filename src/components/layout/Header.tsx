"use client";

import React, { useState, useEffect } from "react";
import {
  Bell,
  Search,
  Fingerprint,
  Calendar,
  User,
  Shield,
  Wifi,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { api } from "@/services/api";
import { DeviceFingerPrint } from "@/types/hr";

export const Header: React.FC = () => {
  const [timeString, setTimeString] = useState<string>("");
  const [dateString, setDateString] = useState<string>("");
  const [devices, setDevices] = useState<DeviceFingerPrint[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString("ar-SA", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
      setDateString(
        now.toLocaleDateString("ar-SA", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    // Fetch device status
    api.devices.getAll().then((devs) => setDevices(devs));

    return () => clearInterval(timer);
  }, []);

  const onlineDevicesCount = devices.filter((d) => d.is_online).length;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-6 py-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md hidden md:block">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="البحث السريع عن موظف، جهاز بصمة، أو رقم وظيفي..."
            className="w-full pr-10 pl-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] focus:ring-2 focus:ring-[#5B21B6]/20 transition-all text-slate-700"
          />
        </div>

        {/* Center Date & Time */}
        <div className="hidden lg:flex items-center gap-3 text-xs bg-purple-50/70 border border-purple-100 px-4 py-1.5 rounded-full text-[#4C1D95]">
          <Calendar className="w-3.5 h-3.5 text-[#5B21B6]" />
          <span className="font-semibold">{dateString}</span>
          <span className="text-purple-300">|</span>
          <span className="font-mono font-bold text-slate-700">{timeString}</span>
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-3">
          {/* Biometric Devices Pill */}
          <Link
            href="/devices"
            className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors"
          >
            <Wifi className="w-3.5 h-3.5 text-emerald-600 animate-pulse" />
            <span>البصمة:</span>
            <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
              {onlineDevicesCount} متصل
            </span>
          </Link>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-[#5B21B6] hover:bg-purple-50 transition-colors border border-transparent hover:border-purple-100"
              title="الإشعارات"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 left-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-50 text-right animate-fadeIn">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h4 className="font-bold text-slate-800 text-sm">التنبيهات</h4>
                  <span className="text-[11px] text-purple-700 font-semibold bg-purple-50 px-2 py-0.5 rounded-full">
                    2 جديدة
                  </span>
                </div>
                <div className="space-y-3 mt-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-purple-50/60 border border-purple-100">
                    <p className="font-bold text-[#4C1D95]">طلب إجازة جديد معلق</p>
                    <p className="text-slate-600 mt-0.5">
                      قدمت نورة الشمري طلب إجازة سنوية لمدة 5 أيام
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">منذ 25 دقيقة</span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                    <p className="font-bold text-amber-900">تنبيه تأخير دوام</p>
                    <p className="text-slate-600 mt-0.5">
                      سجل فهد الدوسري دخولاً متأخراً بـ 22 دقيقة
                    </p>
                    <span className="text-[10px] text-slate-400 mt-1 block">منذ ساعة</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pr-2 border-r border-slate-200">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#4C1D95] to-[#7C3AED] text-white flex items-center justify-center font-bold text-sm shadow-md">
              ع
            </div>
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-800">عبدالرحمن الكاف</p>
              <p className="text-[10px] text-slate-400">مدير النظام والموارد البشرية</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
