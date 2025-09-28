import React from 'react';
import InteractiveMap from '@/components/Map/InteractiveMap';

const MapPage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Interactive Map</h1>
        <p className="text-muted-foreground">
          View and monitor schools and colleges across Punjab with their disaster preparedness status
        </p>
      </div>
      
      <InteractiveMap />
    </div>
  );
};

export default MapPage;