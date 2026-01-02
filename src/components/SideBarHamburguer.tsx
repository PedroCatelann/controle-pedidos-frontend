"use client";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { useState } from "react";
import { TbPackageExport } from "react-icons/tb";
import { MdDeliveryDining, MdBarChart } from "react-icons/md";
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
    <div className="flex h-full w-full">
      {/* SIDEBAR */}
      <Sidebar
        aria-label="Sidebar de navegação"
        className={`
          flex-shrink-0 h-full flex flex-col
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
          !rounded-none [&_*]:!rounded-none
        `}
        style={{ borderRadius: 0 }}
      >
        {/* Botão hambúrguer */}
        <div className="flex justify-end p-2 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          >
            <IoMenuSharp size={22} />
          </button>
        </div>

        {/* Items */}
        <SidebarItems className="flex-1 overflow-y-auto min-h-0">
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
              <SidebarItem href="/dashboard/metricas" icon={MdBarChart}>
                {!collapsed && "Métricas"}
              </SidebarItem>
            )}
            {roles.includes("ROLE_ADMIN") && (
              <SidebarItem href="/admin/funcionario" icon={MdDeliveryDining}>
                {!collapsed && "Funcionários"}
              </SidebarItem>
            )}
          </SidebarItemGroup>
        </SidebarItems>
      </Sidebar>

      {/* CONTEÚDO PRINCIPAL */}
      <main
        className={`
          flex-1 overflow-y-auto min-h-0
          transition-all duration-300
          p-4
        `}
      >
        {children}
      </main>
    </div>
  );
}
