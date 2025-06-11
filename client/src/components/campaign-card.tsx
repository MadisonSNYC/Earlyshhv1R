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
        title: "Early Access Secured!",
        description: "You're in! Your exclusive access is ready.",
      });
      setAlreadyClaimed(true);
      onCouponClaimed?.(coupon);
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
    },
    onError: (error: Error) => {
      if (error.message.includes('already claimed')) {
        setAlreadyClaimed(true);
        toast({
          title: "Already Secured",
          description: "You already have early access to this offer.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Access Unavailable",
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
    if (alreadyClaimed) return <Badge variant="outline" className="glass-morphism border-green-400 text-green-400"><CheckCircle className="w-3 h-3 mr-1" />Secured</Badge>;
    if (progressPercentage >= 90) return <Badge variant="secondary" className="bg-gradient-to-r from-orange-400 to-red-400 text-white border-0">Almost Full</Badge>;
    return <Badge variant="default" className="bg-gradient-to-r from-green-400 to-cyan-400 text-gray-900 border-0 font-rubik font-600">Open</Badge>;
  };

  return (
    <Card className="campaign-card-electric">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 earlyshh-gradient rounded-2xl flex items-center justify-center shadow-lg">
              <img
                src={campaign.brandLogoUrl}
                alt={campaign.brandName}
                className="w-8 h-8 rounded-lg object-cover"
              />
            </div>
            <div>
              <h3 className="font-rubik font-bold text-white text-lg">{campaign.brandName}</h3>
              <p className="text-sm text-cyan-400 font-space">
                {campaign.latitude && campaign.longitude ? "0.3 miles away" : "Location not specified"}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>

        <div className="mb-4">
          <h4 className="font-rubik font-semibold text-white mb-2">{campaign.offerDescription}</h4>
          <p className="text-sm text-gray-300 font-space">{campaign.productName}</p>
          <p className="text-xl font-rubik font-bold earlyshh-text-gradient mt-2">Up to ${campaign.redeemableAmount}</p>
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
          onClick={() => claimMutation.mutate()}
          disabled={!isAvailable || claimMutation.isPending}
          className="btn-electric w-full disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105"
        >
          {claimMutation.isPending ? (
            "Securing Access..."
          ) : alreadyClaimed ? (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Access Secured
            </>
          ) : !isAvailable ? (
            "Fully Booked"
          ) : (
            "Get Early Access"
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
