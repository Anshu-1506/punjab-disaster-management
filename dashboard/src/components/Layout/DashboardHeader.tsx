import React from 'react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { LogOut, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import cmPunjab from '@/assets/cm-punjab-bhagwant-mann.jpg';
import digitalIndiaLogo from '@/assets/digital-india-logo.png';
import swachhBharatLogo from '@/assets/swachh-bharat-logo.png';
import punjabGovtLogo from '@/assets/punjab-govt-logo.png';

export const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been securely logged out.",
    });
  };

  return (
    <header className="border-b bg-white">
      {/* Top Government Bar */}
      <div className="bg-primary text-white px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src={digitalIndiaLogo} alt="Digital India" className="h-6 w-6 object-contain" />
            <span className="text-sm font-medium">Digital India Initiative</span>
            <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-6 w-6 object-contain" />
            <span className="text-sm font-medium">Swachh Bharat Mission</span>
          </div>
          <div className="text-sm">
            Government of Punjab | पंजाब सरकार
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <img src={punjabGovtLogo} alt="Punjab Government" className="h-10 w-10 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-primary">
                  Punjab Disaster Preparedness
                </h1>
                <p className="text-sm text-muted-foreground">
                  Management Dashboard
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* CM Photo */}
            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-muted rounded-lg">
              <img 
                src={cmPunjab} 
                alt="Chief Minister Punjab" 
                className="h-10 w-10 rounded-full object-cover"
              />
              <div className="text-sm">
                <p className="font-medium">Hon'ble Chief Minister</p>
                <p className="text-muted-foreground">Punjab</p>
              </div>
            </div>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary text-white">
                      {user?.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
};