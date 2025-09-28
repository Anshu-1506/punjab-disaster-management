import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

const MapPageSimple = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Interactive Map (Test Version)</h1>
        <p className="text-muted-foreground">
          Testing page without React-Leaflet to isolate the context error
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Map Placeholder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[600px] w-full bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium">Map Loading Test</p>
              <p className="text-muted-foreground">If you see this, the context issue is resolved</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MapPageSimple;