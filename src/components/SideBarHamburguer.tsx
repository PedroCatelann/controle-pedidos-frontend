"use client";

import {
  Sidebar,
  SidebarCollapse,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useState } from "react";
import { TbPackageExport } from "react-icons/tb";
import { MdDeliveryDining } from "react-icons/md";
import { IoMenuSharp } from "react-icons/io5";
import { LuPackageX } from "react-icons/lu";
import { useAuth } from "@/context/AuthContext";

export default function SidebarHamburger({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const { roles } = useAuth();

  return (
    <div className="flex">
      {/* SIDEBAR */}
      <Sidebar
        aria-label="Sidebar"
        className={`h-screen transition-all duration-300
          ${collapsed ? "w-16" : "w-64"} !rounded-none [&_*]:!rounded-none
        `}
        style={{ borderRadius: 0 }}
      >
        {/* Botão hambúrguer */}
        <div className="flex justify-end p-2">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <IoMenuSharp size={22} />
          </button>
        </div>

        {/* Items */}
        <SidebarItems>
          <SidebarItemGroup>
            <SidebarItem href="/dashboard/pedidos" icon={LuPackageX}>
              {!collapsed && "Pedidos"}
            </SidebarItem>

            <SidebarItem
              href="/dashboard/pedidos-entregues"
              icon={TbPackageExport}
            >
              {!collapsed && "Pedidos entregues"}
            </SidebarItem>
            {roles.includes("ROLE_ADMIN") && (
              <SidebarItem href="/admin/funcionario" icon={MdDeliveryDining}>
                {!collapsed && "Funcionários"}
              </SidebarItem>
            )}
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
