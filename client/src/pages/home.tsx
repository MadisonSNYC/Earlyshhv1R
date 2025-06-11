import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Filter, List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { useLocation } from "wouter";
import CampaignCard from "@/components/campaign-card";
import MapView from "@/components/map-view";
import BottomNavigation from "@/components/bottom-navigation";
import CouponModal from "@/components/coupon-modal";
import StoryPromptModal from "@/components/story-prompt-modal";
import { Campaign } from "@shared/schema";

type ViewType = "list" | "map";
type FilterType = "all" | "food" | "premium" | "nightlife";

export default function HomePage() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [currentView, setCurrentView] = useState<ViewType>("list");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [showStoryPrompt, setShowStoryPrompt] = useState(false);

  const { data: campaigns = [], isLoading, error } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const filteredCampaigns = campaigns.filter(campaign => {
    if (selectedFilter === "all") return true;
    return campaign.category === selectedFilter;
  });

  const handleCouponClaimed = (coupon: any) => {
    setSelectedCoupon(coupon);
  };

  const handleCouponRedeemed = () => {
    setSelectedCoupon(null);
    setShowStoryPrompt(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center p-4">
        <div className="text-center glass-morphism p-8 rounded-2xl">
          <h2 className="text-lg font-rubik font-semibold text-white mb-2">Failed to load campaigns</h2>
          <p className="text-gray-400 font-space">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex flex-col mobile-safe-area">
      {/* Mobile Top Navigation */}
      <header className="glass-morphism border-b border-white/10 px-4 py-4 flex items-center justify-between mobile-touch">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 earlyshh-gradient rounded-2xl flex items-center justify-center shadow-lg">
            <div className="w-5 h-5 bg-white rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-gradient-to-br from-pink-500 to-cyan-400 rounded-sm"></div>
            </div>
          </div>
          <div>
            <h1 className="earlyshh-text-gradient text-lg font-rubik font-800">EARLYSHH</h1>
            <p className="text-xs text-gray-400 font-space">Your neighborhood partnership awaits</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/notifications")}
            className="relative hover:bg-white/10 rounded-xl p-2 mobile-touch"
          >
            <Bell className="h-5 w-5 text-white" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-gradient-to-r from-pink-500 to-orange-400 rounded-full"></span>
          </Button>

          <img
            src={user?.profilePicUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"}
            alt="Profile"
            className="w-8 h-8 rounded-full border-2 border-pink-500 shadow-lg"
          />
        </div>
      </header>

      {/* Mobile View Toggle */}
      <div className="glass-morphism px-4 py-3 border-b border-white/10">
        <div className="flex items-center justify-between mb-3">
          <div className="glass-morphism rounded-2xl p-1 flex">
            <Button
              size="sm"
              variant={currentView === "list" ? "default" : "ghost"}
              onClick={() => setCurrentView("list")}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all mobile-touch ${
                currentView === "list" 
                  ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <List className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              size="sm"
              variant={currentView === "map" ? "default" : "ghost"}
              onClick={() => setCurrentView("map")}
              className={`px-3 py-2 text-sm font-medium rounded-xl transition-all mobile-touch ${
                currentView === "map" 
                  ? "bg-gradient-to-r from-pink-500 to-cyan-400 text-white shadow-lg" 
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <MapPin className="w-4 h-4 mr-1" />
              Map
            </Button>
          </div>

          <Button variant="ghost" size="sm" className="hover:bg-white/10 rounded-xl p-2 mobile-touch">
            <Filter className="h-5 w-5 text-white" />
          </Button>
        </div>

        {/* Mobile Filter Pills */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mobile-scroll">
          <Badge
            variant={selectedFilter === "all" ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap transition-all font-rubik font-600 px-4 py-2 rounded-xl ${
              selectedFilter === "all" 
                ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg border-0" 
                : "glass-morphism text-gray-300 hover:text-white border-white/20"
            }`}
            onClick={() => setSelectedFilter("all")}
          >
            All Partnerships
          </Badge>
          <Badge
            variant={selectedFilter === "food" ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap transition-all font-rubik font-600 px-4 py-2 rounded-xl ${
              selectedFilter === "food" 
                ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg border-0" 
                : "glass-morphism text-gray-300 hover:text-white border-white/20"
            }`}
            onClick={() => setSelectedFilter("food")}
          >
            Food & Drink
          </Badge>
          <Badge
            variant={selectedFilter === "premium" ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap transition-all font-rubik font-600 px-4 py-2 rounded-xl ${
              selectedFilter === "premium" 
                ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg border-0" 
                : "glass-morphism text-gray-300 hover:text-white border-white/20"
            }`}
            onClick={() => setSelectedFilter("premium")}
          >
            Premium
          </Badge>
          <Badge
            variant={selectedFilter === "nightlife" ? "default" : "secondary"}
            className={`cursor-pointer whitespace-nowrap transition-all font-rubik font-600 px-4 py-2 rounded-xl ${
              selectedFilter === "nightlife" 
                ? "bg-gradient-to-r from-pink-500 to-yellow-400 text-white shadow-lg border-0" 
                : "glass-morphism text-gray-300 hover:text-white border-white/20"
            }`}
            onClick={() => setSelectedFilter("nightlife")}
          >
            Nightlife
          </Badge>
        </div>
      </div>

      {/* Mobile Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === "list" ? (
          <div className="flex-1 overflow-y-auto px-4 pt-4 pb-20 space-y-4 mobile-scroll">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <p className="text-gray-400 font-space text-lg">No early access available</p>
                <p className="text-gray-500 font-space text-sm mt-2">Try a different filter</p>
              </div>
            ) : (
              filteredCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onCouponClaimed={handleCouponClaimed}
                />
              ))
            )}
          </div>
        ) : (
          <div className="flex-1">
            <MapView campaigns={filteredCampaigns} onCouponClaimed={handleCouponClaimed} />
          </div>
        )}
      </div>

      <BottomNavigation />

      {/* Modals */}
      {selectedCoupon && (
        <CouponModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onRedeemed={handleCouponRedeemed}
        />
      )}

      {showStoryPrompt && (
        <StoryPromptModal onClose={() => setShowStoryPrompt(false)} />
      )}
    </div>
  );
}
