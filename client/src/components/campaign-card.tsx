import React, { memo, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { Campaign } from '../types';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '../lib/queryClient';

interface CampaignCardProps {
  campaign: Campaign;
  onClaim?: (campaignId: string) => void;
  onCardClick?: (campaign: Campaign) => void;
  className?: string;
}

const CampaignCard = memo(({ campaign, onClaim, onCardClick, className = '' }: CampaignCardProps) => {
  const [, setLocation] = useLocation();

  const claimMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/coupons/claim/${campaign.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: 1 }), // Hardcoded for MVP
      });
      
      if (!response.ok) {
        throw new Error('Failed to claim coupon');
      }
      
      return response.json();
    },
    onSuccess: (coupon) => {
      // Navigate to QR code page with the new coupon
      setLocation(`/qr/${coupon.id}`);
    },
    onError: (error) => {
      console.error('Failed to claim coupon:', error);
    },
  });

  const handleClaim = useCallback(() => {
    if (onClaim) {
      onClaim(campaign.id.toString());
    } else {
      claimMutation.mutate();
    }
  }, [onClaim, campaign.id, claimMutation]);

  const formatDistance = useCallback((distance: number) => {
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  }, []);

  const formatTimeLeft = useCallback((expiryDate: string | Date) => {
    try {
      const now = new Date();
      const expiry = new Date(expiryDate);
      
      if (isNaN(expiry.getTime())) return 'Invalid date';
      
      const diffMs = expiry.getTime() - now.getTime();

      if (diffMs <= 0) return 'Expired';

      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) return `${diffDays}d left`;
      return `${diffHours}h left`;
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  const handleCardClick = useCallback(() => {
    if (onCardClick) {
      onCardClick(campaign);
    }
  }, [onCardClick, campaign]);

  return (
    <Card 
      className={`campaign-card bg-gray-900/90 border border-gray-700/50 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-cyan-400/30 cursor-pointer ${className}`}
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img
              src={campaign.brandLogoUrl}
              alt={campaign.brandName}
              className="w-12 h-12 rounded-lg object-cover border border-gray-600 shadow-md"
              onError={(e) => {
                // Fallback to letter if image fails to load
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'flex';
              }}
            />
            <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600 hidden">
              <span className="text-white font-bold text-lg">
                {campaign.brandName.charAt(0)}
              </span>
            </div>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
              <span className="text-xs text-gray-900 font-bold">✓</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-white text-sm truncate">
                {campaign.brandName}
              </h3>
              <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 text-xs">
                {campaign.category || 'General'}
              </Badge>
            </div>

            <p className="text-gray-300 text-xs mb-3 line-clamp-2">
              {campaign.offerDescription}
            </p>

            <div className="mb-3">
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>Early Access Spots</span>
                <span>{Math.max(0, campaign.maxCoupons - (campaign.claimedCount || 0))} remaining</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-cyan-400 to-green-400 h-1.5 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${Math.max(10, ((campaign.maxCoupons - (campaign.claimedCount || 0)) / campaign.maxCoupons) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(campaign.distance || 0)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeLeft(campaign.endDate)}</span>
                </div>
              </div>

              <Button
                onClick={handleClaim}
                disabled={claimMutation.isPending}
                size="sm"
                className="bg-gradient-to-r from-pink-500 to-cyan-400 hover:from-pink-600 hover:to-cyan-500 text-white text-xs px-4 py-2 h-8 font-semibold rounded-full shadow-lg disabled:opacity-50"
              >
                {claimMutation.isPending ? 'Claiming...' : 'Unlock Partnership'}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CampaignCard.displayName = 'CampaignCard';

export default CampaignCard;