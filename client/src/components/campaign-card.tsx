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

interface CampaignCardProps {
  campaign: Campaign & { claimedCount?: number; availableCount?: number };
  onCouponClaimed?: (coupon: any) => void;
}

export default function CampaignCard({ campaign, onCouponClaimed }: CampaignCardProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [alreadyClaimed, setAlreadyClaimed] = useState(false);

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', `/api/campaigns/${campaign.id}/claim`, {
        userId: user?.id,
      });
      return response.json();
    },
    onSuccess: (coupon) => {
      toast({
        title: "Coupon Claimed!",
        description: "Your coupon is ready to use.",
      });
      setAlreadyClaimed(true);
      onCouponClaimed?.(coupon);
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('already claimed')) {
        setAlreadyClaimed(true);
        toast({
          title: "Already Claimed",
          description: "You have already claimed this coupon.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Failed to Claim",
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

  const getStatusBadge = () => {
    if (alreadyClaimed) return <Badge variant="outline"><CheckCircle className="w-3 h-3 mr-1" />Claimed</Badge>;
    if (progressPercentage >= 90) return <Badge variant="secondary">Limited</Badge>;
    return <Badge variant="default">Available</Badge>;
  };

  return (
    <Card className="campaign-card shadow-sm border border-gray-200 overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <img
              src={campaign.brandLogoUrl}
              alt={campaign.brandName}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{campaign.brandName}</h3>
              <p className="text-sm text-gray-500">
                {campaign.latitude && campaign.longitude ? "0.3 miles away" : "Location not specified"}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mb-4">
          <h4 className="font-medium text-gray-900 mb-1">{campaign.offerDescription}</h4>
          <p className="text-sm text-gray-600">{campaign.productName}</p>
          <p className="text-lg font-bold text-primary mt-2">Up to ${campaign.redeemableAmount}</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Claimed</span>
            <span>{claimedCount}/{maxCoupons}</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Button
          onClick={() => claimMutation.mutate()}
          disabled={!isAvailable || claimMutation.isPending}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold button-press disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {claimMutation.isPending ? (
            "Claiming..."
          ) : alreadyClaimed ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Already Claimed
            </>
          ) : !isAvailable ? (
            "Sold Out"
          ) : (
            "Claim Coupon"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
