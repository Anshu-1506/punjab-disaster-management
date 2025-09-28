import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Bell, Send, Clock, CheckCircle, AlertTriangle, MapPin } from 'lucide-react';

interface Alert {
  id: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  regions: string[];
  timestamp: string;
  status: 'sent' | 'draft' | 'scheduled';
  recipients: number;
}

const AlertsPage = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'critical'>('medium');
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const regions = [
    'Chandigarh',
    'Amritsar',
    'Ludhiana',
    'Jalandhar',
    'Patiala',
    'Mohali',
    'Pathankot',
    'Bathinda',
    'Hoshiarpur',
    'Kapurthala'
  ];

  // Mock alerts data
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      title: 'Heavy Rainfall Warning',
      message: 'Heavy rainfall expected in the next 48 hours. All institutions should review their flood preparedness plans.',
      priority: 'high',
      regions: ['Chandigarh', 'Mohali', 'Patiala'],
      timestamp: '2024-01-15T10:30:00Z',
      status: 'sent',
      recipients: 1245
    },
    {
      id: '2',
      title: 'Fire Safety Drill Reminder',
      message: 'Monthly fire safety drill scheduled for tomorrow. Ensure all evacuation routes are clear.',
      priority: 'medium',
      regions: ['Ludhiana', 'Jalandhar'],
      timestamp: '2024-01-14T14:15:00Z',
      status: 'sent',
      recipients: 567
    },
    {
      id: '3',
      title: 'Earthquake Preparedness Update',
      message: 'New earthquake safety guidelines have been uploaded to the system. Please review immediately.',
      priority: 'critical',
      regions: ['All Regions'],
      timestamp: '2024-01-13T09:00:00Z',
      status: 'sent',
      recipients: 2156
    },
    {
      id: '4',
      title: 'System Maintenance Notice',
      message: 'Scheduled system maintenance on Sunday from 2 AM to 6 AM. Dashboard will be temporarily unavailable.',
      priority: 'low',
      regions: ['All Regions'],
      timestamp: '2024-01-12T16:45:00Z',
      status: 'draft',
      recipients: 0
    }
  ]);

  const handleRegionChange = (region: string, checked: boolean) => {
    if (checked) {
      setSelectedRegions([...selectedRegions, region]);
    } else {
      setSelectedRegions(selectedRegions.filter(r => r !== region));
    }
  };

  const handleSendToAllChange = (checked: boolean) => {
    setSendToAll(checked);
    if (checked) {
      setSelectedRegions([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!sendToAll && selectedRegions.length === 0) {
      toast({
        title: "No Recipients Selected",
        description: "Please select regions or choose to send to all",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simulate sending process
    setTimeout(() => {
      const recipientCount = sendToAll ? 2156 : selectedRegions.length * 200;
      
      toast({
        title: "Alert Sent Successfully",
        description: `Alert sent to ${recipientCount} recipients across ${sendToAll ? 'all regions' : selectedRegions.join(', ')}`,
      });
      
      // Reset form
      setTitle('');
      setMessage('');
      setPriority('medium');
      setSelectedRegions([]);
      setSendToAll(false);
      setIsSending(false);
    }, 2000);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'draft':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'scheduled':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Emergency Alert System</h1>
        <p className="text-muted-foreground">
          Send emergency alerts and notifications to schools and colleges across Punjab
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Send Alert Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send New Alert
            </CardTitle>
            <CardDescription>
              Broadcast emergency notifications to educational institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alert-title">Alert Title *</Label>
                <Input
                  id="alert-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter alert title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="alert-message">Message *</Label>
                <Textarea
                  id="alert-message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter detailed alert message"
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level</Label>
                <Select value={priority} onValueChange={(value: 'low' | 'medium' | 'high' | 'critical') => setPriority(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <Label>Recipients</Label>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="send-all"
                    checked={sendToAll}
                    onCheckedChange={handleSendToAllChange}
                  />
                  <Label htmlFor="send-all" className="font-medium">
                    Send to all regions
                  </Label>
                </div>

                {!sendToAll && (
                  <div className="space-y-2">
                    <Label>Select Regions:</Label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                      {regions.map((region) => (
                        <div key={region} className="flex items-center space-x-2">
                          <Checkbox
                            id={region}
                            checked={selectedRegions.includes(region)}
                            onCheckedChange={(checked) => handleRegionChange(region, checked as boolean)}
                          />
                          <Label htmlFor={region} className="text-sm">
                            {region}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {selectedRegions.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Selected: {selectedRegions.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isSending}>
                {isSending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Sending Alert...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Alert
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Alert History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alert History
            </CardTitle>
            <CardDescription>
              Recent alerts and notifications sent to institutions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(alert.status)}
                      <h4 className="font-medium">{alert.title}</h4>
                    </div>
                    <Badge className={getPriorityColor(alert.priority)}>
                      {alert.priority.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">
                    {alert.message}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {alert.regions.join(', ')}
                      </div>
                      {alert.status === 'sent' && (
                        <div>
                          {alert.recipients.toLocaleString()} recipients
                        </div>
                      )}
                    </div>
                    <div>
                      {new Date(alert.timestamp).toLocaleDateString()} {new Date(alert.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AlertsPage;