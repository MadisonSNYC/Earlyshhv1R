import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Instagram, MapPin } from "lucide-react";
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
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-[95vw] max-h-[90vh] p-0 bg-gray-900/95 backdrop-blur-xl border-gray-700/30 flex flex-col overflow-hidden rounded-3xl">
        <DialogTitle className="sr-only">Partnership Terms and Conditions</DialogTitle>
        <div className="sr-only">
          Review partnership terms, benefits, and requirements for {campaign.brandName}
        </div>
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-800/80 backdrop-blur-sm flex items-center justify-center text-gray-400 hover:text-white transition-colors"
        >
          ✕
        </button>
        
        {/* Header */}
        <div className="relative p-6 pb-4 flex-shrink-0">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={campaign.brandLogoUrl}
              alt={campaign.brandName}
              className="w-16 h-16 rounded-2xl shadow-lg object-cover"
            />
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white mb-1">
                {campaign.brandName} Partnership
              </h2>
              <p className="text-gray-300 text-sm mb-2">{campaign.offerDescription}</p>
              <div className="flex items-center space-x-2 text-purple-400 text-sm">
                <Instagram className="w-4 h-4" />
                <span>{campaign.brandIgHandle}</span>
              </div>
            </div>
          </div>
          
          {/* Limited Access Badge */}
          <div className="mb-4">
            <Badge className="bg-gradient-to-r from-pink-500 to-yellow-500 text-black font-medium px-3 py-1 rounded-full">
              Limited Access • {slotsRemaining} slots remaining
            </Badge>
          </div>
          
          {/* Location */}
          <div className="bg-gray-800/50 rounded-2xl p-4 mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-white font-medium">Downtown District</h3>
                <p className="text-gray-400 text-sm">{distance}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Partnership Benefits */}
        <div className="flex-1 overflow-y-auto px-6">
          <div className="flex items-center space-x-2 mb-4">
            <Check className="w-5 h-5 text-green-400" />
            <h3 className="text-white font-bold text-lg">Partnership Benefits</h3>
          </div>
          
          <div className="space-y-3 mb-6">
            {/* Primary Benefit */}
            <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <div>
                  <p className="text-white font-medium">Free {campaign.productName}</p>
                </div>
              </div>
              <div className="bg-green-500/20 px-3 py-1 rounded-full">
                <span className="text-green-400 font-medium text-sm">${campaign.redeemableAmount} value</span>
              </div>
            </div>
            
            {/* Secondary Benefits */}
            <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
              <p className="text-white font-medium">Early access to future {campaign.brandName} deals</p>
            </div>
            
            <div className="bg-gray-800/50 rounded-2xl p-4 flex items-center space-x-3">
              <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
              <p className="text-white font-medium">VIP community status & exclusive perks</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 flex-shrink-0 space-y-3">
          <Button
            onClick={handleAcceptPartnership}
            className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 rounded-2xl text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            Unlock Partnership 🎯
          </Button>
          <Button
            onClick={handleViewBrandProfile}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 py-3 rounded-2xl"
          >
            View Brand Profile
          </Button>
          <p className="text-gray-400 text-center text-sm mt-3">
            Partnership valid up to ${campaign.redeemableAmount}. One per community member.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}