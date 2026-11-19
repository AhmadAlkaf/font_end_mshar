"use client";

import React, { useState, useEffect } from "react";
import {
  Fingerprint,
  Plus,
  Wifi,
  Server,
  Activity,
  MapPin,
  Clock,
  Radio,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  Shield,
  Layers,
} from "lucide-react";
import { DeviceStatusBadge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { api } from "@/services/api";
import { DeviceFingerPrint, DataReception } from "@/types/hr";

export default function DevicesPage() {
  const [devices, setDevices] = useState<DeviceFingerPrint[]>([]);
  const [receptions, setReceptions] = useState<DataReception[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<number | null>(null);

  // New Device Form State
  const [newDevice, setNewDevice] = useState({
    name: "",
    sn: "",
    location: "",
    ip_address: "192.168.1.205",
    port: 4370,
    is_active: true,
  });

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [devs, recs] = await Promise.all([
        api.devices.getAll(),
        api.devices.getLiveReceptions(),
      ]);
      setDevices(devs);
      setReceptions(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handlePing = (id: number) => {
    setPingSuccess(id);
    setTimeout(() => {
      setPingSuccess(null);
    }, 3000);
  };

  const handleCreateDevice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created = await api.devices.create(newDevice);
      setDevices((prev) => [...prev, created]);
      setIsModalOpen(false);
      setNewDevice({
        name: "",
        sn: "",
        location: "",
        ip_address: "192.168.1.",
        port: 4370,
        is_active: true,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Fingerprint className="w-7 h-7 text-[#5B21B6]" />
            <span>أجهزة البصمة وسجلات الاستقبال اللحظية</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            إدارة أجهزة الدوام البيومترية، مراقبة الاتصال (Online/Offline)، وسحب حركات البصمة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-[#5B21B6] hover:bg-purple-50 transition-colors"
            title="تحديث الأجهزة"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-sm shadow-md hover:opacity-95 transition-all hover:scale-105 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة جهاز بصمة جديد</span>
          </button>
        </div>
      </div>

      {/* Device Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.id}
            className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:border-purple-200 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold ${
                      device.is_online
                        ? "bg-purple-100 text-[#5B21B6]"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    <Fingerprint className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">{device.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">
                      SN: {device.sn || "—"}
                    </p>
                  </div>
                </div>
                <DeviceStatusBadge isOnline={device.is_online} />
              </div>

              {/* Details */}
              <div className="py-4 space-y-2.5 text-xs text-slate-600">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 font-mono">
                  <span className="text-slate-400 font-sans">عنوان IP والمنفذ:</span>
                  <span className="font-bold text-slate-700">
                    {device.ip_address}:{device.port}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>الموقع:</span>
                  </span>
                  <span className="font-medium text-slate-700">{device.location}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>ساعة الجهاز:</span>
                  </span>
                  <span className="font-mono font-medium text-slate-700">
                    {device.device_last_time || "—"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Radio className="w-3.5 h-3.5" />
                    <span>آخر اتصال (Ping):</span>
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {device.is_online ? "منذ ثوانٍ قليلة" : "منذ أكثر من 15 دقيقة"}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
              <button
                onClick={() => handlePing(device.id)}
                className="flex-1 py-2 px-3 rounded-xl border border-slate-200 hover:border-[#5B21B6] hover:bg-purple-50 text-[#5B21B6] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                {pingSuccess === device.id ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700 font-bold">تم الاتصال بنجاح</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5" />
                    <span>اختبار الاتصال (Ping)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Live Data Reception Log Table (DataResptions) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-[#5B21B6] flex items-center justify-center">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">
                سجل استقبال البيانات اللحظية (Data Reception)
              </h3>
              <p className="text-xs text-slate-400">
                كافة حركات البصمات الواردة لحظة بلحظة مع رقم المستخدم وتوقيت البصمة
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-medium">
                <th className="pb-3 pr-2">رقم البصمة (User ID)</th>
                <th className="pb-3">اسم الموظف</th>
                <th className="pb-3">جهاز البصمة</th>
                <th className="pb-3">الوقت والتاريخ</th>
                <th className="pb-3">حالة الحركة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {receptions.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/70">
                  <td className="py-3.5 pr-2 font-mono font-bold text-[#4C1D95]">
                    {rec.user_id}
                  </td>
                  <td className="py-3.5 font-bold text-slate-800">
                    {rec.user_name || `المستخدم ${rec.user_id}`}
                  </td>
                  <td className="py-3.5 text-slate-600">{rec.device_name}</td>
                  <td className="py-3.5 font-mono text-slate-500">{rec.timestamp}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {rec.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Device Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="إضافة جهاز بصمة جديد"
        subtitle="تسجيل جهاز جديد في الشبكة الداخلية وربطه بالإدارة"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDevice} className="space-y-4 text-right">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              اسم الجهاز *
            </label>
            <input
              type="text"
              required
              value={newDevice.name}
              onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
              placeholder="مثال: جهاز بصمة الإدارة - البوابة الجنوبية"
              className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                عنوان IP *
              </label>
              <input
                type="text"
                required
                value={newDevice.ip_address}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, ip_address: e.target.value })
                }
                placeholder="192.168.1.205"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                المنفذ (Port) *
              </label>
              <input
                type="number"
                required
                value={newDevice.port}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, port: Number(e.target.value) })
                }
                placeholder="4370"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                الرقم التسلسلي (SN)
              </label>
              <input
                type="text"
                value={newDevice.sn}
                onChange={(e) => setNewDevice({ ...newDevice, sn: e.target.value })}
                placeholder="ZK-BIO-99120"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                مكان العمل / الموقع
              </label>
              <input
                type="text"
                value={newDevice.location}
                onChange={(e) =>
                  setNewDevice({ ...newDevice, location: e.target.value })
                }
                placeholder="المبنى الرئيسي - بوابة 2"
                className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-xl focus:outline-none focus:border-[#5B21B6]"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-semibold text-xs transition-colors"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-l from-[#4C1D95] to-[#5B21B6] text-white font-bold text-xs hover:opacity-95 shadow-md transition-all"
            >
              إضافة الجهاز
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
