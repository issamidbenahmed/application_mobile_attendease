
"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScanLine, List, LogOut, User } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
   const router = useRouter();

  const handleLogout = () => {
    // In a real app, clear session/token here
    router.push('/signin');
  };


  const menuItems = [
    { href: "/app/scan", label: "Scan QR", icon: ScanLine },
    { href: "/app/list", label: "Attendance List", icon: List },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="flex items-center justify-between p-4">
           <Link href="/app/scan" className="flex items-center gap-2">
            {/* Placeholder for Logo - replace with actual logo if available */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-sidebar-primary">
                <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
            </svg>

            <span className="text-lg font-semibold text-sidebar-foreground">AttendEase</span>
          </Link>
          <SidebarTrigger className="md:hidden" /> {/* Only show trigger on mobile */}
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="justify-start"
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <Separator className="my-2 bg-sidebar-border" />
        <SidebarFooter className="p-4 space-y-2">
           <div className="flex items-center gap-3">
             <Avatar className="h-9 w-9">
                {/* Replace with actual user image if available */}
                <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
             </Avatar>
             <div className="flex flex-col text-sm">
                 <span className="font-medium text-sidebar-foreground">Admin User</span>
                 <span className="text-xs text-sidebar-foreground/70">admin@attendease.com</span>
             </div>
           </div>
          <Button variant="ghost" className="w-full justify-start gap-2 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" onClick={handleLogout}>
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {/* Main content area */}
        <div className="p-4 md:p-6">
         {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
