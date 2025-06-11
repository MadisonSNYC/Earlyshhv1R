import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/api";
import { Campaign } from "@shared/schema";
import { CheckCircle } from "lucide-react";
import PartnershipTermsModal from "./partnership-terms-modal";
import React from 'react';

interface CampaignCardProps {
  campaign: Campaign & { claimedCount?: number; availableCount?: number };
  onCouponClaimed?: (coupon: any) => void;
}

export const CampaignCard = React.memo(function CampaignCard({ campaign, onCouponClaimed }: CampaignCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/campaigns/${campaign.id}/claim`, {
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (coupon) => {
      toast({
        title: "Partnership Secured!",
        description: "You're in! Your exclusive partnership is ready.",
      });
      setAlreadyClaimed(true);
      onCouponClaimed?.(coupon);
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('already claimed')) {
        setAlreadyClaimed(true);
        toast({
          title: "Partnership Active",
          description: "You already have access to this partnership.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Partnership Unavailable",
          description: error.message || "Please try again.",
          variant: "destructive",
        });
      }
    },
  });

  const claimedCount = campaign.claimedCount || 0;
  const maxCoupons = campaign.maxCoupons;
  const progressPercentage = (claimedCount / maxCoupons) * 100;
  const isAvailable = claimedCount < maxCoupons && !alreadyClaimed;

  const handleUnlockPartnership = () => {
    setShowTermsModal(true);
  };

  const handleAcceptTerms = () => {
    setShowTermsModal(false);
    claimMutation.mutate();
  };

  const getStatusBadge = () => {
    if (alreadyClaimed) return <Badge variant="outline" className="glass-morphism border-green-400 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Secured</Badge>;
    if (progressPercentage >= 90) return <Badge variant="secondary" className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-0">Almost Full</Badge>;
    return <Badge variant="default" className="bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 border-0 font-rubik font-600">Open</Badge>;
  };

  return (
    <Card className="campaign-card-electric mobile-touch">
      <CardContent className="p-5">
        {/* Mobile-optimized header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-12 h-12 earlyshh-gradient rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="text-2xl">{campaign.brandName[0]}</div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-rubik font-bold text-white text-base truncate">{campaign.brandName}</h3>
              <p className="text-xs text-cyan-400 font-space">
                {campaign.latitude && campaign.longitude ? "0.3 mi away" : "Digital offer"}
              </p>
            </div>
          </div>
          <div className="flex-shrink-0 ml-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Mobile-optimized content */}
        <div className="mb-4">
          <h4 className="font-rubik font-semibold text-white mb-1 text-sm leading-tight">{campaign.offerDescription}</h4>
          <p className="text-xs text-gray-300 font-space mb-2">{campaign.productName}</p>
          <p className="text-lg font-rubik font-bold earlyshh-text-gradient">Up to ${campaign.redeemableAmount}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="flex justify-between text-xs text-gray-400 mb-2 font-space">
            <span>Early Access Spots</span>
            <span>{maxCoupons - claimedCount} remaining</span>
          </div>
          <Progress value={progressPercentage} className="h-3 bg-gray-700" />
          {progressPercentage >= 75 && (
            <p className="text-xs text-orange-400 mt-1 font-space">Filling up fast! 🔥</p>
          )}
        </div>

        <Button
          onClick={handleUnlockPartnership}
          disabled={!isAvailable || claimMutation.isPending}
          className="btn-electric w-full py-3 text-base font-bold disabled:opacity-50 disabled:cursor-not-allowed mobile-touch"
        >
          {claimMutation.isPending ? (
            "Securing Access..."
          ) : alreadyClaimed ? (
            <>
              <CheckCircle className="w-5 h-5 mr-2" />
              Access Secured
            </>
          ) : !isAvailable ? (
            "Fully Booked"
          ) : (
            "Unlock Partnership"
          )}
        </Button>
      </CardContent>

      {/* Partnership Terms Modal */}
      {showTermsModal && (
        <PartnershipTermsModal
          campaign={campaign}
          onAccept={handleAcceptTerms}
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </Card>
  );
})