import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import BottomNavigation from "@/components/bottom-navigation";
import { LogOut, Settings, HelpCircle, Shield, Bell } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePicUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=64&h=64&fit=crop&crop=face"}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
              <div>
                <h2 className="text-xl font-bold text-gray-900">{user?.fullName}</h2>
                <p className="text-gray-500">@{user?.username}</p>
                <Badge variant="secondary" className="mt-1">
                  Age Verified
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Settings className="w-5 h-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Preferences</p>
                  <p className="text-sm text-gray-500">Manage notifications and location settings</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Bell className="w-5 h-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Control what notifications you receive</p>
                </div>
              </Button>

              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <Shield className="w-5 h-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Privacy & Security</p>
                  <p className="text-sm text-gray-500">Manage your data and privacy settings</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Support */}
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Support</h3>
            
            <div className="space-y-4">
              <Button variant="ghost" className="w-full justify-start p-4 h-auto">
                <HelpCircle className="w-5 h-5 mr-3 text-gray-500" />
                <div className="text-left">
                  <p className="font-medium">Help Center</p>
                  <p className="text-sm text-gray-500">Get answers to common questions</p>
                </div>
              </Button>

              <div className="pt-4 border-t border-gray-200">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full justify-start p-4 h-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Sign Out</p>
                    <p className="text-sm opacity-80">Sign out of your account</p>
                  </div>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center text-sm text-gray-500 space-y-1">
          <p>Earlyshh v2.2 (MVP)</p>
          <p>© 2024 Earlyshh Inc. All rights reserved.</p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
