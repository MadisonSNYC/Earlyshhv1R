import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Filter, List, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to load campaigns</h2>
          <p className="text-gray-600">Please check your connection and try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center">
            <i className="fas fa-ticket-alt text-white text-lg"></i>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Earlyshh</h1>
            <p className="text-xs text-gray-500">Brooklyn, NY</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </Button>

          <img
            src={user?.profilePicUrl || "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"}
            alt="Profile"
            className="w-10 h-10 rounded-full border-2 border-primary"
          />
        </div>
      </header>

      {/* View Toggle */}
      <div className="bg-white px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="bg-gray-100 rounded-xl p-1 flex">
            <Button
              size="sm"
              variant={currentView === "list" ? "default" : "ghost"}
              onClick={() => setCurrentView("list")}
              className="px-4 py-2 text-sm font-medium rounded-lg"
            >
              <List className="w-4 h-4 mr-2" />
              List
            </Button>
            <Button
              size="sm"
              variant={currentView === "map" ? "default" : "ghost"}
              onClick={() => setCurrentView("map")}
              className="px-4 py-2 text-sm font-medium rounded-lg"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Map
            </Button>
          </div>

          <Button variant="ghost" size="sm">
            <Filter className="h-5 w-5" />
          </Button>
        </div>

        {/* Filter Pills */}
        <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
          <Badge
            variant={selectedFilter === "all" ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedFilter("all")}
          >
            All Offers
          </Badge>
          <Badge
            variant={selectedFilter === "food" ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedFilter("food")}
          >
            Food & Drink
          </Badge>
          <Badge
            variant={selectedFilter === "premium" ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedFilter("premium")}
          >
            Premium
          </Badge>
          <Badge
            variant={selectedFilter === "nightlife" ? "default" : "secondary"}
            className="cursor-pointer whitespace-nowrap"
            onClick={() => setSelectedFilter("nightlife")}
          >
            Nightlife
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {currentView === "list" ? (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {filteredCampaigns.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No campaigns available for the selected filter.</p>
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
          <MapView campaigns={filteredCampaigns} onCouponClaimed={handleCouponClaimed} />
        )}
      </div>

      {/* Bottom Navigation */}
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
