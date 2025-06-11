import { useMutation } from '@tanstack/react-query';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Clock, MapPin, Gift } from 'lucide-react';
import { queryClient } from '@/lib/queryClient';
import { Campaign } from '@/types';

interface CouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  isLoading: boolean;
  campaign: Campaign | null;
  error: string | null;
}

export default function CouponModal({
  isOpen,
  onClose,
  onConfirm,
  isLoading,
  campaign,
  error
}: CouponModalProps) {
  const claimMutation = useMutation({
    mutationFn: async () => {
      if (!campaign) throw new Error('No campaign selected');
      const response = await fetch(`/api/coupons/claim/${campaign.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to claim coupon');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/campaigns'] });
      queryClient.invalidateQueries({ queryKey: ['/api/user/coupons'] });
      onClose();
    },
    onError: (error: Error) => {
      console.error('Claim error:', error);
    }
  });

  const handleClaim = async () => {
    try {
      await onConfirm();
      claimMutation.mutate();
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  if (!campaign) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-morphism border-0 text-white max-w-md mx-auto">
        <div className="flex items-center justify-between mb-4">
          <DialogTitle className="text-lg font-semibold">Claim Offer</DialogTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-start space-x-3">
            <img
              src={campaign.brandLogoUrl || '/api/placeholder/60/60'}
              alt={campaign.brandName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-white mb-1">{campaign.brandName}</h3>
              <p className="text-sm text-gray-300 mb-2">{campaign.offerDescription}</p>
              <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 text-xs">
                {campaign.category || 'General'}
              </Badge>
            </div>
          </div>

          <div className="bg-black/20 rounded-lg p-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Product:</span>
              <span className="text-white">{campaign.productName}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Offer Value:</span>
              <span className="text-cyan-300 font-semibold">{campaign.offerValue || 'Special Deal'}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Available:</span>
              <span className="text-white">
                {Math.max(0, campaign.maxCoupons - (campaign.claimedCount || 0))} left
              </span>
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Gift className="w-4 h-4 text-yellow-300 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-yellow-200">
                <p className="font-medium mb-1">Partnership Terms</p>
                <p>
                  By claiming this offer, you agree to share your experience on Instagram 
                  and tag @{campaign.brandIgHandle}. You'll receive the coupon code after confirmation.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-gray-600 text-gray-300 hover:text-white hover:border-gray-500"
          >
            Cancel
          </Button>
          <Button
            onClick={handleClaim}
            disabled={isLoading || claimMutation.isPending}
            className="flex-1 bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white border-0"
          >
            {isLoading || claimMutation.isPending ? 'Claiming...' : 'Claim Offer'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}