
import React from 'react';
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider } from "@/components/ui/sidebar";
import Sidebar from './Sidebar';
import Navbar from './Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
          <footer className="border-t py-4 px-6 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} CrateTracker - Apple Crate Management System</p>
          </footer>
        </div>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

export default MainLayout;
