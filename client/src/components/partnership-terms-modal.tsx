import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Instagram, MapPin, X, Sparkles, Crown, Gift } from "lucide-react";
import { Campaign } from "@shared/schema";
import { useLocation } from "wouter";

interface PartnershipTermsModalProps {
  campaign: Campaign & { claimedCount?: number };
  onAccept: () => void;
  onClose: () => void;
  onViewOnMap?: () => void;
}

export default function PartnershipTermsModal({ 
  campaign, 
  onAccept, 
  onClose, 
  onViewOnMap 
}: PartnershipTermsModalProps) {
  const [location, navigate] = useLocation();
  const distance = "0.3 miles away";
  const slotsRemaining = campaign.maxCoupons - (campaign.claimedCount || 0);

  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap();
      onClose();
    }
  };

  const handleAcceptPartnership = () => {
    onAccept();
    const campaignData = encodeURIComponent(JSON.stringify(campaign));
    navigate(`/partnership-confirmation?campaign=${campaignData}`);
  };

  const handleViewBrandProfile = () => {
    navigate(`/brand/${campaign.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm iphone-container">
      <div className="relative modal-812 bg-gradient-to-br from-indigo-600 via-purple-700 via-pink-600 to-orange-500 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Enhanced background overlays */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/40 via-purple-600/30 to-pink-500/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/40 to-gray-900/60" />
        
        {/* Close Button - iPhone touch optimized */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-gray-900/80 backdrop-blur-md flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-800/90 transition-all duration-300 border border-white/10 shadow-lg"
        >
          <X className="w-5 h-5" />
        </button>
        
        {/* Scrollable Content Container */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden modal-scroll">
          <div className="p-6 space-y-6 pt-16">
            {/* Header Section */}
            <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-purple-400/30 rounded-2xl blur-lg" />
                  <img
                    src={campaign.brandLogoUrl}
                    alt={campaign.brandName}
                    className="relative w-16 h-16 rounded-2xl shadow-xl object-cover border border-white/20"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23374151" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                    }}
                  />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
                    {campaign.brandName} Partnership
                  </h2>
                  <p className="text-orange-200 text-sm mb-3 drop-shadow-md font-medium">
                    {campaign.offerDescription}
                  </p>
                  <div className="flex items-center space-x-2 text-purple-300 text-sm">
                    <Instagram className="w-4 h-4" />
                    <span className="font-medium">{campaign.brandIgHandle}</span>
                  </div>
                </div>
              </div>
              
              {/* Limited Access Badge */}
              <div className="mb-4">
                <Badge className="bg-gradient-to-r from-pink-400 via-orange-500 to-yellow-400 text-white font-bold px-4 py-2 rounded-full shadow-lg shadow-pink-400/30">
                  <Crown className="w-4 h-4 mr-1" />
                  Limited Access • {slotsRemaining} slots remaining
                </Badge>
              </div>
              
              {/* Location */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-4 border border-cyan-400/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400/20 to-blue-500/20 rounded-full flex items-center justify-center border border-cyan-400/30">
                    <MapPin className="w-6 h-6 text-cyan-300" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold drop-shadow-md">Downtown District</h3>
                    <p className="text-cyan-200 text-sm drop-shadow-sm font-medium">{distance}</p>
                  </div>
                  {onViewOnMap && (
                    <Button
                      onClick={handleViewOnMap}
                      className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white font-bold rounded-xl transition-all duration-300 hover:scale-105"
                      size="sm"
                    >
                      View Map
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Partnership Details */}
            <div className="bg-gray-900/70 backdrop-blur-md rounded-3xl p-6 border border-white/20 shadow-xl">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white font-black text-xl drop-shadow-lg">Partnership Details</h3>
              </div>
              
              <div className="space-y-5">
                {/* What You Get */}
                <div>
                  <h4 className="text-green-300 font-bold text-sm mb-3 drop-shadow-md">What You Get</h4>
                  <div className="bg-gradient-to-r from-green-900/60 to-cyan-900/60 backdrop-blur-sm rounded-2xl p-4 flex items-center justify-between border border-green-400/20 shadow-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full shadow-lg"></div>
                      <div>
                        <p className="text-white font-bold drop-shadow-md">Free {campaign.productName}</p>
                        <p className="text-green-200 text-xs drop-shadow-sm">Premium quality + creator recognition</p>
                      </div>
                    </div>
                    <div className="bg-gradient-to-r from-green-400/20 to-cyan-400/20 px-3 py-1.5 rounded-full border border-green-400/30">
                      <span className="text-green-300 font-bold drop-shadow-md">${campaign.redeemableAmount}</span>
                      <span className="text-green-200 text-xs ml-1">value</span>
                    </div>
                  </div>
                </div>

                {/* What You Do */}
                <div>
                  <h4 className="text-orange-300 font-bold text-sm mb-3 drop-shadow-md">What You Do</h4>
                  <div className="space-y-3">
                    {/* Location Requirement */}
                    <div className="bg-red-900/40 backdrop-blur-sm rounded-xl p-3 border border-red-400/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-red-400 to-orange-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium text-sm drop-shadow-sm">Be within 500 feet of store location</p>
                        </div>
                      </div>
                    </div>

                    {/* Time Limit */}
                    <div className="bg-orange-900/40 backdrop-blur-sm rounded-xl p-3 border border-orange-400/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium text-sm drop-shadow-sm">Complete within 1 hour of unlocking</p>
                        </div>
                      </div>
                    </div>

                    {/* Instagram Story Requirement */}
                    <div className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-3 border border-purple-400/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium text-sm drop-shadow-sm">Share Instagram Story with {campaign.brandIgHandle} and @Earlyshh</p>
                        </div>
                      </div>
                    </div>

                    {/* Feedback Requirement */}
                    <div className="bg-pink-900/40 backdrop-blur-sm rounded-xl p-3 border border-pink-400/30">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-gradient-to-r from-pink-400 to-red-400 rounded-full mt-1.5 flex-shrink-0"></div>
                        <div>
                          <p className="text-white font-medium text-sm drop-shadow-sm">Complete feedback survey within 24 hours</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons - Enhanced visual hierarchy */}
            <div className="space-y-4">
              {/* Primary Action */}
              <Button
                onClick={handleAcceptPartnership}
                className="touch-button w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-white font-black text-812-base py-4 rounded-2xl shadow-xl shadow-yellow-500/40 transform hover:scale-105 transition-all duration-300"
              >
                <MapPin className="w-5 h-5 mr-3" />
                Verify Location & Unlock
                <Sparkles className="w-5 h-5 ml-3" />
              </Button>
              
              {/* Secondary Action */}
              <Button
                onClick={handleViewBrandProfile}
                className="touch-button w-full bg-transparent border border-purple-400/50 text-purple-200 hover:bg-purple-400/10 hover:text-purple-100 hover:border-purple-400/70 font-medium text-812-sm py-3 rounded-2xl transition-all duration-300"
              >
                View Brand Profile
              </Button>
              
              {/* Terms Notice - Improved spacing and typography */}
              <div className="bg-gray-800/60 backdrop-blur-sm rounded-2xl p-5 border border-white/10 mt-6">
                <p className="text-orange-200 text-center text-812-xs leading-relaxed drop-shadow-sm font-light">
                  Partnership valid up to <span className="font-semibold text-yellow-300">${campaign.redeemableAmount}</span>. 
                  Must be within 500ft of store location. Instagram story & feedback required.
                  One per community member. No purchase required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}