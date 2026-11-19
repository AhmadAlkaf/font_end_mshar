// ==========================================
// مسار - طبقة الاتصال بـ Django REST API
// Masar Django API Client
// ==========================================

import {
  Employee,
  OrganizationalStructure,
  JobTitle,
  EducationalLevel,
  DeviceFingerPrint,
  Shift,
  Attendance,
  DataReception,
  LeaveType,
  LeaveRequest,
  LeaveBalance,
  LeaveDay,
  LawFingerPrinter,
  StatusRequest,
} from "@/types/hr";

import {
  mockEmployees,
  mockOrgStructure,
  mockJobTitles,
  mockEducationalLevels,
  mockDevices,
  mockShifts,
  mockAttendanceRecords,
  mockReceptions,
  mockLeaveTypes,
  mockLeaveRequests,
  mockLeaveBalances,
  mockHolidays,
  mockLawFingerPrint,
} from "./mockData";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000/api";
const ENABLE_MOCK_FALLBACK =
  process.env.NEXT_PUBLIC_ENABLE_MOCK_FALLBACK !== "false";

// Helper for fetching from Django with fallback
async function fetchWithFallback<T>(
  endpoint: string,
  options?: RequestInit,
  fallbackData?: T
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("masar_token") : null;
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options?.headers as Record<string, string>),
    };
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(url, {
      ...options,
      headers,
    });

    if (!res.ok) {
      throw new Error(`API error: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data as T;
  } catch (error) {
    if (ENABLE_MOCK_FALLBACK && fallbackData !== undefined) {
      console.warn(`[Masar API] Falling back to mock data for: ${endpoint}`);
      return fallbackData;
    }
    throw error;
  }
}

export const api = {
  // ----------------------------------------
  // الموظفون (Employees)
  // ----------------------------------------
  employees: {
    getAll: async (): Promise<Employee[]> => {
      return fetchWithFallback<Employee[]>("/employees/", {}, mockEmployees);
    },
    getById: async (id: number): Promise<Employee | null> => {
      const fallback = mockEmployees.find((e) => e.id === id) || null;
      return fetchWithFallback<Employee | null>(`/employees/${id}/`, {}, fallback);
    },
    create: async (payload: Partial<Employee>): Promise<Employee> => {
      const newEmp: Employee = {
        id: Date.now(),
        name: payload.name || "موظف جديد",
        address: payload.address || "",
        phone: payload.phone || "",
        number_employee: payload.number_employee || `EMP-${Date.now().toString().slice(-4)}`,
        educational_level: payload.educational_level || 1,
        type_of_employee: payload.type_of_employee || 1,
        marital_status: payload.marital_status || 1,
        basic_salary: payload.basic_salary || 0,
        secondary_salary: payload.secondary_salary || 0,
        active: payload.active ?? true,
        department_name: payload.department_name || "الموارد البشرية",
        job_title_name: payload.job_title_name || "موظف",
        ...payload,
      };
      return fetchWithFallback<Employee>(
        "/employees/",
        { method: "POST", body: JSON.stringify(payload) },
        newEmp
      );
    },
    update: async (id: number, payload: Partial<Employee>): Promise<Employee> => {
      const existing = mockEmployees.find((e) => e.id === id) || mockEmployees[0];
      const updated = { ...existing, ...payload };
      return fetchWithFallback<Employee>(
        `/employees/${id}/`,
        { method: "PUT", body: JSON.stringify(payload) },
        updated
      );
    },
  },

  // ----------------------------------------
  // الهيكل الإداري والمسميات (Organization)
  // ----------------------------------------
  organization: {
    getTree: async (): Promise<OrganizationalStructure[]> => {
      return fetchWithFallback<OrganizationalStructure[]>(
        "/organizational-structure/",
        {},
        mockOrgStructure
      );
    },
    getJobTitles: async (): Promise<JobTitle[]> => {
      return fetchWithFallback<JobTitle[]>("/job-titles/", {}, mockJobTitles);
    },
    getEducationalLevels: async (): Promise<EducationalLevel[]> => {
      return fetchWithFallback<EducationalLevel[]>(
        "/educational-levels/",
        {},
        mockEducationalLevels
      );
    },
  },

  // ----------------------------------------
  // أجهزة البصمة (Biometric Devices & Receptions)
  // ----------------------------------------
  devices: {
    getAll: async (): Promise<DeviceFingerPrint[]> => {
      return fetchWithFallback<DeviceFingerPrint[]>("/devices/", {}, mockDevices);
    },
    getById: async (id: number): Promise<DeviceFingerPrint | null> => {
      const fallback = mockDevices.find((d) => d.id === id) || null;
      return fetchWithFallback<DeviceFingerPrint | null>(`/devices/${id}/`, {}, fallback);
    },
    create: async (payload: Partial<DeviceFingerPrint>): Promise<DeviceFingerPrint> => {
      const newDevice: DeviceFingerPrint = {
        id: Date.now(),
        name: payload.name || "جهاز بصمة جديد",
        location: payload.location || "المقر الرئيسي",
        ip_address: payload.ip_address || "192.168.1.100",
        port: payload.port || 4370,
        is_active: payload.is_active ?? true,
        last_seen: new Date().toISOString(),
        is_online: true,
        ...payload,
      };
      return fetchWithFallback<DeviceFingerPrint>(
        "/devices/",
        { method: "POST", body: JSON.stringify(payload) },
        newDevice
      );
    },
    getLiveReceptions: async (): Promise<DataReception[]> => {
      return fetchWithFallback<DataReception[]>("/receptions/", {}, mockReceptions);
    },
  },

  // ----------------------------------------
  // الحضور وفترات الدوام (Attendance & Shifts)
  // ----------------------------------------
  attendance: {
    getRecords: async (date?: string): Promise<Attendance[]> => {
      const fallback = date
        ? mockAttendanceRecords.filter((a) => a.date === date)
        : mockAttendanceRecords;
      return fetchWithFallback<Attendance[]>(
        date ? `/attendance/?date=${date}` : "/attendance/",
        {},
        fallback
      );
    },
    getShifts: async (): Promise<Shift[]> => {
      return fetchWithFallback<Shift[]>("/shifts/", {}, mockShifts);
    },
    getLaws: async (): Promise<LawFingerPrinter> => {
      return fetchWithFallback<LawFingerPrinter>(
        "/law-finger-printer/",
        {},
        mockLawFingerPrint
      );
    },
  },

  // ----------------------------------------
  // الإجازات (Leaves Management)
  // ----------------------------------------
  leaves: {
    getTypes: async (): Promise<LeaveType[]> => {
      return fetchWithFallback<LeaveType[]>("/leave-types/", {}, mockLeaveTypes);
    },
    getRequests: async (): Promise<LeaveRequest[]> => {
      return fetchWithFallback<LeaveRequest[]>(
        "/leave-requests/",
        {},
        mockLeaveRequests
      );
    },
    createRequest: async (payload: Partial<LeaveRequest>): Promise<LeaveRequest> => {
      const newReq: LeaveRequest = {
        id: Date.now(),
        employee: payload.employee || 1,
        employee_name: payload.employee_name || "موظف مسار",
        leave_type: payload.leave_type || 1,
        leave_type_name: payload.leave_type_name || "إجازة سنوية اعتيادية",
        start_day: payload.start_day || new Date().toISOString().split("T")[0],
        end_day: payload.end_day || new Date().toISOString().split("T")[0],
        status: StatusRequest.Pending,
        days_count: payload.days_count || 1,
        ...payload,
      };
      return fetchWithFallback<LeaveRequest>(
        "/leave-requests/",
        { method: "POST", body: JSON.stringify(payload) },
        newReq
      );
    },
    updateStatus: async (
      id: number,
      status: StatusRequest
    ): Promise<{ success: boolean; id: number; status: StatusRequest }> => {
      return fetchWithFallback(
        `/leave-requests/${id}/status/`,
        { method: "PATCH", body: JSON.stringify({ status }) },
        { success: true, id, status }
      );
    },
    getBalances: async (): Promise<LeaveBalance[]> => {
      return fetchWithFallback<LeaveBalance[]>(
        "/leave-balances/",
        {},
        mockLeaveBalances
      );
    },
    getHolidays: async (): Promise<LeaveDay[]> => {
      return fetchWithFallback<LeaveDay[]>("/leave-days/", {}, mockHolidays);
    },
  },

  // ----------------------------------------
  // حالة الاتصال والتشخيص
  // ----------------------------------------
  healthCheck: async (): Promise<{ isConnected: boolean; message: string }> => {
    try {
      const res = await fetch(`${API_BASE_URL}/health/`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      return {
        isConnected: res.ok,
        message: res.ok ? "الاتصال بـ Django API سليم" : `خطأ ${res.status}`,
      };
    } catch {
      return {
        isConnected: false,
        message: "تعذر الاتصال بسيرفر Django - يتم استخدام البيانات التجريبية النشطة",
      };
    }
  },
};
