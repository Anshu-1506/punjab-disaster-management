import React, { useEffect, useState } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, School, GraduationCap, Filter } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet - simpler approach
const DefaultIcon = L.icon({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface Institution {
  id: string;
  name: string;
  type: 'school' | 'college';
  district: string;
  coordinates: [number, number];
  readinessStatus: 'high' | 'medium' | 'low';
  studentsCount: number;
  lastDrillDate: string;
  contactPerson: string;
  phone: string;
}

// Mock data for Punjab institutions
const INSTITUTIONS: Institution[] = [
  {
    id: '1',
    name: 'Government Senior Secondary School, Chandigarh',
    type: 'school',
    district: 'Chandigarh',
    coordinates: [30.7333, 76.7794],
    readinessStatus: 'high',
    studentsCount: 1250,
    lastDrillDate: '2024-01-15',
    contactPerson: 'Dr. Manjeet Kaur',
    phone: '+91-172-2741234'
  },
  {
    id: '2',
    name: 'Punjab University, Chandigarh',
    type: 'college',
    district: 'Chandigarh',
    coordinates: [30.7571, 76.7691],
    readinessStatus: 'high',
    studentsCount: 15000,
    lastDrillDate: '2024-01-10',
    contactPerson: 'Prof. Rajesh Kumar',
    phone: '+91-172-2534000'
  },
  {
    id: '3',
    name: 'DAV College, Amritsar',
    type: 'college',
    district: 'Amritsar',
    coordinates: [31.6340, 74.8723],
    readinessStatus: 'medium',
    studentsCount: 3200,
    lastDrillDate: '2023-12-20',
    contactPerson: 'Dr. Harpreet Singh',
    phone: '+91-183-2258000'
  },
  {
    id: '4',
    name: 'Government High School, Ludhiana',
    type: 'school',
    district: 'Ludhiana',
    coordinates: [30.9010, 75.8573],
    readinessStatus: 'medium',
    studentsCount: 800,
    lastDrillDate: '2023-11-30',
    contactPerson: 'Ms. Priya Sharma',
    phone: '+91-161-2401234'
  },
  {
    id: '5',
    name: 'Khalsa College, Jalandhar',
    type: 'college',
    district: 'Jalandhar',
    coordinates: [31.3260, 75.5762],
    readinessStatus: 'low',
    studentsCount: 2800,
    lastDrillDate: '2023-10-15',
    contactPerson: 'Prof. Gurdeep Singh',
    phone: '+91-181-2223000'
  },
  {
    id: '6',
    name: 'Government Senior Secondary School, Patiala',
    type: 'school',
    district: 'Patiala',
    coordinates: [30.3398, 76.3869],
    readinessStatus: 'high',
    studentsCount: 950,
    lastDrillDate: '2024-01-05',
    contactPerson: 'Mr. Amarjeet Singh',
    phone: '+91-175-2212345'
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'high':
      return 'bg-green-100 text-green-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'high':
      return '🟢';
    case 'medium':
      return '🟡';
    case 'low':
      return '🔴';
    default:
      return '⚪';
  }
};

// Removed MapController component to avoid useMap hook issues

const InteractiveMap: React.FC = () => {
  const [filteredInstitutions, setFilteredInstitutions] = useState<Institution[]>(INSTITUTIONS);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');

  const districts = Array.from(new Set(INSTITUTIONS.map(inst => inst.district)));

  useEffect(() => {
    let filtered = INSTITUTIONS;

    if (selectedDistrict !== 'all') {
      filtered = filtered.filter(inst => inst.district === selectedDistrict);
    }

    if (selectedType !== 'all') {
      filtered = filtered.filter(inst => inst.type === selectedType);
    }

    setFilteredInstitutions(filtered);
  }, [selectedDistrict, selectedType]);

  const clearFilters = () => {
    setSelectedDistrict('all');
    setSelectedType('all');
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Map Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">District</label>
              <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {districts.map(district => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1">
              <label className="text-sm font-medium mb-2 block">Institution Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="school">Schools</SelectItem>
                  <SelectItem value="college">Colleges</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Showing {filteredInstitutions.length} of {INSTITUTIONS.length} institutions
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card>
        <CardContent className="p-0">
          <div className="h-[600px] w-full rounded-lg overflow-hidden">
            <MapContainer
              center={[30.7333, 76.7794]}
              zoom={8}
              style={{ height: '100%', width: '100%' }}
              className="rounded-lg"
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />

              {filteredInstitutions.map((institution) => (
                <Marker
                  key={institution.id}
                  position={institution.coordinates}
                  icon={DefaultIcon}
                >
                  <Popup>
                    <div className="p-2 min-w-[250px]">
                      <div className="flex items-start gap-2 mb-3">
                        {institution.type === 'school' ? (
                          <School className="h-5 w-5 text-blue-600 mt-1" />
                        ) : (
                          <GraduationCap className="h-5 w-5 text-blue-600 mt-1" />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm leading-tight">
                            {institution.name}
                          </h3>
                          <p className="text-xs text-gray-600 mt-1">
                            {institution.district} District
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium">Readiness Status:</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(institution.readinessStatus)}`}>
                            {getStatusIcon(institution.readinessStatus)} {institution.readinessStatus.toUpperCase()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="font-medium">Students:</span>
                            <p className="text-gray-600">{institution.studentsCount.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Last Drill:</span>
                            <p className="text-gray-600">{institution.lastDrillDate}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="text-xs">
                            <span className="font-medium">Contact Person:</span>
                            <p className="text-gray-600">{institution.contactPerson}</p>
                            <p className="text-gray-600">{institution.phone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟢</span>
              <div>
                <p className="font-medium text-sm">High Readiness</p>
                <p className="text-xs text-muted-foreground">Recent drills, full preparedness</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🟡</span>
              <div>
                <p className="font-medium text-sm">Medium Readiness</p>
                <p className="text-xs text-muted-foreground">Some preparation needed</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔴</span>
              <div>
                <p className="font-medium text-sm">Low Readiness</p>
                <p className="text-xs text-muted-foreground">Immediate attention required</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveMap;