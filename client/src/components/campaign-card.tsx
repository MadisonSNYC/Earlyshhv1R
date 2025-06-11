import React, { memo, useCallback } from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { MapPin, Clock, Users, ExternalLink } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignCardProps {
  campaign: Campaign;
  onClaim?: (campaignId: string) => void;
  className?: string;
}

const CampaignCard = memo(({ campaign, onClaim, className = '' }: CampaignCardProps) => {
  const handleClaim = useCallback(() => {
    onClaim?.(campaign.id);
  }, [onClaim, campaign.id]);

  const formatDistance = useCallback((distance: number) => {
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  }, []);

  const formatTimeLeft = useCallback((expiryDate: string) => {
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffMs = expiry.getTime() - now.getTime();

    if (diffMs <= 0) return 'Expired';

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays}d left`;
    return `${diffHours}h left`;
  }, []);

  return (
    <Card className={`glass-morphism border-0 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${className}`}>
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <div className="relative">
            <img
              src={campaign.brandLogo || '/api/placeholder/48/48'}
              alt={campaign.brandName}
              className="w-12 h-12 rounded-lg object-cover"
              loading="lazy"
            />
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-white"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-white text-sm truncate">
                {campaign.brandName}
              </h3>
              <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 text-xs">
                {campaign.category}
              </Badge>
            </div>

            <p className="text-gray-300 text-xs mb-2 line-clamp-2">
              {campaign.offerDescription}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{formatDistance(campaign.distance || 0)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTimeLeft(campaign.expiryDate)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{campaign.spotsLeft}/{campaign.totalSpots}</span>
                </div>
              </div>

              <Button
                onClick={handleClaim}
                size="sm"
                className="bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-500 hover:to-blue-600 text-white text-xs px-3 py-1 h-7"
              >
                Claim
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