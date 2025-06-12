
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { campaignService } from '../services/campaign-service';
import { useAuth } from '../lib/auth';

export function useCouponClaim() {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();

  const claimMutation = useMutation({
    mutationFn: (campaignId: string) => campaignService.claimCoupon(campaignId),
    onSuccess: (coupon) => {
      // Invalidate campaigns query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      
      // Log success for debugging
      console.log('Coupon claimed successfully, navigating to partnerships page');
      
      // Ensure navigation happens after state updates
      setTimeout(() => {
        setLocation('/partnerships');
      }, 100);
    },
    onError: (error: any) => {
      console.error('Failed to claim coupon:', error);
      // Handle error (show toast, etc.)
    }
  });

  const handleClaimClick = (campaign: any) => {
    if (!user) {
      // Redirect to login using wouter
      setLocation('/onboarding');
      return;
    }

    setSelectedCampaign(campaign);
    setIsClaimModalOpen(true);
  };

  const handleConfirmClaim = () => {
    if (selectedCampaign) {
      claimMutation.mutate(selectedCampaign.id);
      setIsClaimModalOpen(false);
      setSelectedCampaign(null);
    }
  };

  const handleCloseModal = () => {
    setIsClaimModalOpen(false);
    setSelectedCampaign(null);
  };

  return {
    isClaimModalOpen,
    selectedCampaign,
    isClaimLoading: claimMutation.isPending,
    claimError: claimMutation.error,
    handleClaimClick,
    handleConfirmClaim,
    handleCloseModal
  };
}
