import type { Metadata } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";

export const metadata: Metadata = {
  title: "مسار | نظام إدارة الموارد البشرية والدوام وبوابة الموظف",
  description:
    "منظومة مسار المتكاملة لإدارة الموظفين والدوام وأجهزة البصمة وتطبيق الجوال للموظف المتوافق مع Django API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <body className="min-h-screen bg-slate-50 text-slate-800 antialiased font-sans selection:bg-purple-200 selection:text-[#4C1D95]">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
