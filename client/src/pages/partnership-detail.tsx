import { useState } from 'react';
import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MapPin, Clock, Users, Instagram, Camera, Star, CheckCircle, ExternalLink } from 'lucide-react';
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
        <div className="flex-1 px-4 pb-6">
          {/* Brand Header */}
          <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-3xl p-6 mb-6 shadow-2xl">
            <div className="flex items-center space-x-4 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-cyan-400/30 rounded-2xl blur-lg" />
                <img
                  src={campaign.brandLogoUrl}
                  alt={campaign.brandName}
                  className="relative w-20 h-20 rounded-2xl object-cover shadow-xl border border-white/10"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"><rect width="80" height="80" fill="%23374151" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="28" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                  }}
                />
              </div>
              
              <div className="flex-1">
                <h2 className="text-white font-black text-2xl mb-2 drop-shadow-lg">
                  {campaign.brandName}
                </h2>
                <p className="text-pink-200 text-sm font-medium drop-shadow-sm">
                  {campaign.category}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge className="bg-green-500/20 text-green-300 border-green-400/30">
                    Active
                  </Badge>
                  <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30">
                    <Clock className="w-3 h-3 mr-1" />
                    24h left
                  </Badge>
                </div>
              </div>
            </div>

            {/* Location & Distance */}
            <div className="flex items-center gap-4 text-cyan-200 mb-4">
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{formatDistance(150)}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">3/5 spots available</span>
              </div>
            </div>

            {/* Offer Description */}
            <p className="text-white text-base leading-relaxed drop-shadow-md">
              {campaign.offerDescription}
            </p>
          </div>

          {/* Partnership Requirements */}
          <div className="bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-gray-900/80 backdrop-blur-md border border-blue-300/30 rounded-3xl p-6 mb-6 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
              What You'll Do
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Camera className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Take authentic photos</p>
                  <p className="text-gray-300 text-sm">Capture your genuine experience with the product</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Instagram className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Share on Instagram Story</p>
                  <p className="text-gray-300 text-sm">Post to your story with subtle @earlyshh branding</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-white font-semibold">Complete feedback survey</p>
                  <p className="text-gray-300 text-sm">Share your honest experience and recommendations</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Proposition */}
          <div className="bg-gradient-to-br from-green-900/60 via-gray-900/80 to-green-900/60 backdrop-blur-md border border-green-300/30 rounded-3xl p-6 mb-8 shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-4 flex items-center">
              <ExternalLink className="w-5 h-5 mr-2 text-green-400" />
              What You'll Get
            </h3>
            
            <div className="text-center">
              <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400 mb-2">
                FREE PRODUCT
              </div>
              <p className="text-gray-300 text-sm">
                Get the full product value at no cost in exchange for authentic content creation
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