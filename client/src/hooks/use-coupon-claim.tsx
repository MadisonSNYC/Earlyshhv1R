
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { campaignService } from '../services/campaign-service';
import { useAuth } from '../lib/auth';

export function useCouponClaim() {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const claimMutation = useMutation({
    mutationFn: (campaignId: string) => campaignService.claimCoupon(campaignId),
    onSuccess: (coupon) => {
      // Invalidate campaigns query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      
      // Navigate to partnerships page to show all partnerships
      window.location.href = `/partnerships`;
    },
    onError: (error: any) => {
      console.error('Failed to claim coupon:', error);
      // Handle error (show toast, etc.)
    }
  });

  const handleClaimClick = (campaign: any) => {
    if (!user) {
      // Redirect to login
      window.location.href = '/onboarding';
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
