import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MapPageSimple from "./pages/MapPageSimple";
import UploadPage from "./pages/UploadPage";
import AlertsPage from "./pages/AlertsPage";
import ReportsPage from "./pages/ReportsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Protected Dashboard Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/map" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <MapPageSimple />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/upload" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <UploadPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/alerts" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <AlertsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/reports" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <ReportsPage />
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Admin Routes - Placeholder for now */}
            <Route path="/dashboard/users" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage government user accounts and permissions.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/security" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">Security Settings</h1>
                    <p className="text-muted-foreground">Configure system security and access controls.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            <Route path="/dashboard/settings" element={
              <ProtectedRoute>
                <DashboardLayout>
                  <div className="p-6">
                    <h1 className="text-2xl font-bold">System Settings</h1>
                    <p className="text-muted-foreground">Configure system preferences and parameters.</p>
                  </div>
                </DashboardLayout>
              </ProtectedRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
