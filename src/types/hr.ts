// ==========================================
// مسار - نظام إدارة الموارد البشرية والدوام
// نماذج البيانات المشتقة من نماذج Django API
// ==========================================

export enum AttendanceStatus {
  PRESENT = 1,
  LATE = 2,
  EARLY_LEAVE = 3,
  ABSENT = 4,
  MISSING_ENTRY = 5,
  MISSING_EXIT = 6,
  VACATION = 7,
  OVERTIME = 8,
}

export const AttendanceStatusLabels: Record<AttendanceStatus, string> = {
  [AttendanceStatus.PRESENT]: "حاضر",
  [AttendanceStatus.LATE]: "متأخر",
  [AttendanceStatus.EARLY_LEAVE]: "خرج مبكر",
  [AttendanceStatus.ABSENT]: "غائب",
  [AttendanceStatus.MISSING_ENTRY]: "بدون دخول",
  [AttendanceStatus.MISSING_EXIT]: "بدون خروج",
  [AttendanceStatus.VACATION]: "إجازة",
  [AttendanceStatus.OVERTIME]: "عمل إضافي",
};

export const AttendanceStatusColors: Record<AttendanceStatus, { bg: string; text: string; border: string }> = {
  [AttendanceStatus.PRESENT]: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  [AttendanceStatus.LATE]: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  [AttendanceStatus.EARLY_LEAVE]: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  [AttendanceStatus.ABSENT]: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
  [AttendanceStatus.MISSING_ENTRY]: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  [AttendanceStatus.MISSING_EXIT]: { bg: "bg-indigo-50", text: "text-indigo-700", border: "border-indigo-200" },
  [AttendanceStatus.VACATION]: { bg: "bg-sky-50", text: "text-sky-700", border: "border-sky-200" },
  [AttendanceStatus.OVERTIME]: { bg: "bg-teal-50", text: "text-teal-700", border: "border-teal-200" },
};

export enum EmploymentTypeChoice {
  EMPLOYEE = "1",
  CONTRACTOR = "2",
  DAILY = "3",
}

export const EmploymentTypeLabels: Record<EmploymentTypeChoice, string> = {
  [EmploymentTypeChoice.EMPLOYEE]: "موظف",
  [EmploymentTypeChoice.CONTRACTOR]: "متعاقد",
  [EmploymentTypeChoice.DAILY]: "يومي",
};

export enum MaritalStatusChoice {
  MARRIED = "1",
  SINGLE = "2",
}

export const MaritalStatusLabels: Record<MaritalStatusChoice, string> = {
  [MaritalStatusChoice.MARRIED]: "متزوج",
  [MaritalStatusChoice.SINGLE]: "عازب",
};

export enum TypeDate {
  HIJRI = 1,
  GREGORIAN = 2,
}

export const TypeDateLabels: Record<TypeDate, string> = {
  [TypeDate.HIJRI]: "الهجري",
  [TypeDate.GREGORIAN]: "الميلادي",
};

export enum StatusRequest {
  Pending = 1,
  Approved = 2,
  Rejected = 3,
}

export const StatusRequestLabels: Record<StatusRequest, string> = {
  [StatusRequest.Pending]: "في الانتظار",
  [StatusRequest.Approved]: "مقبول",
  [StatusRequest.Rejected]: "مرفوضة",
};

