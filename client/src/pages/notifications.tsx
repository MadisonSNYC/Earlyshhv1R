import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Gift, 
  Trophy, 
  CheckCircle, 
  Clock, 
  Instagram, 
  Star,
  AlertCircle,
  MapPin,
  Zap,
  MoreHorizontal,
  Home,
  Eye,
  Timer,
  Sparkles
} from "lucide-react";
import BottomNavigation from "@/components/bottom-navigation";

export default function NotificationsPage() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "new_deal",
      title: "New Partnership Alert!",
      message: "SuperRoot Energy just dropped a free sample partnership near you",
      icon: "🎁",
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      priority: "normal",
      relatedId: "partnership_123"
    },
    {
      id: 2,
      type: "expiry_warning", 
      title: "Partnership Expires Soon",
      message: "Your Glow Beauty face mask partnership expires in 2 hours",
      icon: "⏰",
      createdAt: new Date(Date.now() - 10 * 60 * 1000),
      isRead: false,
      priority: "normal",
      relatedId: "partnership_456"
    },
    {
      id: 3,
      type: "achievement",
      title: "First Partnership Claimed!",
      message: "You've claimed your first early access partnership. Keep exploring!",
      icon: "🏆",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      isRead: false,
      priority: "normal",
      relatedId: "achievement_first"
    },
    {
      id: 4,
      type: "redemption_success",
      title: "Partnership Completed Successfully!",
      message: "Your SuperRoot Energy partnership was completed at Brooklyn Store",
      icon: "✅",
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      priority: "normal",
      relatedId: "partnership_123"
    },
    {
      id: 5,
      type: "story_verified",
      title: "Story Verified!",
      message: "Your Instagram story for SuperRoot Energy has been verified",
      icon: "📱",
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      priority: "normal",
      relatedId: "story_789"
    }
  ]);

  // Mock live partnerships data
  const livePartnerships = [
    {
      id: 1,
      brandName: "SuperRoot Energy",
      status: "active",
      timeLeft: "19h left",
      progress: 75,
      color: "from-green-400 to-cyan-400"
    },
    {
      id: 2,
      brandName: "Glow Beauty",
      status: "pending_story",
      timeLeft: "2h left",
      progress: 90,
      color: "from-pink-400 to-purple-400"
    },
    {
      id: 3,
      brandName: "Pure Wellness",
      status: "claimed",
      timeLeft: "Just claimed",
      progress: 100,
      color: "from-orange-400 to-pink-400"
    }
  ];

  const newNotifications = notifications.filter(n => !n.isRead);
  const earlierNotifications = notifications.filter(n => n.isRead);

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    );
  };

  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    // Navigation routing logic based on notification type
    switch (notification.type) {
      case "new_deal":
      case "expiry_warning":
        setLocation(`/partnership/${notification.relatedId}`);
        break;
      case "achievement":
        setLocation('/dashboard');
        break;
      case "redemption_success":
        setLocation('/history');
        break;
      case "story_verified":
        setLocation(`/stories/${notification.relatedId}`);
        break;
      default:
        console.log(`Unknown notification type: ${notification.type}`);
    }
  };

  const handlePartnershipClick = (partnership: any) => {
    // Live partnership routing logic
    switch (partnership.status) {
      case "active":
        setLocation(`/partnership/${partnership.id}`);
        break;
      case "pending_story":
        setLocation(`/instagram-story/${partnership.id}`);
        break;
      case "claimed":
        setLocation(`/partnerships`);
        break;
      default:
        setLocation(`/partnership/${partnership.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-700 via-pink-600 to-orange-500 relative overflow-hidden">
      {/* Enhanced background overlays for better contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-purple-600/30 to-pink-500/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/20 to-gray-900/40" />
      
      <div className="relative z-10 container mx-auto px-6 py-8 max-w-md">
        {/* Enhanced Header with compartmentalized logo section */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
          {/* Separate Earlyshh Logo Container */}
          <div className="bg-gray-800/40 backdrop-blur-sm rounded-2xl p-5 mb-6 border border-white/10">
            <div className="flex items-center justify-center space-x-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur-lg opacity-60 animate-pulse" />
                <div className="relative w-14 h-14 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-xl">
                  <Zap className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="text-2xl font-black text-white drop-shadow-lg tracking-tight mb-1">
                  <span 
                    className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent"
                  >
                    EARLYSHH
                  </span>
                </h1>
                <p className="text-orange-200 text-sm font-medium drop-shadow-sm">
                  Partnership Platform
                </p>
              </div>
            </div>
          </div>

          {/* Updates Section - Redesigned for better layout */}
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-bold text-white/95 drop-shadow-md mb-2">Partnership Updates</h2>
              <p className="text-orange-200 text-sm font-medium drop-shadow-sm">
                {newNotifications.length} new updates available
              </p>
            </div>
            
            {/* Button centered and properly sized */}
            <div className="flex justify-center">
              <Button
                onClick={markAllAsRead}
                disabled={newNotifications.length === 0}
                className="bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white border-0 font-semibold rounded-xl shadow-lg shadow-orange-400/30 transition-all duration-300 hover:scale-105 px-6 py-2.5 h-auto text-sm min-w-[140px]"
              >
                Mark all read
              </Button>
            </div>
          </div>
        </div>

        {/* Live Partnerships Status Component */}
        <div className="bg-gray-900/60 backdrop-blur-md rounded-3xl p-6 mb-6 border border-white/20 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-cyan-400 rounded-xl flex items-center justify-center">
                <Eye className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-white font-bold text-lg drop-shadow-md">Live Partnerships</h3>
            </div>
            <Badge className="bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-green-300 border border-green-400/40 rounded-xl">
              {livePartnerships.length} Active
            </Badge>
          </div>
          
          <div className="space-y-3">
            {livePartnerships.map((partnership) => (
              <div
                key={partnership.id}
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:border-white/20 transition-all duration-300 cursor-pointer group"
                onClick={() => handlePartnershipClick(partnership)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-xl flex items-center justify-center">
                      <span className="text-lg font-bold text-white">
                        {partnership.brandName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-semibold drop-shadow-sm">
                        {partnership.brandName}
                      </h4>
                      <p className="text-orange-200 text-sm capitalize">
                        {partnership.status.replace('_', ' ')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-cyan-200 text-sm">
                      <Timer className="w-3 h-3" />
                      <span>{partnership.timeLeft}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300">Progress</span>
                    <span className="text-white font-medium">{partnership.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className={`bg-gradient-to-r ${partnership.color} h-2 rounded-full transition-all duration-500 shadow-lg`}
                      style={{ width: `${partnership.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* New Updates */}
        {newNotifications.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse shadow-lg"></div>
              <h3 className="text-white font-bold text-lg drop-shadow-md">New Updates</h3>
            </div>
            
            <div className="space-y-4">
              {newNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-5 border border-white/20 hover:border-white/30 hover:bg-gray-900/80 transition-all duration-300 cursor-pointer group shadow-xl"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-orange-400/20 to-pink-400/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl border border-white/10 group-hover:border-white/20 transition-all duration-300">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white font-bold text-lg mb-2 drop-shadow-md">
                            {notification.title}
                          </h4>
                          <p className="text-orange-100 text-sm leading-relaxed drop-shadow-sm">
                            {notification.message}
                          </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-cyan-200 text-xs font-medium drop-shadow-sm">
                            {getTimeAgo(notification.createdAt)}
                          </span>
                          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full shadow-lg animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Earlier Updates */}
        {earlierNotifications.length > 0 && (
          <div className="mb-8">
            <h3 className="text-white/80 font-bold text-lg mb-4 drop-shadow-md">Earlier</h3>
            
            <div className="space-y-4">
              {earlierNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className="bg-gray-900/50 backdrop-blur-md rounded-3xl p-5 border border-white/10 hover:border-white/15 transition-all duration-300 cursor-pointer shadow-lg"
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-14 h-14 bg-gray-800/60 backdrop-blur-sm rounded-2xl flex items-center justify-center text-2xl opacity-80 border border-white/5">
                      {notification.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-white/90 font-bold text-lg mb-2 drop-shadow-md">
                            {notification.title}
                          </h4>
                          <p className="text-white/70 text-sm leading-relaxed drop-shadow-sm">
                            {notification.message}
                          </p>
                        </div>
                        <span className="text-white/50 text-xs font-medium drop-shadow-sm">
                          {getTimeAgo(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {notifications.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gray-900/60 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
              <Bell className="w-10 h-10 text-white/60" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 drop-shadow-lg">No updates yet</h3>
            <p className="text-white/80 drop-shadow-md">
              You'll see updates about new partnerships, achievements, and more here.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}