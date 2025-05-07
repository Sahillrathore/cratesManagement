
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarTrigger,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { 
  LayoutDashboard, 
  Users, 
  DollarSign, 
  Package, 
  FileText 
} from "lucide-react";

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Vendors", path: "/vendors" },
    { icon: DollarSign, label: "Sales", path: "/sales" },
    { icon: Package, label: "Crates", path: "/crates" },
    { icon: FileText, label: "Reports", path: "/reports" },
  ];

  return (
    <SidebarComponent>
      <SidebarHeader className="flex items-center px-4 py-2">
        <div className="flex items-center space-x-2">
          <Package className="h-6 w-6 text-primary-foreground" />
          <span className="text-xl font-bold text-primary-foreground">CrateTracker</span>
        </div>
        <div className="ml-auto">
          <SidebarTrigger />
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.path}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => isActive ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </SidebarComponent>
  );
};

export default Sidebar;
