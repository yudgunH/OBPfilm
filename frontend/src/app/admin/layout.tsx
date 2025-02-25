// src/app/admin/layout.tsx
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/authOptions"; // Đảm bảo bạn đã cấu hình authOptions cho next-auth
import { SidebarProvider } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/admin/layout";
import type React from "react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // Nếu chưa đăng nhập hoặc không có quyền admin, chuyển hướng về trang chủ hoặc trang login
  if (!session || session.user?.role !== "admin") {
    redirect("/");
  }

  return (
    <SidebarProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SidebarProvider>
  );
}
