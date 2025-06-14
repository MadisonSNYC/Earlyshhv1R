
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
  Gift,
  Edit,
  ExternalLink
} from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(3);
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);
  const [showAnalytics, setShowAnalytics] = useState(false);

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

  // Enhanced achievements with gradient colors and unlock instructions
  const achievements = [
    { 
      id: 1, 
      title: 'First Partnership', 
      description: 'Claimed your first partnership', 
      icon: Trophy, 
      unlocked: true, 
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      shadowColor: 'shadow-yellow-400/30',
      unlockHint: 'Claim any partnership to unlock this achievement'
    },
    { 
      id: 2, 
      title: 'Social Influencer', 
      description: 'Shared 15 partnership stories', 
      icon: Share2, 
      unlocked: true, 
      gradient: 'from-blue-400 via-purple-500 to-pink-500',
      shadowColor: 'shadow-blue-400/30',
      unlockHint: 'Share 15 Instagram stories featuring partnerships'
    },
    { 
      id: 3, 
      title: 'Partnership Pro', 
      description: 'Redeemed 10+ partnerships', 
      icon: Target, 
      unlocked: redeemedCount >= 10, 
      gradient: 'from-green-400 via-cyan-500 to-blue-500',
      shadowColor: 'shadow-green-400/30',
      unlockHint: `Redeem ${10 - redeemedCount} more partnerships to unlock (${redeemedCount}/10)`
    },
    { 
      id: 4, 
      title: 'Trendsetter', 
      description: 'Early adopter badge', 
      icon: Crown, 
      unlocked: false, 
      gradient: 'from-purple-400 via-pink-500 to-red-500',
      shadowColor: 'shadow-purple-400/30',
      unlockHint: 'Be among the first 1000 users to join Earlyshh'
    },
    { 
      id: 5, 
      title: 'Content Creator', 
      description: 'Captured 20+ stories with camera', 
      icon: Camera, 
      unlocked: false, 
      gradient: 'from-pink-400 via-orange-500 to-yellow-500',
      shadowColor: 'shadow-pink-400/30',
      unlockHint: 'Use the in-app camera to capture 20 Instagram stories'
    },
    { 
      id: 6, 
      title: 'Local Explorer', 
      description: 'Visited 5+ different locations', 
      icon: MapPin, 
      unlocked: false, 
      gradient: 'from-cyan-400 via-blue-500 to-purple-500',
      shadowColor: 'shadow-cyan-400/30',
      unlockHint: 'Redeem partnerships at 5 different locations'
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
      
      <div className="relative z-10 px-4 pt-8 pb-32 space-y-6 max-w-md mx-auto">
        {/* Header Section - Profile Picture and Basic Info */}
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-400 via-pink-500 to-orange-500 rounded-full flex items-center justify-center shadow-2xl border-4 border-white/30 relative overflow-hidden group cursor-pointer"
                   onClick={handlePhotoUpload}>
                {profileData.profileImage ? (
                  <img src={profileData.profileImage} alt="Profile" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <div className="w-28 h-28 bg-gradient-to-br from-purple-300 to-pink-400 rounded-full flex items-center justify-center">
                    <span className="text-white font-black text-4xl drop-shadow-lg">M</span>
                  </div>
                )}
                {/* Photo upload overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full flex items-center justify-center">
                  <Camera className="w-8 h-8 text-white" />
                </div>
              </div>
              {/* Enhanced verification badge */}
              <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full border-4 border-gray-900 flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          {/* User Identity */}
          <div className="text-center space-y-3 mb-6">
            <h1 className="text-3xl font-black drop-shadow-lg tracking-tight">
              <span 
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 bg-clip-text text-transparent"
                style={{
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 3s ease-in-out infinite'
                }}
              >
                {profileData.instagramHandle}
              </span>
            </h1>
            <p className="text-white text-xl font-bold drop-shadow-md">{profileData.fullName}</p>
          </div>

          {/* Follower Stats */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-cyan-300 drop-shadow-lg">
                {profileData.followerCount.toLocaleString()}
              </div>
              <div className="text-sm font-bold text-cyan-200 drop-shadow-md">Followers</div>
            </div>
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
              <div className="text-2xl font-black text-purple-300 drop-shadow-lg">
                {profileData.followingCount.toLocaleString()}
              </div>
              <div className="text-sm font-bold text-purple-200 drop-shadow-md">Following</div>
            </div>
          </div>

          {/* Social Links */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <a 
              href={`https://instagram.com/${profileData.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 border border-pink-400/40 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="text-pink-300 text-lg">📷</span>
              <span className="text-pink-200 text-sm font-bold">Instagram</span>
            </a>
            <a 
              href={`https://tiktok.com/@${profileData.instagramHandle.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 border border-cyan-400/40 rounded-xl px-4 py-3 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <span className="text-cyan-300 text-lg">🎵</span>
              <span className="text-cyan-200 text-sm font-bold">TikTok</span>
            </a>
          </div>

          {/* Bio */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10 mb-6">
            <p className="text-white text-base leading-relaxed drop-shadow-sm text-center mb-4">
              {profileData.bio}
            </p>
            
            {/* Education Info */}
            <div className="bg-gray-700/30 rounded-xl p-3 space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm text-orange-200">
                <span className="text-lg">🎓</span>
                <span className="font-medium">{profileData.school}</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-orange-200">
                <span className="text-lg">📅</span>
                <span className="font-medium">Class of {profileData.graduationYear}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={handleEditProfile}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 rounded-xl font-bold py-3 transition-all duration-300 hover:scale-105 shadow-lg shadow-purple-500/30"
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button 
              onClick={() => setLocation('/settings')}
              className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white border-0 rounded-xl shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>

        {/* Partnership Impact Score - Moved to Top */}
        <div className="bg-gradient-to-br from-yellow-900/90 via-orange-900/80 to-red-900/90 backdrop-blur-lg rounded-3xl p-6 border border-yellow-400/30 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div className="text-center">
              <div className="text-yellow-300 font-black text-lg drop-shadow-lg">PREMIUM DISCOVERER</div>
              <div className="text-yellow-200 text-sm font-medium">Partnership Impact Score</div>
            </div>
          </div>
          
          <div className="relative mb-6">
            <div className="w-40 h-40 mx-auto relative">
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

          <div className="text-center mb-6">
            <p className="text-white text-sm drop-shadow-md">
              You're in the top <span className="text-cyan-300 font-black text-lg">12%</span> of partnership creators!
            </p>
          </div>

          <Button className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-3 rounded-xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/40">
            <Sparkles className="w-5 h-5 mr-2" />
            Boost Score
          </Button>
        </div>

        

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-green-900/90 to-cyan-900/90 backdrop-blur-lg rounded-2xl p-5 border border-green-400/30 shadow-xl text-center">
            <div className="text-4xl font-black text-green-300 drop-shadow-lg mb-2">{completedPartnerships}</div>
            <div className="text-sm font-bold text-green-200 drop-shadow-md">Partnerships Claimed</div>
          </div>
          
          <div className="bg-gradient-to-br from-blue-900/90 to-purple-900/90 backdrop-blur-lg rounded-2xl p-5 border border-blue-400/30 shadow-xl text-center">
            <div className="text-4xl font-black text-blue-300 drop-shadow-lg mb-2">${totalSavings}</div>
            <div className="text-sm font-bold text-blue-200 drop-shadow-md">Total Value</div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-black text-xl drop-shadow-lg">Achievements</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement) => (
              <div key={achievement.id} className="relative">
                <div 
                  onClick={() => {
                    if (!achievement.unlocked) {
                      setSelectedAchievement(
                        selectedAchievement === achievement.id ? null : achievement.id
                      );
                    }
                  }}
                  className={`p-4 rounded-xl border transition-all duration-300 ${
                    achievement.unlocked 
                      ? `bg-gradient-to-br ${achievement.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/20 border-white/20 ${achievement.shadowColor} shadow-lg hover:scale-105` 
                      : 'bg-gray-800/60 border-gray-600/50 opacity-60 hover:opacity-80 cursor-pointer'
                  }`}
                >
                  <div className={`${achievement.unlocked ? 'text-white' : 'text-gray-500'} mb-2`}>
                    <achievement.icon className="w-7 h-7" />
                  </div>
                  <h4 className={`font-bold text-xs mb-1 ${achievement.unlocked ? 'text-white drop-shadow-md' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h4>
                  <p className={`text-xs ${achievement.unlocked ? 'text-white/80 drop-shadow-sm' : 'text-gray-600'}`}>
                    {achievement.description}
                  </p>
                </div>

                {/* Click tooltip for locked achievements */}
                {!achievement.unlocked && selectedAchievement === achievement.id && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-20">
                    <div className="bg-gray-900/95 backdrop-blur-md text-white text-xs rounded-xl p-3 shadow-xl border border-white/20 mx-2">
                      <div className="text-center">
                        <div className="text-yellow-300 font-bold mb-2">How to unlock:</div>
                        <div className="text-gray-200 leading-relaxed">{achievement.unlockHint}</div>
                      </div>
                      {/* Tooltip arrow */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900/95"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Analytics Dashboard */}
        <div className="bg-gradient-to-br from-purple-900/90 to-pink-900/90 backdrop-blur-lg rounded-3xl p-6 border border-purple-400/30 shadow-2xl cursor-pointer hover:scale-[1.02] transition-all duration-300">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-white font-black text-xl drop-shadow-lg">Analytics Dashboard</h3>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-6">
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

          <Button 
            onClick={() => setShowAnalytics(true)}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl border-0 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Full Analytics →
          </Button>
        </div>

        {/* Partnership Completions */}
        <div className="bg-gray-900/80 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-black text-lg drop-shadow-lg">Recent Completions</h3>
            </div>
            <Button className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl border-0 transition-all duration-300 text-sm px-4 py-2">
              View All
            </Button>
          </div>
          
          <div className="space-y-3">
            {partnershipStats.map((partnership) => (
              <div key={partnership.id} className="flex items-center gap-4 p-4 bg-gray-800/50 backdrop-blur-sm rounded-xl hover:bg-gray-800/70 transition-all cursor-pointer border border-white/10">
                <div className={`w-12 h-12 bg-gradient-to-r ${partnership.gradient} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
                  <span className="text-white text-lg">{partnership.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm drop-shadow-md truncate">{partnership.brandName}</p>
                  <p className="text-orange-200 text-xs drop-shadow-sm">{partnership.location}</p>
                  <p className="text-gray-300 text-xs">{partnership.completedDate} • Saved {partnership.savings}</p>
                </div>
                <div className="w-8 h-8 bg-green-500/20 text-green-300 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-yellow-900/90 via-orange-900/80 to-red-900/90 backdrop-blur-lg rounded-3xl p-6 border border-yellow-400/30 shadow-2xl">
          <h3 className="text-white font-black text-xl mb-3 drop-shadow-lg text-center">Ready for your next partnership?</h3>
          <p className="text-orange-100 text-sm mb-6 drop-shadow-md text-center">
            Premium discoverers get first access to exclusive brand partnerships.
          </p>
          <Button 
            onClick={() => setLocation('/')}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-4 rounded-xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/40"
          >
            <Gift className="w-5 h-5 mr-2" />
            Discover New Partnerships
          </Button>
        </div>

        {/* Account Actions */}
        <div className="space-y-3">
          <Button
            onClick={handleLogout}
            className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold rounded-xl border-0 transition-all duration-300 hover:scale-105 shadow-lg py-3"
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

      </div>

      {/* Analytics Modal */}
      {showAnalytics && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-900/95 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-white font-black text-xl">Full Analytics</h2>
              </div>
              <Button
                onClick={() => setShowAnalytics(false)}
                className="w-8 h-8 rounded-full bg-gray-700/50 hover:bg-gray-600/50 border-0 p-0 flex items-center justify-center"
              >
                <span className="text-white text-lg">×</span>
              </Button>
            </div>

            {/* Analytics Content */}
            <div className="p-6 space-y-6">
              {/* Monthly Overview */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-400" />
                  This Month
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-green-400">12</div>
                    <div className="text-xs text-gray-300">Partnerships</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-yellow-400">$347</div>
                    <div className="text-xs text-gray-300">Value Saved</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-purple-400">28</div>
                    <div className="text-xs text-gray-300">Stories Shared</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-cyan-400">4.8</div>
                    <div className="text-xs text-gray-300">Avg Rating</div>
                  </div>
                </div>
              </div>

              {/* Performance Trends */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Performance Trends
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Partnership Success Rate</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div className="w-14 h-2 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full"></div>
                      </div>
                      <span className="text-green-400 font-bold text-sm">92%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Story Engagement</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div className="w-12 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      </div>
                      <span className="text-purple-400 font-bold text-sm">78%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">Brand Satisfaction</span>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-700 rounded-full">
                        <div className="w-15 h-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                      </div>
                      <span className="text-yellow-400 font-bold text-sm">96%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Category Breakdown */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-orange-400" />
                  Category Breakdown
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">🧴 Beauty & Wellness</span>
                    <span className="text-pink-400 font-bold text-sm">8 partnerships</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">☕ Food & Beverage</span>
                    <span className="text-yellow-400 font-bold text-sm">6 partnerships</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">👔 Fashion & Lifestyle</span>
                    <span className="text-blue-400 font-bold text-sm">4 partnerships</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300 text-sm">💪 Fitness & Health</span>
                    <span className="text-green-400 font-bold text-sm">3 partnerships</span>
                  </div>
                </div>
              </div>

              {/* Achievement Progress */}
              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-5 border border-white/10">
                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  Next Achievements
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Crown className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">VIP Discoverer</div>
                        <div className="text-gray-400 text-xs">Complete 25 partnerships</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-purple-400 font-bold text-sm">21/25</div>
                      <div className="w-12 h-1 bg-gray-700 rounded-full mt-1">
                        <div className="w-10 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                        <Star className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <div className="text-white font-medium text-sm">5-Star Reviewer</div>
                        <div className="text-gray-400 text-xs">Get 50 perfect ratings</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold text-sm">43/50</div>
                      <div className="w-12 h-1 bg-gray-700 rounded-full mt-1">
                        <div className="w-10 h-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for shimmer animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes shimmer {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `
      }} />

      {/* Bottom Navigation */}
      {window.self === window.top && <BottomNavigation />}
    </div>
  );
}
