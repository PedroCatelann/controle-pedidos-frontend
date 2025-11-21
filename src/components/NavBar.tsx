"use client";

import {
  Button,
  MegaMenu,
  MegaMenuDropdown,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export const NavBarComponent: React.FC = () => {
  return (
    <MegaMenu>
      <NavbarBrand href="/">
        <img alt="" src="/favicon.svg" className="mr-3 h-6 sm:h-9" />
        <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
          Introdução
        </span>
      </NavbarBrand>

      <div className="flex flex-row gap-8">
        <NavbarBrand href="/pedidos">Pedidos</NavbarBrand>
        <NavbarBrand href="/funcionario">Funcionários</NavbarBrand>
      </div>

      <NavbarToggle />
      <NavbarCollapse>
        <NavbarLink href="#">Home</NavbarLink>

        <NavbarLink href="#">Team</NavbarLink>
      </NavbarCollapse>
    </MegaMenu>
  );
};
