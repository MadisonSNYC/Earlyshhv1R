import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Settings, 
  Trophy, 
  Users, 
  BarChart3, 
  Star, 
  Award, 
  Target, 
  Share2, 
  CheckCircle,
  Camera,
  Upload,
  Zap,
  Heart,
  TrendingUp,
  MapPin,
  Calendar,
  Sparkles,
  Crown,
  Gift
} from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(3);

  // Mock user profile data
  const profileData = {
    fullName: 'Maya Chen',
    instagramHandle: '@maya_discovers',
    bio: 'Coffee enthusiast & wellness advocate. Always trying new products!',
    school: 'NYU Stern School of Business',
    graduationYear: '2025',
    followerCount: 1247,
    followingCount: 892,
    profileImage: null,
  };

  // Enhanced gamification data
  const discoveryScore = 88;
  const completedPartnerships = 12;
  const totalSavings = 247;
  const shareCount = 15;
  const redeemedCount = 8;
  const currentStreak = 7;

  // Enhanced achievements with gradient colors
  const achievements = [
    { 
      id: 1, 
      title: 'First Partnership', 
      description: 'Claimed your first partnership', 
      icon: Trophy, 
      unlocked: true, 
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      shadowColor: 'shadow-yellow-400/30'
    },
    { 
      id: 2, 
      title: 'Social Influencer', 
      description: 'Shared 15 partnership stories', 
      icon: Share2, 
      unlocked: true, 
      gradient: 'from-blue-400 via-purple-500 to-pink-500',
      shadowColor: 'shadow-blue-400/30'
    },
    { 
      id: 3, 
      title: 'Partnership Pro', 
      description: 'Redeemed 10+ partnerships', 
      icon: Target, 
      unlocked: redeemedCount >= 10, 
      gradient: 'from-green-400 via-cyan-500 to-blue-500',
      shadowColor: 'shadow-green-400/30'
    },
    { 
      id: 4, 
      title: 'Trendsetter', 
      description: 'Early adopter badge', 
      icon: Crown, 
      unlocked: false, 
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      shadowColor: 'shadow-purple-400/30'
    },
  ];

  // Partnership completion data
  const partnershipStats = [
    {
      id: 1,
      brandName: 'SuperRoot Energy',
      location: 'Corner Market',
      completedDate: '2 days ago',
      icon: '⚡',
      gradient: 'from-orange-400 to-red-500',
      status: 'completed',
      savings: '$15'
    },
    {
      id: 2,
      brandName: 'Glow Beauty',
      location: 'Beauty Plus',
      completedDate: '1 week ago',
      icon: '✨',
      gradient: 'from-pink-400 to-purple-500',
      status: 'completed',
      savings: '$25'
    },
    {
      id: 3,
      brandName: 'Pure Wellness',
      location: 'Health Hub',
      completedDate: '2 weeks ago',
      icon: '💚',
      gradient: 'from-green-400 to-cyan-500',
      status: 'completed',
      savings: '$18'
    }
  ];

  const handleLogout = () => {
    console.log('Logout clicked');
  };

  const handleEditProfile = () => {
    setLocation('/profile/edit');
  };

  const handlePhotoUpload = () => {
    console.log('Photo upload clicked');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Enhanced background overlays */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/20 via-pink-500/15 to-cyan-400/20" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 via-gray-900/20 to-gray-900/30" />
      
      <div className="relative z-10 px-6 pt-12 pb-32 space-y-6">
        {/* Enhanced Profile Header */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-5">
              {/* Much larger, more prominent profile picture */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-3 border-white/30 relative overflow-hidden group cursor-pointer"
                     onClick={handlePhotoUpload}>
                  {profileData.profileImage ? (
                    <img src={profileData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full flex items-center justify-center">
                      <span className="text-white font-black text-2xl drop-shadow-lg">M</span>
                    </div>
                  )}
                  {/* Photo upload overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                {/* Enhanced verification badge */}
                <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full border-3 border-gray-900 flex items-center justify-center shadow-lg">
                  <CheckCircle className="w-5 h-5 text-white" />
                </div>
              </div>
              
              {/* Compartmentalized user info with social links */}
              <div className="flex-1 min-w-0">
                <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-3 border border-white/10">
                  <h2 className="text-xl font-black drop-shadow-lg tracking-tight mb-2 truncate">
                    <span 
                      className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s ease-in-out infinite'
                      }}
                    >
                      {profileData.instagramHandle}
                    </span>
                  </h2>
                  <p className="text-white text-base font-bold drop-shadow-md mb-2 truncate">{profileData.fullName}</p>
                  <p className="text-orange-200 text-xs font-medium drop-shadow-sm mb-3">
                    {profileData.followerCount.toLocaleString()} followers · {profileData.followingCount.toLocaleString()} following
                  </p>
                  
                  {/* Social Handle Links */}
                  <div className="flex items-center gap-3">
                    <a 
                      href={`https://instagram.com/${profileData.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 border border-pink-400/30 rounded-xl px-2 py-1 transition-all duration-300 hover:scale-105"
                    >
                      <span className="text-pink-300 text-xs">📷</span>
                      <span className="text-pink-200 text-xs font-medium">Instagram</span>
                    </a>
                    <a 
                      href={`https://tiktok.com/@${profileData.instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-400/30 rounded-xl px-2 py-1 transition-all duration-300 hover:scale-105"
                    >
                      <span className="text-cyan-300 text-xs">🎵</span>
                      <span className="text-cyan-200 text-xs font-medium">TikTok</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced bio section */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
            <p className="text-white text-sm leading-relaxed drop-shadow-sm mb-3">{profileData.bio}</p>
            <div className="flex items-center gap-6 text-xs text-orange-200 mb-4">
              <span className="flex items-center space-x-1">
                <span>🎓</span>
                <span>{profileData.school}</span>
              </span>
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>Class of {profileData.graduationYear}</span>
              </span>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={handleEditProfile}
                className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
                size="sm"
              >
                Edit Profile
              </Button>
              <Button 
                onClick={() => setLocation('/settings')}
                className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border-0 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105"
                size="sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Premium Discoverer Badge */}
        <div className="bg-gradient-to-br from-yellow-900/80 via-orange-900/70 to-red-900/80 backdrop-blur-md rounded-3xl p-6 border border-yellow-400/30 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <span className="text-yellow-300 font-black text-lg drop-shadow-lg">PREMIUM DISCOVERER</span>
          </div>
          
          <h3 className="text-white font-black text-3xl mb-6 drop-shadow-lg">Partnership Impact Score</h3>
          
          <div className="relative mb-6">
            <div className="w-36 h-36 mx-auto relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="10"/>
                <circle 
                  cx="60" 
                  cy="60" 
                  r="50" 
                  fill="none" 
                  stroke="url(#discoveryGradient)" 
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${(discoveryScore / 100) * 314} 314`}
                  className="drop-shadow-lg"
                />
                <defs>
                  <linearGradient id="discoveryGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="33%" stopColor="#06B6D4" />
                    <stop offset="66%" stopColor="#EC4899" />
                    <stop offset="100%" stopColor="#F59E0B" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black text-white drop-shadow-lg">{discoveryScore}</span>
                <span className="text-sm font-bold text-green-300 drop-shadow-md">Excellent</span>
              </div>
            </div>
          </div>

          <p className="text-center text-white text-sm mb-4 drop-shadow-md">
            You're in the top <span className="text-cyan-300 font-black text-lg">12%</span> of partnership creators!
          </p>

          <Button className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-3 rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/40">
            <Sparkles className="w-4 h-4 mr-2" />
            Boost Score
          </Button>
        </div>

        {/* Enhanced Color-Coded Stats Grid with Larger Numbers */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-900/80 to-cyan-900/80 backdrop-blur-md rounded-3xl p-5 border border-green-400/30 shadow-xl">
            <div className="text-center">
              <div className="text-4xl font-black text-green-300 drop-shadow-lg mb-1">{completedPartnerships}</div>
              <div className="text-sm font-bold text-green-200 drop-shadow-md">Partnerships Claimed</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/80 to-purple-900/80 backdrop-blur-md rounded-3xl p-5 border border-blue-400/30 shadow-xl">
            <div className="text-center">
              <div className="text-4xl font-black text-blue-300 drop-shadow-lg mb-1">${totalSavings}</div>
              <div className="text-sm font-bold text-blue-200 drop-shadow-md">Total Value</div>
            </div>
          </div>
        </div>

        {/* Enhanced Achievements with Individual Gradients */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-black text-2xl drop-shadow-lg">Achievements</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id} 
                className={`p-4 rounded-2xl border transition-all duration-300 ${
                  achievement.unlocked 
                    ? `bg-gradient-to-br ${achievement.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/20 border-white/20 ${achievement.shadowColor} shadow-lg hover:scale-105` 
                    : 'bg-gray-800/60 border-gray-600/50 opacity-60'
                }`}
              >
                <div className={`${achievement.unlocked ? 'text-white' : 'text-gray-500'} mb-3`}>
                  <achievement.icon className="w-8 h-8" />
                </div>
                <h4 className={`font-bold text-sm mb-1 ${achievement.unlocked ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                  {achievement.title}
                </h4>
                <p className={`text-xs ${achievement.unlocked ? 'text-white/80 drop-shadow-sm' : 'text-gray-600'}`}>
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Analytics Dashboard */}
        <div className="bg-gradient-to-br from-purple-900/80 to-pink-900/80 backdrop-blur-md rounded-3xl p-6 border border-purple-400/30 shadow-xl cursor-pointer hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-black text-2xl drop-shadow-lg">Analytics Dashboard</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-3xl font-black text-green-300 drop-shadow-lg">{completedPartnerships}</div>
              <div className="text-xs font-bold text-green-200 drop-shadow-md">Claimed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-blue-300 drop-shadow-lg">{redeemedCount}</div>
              <div className="text-xs font-bold text-blue-200 drop-shadow-md">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-black text-purple-300 drop-shadow-lg">{shareCount}</div>
              <div className="text-xs font-bold text-purple-200 drop-shadow-md">Shared</div>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-2xl border-0 transition-all duration-300">
            View Full Analytics →
          </Button>
        </div>

        {/* Partnership Completion Tracker */}
        <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-black text-2xl drop-shadow-lg">Partnership Completions</h3>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-2xl border-0 transition-all duration-300 text-sm">
              View All
            </Button>
          </div>
          
          <div className="space-y-4">
            {partnershipStats.map((partnership) => (
              <div key={partnership.id} className="flex items-center space-x-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-2xl hover:bg-gray-800/70 transition-all cursor-pointer border border-white/10">
                <div className={`w-12 h-12 bg-gradient-to-r ${partnership.gradient} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <span className="text-white text-lg">{partnership.icon}</span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold text-sm drop-shadow-md">{partnership.brandName} • {partnership.location}</p>
                  <p className="text-orange-200 text-xs drop-shadow-sm">{partnership.completedDate} • Saved {partnership.savings}</p>
                </div>
                <div className="w-8 h-8 bg-green-500/20 text-green-300 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="bg-gradient-to-br from-yellow-900/80 via-orange-900/70 to-red-900/80 backdrop-blur-md rounded-3xl p-6 border border-yellow-400/30 shadow-xl">
          <h3 className="text-white font-black text-2xl mb-3 drop-shadow-lg">Ready for your next partnership?</h3>
          <p className="text-orange-100 text-sm mb-6 drop-shadow-md">
            Premium discoverers get first access to exclusive brand partnerships.
          </p>
          <Button 
            onClick={() => setLocation('/')}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-4 rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/40"
          >
            <Gift className="w-5 h-5 mr-2" />
            Discover New Partnerships
          </Button>
        </div>

        {/* Enhanced Account Actions */}
        <div className="flex gap-4">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-2xl border-0 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>

        {/* App Info */}
        <div className="text-center space-y-2 px-4">
          <p className="text-lg font-bold text-white drop-shadow-lg">Earlyshh v2.2 (MVP)</p>
          <p className="text-sm text-orange-200 leading-relaxed drop-shadow-md">© 2024 Earlyshh Inc. All rights reserved.</p>
        </div>

        {/* CSS for shimmer animation */}
        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}