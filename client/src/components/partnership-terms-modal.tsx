import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Instagram, AlertCircle, MapPin, Clock, Users, Navigation } from "lucide-react";
import { Campaign } from "@shared/schema";
import { useLocation } from "wouter";

interface PartnershipTermsModalProps {
  campaign: Campaign & { claimedCount?: number };
  onAccept: () => void;
  onClose: () => void;
  onViewOnMap?: () => void;
}

export default function PartnershipTermsModal({ campaign, onAccept, onClose, onViewOnMap }: PartnershipTermsModalProps) {
  const [location, navigate] = useLocation();
  // Calculate approximate distance (using mock data for now)
  const distance = "0.3 miles away";

  const handleViewOnMap = () => {
    if (onViewOnMap) {
      onViewOnMap();
      onClose(); // Close modal when viewing on map
    }
  };

  const handleAcceptPartnership = () => {
    // Execute the original onAccept callback
    onAccept();
    
    // Navigate to partnership confirmation page with campaign data
    const campaignData = encodeURIComponent(JSON.stringify(campaign));
    navigate(`/partnership-confirmation?campaign=${campaignData}`);
  };
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 glass-morphism border-white/20 overflow-hidden max-h-[90vh] flex flex-col">
        <DialogTitle className="sr-only">Partnership Terms and Conditions</DialogTitle>
        
        {/* Fixed Header */}
        <div className="relative p-6 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={campaign.brandLogoUrl}
              alt={campaign.brandName}
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
            <div>
              <h2 className="text-xl font-rubik font-bold text-white mb-1">
                {campaign.brandName} Partnership
              </h2>
              <p className="text-gray-300 text-sm font-space mb-2">
                {campaign.offerDescription}
              </p>
              <a
                href={`https://instagram.com/${campaign.brandIgHandle || campaign.brandName.toLowerCase().replace(/\s+/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-xs text-pink-400 hover:text-pink-300 font-space transition-colors"
              >
                <Instagram className="w-3 h-3 mr-1" />
                @{campaign.brandIgHandle || campaign.brandName.toLowerCase().replace(/\s+/g, '')}
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Badge className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-0 font-rubik font-600">
              Limited Access • {campaign.maxCoupons - (campaign.claimedCount || 0)} slots remaining
            </Badge>
          </div>

          {/* Location Section */}
          <div className="mt-4 glass-morphism rounded-xl p-4 border border-white/10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-rubik font-semibold text-sm">{campaign.location || "Downtown District"}</p>
                  <p className="text-gray-400 font-space text-xs">{distance}</p>
                </div>
              </div>
              {onViewOnMap && (
                <Button
                  onClick={handleViewOnMap}
                  variant="outline"
                  size="sm"
                  className="border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10 hover:text-cyan-300 font-rubik font-medium"
                >
                  <Navigation className="w-4 h-4 mr-1" />
                  View on Map
                </Button>
              )}
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto mobile-scroll">
          {/* Featured Partnership Card */}
          <div className="p-6 pt-4">
            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 rounded-2xl p-6 border border-yellow-400/30 backdrop-blur-sm">
              <h3 className="text-2xl font-rubik font-bold text-yellow-400 mb-2">
                First-Access Partnership
              </h3>
              <p className="text-white font-space text-sm">
                First Access • {campaign.maxCoupons - (campaign.claimedCount || 0)} partner slots remaining
              </p>
            </div>
          </div>

          {/* Key Requirements Cards */}
          <div className="px-6 space-y-4">
            {/* Location Card */}
            <div className="glass-morphism rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-rubik font-bold text-base">
                    {campaign.location || "Downtown District"}
                  </h4>
                  <p className="text-gray-400 font-space text-sm">{distance}</p>
                </div>
                {onViewOnMap && (
                  <Button
                    onClick={handleViewOnMap}
                    variant="outline"
                    size="sm"
                    className="border-orange-400/30 text-orange-400 hover:bg-orange-400/10 hover:text-orange-300 font-rubik font-medium"
                  >
                    View
                  </Button>
                )}
              </div>
            </div>

            {/* Expiration Card */}
            <div className="glass-morphism rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-rubik font-bold text-base">
                    Partnership expires {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </h4>
                  <p className="text-gray-400 font-space text-sm">Access valid before expiration</p>
                </div>
              </div>
            </div>

            {/* Story Requirement Card */}
            <div className="glass-morphism rounded-2xl p-4 border border-white/10">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <Instagram className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-rubik font-bold text-base">
                    Story sharing required
                  </h4>
                  <p className="text-gray-400 font-space text-sm">
                    Tag @{campaign.brandIgHandle || campaign.brandName.toLowerCase().replace(/\s+/g, '')} + @earlyshh
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Benefits Summary */}
        <div className="p-6 pt-4">
          <h3 className="text-lg font-rubik font-bold text-white mb-4 flex items-center">
            <Check className="w-5 h-5 mr-2 text-green-400" />
            Partnership Benefits
          </h3>
          <div className="space-y-4">
            <div className="glass-morphism rounded-lg p-3 border border-green-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full flex-shrink-0"></div>
                <span className="text-white font-rubik font-medium text-sm">
                  Free {campaign.productName}
                </span>
                <Badge variant="outline" className="text-xs border-green-400/30 text-green-300 ml-auto">
                  ${campaign.redeemableAmount} value
                </Badge>
              </div>
            </div>
            <div className="glass-morphism rounded-lg p-3 border border-purple-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-purple-400 rounded-full flex-shrink-0"></div>
                <span className="text-white font-rubik font-medium text-sm">
                  Early access to future {campaign.brandName} deals
                </span>
              </div>
            </div>
            <div className="glass-morphism rounded-lg p-3 border border-pink-400/20">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-pink-400 rounded-full flex-shrink-0"></div>
                <span className="text-white font-rubik font-medium text-sm">
                  VIP community status & exclusive perks
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-4 flex-shrink-0 space-y-3">
          <Button 
            onClick={onAccept}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-rubik font-bold py-4 h-16 text-xl shadow-2xl rounded-2xl border-0 transform transition-all hover:scale-[1.02]"
          >
            Unlock Partnership 🎯
          </Button>
          <p className="text-center text-xs text-gray-400 font-space px-4">
            Partnership valid up to ${campaign.redeemableAmount}. One per community member.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}