export const StatusRequestColors: Record<StatusRequest, { bg: string; text: string; border: string }> = {
  [StatusRequest.Pending]: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  [StatusRequest.Approved]: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  [StatusRequest.Rejected]: { bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-200" },
};

export type DayChoice = "sat" | "sun" | "mon" | "tue" | "wed" | "thu" | "fri";

export const DayLabels: Record<DayChoice, string> = {
  sat: "السبت",
  sun: "الأحد",
  mon: "الإثنين",
  tue: "الثلاثاء",
  wed: "الأربعاء",
  thu: "الخميس",
  fri: "الجمعة",
};

// ==========================================
// الكيانات (Entities)
// ==========================================

export interface TypeOfEmployee {
  id: number;
  type_of_employee: EmploymentTypeChoice;
  display_name?: string;
}

export interface MaritalStatus {
  id: number;
  marital_status: MaritalStatusChoice;
  display_name?: string;
}

export interface UserSummary {
  id: number;
  username: string;
  first_name?: string;
  last_name?: string;
  email?: string;
}

export interface OrganizationalStructure {
  id: number;
  name: string;
  descriptions: string;
  parent: number | null;
  parent_name?: string | null;
  manger: (number | UserSummary)[];
  children?: OrganizationalStructure[];
  create_at?: string;
  update_at?: string;
}

export interface JobTitle {
  id: number;
  name: string;
  tesk: string;
  create_at?: string;
  update_at?: string;
}

export interface EducationalLevel {
  id: number;
  name: string;
  create_at?: string;
  update_at?: string;
}

export interface Employee {
  id: number;
  name: string;
  address: string;
  phone: string;
  number_employee?: string | null;
  educational_level: number | EducationalLevel;
  phone1?: string;
  type_of_employee: number | EmploymentTypeChoice | TypeOfEmployee;
  marital_status: number | MaritalStatusChoice | MaritalStatus;
  email?: string | null;
  basic_salary: number | string;
  secondary_salary: number | string;
  active: boolean;
  data_of_birth?: string | null;
  id_card?: string | null;
  cv?: string | null;
  note?: string;
  create_at?: string;
  update_at?: string;
  // الحقول المدمجة للعرض السريع
  educational_level_name?: string;
  type_of_employee_display?: string;
  marital_status_display?: string;
  current_job?: Job;
  department_name?: string;
  job_title_name?: string;
}

export interface Job {
  id: number;
  employee: number | Employee;
  organizational_structure: number | OrganizationalStructure;
  JobTitle: number | JobTitle;
  create_at?: string;
  update_at?: string;
  // تفاصيل إضافية
  department_name?: string;
  job_title_name?: string;
  employee_name?: string;
}

export interface DeviceFingerPrint {
  id: number;
  name: string;
  sn?: string | null;
  location: string;
  ip_address: string;
  port: number;
  is_active: boolean;
  password?: string | null;
  last_seen?: string | null;
  device_last_time?: string | null;
  organizational_structure?: number | OrganizationalStructure | null;
  department_name?: string;
  is_online?: boolean;
  create_at?: string;
  update_at?: string;
}

export interface EmployeeFingerPrint {
  id: number;
  employee: number | Employee;
  employee_name?: string;
  device_figer_print: number | DeviceFingerPrint;
  device_name?: string;
  id_users: number;
  create_at?: string;
  update_at?: string;
}

export interface DataReception {
  id: number;
  device_finger_print: number | DeviceFingerPrint;
  device_name?: string;
  user_id: number;
  user_name?: string;
  timestamp: string;
  status: string; // e.g. "دخول" أو "خروج" أو "Check-in"
  create_at?: string;
  update_at?: string;
}

export interface Day {
  id: number;
  day: DayChoice;
  display_name?: string;
}

export interface Shift {
  id: number;
  name: string;
  start_time: string; // HH:MM:SS
  end_time: string; // HH:MM:SS
  days: (number | Day)[];
  employee: (number | Employee)[];
  days_display?: string[];
  employee_count?: number;
  create_at?: string;
  update_at?: string;
}

export interface Attendance {
  id: number;
  employee: number | Employee;
  employee_name?: string;
  employee_number?: string;
  shift?: number | Shift | null;
  shift_name?: string;
  date: string; // YYYY-MM-DD
  time_in?: string | null;
  time_out?: string | null;
  is_present: boolean;
  device_in?: number | DeviceFingerPrint | null;
  device_in_name?: string;
  device_out?: number | DeviceFingerPrint | null;
  device_out_name?: string;
  is_present1?: AttendanceStatus | null;
  note?: string;
  create_at?: string;
  update_at?: string;
}

export interface LawFingerPrinter {
  id: number;
  name: string;
  shift: number | Shift;
  shift_name?: string;
  time_from_which_fingerprint_entry_is_received?: string | null; // Duration e.g. "00:30:00"
  entry_grace_period?: string | null; // e.g. "00:15:00"
  consider_absent_if_late_by?: string | null;
  early_departure_allowance?: string | null;
  last_time_to_accept_finger_print?: string | null;
  time_from_which_fingerprint_out_is_received?: string | null;
  deduct_for_missing_check_in: boolean;
  deduct_for_missing_check_out: boolean;
  create_at?: string;
  update_at?: string;
}

export interface LeaveType {
  id: number;
  name: string;
  descrptions: string;
  minimum_request: number; // الأيام التي يتم طلب الإجازة قبلها
  due: boolean; // إجازة لا تظهر في الطلبات
  create_at?: string;
  update_at?: string;
}

export interface LeaveLaw {
  id: number;
  leave_type: number | LeaveType;
  leave_type_name?: string;
  employee_type_is_given: (number | TypeOfEmployee)[];
  employee_marital_status_is_given: (number | MaritalStatus)[];
  annual: boolean;
  create_at?: string;
  update_at?: string;
}

export interface AgeLeaveLaw {
  id: number;
  leave_law: number | LeaveLaw;
  age: number; // أصغر من العمر
  start: number; // بعد كم يوم دوام
  balance: number; // رصيد الإجازة
  calculation?: string | null; // كم ساعة في اليوم دوام
  deportation: number; // نسبة الترحيل 0-100
  create_at?: string;
  update_at?: string;
}

export interface LeaveDay {
  id: number;
  leave_type: number | LeaveType;
  leave_type_name?: string;
  name: string;
  annual: boolean;
  day: number;
  month: number;
  type_date: TypeDate;
  create_at?: string;
  update_at?: string;
}

export interface LeaveBalance {
  id: number;
  employee: number | Employee;
  employee_name?: string;
  leave_type: number | LeaveType;
  leave_type_name?: string;
  balance: number | string;
  create_at?: string;
  update_at?: string;
}

export interface LeaveRequest {
  id: number;
  employee: number | Employee;
  employee_name?: string;
  department_name?: string;
  leave_type: number | LeaveType;
  leave_type_name?: string;
  start_day: string; // YYYY-MM-DD
  end_day: string; // YYYY-MM-DD
  status: StatusRequest;
  days_count?: number;
  create_at?: string;
  update_at?: string;
}
