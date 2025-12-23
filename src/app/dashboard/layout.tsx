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
    <>
      <NavBarComponent />
      <SidebarHamburger>{children}</SidebarHamburger>
    </>
    //<ProtectedRoute>

    //</ProtectedRoute>
  );
}
