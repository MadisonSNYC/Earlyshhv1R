import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import BottomNavigation from "@/components/bottom-navigation";
import { LogOut, Settings, HelpCircle, Shield, Bell, Trophy, TrendingUp, MapPin, Users } from "lucide-react";

export default function ProfilePage() {
  const { user, logout } = useAuth();

  // Fetch user stats and analytics
  const { data: userStats } = useQuery({
    queryKey: ['/api/users/1/stats'],
  });

  const { data: userCoupons } = useQuery({
    queryKey: ['/api/users/1/coupons'],
  });

  const discoveryScore = 88;
  const completedDiscoveries = Array.isArray(userCoupons) ? userCoupons.length : 0;

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen electric-bg flex flex-col">
      <div className="flex-1 px-4 pt-12 pb-20 space-y-6">
        {/* Profile Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
          </div>
          <div>
            <h2 className="text-white font-rubik font-bold text-lg">@maya_discovers</h2>
            <p className="text-gray-300 font-space text-sm">Maya Chen</p>
            <p className="text-gray-400 font-space text-xs">1247 followers · 892 following</p>
          </div>
        </div>

        {/* Premium Discoverer Badge */}
        <Card className="glass-morphism border-gold-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded flex items-center justify-center">
                <Trophy className="w-3 h-3 text-white" />
              </div>
              <span className="text-yellow-400 font-space font-bold text-sm">PREMIUM DISCOVERER</span>
            </div>
            
            <h3 className="text-white font-rubik font-bold text-xl mb-4">Discovery Impact Score</h3>
            
            <div className="relative mb-6">
              <div className="w-32 h-32 mx-auto relative">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"/>
                  <circle 
                    cx="60" 
                    cy="60" 
                    r="50" 
                    fill="none" 
                    stroke="url(#discoveryGradient)" 
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(discoveryScore / 100) * 314} 314`}
                  />
                  <defs>
                    <linearGradient id="discoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="50%" stopColor="#06B6D4" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-rubik font-bold text-white">{discoveryScore}</span>
                  <span className="text-sm font-space text-green-400">Excellent</span>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-300 font-space text-sm mb-4">
              You're in the top <span className="text-cyan-400 font-bold">12%</span> of discovery creators!
            </p>

            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-rubik font-bold">
              Boost Score
            </Button>
          </CardContent>
        </Card>

        {/* Creator Demographics */}
        <Card className="glass-morphism border-purple-500/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-4">
              <Users className="w-5 h-5 text-purple-400" />
              <h3 className="text-white font-rubik font-bold text-lg">Creator Demographics</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-rubik font-bold text-pink-400">22</div>
                <div className="text-xs font-space text-gray-400">Age</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-rubik font-bold text-purple-400">NYC</div>
                <div className="text-xs font-space text-gray-400">Location</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-rubik font-bold text-cyan-400">12.4%</div>
                <div className="text-xs font-space text-gray-400">Engagement</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-rubik font-bold text-yellow-400">8.2K</div>
                <div className="text-xs font-space text-gray-400">Avg Views</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Completed Discoveries */}
        <Card className="glass-morphism border-white/10">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-5 h-5 text-green-400">✓</div>
                <h3 className="text-white font-rubik font-bold text-lg">Completed Discoveries</h3>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">P</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-space font-medium text-sm">Peak Energy • Corner Market</p>
                  <p className="text-gray-400 font-space text-xs">2 days ago</p>
                </div>
                <div className="w-6 h-6 bg-orange-500/20 text-orange-400 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-3 h-3" />
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">C</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-space font-medium text-sm">Cosmic Brownies • Deli Plus</p>
                  <p className="text-gray-400 font-space text-xs">1 week ago</p>
                </div>
                <div className="w-6 h-6 bg-purple-500/20 text-purple-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">🔥</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">L</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-space font-medium text-sm">Local Brew Co • Quick Stop</p>
                  <p className="text-gray-400 font-space text-xs">2 weeks ago</p>
                </div>
                <div className="w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">📡</span>
                </div>
              </div>
            </div>

            <Button variant="ghost" className="w-full mt-4 text-cyan-400 hover:text-cyan-300">
              Show more
            </Button>
          </CardContent>
        </Card>

        {/* Ready for Next Discovery */}
        <Card className="glass-morphism border-yellow-500/20">
          <CardContent className="p-4">
            <h3 className="text-white font-rubik font-bold text-lg mb-2">Ready for your next discovery?</h3>
            <p className="text-gray-300 font-space text-sm mb-4">
              Premium discoverers get first access to exclusive brand partnerships.
            </p>
            <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-rubik font-bold">
              🔍 Discover New Brands
            </Button>
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
