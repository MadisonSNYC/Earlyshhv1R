import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Users, Instagram, Camera, Star, CheckCircle, ExternalLink, Globe, User } from 'lucide-react';
import { Campaign } from '@shared/schema';

export default function PartnershipDetailPage() {
  const [location, navigate] = useLocation();
  
  // Extract campaign ID from URL path
  const pathParts = location.split('/');
  const campaignId = pathParts[pathParts.length - 1];

  // Fetch campaign data based on ID
  const { data: campaigns = [], isLoading } = useQuery<Campaign[]>({
    queryKey: ['/api/campaigns'],
  });

  const campaign = campaigns.find(c => c.id.toString() === campaignId);



  const formatDistance = (distance: number): string => {
    const feet = distance * 3.28084;
    if (feet < 5280) return `${Math.round(feet)} feet away`;
    const miles = feet / 5280;
    return `${miles.toFixed(1)} miles away`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen earlyshh-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Partnership not found</h2>
          <Button onClick={() => navigate('/home')} variant="outline">
            Return Home
          </Button>
        </div>
      </div>
    );
  }

  const handleStartPartnership = () => {
    navigate(`/partnership-confirmation/${campaign.id}`);
  };

  return (
    <div className="min-h-screen earlyshh-bg relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/home')}
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Partnership Details</h1>
          <div className="w-10" />
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 pb-6 space-y-4">
          {/* Brand Header */}
          <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-cyan-400/30 rounded-xl blur-md" />
                <img
                  src={campaign.brandLogoUrl}
                  alt={campaign.brandName}
                  className="relative w-16 h-16 rounded-xl object-cover shadow-lg border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23374151" rx="12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                  }}
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <h2 className="text-white font-black text-lg mb-1 drop-shadow-lg truncate">
                  {campaign.brandName}
                </h2>
                <p className="text-pink-200 text-sm font-medium drop-shadow-sm">
                  {campaign.category}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30 text-xs">
                    Active
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    24h left
                  </Badge>
                </div>
              </div>
            </div>

            {/* Brand Links */}
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/brand/${campaign.id}`)}
                className="bg-gradient-to-r from-purple-500/20 to-blue-500/20 hover:from-purple-500/30 hover:to-blue-500/30 text-white border border-purple-400/30 rounded-lg h-8 px-3 text-xs font-medium"
              >
                <User className="w-3 h-3 mr-1" />
                Brand Profile
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(`https://instagram.com/${campaign.brandIgHandle}`, '_blank')}
                className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 hover:from-pink-500/30 hover:to-purple-500/30 text-white border border-pink-400/30 rounded-lg h-8 px-3 text-xs font-medium"
              >
                <Instagram className="w-3 h-3 mr-1" />
                {campaign.brandIgHandle}
              </Button>

            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-4 text-cyan-200 mb-3">
              <div className="flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="text-sm font-medium">{formatDistance(150)}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-3 h-3 mr-1" />
                <span className="text-sm font-medium">3/50spots available</span>
              </div>
            </div>

            {/* Offer Description */}
            <p className="text-white text-sm leading-relaxed drop-shadow-md">
              {campaign.offerDescription}
            </p>
          </div>

          {/* Partnership Requirements */}
          <div className="bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-gray-900/80 backdrop-blur-md border border-blue-300/30 rounded-2xl p-4 shadow-xl">
            <h3 className="text-white font-bold text-base mb-3 flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              What You'll Do
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Take authentic photos</p>
                  <p className="text-gray-300 text-xs">Capture your genuine experience</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Share on Instagram Story</p>
                  <p className="text-gray-300 text-xs">Tag @drinksuperoot and @earlyshh in your story</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-3 h-3 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">Complete feedback survey</p>
                  <p className="text-gray-300 text-xs">Share honest experience</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-br from-green-900/60 via-gray-900/80 to-green-900/60 backdrop-blur-md border border-green-300/30 rounded-2xl p-4 shadow-xl">
            <h3 className="text-white font-bold text-base mb-3 flex items-center">
              <ExternalLink className="w-4 h-4 mr-2 text-green-400" />
              What You'll Get
            </h3>
            
            <div className="text-center">
              <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-1">
                FREE PRODUCT
              </div>
              <p className="text-gray-300 text-sm">
                Full product value at no cost for authentic content
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Action */}
        <div className="p-4 bg-gradient-to-t from-black/50 to-transparent">
          <Button
            onClick={handleStartPartnership}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-4 rounded-2xl text-lg shadow-2xl shadow-pink-500/30 hover:shadow-purple-500/40 transition-all duration-300 hover:scale-[1.02] border border-white/10"
          >
            Start Partnership
          </Button>
        </div>
      </div>
    </div>
  );
}