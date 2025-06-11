import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  User, 
  Bell, 
  MapPin, 
  Camera, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Instagram,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Download
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import BottomNavigation from '@/components/bottom-navigation';

export default function SettingsPage() {
  const [location, navigate] = useLocation();
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState({
    partnerships: true,
    nearbyDeals: true,
    rewards: false,
    marketing: false,
  });
  const [privacy, setPrivacy] = useState({
    shareLocation: true,
    shareStories: true,
    profileVisible: true,
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const settingSections = [
    {
      title: "Account",
      items: [
        {
          icon: User,
          label: "Edit Profile",
          description: "Update your personal information",
          action: () => navigate('/profile'),
          showChevron: true,
        },
        {
          icon: Instagram,
          label: "Connected Accounts",
          description: "Manage social media connections",
          action: () => {},
          showChevron: true,
          badge: "Connected",
        },
      ]
    },
    {
      title: "Notifications",
      items: [
        {
          icon: Bell,
          label: "Partnership Alerts",
          description: "New partnership opportunities",
          toggle: true,
          value: notifications.partnerships,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, partnerships: value })),
        },
        {
          icon: MapPin,
          label: "Nearby Deals",
          description: "Location-based notifications",
          toggle: true,
          value: notifications.nearbyDeals,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, nearbyDeals: value })),
        },
        {
          icon: Bell,
          label: "Rewards & Updates",
          description: "Achievement and app updates",
          toggle: true,
          value: notifications.rewards,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, rewards: value })),
        },
        {
          icon: Mail,
          label: "Marketing Communications",
          description: "Promotional emails and offers",
          toggle: true,
          value: notifications.marketing,
          onChange: (value: boolean) => setNotifications(prev => ({ ...prev, marketing: value })),
        },
      ]
    },
    {
      title: "Privacy & Security",
      items: [
        {
          icon: MapPin,
          label: "Share Location",
          description: "Allow location-based recommendations",
          toggle: true,
          value: privacy.shareLocation,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, shareLocation: value })),
        },
        {
          icon: Camera,
          label: "Share Stories",
          description: "Allow story content for marketing",
          toggle: true,
          value: privacy.shareStories,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, shareStories: value })),
        },
        {
          icon: Shield,
          label: "Public Profile",
          description: "Make profile visible to others",
          toggle: true,
          value: privacy.profileVisible,
          onChange: (value: boolean) => setPrivacy(prev => ({ ...prev, profileVisible: value })),
        },
        {
          icon: Shield,
          label: "Privacy Policy",
          description: "Review our privacy practices",
          action: () => {},
          showChevron: true,
        },
      ]
    },
    {
      title: "Data & Storage",
      items: [
        {
          icon: Download,
          label: "Download My Data",
          description: "Export your account information",
          action: () => {},
          showChevron: true,
        },
        {
          icon: Trash2,
          label: "Clear Cache",
          description: "Free up storage space",
          action: () => {},
          showChevron: true,
        },
      ]
    },
    {
      title: "Support",
      items: [
        {
          icon: HelpCircle,
          label: "Help Center",
          description: "FAQs and support articles",
          action: () => {},
          showChevron: true,
        },
        {
          icon: Mail,
          label: "Contact Support",
          description: "Get help from our team",
          action: () => {},
          showChevron: true,
        },
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 pb-20">
      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pt-8">
          <Button
            onClick={() => navigate('/')}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
          <h1 className="text-xl font-rubik font-bold text-white">Settings</h1>
          <div className="w-16"></div>
        </div>

        {/* Profile Summary */}
        <Card className="mx-6 mb-6 glass-morphism border-white/20 p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-rubik font-bold text-white">
                {user?.fullName || 'User'}
              </h3>
              <p className="text-gray-300 font-space text-sm">
                @{user?.username || 'username'}
              </p>
              <Badge className="mt-2 bg-green-500/20 text-green-300 border-green-400/30">
                Verified Partner
              </Badge>
            </div>
            <Button
              onClick={() => navigate('/profile')}
              variant="outline"
              size="sm"
              className="border-white/30 text-white hover:bg-white/10"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Settings Sections */}
        <div className="px-6 space-y-6">
          {settingSections.map((section, sectionIndex) => (
            <Card key={sectionIndex} className="glass-morphism border-white/20 p-6">
              <h2 className="text-lg font-rubik font-bold text-white mb-4">
                {section.title}
              </h2>
              <div className="space-y-4">
                {section.items.map((item, itemIndex) => (
                  <div key={itemIndex}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3 flex-1">
                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-rubik font-semibold text-white text-sm">
                              {item.label}
                            </h3>
                            {item.badge && (
                              <Badge className="text-xs bg-green-500/20 text-green-300 border-green-400/30">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-gray-400 font-space text-xs">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      
                      {item.toggle && (
                        <Switch
                          checked={item.value}
                          onCheckedChange={item.onChange}
                          className="data-[state=checked]:bg-purple-600"
                        />
                      )}
                      
                      {item.showChevron && (
                        <Button
                          onClick={item.action}
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-white hover:bg-white/10"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    
                    {itemIndex < section.items.length - 1 && (
                      <Separator className="bg-white/10 mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {/* Logout Section */}
          <Card className="glass-morphism border-red-500/20 p-6">
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-rubik font-semibold py-3 h-12"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
            <p className="text-center text-gray-400 font-space text-xs mt-3">
              You'll need to sign in again to access your account
            </p>
          </Card>

          {/* App Info */}
          <Card className="glass-morphism border-white/20 p-6 text-center">
            <h3 className="font-rubik font-bold text-white mb-2">Earlyshh</h3>
            <p className="text-gray-400 font-space text-xs mb-2">Version 1.0.0</p>
            <p className="text-gray-500 font-space text-xs">
              © 2025 Earlyshh Inc. All rights reserved.
            </p>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}