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
  const { theme, toggleTheme } = useTheme();

  return (
    <MegaMenu className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white transition-colors">
      <div></div>
      <div className="flex flex-row gap-4">
        <button
          type="button"
          onClick={toggleTheme}
          style={{
            borderRadius: "20px",
            border: "1px solid",
            borderColor: "black",
            padding: "12px",
          }}
        >
          {theme === "dark" ? <FaRegMoon /> : <MdOutlineWbSunny />}
        </button>
        <Dropdown
          arrowIcon={false}
          inline
          label={
            <Avatar
              alt="User settings"
              img="https://flowbite.com/docs/images/people/profile-picture-5.jpg"
              rounded
            />
          }
        >
          <DropdownHeader>
            <span className="block text-sm">Bonnie Green</span>
            <span className="block truncate text-sm font-medium">
              name@flowbite.com
            </span>
          </DropdownHeader>
          <DropdownItem>Dashboard</DropdownItem>
          <DropdownItem>Settings</DropdownItem>
          <DropdownItem>Earnings</DropdownItem>
          <DropdownDivider />
          <DropdownItem>Sign out</DropdownItem>
        </Dropdown>
      </div>
    </MegaMenu>
  );
};
