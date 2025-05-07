
import React from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger } from "@/components/ui/sidebar";

const Navbar: React.FC = () => {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-6">
        <SidebarTrigger className="lg:hidden mr-2" />
        <h1 className="text-lg font-semibold">CrateTracker</h1>
        
        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Help</DropdownMenuItem>
              <DropdownMenuItem>About</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              A
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium">Admin</p>
              <p className="text-xs text-muted-foreground">admin@cratetracker.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
