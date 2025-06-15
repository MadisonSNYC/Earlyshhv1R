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
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-gray-300 text-sm font-bold">3</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-semibold">VIP Access</p>
                      <p className="text-gray-400 text-xs">Coming soon</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {brandData.campaigns.map((campaign) => (
              <Card key={campaign.id} className={`bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl ${
                campaign.status === 'locked' ? 'opacity-75' : ''
              }`}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 pr-3">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-base leading-tight">{campaign.title}</h3>
                        {campaign.status === 'locked' && (
                          <div className="w-5 h-5 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-black text-xs font-bold">🔒</span>
                          </div>
                        )}
                        {campaign.isPrerequisite && (
                          <Badge className="bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-green-300 text-xs px-3 py-1 border border-green-400/30 rounded-full">
                            Step 1
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed mb-2">{campaign.description}</p>
                      {campaign.isPrerequisite && campaign.unlocks && (
                        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded-lg p-2 mt-2">
                          <p className="text-yellow-300 text-xs font-medium">
                            🎁 Unlocks: {campaign.unlocks}
                          </p>
                        </div>
                      )}
                      {campaign.status === 'locked' && campaign.lockReason && (
                        <div className="bg-gradient-to-r from-yellow-400/10 to-orange-400/10 border border-yellow-400/30 rounded-lg p-3 mt-2">
                          <p className="text-yellow-300 text-xs font-medium">
                            {campaign.lockReason}
                          </p>
                        </div>
                      )}
                    </div>
                    <Badge
                      variant={campaign.status === 'active' ? 'default' : 'secondary'}
                      className={`text-xs font-semibold px-3 py-1 rounded-full border ${
                        campaign.status === 'active'
                          ? 'bg-gradient-to-r from-green-400/20 to-cyan-400/20 text-green-300 border-green-400/30'
                          : campaign.status === 'locked'
                          ? 'bg-gradient-to-r from-yellow-400/20 to-orange-400/20 text-yellow-300 border-yellow-400/30'
                          : 'bg-gray-600/50 text-gray-400 border-gray-600/50'
                      }`}
                    >
                      {campaign.status === 'active' ? 'Active' : 
                       campaign.status === 'locked' ? 'Locked' : 'Coming Soon'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className={`font-black text-xl ${
                      campaign.status === 'locked' ? 'text-gray-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-green-400'
                    }`}>
                      {campaign.value}
                    </span>
                    <span className="text-gray-400 text-sm font-medium">
                      {campaign.claimed}/{campaign.total} claimed
                    </span>
                  </div>

                  <div className="w-full bg-gray-700/50 rounded-full h-3 mb-4 shadow-inner">
                    <div
                      className={`h-3 rounded-full shadow-lg ${
                        campaign.status === 'locked' 
                          ? 'bg-gradient-to-r from-gray-600 to-gray-500' 
                          : 'bg-gradient-to-r from-cyan-400 to-green-400'
                      }`}
                      style={{ width: `${(campaign.claimed / campaign.total) * 100}%` }}
                    ></div>
                  </div>

                  <Button
                    className={`w-full font-bold py-3 rounded-xl text-sm transition-all duration-300 shadow-lg ${
                      campaign.status === 'active'
                        ? 'bg-gradient-to-r from-cyan-400 to-green-400 hover:from-cyan-500 hover:to-green-500 text-black shadow-cyan-400/30 hover:shadow-green-400/40 hover:scale-105 border border-white/10'
                        : campaign.status === 'locked'
                        ? 'bg-gray-700/80 text-gray-400 cursor-not-allowed border border-gray-600/50'
                        : 'bg-gray-600/80 text-gray-300 border border-gray-600/50'
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
            <Card className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center bg-gradient-to-br from-cyan-400/10 to-blue-400/10 rounded-xl p-4 border border-cyan-400/20">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">{brandData.activeCampaigns}</div>
                    <div className="text-xs text-gray-300 font-medium mt-1">Active Campaigns</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-green-400/10 to-cyan-400/10 rounded-xl p-4 border border-green-400/20">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">{brandData.totalOffers}</div>
                    <div className="text-xs text-gray-300 font-medium mt-1">Total Offers</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-xl p-4 border border-purple-400/20">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">{brandData.stats.claimed}</div>
                    <div className="text-xs text-gray-300 font-medium mt-1">Claimed</div>
                  </div>
                  <div className="text-center bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-xl p-4 border border-orange-400/20">
                    <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">{brandData.stats.satisfaction}%</div>
                    <div className="text-xs text-gray-300 font-medium mt-1">Satisfaction</div>
                  </div>
                </div>

                <div className="border-t border-gray-700/50 pt-6">
                  <h3 className="font-bold text-white mb-4 text-lg">Company Info</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300 font-medium">Founded</span>
                      <span className="text-white font-semibold">{brandData.founded}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300 font-medium">Location</span>
                      <span className="text-white font-semibold">{brandData.location}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg">
                      <span className="text-gray-300 font-medium">Website</span>
                      <span className="text-cyan-400 font-semibold">{brandData.website}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4 mt-6">
            <Card className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400 mb-2">{brandData.rating}</div>
                <div className="flex justify-center items-center space-x-1 mb-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.floor(brandData.rating)
                          ? 'text-yellow-400 fill-current drop-shadow-lg'
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                </div>
                <div className="text-sm text-gray-300 font-medium">{brandData.totalReviews} reviews</div>
              </CardContent>
            </Card>

            {brandData.reviews.map((review) => (
              <Card key={review.id} className="bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-green-400 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-black font-bold text-sm">
                          {review.user.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-bold text-white text-sm">{review.user}</span>
                        <div className="flex items-center space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-500'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <span className="text-gray-400 text-xs font-medium">{review.date}</span>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
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