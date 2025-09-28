import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Map,
  Upload,
  Bell,
  BarChart3,
  Shield,
  Users,
  Settings,
} from 'lucide-react';

const navigationItems = [
  {
    title: 'Overview',
    url: '/dashboard',
    icon: LayoutDashboard,
    description: 'Dashboard overview and statistics'
  },
  {
    title: 'Interactive Map',
    url: '/dashboard/map',
    icon: Map,
    description: 'View schools and colleges on map'
  },
  {
    title: 'Upload Modules',
    url: '/dashboard/upload',
    icon: Upload,
    description: 'Upload educational content'
  },
  {
    title: 'Send Alerts',
    url: '/dashboard/alerts',
    icon: Bell,
    description: 'Emergency alert management'
  },
  {
    title: 'Reports',
    url: '/dashboard/reports',
    icon: BarChart3,
    description: 'Analytics and reports'
  },
];

const adminItems = [
  {
    title: 'User Management',
    url: '/dashboard/users',
    icon: Users,
    description: 'Manage government users'
  },
  {
    title: 'Security',
    url: '/dashboard/security',
    icon: Shield,
    description: 'Security settings'
  },
  {
    title: 'System Settings',
    url: '/dashboard/settings',
    icon: Settings,
    description: 'System configuration'
  },
];

export const DashboardSidebar = () => {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return currentPath === '/dashboard';
    }
    return currentPath.startsWith(path);
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-sidebar">
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/dashboard'}
                    >
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="text-sm">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground">
            Administration
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url}>
                      <item.icon className="h-4 w-4" />
                      {!isCollapsed && (
                        <div className="flex flex-col">
                          <span className="text-sm">{item.title}</span>
                          <span className="text-xs opacity-70">{item.description}</span>
                        </div>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};