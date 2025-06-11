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
    name: 'SuperRoot Energy',
    handle: '@superrootenergy',
    category: 'Health & Wellness',
    description: 'Premium energy drinks crafted with natural ingredients for sustained performance.',
    logo: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&h=100&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=200&fit=crop',
    website: 'https://superroot.com',
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
        title: 'Free Energy Sample',
        description: 'Try our premium energy formula - Complete this first!',
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
        comment: 'Amazing energy drink! No crash afterwards.',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900">
      {/* Header */}
      <header className="relative">
        {/* Cover Image */}
        <div 
          className="h-48 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${brandData.coverImage})` }}
        >
          <div className="absolute inset-0 bg-black/50"></div>
          
          {/* Navigation */}
          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="bg-black/50 text-white hover:bg-black/70"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Brand Info */}
        <div className="relative -mt-16 mx-4">
          <Card className="bg-gray-900/95 border-gray-700/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <img
                    src={brandData.logo}
                    alt={brandData.name}
                    className="w-20 h-20 rounded-xl border-2 border-gray-600"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-400 rounded-full border-2 border-gray-900 flex items-center justify-center">
                    <span className="text-xs text-gray-900 font-bold">✓</span>
                  </div>
                </div>

                <div className="flex-1">
                  <h1 className="text-xl font-bold text-white mb-1">{brandData.name}</h1>
                  <p className="text-cyan-400 text-sm mb-2">{brandData.handle}</p>
                  <Badge variant="secondary" className="bg-cyan-400/20 text-cyan-300 text-xs mb-3">
                    {brandData.category}
                  </Badge>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{brandData.followers.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>{brandData.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-4 h-4" />
                      <span>{brandData.location}</span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 text-sm mt-4 leading-relaxed">
                {brandData.description}
              </p>

              <div className="flex space-x-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(brandData.website, '_blank')}
                >
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                  onClick={() => window.open(`https://instagram.com/${brandData.handle.replace('@', '')}`, '_blank')}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  Follow
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </header>

      {/* Content */}
      <div className="px-4 py-6 pb-24">
        <Tabs defaultValue="campaigns" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800/50">
            <TabsTrigger value="campaigns" className="text-gray-300 data-[state=active]:text-white">Campaigns</TabsTrigger>
            <TabsTrigger value="about" className="text-gray-300 data-[state=active]:text-white">About</TabsTrigger>
            <TabsTrigger value="reviews" className="text-gray-300 data-[state=active]:text-white">Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="campaigns" className="space-y-4 mt-6">
            {/* Progress Journey */}
            <Card className="bg-gradient-to-r from-purple-900/50 to-cyan-900/50 border-purple-700/30">
              <CardContent className="p-4">
                <h3 className="text-white font-semibold mb-3">Your SuperRoot Journey</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-green-400 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-green-300 text-sm font-medium">Free Sample</p>
                      <p className="text-gray-400 text-xs">Available now</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-black text-sm font-bold">🔒</span>
                    </div>
                    <div>
                      <p className="text-yellow-300 text-sm font-medium">50% Off Box</p>
                      <p className="text-gray-400 text-xs">Complete step 1</p>
                    </div>
                  </div>
                  <div className="flex-1 h-px bg-gray-600"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                      <span className="text-gray-400 text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm font-medium">VIP Access</p>
                      <p className="text-gray-500 text-xs">Coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {brandData.campaigns.map((campaign) => (
              <Card key={campaign.id} className={`bg-gray-900/90 border-gray-700/50 ${
                campaign.status === 'locked' ? 'opacity-75' : ''
              }`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-white text-sm">{campaign.title}</h3>
                        {campaign.status === 'locked' && (
                          <div className="w-4 h-4 bg-yellow-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">🔒</span>
                          </div>
                        )}
                        {campaign.isPrerequisite && (
                          <Badge className="bg-green-400/20 text-green-300 text-xs px-2 py-0.5">
                            Step 1
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-400 text-xs mt-1">{campaign.description}</p>
                      {campaign.isPrerequisite && campaign.unlocks && (
                        <p className="text-yellow-400 text-xs mt-1 font-medium">
                          🎁 Unlocks: {campaign.unlocks}
                        </p>
                      )}
                      {campaign.status === 'locked' && campaign.lockReason && (
                        <p className="text-yellow-400 text-xs mt-2 bg-yellow-400/10 p-2 rounded">
                          {campaign.lockReason}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className={`text-xs ${
                        campaign.status === 'active'
                          ? 'bg-green-400/20 text-green-300'
                          : campaign.status === 'locked'
                          ? 'bg-yellow-400/20 text-yellow-300'
                          : 'bg-gray-600/50 text-gray-400'
                      }`}
                    >
                      {campaign.status === 'active' ? 'Active' : 
                       campaign.status === 'locked' ? 'Locked' : 'Coming Soon'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-3">
                    <span className={`font-bold text-lg ${
                      campaign.status === 'locked' ? 'text-gray-500' : 'text-cyan-400'
                    }`}>
                      {campaign.value}
                    </span>
                    <span className="text-gray-400 text-xs">
                      {campaign.claimed}/{campaign.total} claimed
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-2 mb-3">
                    <div
                      className={`h-2 rounded-full ${
                        campaign.status === 'locked' 
                          ? 'bg-gray-600' 
                          : 'bg-gradient-to-r from-cyan-400 to-green-400'
                      }`}
                      style={{ width: `${(campaign.claimed / campaign.total) * 100}%` }}
                    ></div>
                  </div>

                  <Button
                    className={`w-full font-semibold ${
                      campaign.status === 'active'
                        ? 'bg-gradient-to-r from-cyan-400 to-green-400 text-black hover:from-cyan-500 hover:to-green-500'
                        : campaign.status === 'locked'
                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-600 text-gray-300'
                    }`}
                    disabled={campaign.status !== 'active'}
                    onClick={() => campaign.status === 'active' && handleCampaignClaim(campaign.id)}
                  >
                    {campaign.status === 'active' ? 'Claim Offer' : 
                     campaign.status === 'locked' ? '🔒 Complete Step 1 First' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="about" className="mt-6">
            <Card className="bg-gray-900/90 border-gray-700/50">
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{brandData.activeCampaigns}</div>
                    <div className="text-xs text-gray-400">Active Campaigns</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{brandData.totalOffers}</div>
                    <div className="text-xs text-gray-400">Total Offers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{brandData.stats.claimed}</div>
                    <div className="text-xs text-gray-400">Claimed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{brandData.stats.satisfaction}%</div>
                    <div className="text-xs text-gray-400">Satisfaction</div>
                  </div>
                </div>

                <div className="border-t border-gray-700 pt-4">
                  <h3 className="font-semibold text-white mb-2">Company Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Founded</span>
                      <span className="text-white">{brandData.founded}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white">{brandData.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Website</span>
                      <span className="text-cyan-400">{brandData.website}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-6">
            <div className="text-center mb-6">
              <div className="text-3xl font-bold text-white mb-1">{brandData.rating}</div>
              <div className="flex justify-center items-center space-x-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(brandData.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-400'
                    }`}
                  />
                ))}
              </div>
              <div className="text-sm text-gray-400">{brandData.totalReviews} reviews</div>
            </div>

            {brandData.reviews.map((review) => (
              <Card key={review.id} className="bg-gray-900/90 border-gray-700/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center">
                        <span className="text-black font-bold text-xs">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                      <span className="font-medium text-white text-sm">{review.user}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3 h-3 ${
                            star <= review.rating
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-400'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-300 text-sm mb-2">{review.comment}</p>
                  <span className="text-gray-400 text-xs">{review.date}</span>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation />
    </div>
  );
}