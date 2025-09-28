import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  Users, 
  MapPin,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const ReportsPage = () => {
  // Mock data for reports
  const completionStats = {
    earthquake: 78,
    fire: 65,
    flood: 72,
    medical: 58,
    evacuation: 83
  };

  const regionStats = [
    { region: 'Chandigarh', schools: 45, colleges: 12, completion: 85, alerts: 15 },
    { region: 'Amritsar', schools: 123, colleges: 28, completion: 72, alerts: 23 },
    { region: 'Ludhiana', schools: 156, colleges: 34, completion: 68, alerts: 31 },
    { region: 'Jalandhar', schools: 98, colleges: 22, completion: 75, alerts: 18 },
    { region: 'Patiala', schools: 87, colleges: 19, completion: 79, alerts: 14 },
    { region: 'Mohali', schools: 76, colleges: 16, completion: 82, alerts: 12 }
  ];

  const monthlyAlerts = [
    { month: 'Jan', sent: 45, received: 43 },
    { month: 'Feb', sent: 52, received: 51 },
    { month: 'Mar', sent: 38, received: 36 },
    { month: 'Apr', sent: 41, received: 39 },
    { month: 'May', sent: 35, received: 34 },
    { month: 'Jun', sent: 48, received: 47 }
  ];

  const getCompletionColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Comprehensive analysis and insights into disaster preparedness across Punjab
          </p>
        </div>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Export Reports
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Institutions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,636</div>
            <p className="text-xs text-muted-foreground">
              1,247 schools • 389 colleges
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">71.2%</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+5.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alerts Sent</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">259</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.3%</div>
            <p className="text-xs text-muted-foreground">
              Alert acknowledgment rate
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module Completion by Category */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Module Completion by Category
            </CardTitle>
            <CardDescription>
              Training module completion rates across different disaster types
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(completionStats).map(([category, percentage]) => (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium capitalize">
                    {category} Safety
                  </span>
                  <span className={`text-sm font-medium ${getCompletionColor(percentage)}`}>
                    {percentage}%
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Regional Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Regional Performance
            </CardTitle>
            <CardDescription>
              District-wise statistics and performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionStats.map((region) => (
                <div key={region.region} className="p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{region.region}</h4>
                    <Badge variant={region.completion >= 80 ? 'default' : region.completion >= 60 ? 'secondary' : 'destructive'}>
                      {region.completion}% Complete
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                    <div>
                      <span className="block font-medium text-foreground">{region.schools}</span>
                      <span>Schools</span>
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">{region.colleges}</span>
                      <span>Colleges</span>
                    </div>
                    <div>
                      <span className="block font-medium text-foreground">{region.alerts}</span>
                      <span>Alerts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Alert Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Alert Trends
          </CardTitle>
          <CardDescription>
            Alert dispatch and acknowledgment rates over the past 6 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {monthlyAlerts.map((data) => (
              <div key={data.month} className="flex items-center gap-4">
                <div className="w-12 text-sm font-medium">
                  {data.month}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm">Sent: {data.sent}</span>
                    <span className="text-sm">Received: {data.received}</span>
                  </div>
                  <div className="relative">
                    <Progress value={(data.sent / 60) * 100} className="h-2" />
                    <Progress 
                      value={(data.received / 60) * 100} 
                      className="h-2 absolute top-0 bg-green-200" 
                    />
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((data.received / data.sent) * 100)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Recommendations</CardTitle>
          <CardDescription>
            Data-driven insights to improve disaster preparedness
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-800 mb-2">✅ Performing Well</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Evacuation procedures training: 83% completion</li>
                <li>• Chandigarh region: 85% overall readiness</li>
                <li>• Alert response rate consistently above 90%</li>
              </ul>
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">⚠️ Needs Attention</h4>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Medical emergency training: Only 58% completion</li>
                <li>• Ludhiana region: Below average performance</li>
                <li>• Fire safety drills need more frequent scheduling</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;