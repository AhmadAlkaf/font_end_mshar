"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Server,
  Key,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
  ExternalLink,
  Code,
  Shield,
  Activity,
} from "lucide-react";
import { api } from "@/services/api";

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState("http://localhost:8000/api");
  const [token, setToken] = useState("");
  const [testResult, setTestResult] = useState<{
    status: "idle" | "testing" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "" });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedToken = localStorage.getItem("masar_token") || "";
      setToken(savedToken);
    }
  }, []);

  const handleTestConnection = async () => {
    setTestResult({ status: "testing", message: "جاري فحص الاتصال بالخادم..." });
    const res = await api.healthCheck();
    if (res.isConnected) {
      setTestResult({
        status: "success",
        message: "تم الاتصال بنجاح مع سيرفر Django API!",
      });
    } else {
      setTestResult({
        status: "error",
        message:
          "تعذر الاتصال بـ Django API. تم تفعيل نظام البيانات التجريبية النشط (Mock Data) لضمان استمرار عمل الواجهة.",
      });
    }
  };

  const handleSaveToken = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("masar_token", token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const corsConfigCode = `# في ملف settings.py في مشروع Django:

INSTALLED_APPS = [
    ...
    'rest_framework',
    'corsheaders',
    'hr',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware', # يجب أن يكون بالأعلى
    'django.middleware.common.CommonMiddleware',
    ...
]

# السماح للواجهة الأمامية Next.js بالتواصل
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

CORS_ALLOW_CREDENTIALS = True
`;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Settings className="w-7 h-7 text-[#5B21B6]" />
            <span>إعدادات الربط مع Django API</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            تهيئة مسار الاتصال، مفاتيح المصادقة (JWT Token)، وإرشادات الـ Endpoints
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Server Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Connection Settings Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-5">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold">
                <Server className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  عنوان السيرفر (Django REST API Base URL)
                </h3>
                <p className="text-xs text-slate-400">
                  المسار الأساسي لكافة طلبات الـ HTTP
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رابط الـ API
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
                  />
                  <button
                    onClick={handleTestConnection}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-[#4C1D95] font-bold text-xs border border-purple-200 transition-colors"
                  >
                    <Activity className="w-4 h-4" />
                    <span>فحص الاتصال</span>
                  </button>
                </div>
              </div>

              {testResult.status !== "idle" && (
                <div
                  className={`p-4 rounded-2xl text-xs font-medium flex items-center gap-3 ${
                    testResult.status === "testing"
                      ? "bg-slate-100 text-slate-700"
                      : testResult.status === "success"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {testResult.status === "testing" && (
                    <RefreshCw className="w-4 h-4 animate-spin text-purple-600" />
                  )}
                  {testResult.status === "success" && (
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                  )}
                  {testResult.status === "error" && (
                    <XCircle className="w-5 h-5 text-amber-600" />
                  )}
                  <span>{testResult.message}</span>
                </div>
              )}

              {/* JWT Token */}
              <div className="pt-3 border-t border-slate-100">
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  رمز المصادقة (Bearer JWT Token)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="password"
                    placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    className="flex-1 px-4 py-2 text-sm font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
                  />
                  <button
                    onClick={handleSaveToken}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs shadow-md hover:opacity-95 transition-all"
                  >
                    {copied ? "تم الحفظ!" : "حفظ التوكن"}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CORS Configuration Guide */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-[#4C1D95] flex items-center justify-center font-bold">
                <Code className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm">
                  إعداد CORS في مشروع Django
                </h3>
                <p className="text-xs text-slate-400">
                  للسماح للواجهة بالاتصال بسلاسة دون أخطاء Cross-Origin
                </p>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-900 text-purple-200 font-mono text-xs overflow-x-auto leading-relaxed text-left" dir="ltr">
                {corsConfigCode}
              </pre>
            </div>
          </div>
        </div>

        {/* Right 1 Col: Endpoints mapping summary */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm pb-2 border-b border-slate-100">
              خريطة Endpoints المجهزة في الواجهة
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">الموظفون:</span>
                <span className="text-[#5B21B6] font-bold">/api/employees/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">الهيكل الإداري:</span>
                <span className="text-[#5B21B6] font-bold">/api/organizational-structure/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">المسميات الوظيفية:</span>
                <span className="text-[#5B21B6] font-bold">/api/job-titles/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">أجهزة البصمة:</span>
                <span className="text-[#5B21B6] font-bold">/api/devices/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">استقبال البصمات:</span>
                <span className="text-[#5B21B6] font-bold">/api/receptions/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">سجل الحضور:</span>
                <span className="text-[#5B21B6] font-bold">/api/attendance/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">فترات الدوام:</span>
                <span className="text-[#5B21B6] font-bold">/api/shifts/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">قوانين البصمة:</span>
                <span className="text-[#5B21B6] font-bold">/api/law-finger-printer/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">طلبات الإجازة:</span>
                <span className="text-[#5B21B6] font-bold">/api/leave-requests/</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 flex items-center justify-between font-mono">
                <span className="text-slate-700 font-sans font-semibold">أرصدة الإجازات:</span>
                <span className="text-[#5B21B6] font-bold">/api/leave-balances/</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
