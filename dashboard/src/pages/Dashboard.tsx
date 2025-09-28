import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  School, 
  GraduationCap, 
  Upload, 
  Bell, 
  TrendingUp, 
  Users, 
  AlertTriangle,
  CheckCircle 
} from 'lucide-react';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Schools',
      value: '1,247',
      change: '+12%',
      trend: 'up',
      icon: School,
      color: 'text-blue-600'
    },
    {
      title: 'Total Colleges',
      value: '389',
      change: '+5%',
      trend: 'up',
      icon: GraduationCap,
      color: 'text-green-600'
    },
    {
      title: 'Modules Uploaded',
      value: '156',
      change: '+23%',
      trend: 'up',
      icon: Upload,
      color: 'text-purple-600'
    },
    {
      title: 'Alerts Sent',
      value: '892',
      change: '+8%',
      trend: 'up',
      icon: Bell,
      color: 'text-orange-600'
    }
  ];

  const recentActivities = [
    {
      type: 'upload',
      title: 'New disaster preparedness module uploaded',
      description: 'Earthquake safety guidelines for schools',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'alert',
      title: 'Emergency alert sent to Chandigarh district',
      description: 'Heavy rainfall warning for next 48 hours',
      time: '4 hours ago',
      status: 'completed'
    },
    {
      type: 'drill',
      title: 'Fire drill completed at Punjab University',
      description: 'Evacuation time: 4 minutes 32 seconds',
      time: '1 day ago',
      status: 'completed'
    },
    {
      type: 'training',
      title: 'New school registered in Ludhiana',
      description: 'Government Senior Secondary School',
      time: '2 days ago',
      status: 'pending'
    }
  ];

  const readinessStats = {
    high: 65,
    medium: 25,
    low: 10
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">
          Welcome to Punjab Disaster Preparedness Dashboard
        </h1>
        <p className="text-blue-100">
          Monitor and manage disaster preparedness across educational institutions in Punjab
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                <span className="text-green-600">{stat.change}</span> from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Readiness Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Institution Readiness Overview
            </CardTitle>
            <CardDescription>
              Disaster preparedness status across all institutions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium">High Readiness</span>
                </div>
                <Badge variant="secondary">{readinessStats.high}%</Badge>
              </div>
              <Progress value={readinessStats.high} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm font-medium">Medium Readiness</span>
                </div>
                <Badge variant="secondary">{readinessStats.medium}%</Badge>
              </div>
              <Progress value={readinessStats.medium} className="h-2" />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm font-medium">Low Readiness</span>
                </div>
                <Badge variant="destructive">{readinessStats.low}%</Badge>
              </div>
              <Progress value={readinessStats.low} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Recent Activities
            </CardTitle>
            <CardDescription>
              Latest updates and activities in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-1">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium">{activity.title}</h4>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Frequently used actions for efficient management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Upload className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Upload New Module</h3>
              <p className="text-sm text-muted-foreground">Add educational content for institutions</p>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Bell className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">Send Alert</h3>
              <p className="text-sm text-muted-foreground">Broadcast emergency notifications</p>
            </div>
            
            <div className="p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
              <Users className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium">View Reports</h3>
              <p className="text-sm text-muted-foreground">Access analytics and insights</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;