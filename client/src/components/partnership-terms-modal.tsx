import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check, Instagram, AlertCircle, MapPin, Clock, Users } from "lucide-react";
import { Campaign } from "@shared/schema";

interface PartnershipTermsModalProps {
  campaign: Campaign & { claimedCount?: number };
  onAccept: () => void;
  onClose: () => void;
}

export default function PartnershipTermsModal({ campaign, onAccept, onClose }: PartnershipTermsModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full p-0 glass-morphism border-white/20 overflow-hidden">
        <DialogTitle className="sr-only">Partnership Terms and Conditions</DialogTitle>
        
        {/* Header */}
        <div className="relative p-6 pb-4">
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
              <p className="text-gray-300 text-sm font-space">
                {campaign.offerDescription}
              </p>
            </div>
          </div>

          <Badge className="bg-gradient-to-r from-pink-500 to-yellow-400 text-white border-0 font-rubik font-600">
            Limited Access • {campaign.maxCoupons - (campaign.claimedCount || 0)} slots remaining
          </Badge>
        </div>

        <Separator className="bg-white/10" />

        {/* Partnership Requirements */}
        <div className="p-6 py-4">
          <h3 className="text-lg font-rubik font-bold text-white mb-4 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 text-yellow-400" />
            Partnership Requirements
          </h3>

          <div className="space-y-4">
            {/* Instagram Story Requirement */}
            <div className="electric-border glass-morphism rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Instagram className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-rubik font-semibold text-white mb-1">
                    Instagram Story Required
                  </h4>
                  <p className="text-sm text-gray-300 font-space mb-2">
                    Tag <span className="earlyshh-text-gradient font-semibold">@{campaign.brandName}</span> and <span className="earlyshh-text-gradient font-semibold">@Earlyshh</span> in your Instagram Story within 24 hours of redemption.
                  </p>
                  <Badge variant="outline" className="text-xs border-pink-500/30 text-pink-300">
                    Stories only • No feed posts required
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location & Time Restrictions */}
            <div className="grid grid-cols-2 gap-3">
              <div className="glass-morphism rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-rubik font-semibold text-white">Location</span>
                </div>
                <p className="text-xs text-gray-300 font-space">
                  {campaign.location || "Brooklyn area only"}
                </p>
              </div>

              <div className="glass-morphism rounded-xl p-3">
                <div className="flex items-center space-x-2 mb-1">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span className="text-sm font-rubik font-semibold text-white">Valid Until</span>
                </div>
                <p className="text-xs text-gray-300 font-space">
                  {new Date(campaign.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Community Guidelines */}
            <div className="glass-morphism rounded-xl p-4">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-rubik font-semibold text-white mb-1">
                    Community Partnership
                  </h4>
                  <p className="text-sm text-gray-300 font-space">
                    Share authentic experiences. Help others discover your neighborhood's next big find.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Benefits Summary */}
        <div className="p-6 py-4">
          <h3 className="text-lg font-rubik font-bold text-white mb-3">
            What You Get
          </h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300 font-space">
                Free {campaign.productName} (up to ${campaign.redeemableAmount})
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300 font-space">
                Early access to future {campaign.brandName} partnerships
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <Check className="w-4 h-4 text-green-400" />
              <span className="text-sm text-gray-300 font-space">
                VIP status in Earlyshh community
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 pt-0 space-y-3">
          <Button 
            onClick={onAccept}
            className="w-full earlyshh-gradient hover:opacity-90 font-rubik font-600 py-3"
          >
            Accept Partnership Terms
          </Button>
          <Button 
            onClick={onClose}
            variant="outline" 
            className="w-full border-white/20 text-gray-300 hover:text-white hover:bg-white/10 font-rubik font-600"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}