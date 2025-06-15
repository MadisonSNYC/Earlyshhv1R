import { useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { ArrowLeft, ExternalLink, MapPin, Clock, Users, Star, Instagram, Globe, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useQuery } from '@tanstack/react-query';
import BottomNavigation from '@/components/bottom-navigation';

export default function BrandProfilePage() {
  const [, params] = useRoute('/brand/:brandId');
  const [, setLocation] = useLocation();

  // Mock brand data - in real app this would come from API
  const brandData = {
    id: params?.brandId || '1',
    name: 'SUPEROOT',
    handle: '@drinksuperoot',
    category: 'Health & Wellness',
    description: 'Dry powder electrolyte mix with natural roots for immunity, hydration, and vitality.',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    website: 'https://drinksuperoot.com',
    followers: 12500,
    rating: 4.8,
    totalReviews: 342,
    location: 'New York, NY',
    founded: '2020',
    activeCampaigns: 3,
    totalOffers: 15,
    stats: {
      claimed: 1247,
      redeemed: 892,
      satisfaction: 96
    },
    campaigns: [
      {
        id: 1,
        title: 'Free Electrolyte Sample',
        description: 'Try our daily electrolyte mix - Complete this first!',
        value: '$3.99',
        status: 'active',
        claimed: 85,
        total: 100,
        isPrerequisite: true,
        unlocks: 'Exclusive 50% off offer'
      },
      {
        id: 2,
        title: '50% Off First Box',
        description: 'Exclusive discount on your first monthly box',
        value: '$24.99',
        status: 'locked',
        claimed: 0,
        total: 50,
        requiresCompletion: 1,
        lockReason: 'Complete the free sample offer first to unlock this deal'
      },
      {
        id: 3,
        title: 'VIP Membership Trial',
        description: '30-day premium access with personalized nutrition plan',
        value: '$29.99',
        status: 'coming_soon',
        claimed: 0,
        total: 25
      }
    ],
    reviews: [
      {
        id: 1,
        user: 'Alex M.',
        rating: 5,
        comment: 'Amazing electrolyte mix! No crash afterwards.',
        date: '2 days ago'
      },
      {
        id: 2,
        user: 'Sarah K.',
        rating: 5,
        comment: 'Great taste and clean ingredients.',
        date: '1 week ago'
      },
      {
        id: 3,
        user: 'Mike R.',
        rating: 4,
        comment: 'Good product, fast delivery.',
        date: '2 weeks ago'
      }
    ]
  };

  const handleBack = () => {
    setLocation('/');
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${brandData.name} - Earlyshh`,
          text: `Check out ${brandData.name} on Earlyshh!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    }
  };

  const handleCampaignClaim = (campaignId: number) => {
    // Navigate to partnership modal or claim flow
    setLocation(`/?campaign=${campaignId}`);
  };

  return (
    <div className="min-h-screen earlyshh-bg relative">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 iphone-container min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pt-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-white font-bold text-lg">Brand Profile</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-white hover:bg-white/10 rounded-full w-10 h-10 p-0"
          >
            <Share2 className="w-5 h-5" />
          </Button>
        </div>

        {/* Brand Header Card */}
        <div className="px-4 mb-6">
          <div className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-2xl p-4 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center text-white font-bold text-lg">
                  SO
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                  <span className="text-xs text-gray-900 font-bold">✓</span>
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <h2 className="text-white font-bold text-lg mb-1">{brandData.name}</h2>
                <p className="text-cyan-400 text-sm mb-2">{brandData.handle}</p>
                <Badge className="bg-cyan-400/20 text-cyan-300 text-xs mb-3 border-cyan-400/30">
                  {brandData.category}
                </Badge>
                
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    <span>{brandData.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span>{brandData.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-300 text-sm mt-4 leading-relaxed">
              {brandData.description}
            </p>

            <div className="flex gap-2 mt-4">
              <Button
                size="sm"
                onClick={() => window.open(brandData.website, '_blank')}
                className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 flex-1"
              >
                <Globe className="w-3 h-3 mr-1" />
                Website
              </Button>
              <Button
                size="sm"
                onClick={() => window.open(`https://instagram.com/${brandData.handle.replace('@', '')}`, '_blank')}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white border-0 flex-1"
              >
                <Instagram className="w-3 h-3 mr-1" />
                Follow
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="px-4 mb-6">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gradient-to-br from-gray-900/60 to-purple-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{brandData.stats.claimed}</div>
              <div className="text-xs text-gray-400">Claimed</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-green-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{brandData.stats.redeemed}</div>
              <div className="text-xs text-gray-400">Redeemed</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900/60 to-cyan-900/40 backdrop-blur-md border border-gray-700/50 rounded-xl p-3 text-center">
              <div className="text-lg font-bold text-white">{brandData.stats.satisfaction}%</div>
              <div className="text-xs text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>

        {/* Campaigns */}
        <div className="px-4 space-y-4 pb-24">
          <h3 className="text-white font-bold text-lg mb-4">Available Partnerships</h3>
          
          {brandData.campaigns.map((campaign) => (
            <div key={campaign.id} className="bg-gradient-to-br from-gray-900/80 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-2xl p-4 shadow-xl">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-base mb-1">{campaign.title}</h4>
                  <p className="text-gray-300 text-sm mb-2">{campaign.description}</p>
                  <div className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                    {campaign.value}
                  </div>
                </div>
                <Badge 
                  className={`ml-3 ${
                    campaign.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400/30' :
                    campaign.status === 'locked' ? 'bg-gray-500/20 text-gray-400 border-gray-400/30' :
                    'bg-blue-500/20 text-blue-400 border-blue-400/30'
                  }`}
                >
                  {campaign.status === 'active' ? 'Available' :
                   campaign.status === 'locked' ? 'Locked' : 'Coming Soon'}
                </Badge>
              </div>
              
              {campaign.status === 'active' && (
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                    <span>Progress</span>
                    <span>{campaign.claimed}/{campaign.total}</span>
                  </div>
                  <div className="w-full bg-gray-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-cyan-400 h-2 rounded-full"
                      style={{ width: `${(campaign.claimed / campaign.total) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {campaign.status === 'locked' && campaign.lockReason && (
                <p className="text-yellow-400 text-xs mb-3 bg-yellow-400/10 p-2 rounded-lg">
                  {campaign.lockReason}
                </p>
              )}

              <Button
                onClick={() => handleCampaignClaim(campaign.id)}
                disabled={campaign.status !== 'active'}
                className={`w-full ${
                  campaign.status === 'active' 
                    ? 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white' 
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
              >
                {campaign.status === 'active' ? 'Claim Partnership' :
                 campaign.status === 'locked' ? 'Complete Previous First' : 'Coming Soon'}
              </Button>
            </div>
          ))}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}