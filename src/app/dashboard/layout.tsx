"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { NavBarComponent } from "@/components/NavBar";
import SidebarHamburger from "@/components/SideBarHamburguer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <NavBarComponent />
      <div className="flex-1 relative overflow-hidden">
        <SidebarHamburger>{children}</SidebarHamburger>
      </div>
    </div>
    //<ProtectedRoute>

    //</ProtectedRoute>
  );
}
