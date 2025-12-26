"use client";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  MegaMenu,
  MegaMenuDropdown,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";
import { FaRegMoon, FaRegSun } from "react-icons/fa";
import { MdOutlineWbSunny } from "react-icons/md";
import { useTheme } from "./ThemeProvider";

export const NavBarComponent: React.FC = () => {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <MegaMenu className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-colors">
      <div></div>
      <div className="flex flex-row gap-4">
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              rounded
            />
          }
        >
          <DropdownItem onClick={handleLogout}>Sair</DropdownItem>
        </Dropdown>
      </div>
    </MegaMenu>
  );
};
