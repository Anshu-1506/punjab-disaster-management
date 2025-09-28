import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, MapPin, Upload, Bell, BarChart3, ArrowRight } from 'lucide-react';
import digitalIndiaLogo from '@/assets/digital-india-logo.png';
import swachhBharatLogo from '@/assets/swachh-bharat-logo.png';
import punjabGovtLogo from '@/assets/punjab-govt-logo.png';
import cmPunjab from '@/assets/Nivaransetu.jpg';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Map',
      description: 'Real-time monitoring of schools and colleges across Punjab with readiness status.',
    },
    {
      icon: Upload,
      title: 'Module Management',
      description: 'Upload and distribute disaster preparedness training materials and resources.',
    },
    {
      icon: Bell,
      title: 'Alert System',
      description: 'Instant emergency notifications to all educational institutions statewide.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Comprehensive insights and performance metrics for informed decision-making.',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Government Header */}
      <header className="bg-primary text-white">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={digitalIndiaLogo} alt="Digital India" className="h-8 w-8 object-contain" />
              <span className="text-sm font-medium">Digital India Initiative</span>
              <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-8 w-8 object-contain" />
              <span className="text-sm font-medium">Swachh Bharat Mission</span>
            </div>
            <div className="text-sm">
              Government of Punjab | पंजाब सरकार
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-4 mb-6">
                <img src={punjabGovtLogo} alt="Punjab Government" className="h-16 w-16 object-contain" />
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    Punjab Disaster Preparedness
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Management Dashboard
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                A comprehensive digital platform for managing disaster preparedness across educational 
                institutions in Punjab. Monitor readiness, distribute training materials, and coordinate 
                emergency responses efficiently.
              </p>
              
              <div className="flex gap-4">
                <Button 
                  size="lg" 
                  onClick={() => navigate('/login')}
                  className="bg-primary hover:bg-primary/90"
                >
                  <Shield className="mr-2 h-5 w-5" />
                  Access Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="relative">
                <img 
                  src={cmPunjab} 
                  alt="Chief Minister Punjab" 
                  className="w-70 h-96 object-cover rounded-2xl shadow-2xl"
                />
                <div className="absolute bottom-0 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-4">
                  
                  <p className="text-sm text-muted-foreground">Government of Punjab</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Disaster Management
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Advanced tools and features designed to enhance disaster preparedness 
              and response capabilities across Punjab's educational institutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-8 mb-6">
              <img src={digitalIndiaLogo} alt="Digital India" className="h-12 w-12 object-contain" />
              <img src={punjabGovtLogo} alt="Punjab Government" className="h-16 w-16 object-contain" />
              <img src={swachhBharatLogo} alt="Swachh Bharat" className="h-12 w-12 object-contain" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              Punjab Disaster Preparedness Management System
            </h3>
            <p className="text-blue-100 mb-4">
              Building safer communities through enhanced disaster preparedness
            </p>
            <p className="text-blue-200 text-sm">
              © 2024 Government of Punjab. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;