import {
  Navbar,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Avatar
} from "@heroui/react";
import { useAuth } from "../context/AuthContext";

export function AppNavbar() {
  const { currentUser, logout } = useAuth();

  return (
    <Navbar isBordered maxWidth="xl">
      <NavbarContent className="gap-4" justify="center">
        <NavbarItem>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            Food Inventory
          </h1>
        </NavbarItem>
      </NavbarContent>
      
      <NavbarContent justify="end">
        {currentUser && (
          <Dropdown>
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="secondary"
                name={currentUser.displayName || currentUser.email || "User"}
                size="sm"
                src={currentUser.photoURL || undefined}
              />
            </DropdownTrigger>
            <DropdownMenu aria-label="Profile Actions" variant="flat">
              <DropdownItem key="profile" className="h-14 gap-2" textValue={`Signed in as ${currentUser.email}`}>
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{currentUser.email}</p>
              </DropdownItem>
              <DropdownItem key="logout" color="danger" onPress={() => logout()}>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        )}
      </NavbarContent>
    </Navbar>
  );
}
