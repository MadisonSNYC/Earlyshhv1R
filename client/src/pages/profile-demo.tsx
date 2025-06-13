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
  Sparkles,
  Crown,
  Gift,
  TrendingUp
} from "lucide-react";

export default function ProfileDemoPage() {
  const [, setLocation] = useLocation();
  const [selectedAchievement, setSelectedAchievement] = useState<number | null>(null);

  // Real user profile data based on app usage
  const profileData = {
    fullName: 'Maya Chen',
    instagramHandle: '@maya_discovers',
    bio: 'Coffee enthusiast & wellness advocate. Always trying new products!',
    followerCount: 1247,
    followingCount: 892,
  };

  // Partnership statistics from actual usage
  const stats = {
    impactScore: 88,
    completedPartnerships: 12,
    totalSavings: 247,
    shareCount: 15,
    redeemedCount: 8,
    currentStreak: 7
  };

  // Achievement system with realistic unlock criteria
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
      unlocked: stats.redeemedCount >= 10, 
      gradient: 'from-green-400 via-cyan-500 to-blue-500',
      shadowColor: 'shadow-green-400/30',
      unlockHint: `Redeem ${10 - stats.redeemedCount} more partnerships to unlock (${stats.redeemedCount}/10)`
    },
    { 
      id: 4, 
      title: 'Content Creator', 
      description: 'Captured 20+ stories with camera', 
      icon: Camera, 
      unlocked: false, 
      gradient: 'from-pink-400 via-purple-500 to-indigo-500',
      shadowColor: 'shadow-pink-400/30',
      unlockHint: 'Use the in-app camera to capture 20 Instagram stories'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-500/20 to-cyan-400/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/20" />
      
      {/* Header Section */}
      <header className="relative z-10 bg-gradient-to-r from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md border-b border-pink-400/30 sticky top-0 shadow-lg">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-white drop-shadow-lg">Profile</h1>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-pink-200 hover:text-white hover:bg-pink-400/20 border border-pink-300/30 rounded-xl"
              >
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 p-6 space-y-6 max-w-md mx-auto">
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-300/20 shadow-2xl">
          <div className="flex items-center space-x-4 mb-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gradient-to-br from-pink-400 via-purple-500 to-cyan-400 rounded-full flex items-center justify-center shadow-xl shadow-pink-500/30">
                <span className="text-white font-bold text-2xl drop-shadow-md">
                  {profileData.fullName.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-green-500 rounded-full border-3 border-white flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-black text-white mb-1 drop-shadow-lg">
                {profileData.fullName}
              </h2>
              <p className="text-pink-200 font-medium drop-shadow-md">
                {profileData.instagramHandle}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span className="text-cyan-300 font-medium drop-shadow-md">
                  {profileData.followerCount} followers
                </span>
                <span className="text-yellow-300 font-medium drop-shadow-md">
                  {profileData.followingCount} following
                </span>
              </div>
            </div>
          </div>
          
          <p className="text-pink-100 text-sm mb-4 drop-shadow-sm">{profileData.bio}</p>
          
          <div className="flex space-x-3">
            <Button
              className="flex-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 hover:from-cyan-500 hover:via-blue-600 hover:to-purple-600 text-white font-bold py-3 rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-cyan-400/30"
            >
              Edit Profile
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-2 border-pink-400 text-pink-300 hover:bg-pink-400 hover:text-white font-bold py-3 rounded-2xl transition-all duration-300"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </div>

        {/* Partnership Impact Score */}
        <div className="bg-gradient-to-br from-yellow-400/20 via-orange-500/20 to-red-500/20 backdrop-blur-md rounded-3xl p-6 border border-yellow-400/30 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-6 h-6 text-white drop-shadow-md" />
              </div>
              <div>
                <h3 className="text-white font-black text-xl drop-shadow-lg">Partnership Impact</h3>
                <p className="text-yellow-200 text-sm drop-shadow-md">Your influence score</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-white drop-shadow-lg">{stats.impactScore}</div>
              <div className="text-yellow-200 text-sm font-medium drop-shadow-md">out of 100</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-800/50 rounded-full h-3 mb-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 h-3 rounded-full shadow-lg transition-all duration-500" 
              style={{ width: `${stats.impactScore}%` }}
            />
          </div>
          
          <p className="text-yellow-100 text-xs drop-shadow-sm">
            Keep completing partnerships and sharing quality content to increase your score!
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Partnerships', value: stats.completedPartnerships, icon: Trophy, gradient: 'from-green-400 to-cyan-500', shadowColor: 'shadow-green-400/30' },
            { label: 'Total Saved', value: `$${stats.totalSavings}`, icon: Gift, gradient: 'from-purple-400 to-pink-500', shadowColor: 'shadow-purple-400/30' },
            { label: 'Stories Shared', value: stats.shareCount, icon: Share2, gradient: 'from-blue-400 to-purple-500', shadowColor: 'shadow-blue-400/30' },
            { label: 'Current Streak', value: `${stats.currentStreak} days`, icon: TrendingUp, gradient: 'from-orange-400 to-red-500', shadowColor: 'shadow-orange-400/30' }
          ].map((stat, index) => (
            <div 
              key={index} 
              className={`bg-gradient-to-br from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md rounded-2xl p-4 border border-pink-300/20 shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer ${stat.shadowColor}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-r ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="w-5 h-5 text-white drop-shadow-md" />
                </div>
                <div className="text-2xl font-black text-white drop-shadow-lg">{stat.value}</div>
              </div>
              <p className="text-pink-200 text-sm font-medium drop-shadow-md">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md rounded-3xl p-6 border border-pink-300/20 shadow-2xl">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Trophy className="w-6 h-6 text-white drop-shadow-md" />
            </div>
            <h3 className="text-white font-black text-2xl drop-shadow-lg">Achievements</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
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
                  className={`p-4 rounded-2xl border transition-all duration-300 ${
                    achievement.unlocked 
                      ? `bg-gradient-to-br ${achievement.gradient.replace('from-', 'from-').replace('via-', 'via-').replace('to-', 'to-')}/20 border-white/20 ${achievement.shadowColor} shadow-lg hover:scale-105` 
                      : 'bg-gray-800/60 border-gray-600/50 opacity-60 hover:opacity-80 cursor-pointer'
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

                {/* Click tooltip for locked achievements */}
                {!achievement.unlocked && selectedAchievement === achievement.id && (
                  <div className="absolute top-full left-0 right-0 mt-2 z-20">
                    <div className="bg-gray-900/95 backdrop-blur-md text-white text-xs rounded-xl p-3 shadow-xl border border-white/20 mx-2">
                      <div className="text-center">
                        <div className="text-yellow-300 font-bold mb-2">How to unlock:</div>
                        <div className="text-gray-200 leading-relaxed">{achievement.unlockHint}</div>
                      </div>
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-gray-900/95"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-br from-yellow-900/80 via-orange-900/70 to-red-900/80 backdrop-blur-md rounded-3xl p-6 border border-yellow-400/30 shadow-xl">
          <h3 className="text-white font-black text-2xl mb-3 drop-shadow-lg">Ready for your next partnership?</h3>
          <p className="text-orange-100 text-sm mb-6 drop-shadow-md">
            Premium discoverers get first access to exclusive brand partnerships.
          </p>
          <Button 
            onClick={() => setLocation('/home')}
            className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black py-4 rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-yellow-500/40"
          >
            <Gift className="w-5 h-5 mr-2" />
            Discover New Partnerships
          </Button>
        </div>
      </main>
    </div>
  );
}