import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Shield, Loader2 } from 'lucide-react';
import digitalIndiaLogo from '@/assets/digital-india-logo.png';
import swachhBharatLogo from '@/assets/swachh-bharat-logo.png';
import punjabGovtLogo from '@/assets/punjab-govt-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const success = await login(email, password);
    if (success) {
      toast({
        title: "Login Successful",
        description: "Welcome to Punjab Disaster Preparedness Dashboard",
      });
    } else {
      setError('Invalid credentials. Please contact your system administrator.');
      toast({
        title: "Login Failed",
        description: "Invalid email or password",
        variant: "destructive",
      });
    }
  };

  const fillDemoCredentials = (userIndex: number) => {
    const demoCredentials = [
      { email: 'rajesh.kumar@gov.punjab.in', password: 'Punjab@2024' },
      { email: 'priya.singh@edu.punjab.gov.in', password: 'Edu@Punjab2024' },
      { email: 'hardeep.singh@admin.punjab.gov.in', password: 'Admin@Punjab24' }
    ];
    
    const creds = demoCredentials[userIndex];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Government Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={digitalIndiaLogo} alt="Digital India" className="h-12 w-12 object-contain" />
            <img src={punjabGovtLogo} alt="Punjab Government" className="h-16 w-16 object-contain" />
            <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-12 w-12 object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Punjab Government
          </h1>
          <p className="text-blue-100 text-sm">
            Disaster Preparedness Management System
          </p>
        </div>

        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-xl">Government Portal Login</CardTitle>
            <CardDescription>
              Authorized access only for government employees
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Government Email ID</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.name@gov.punjab.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-3">Demo Accounts (for testing):</p>
              <div className="grid gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials(0)}
                  className="text-xs justify-start"
                >
                  Dr. Rajesh Kumar - Disaster Management Officer
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials(1)}
                  className="text-xs justify-start"
                >
                  Ms. Priya Singh - Education Coordinator
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fillDemoCredentials(2)}
                  className="text-xs justify-start"
                >
                  Mr. Hardeep Singh - System Administrator
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-blue-100 text-xs">
            © 2024 Government of Punjab. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;