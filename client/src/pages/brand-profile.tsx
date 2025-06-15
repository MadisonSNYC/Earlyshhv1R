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
    <div className="h-screen earlyshh-bg relative flex flex-col">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800/20 via-transparent to-cyan-800/20" />
      
      <div className="relative z-10 h-full flex flex-col max-w-md mx-auto w-full">
        {/* Fixed Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 pt-8">
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

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {/* Cover Image */}
          <div className="relative h-48 mb-6">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-b-3xl"
              style={{ backgroundImage: `url(${brandData.coverImage})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent rounded-b-3xl"></div>
            </div>
          </div>

          {/* Brand Header Card */}
          <div className="px-4 mb-6 -mt-20 relative z-10">
            <div className="bg-gradient-to-br from-gray-900/95 via-purple-900/80 to-gray-900/95 backdrop-blur-xl border border-purple-300/40 rounded-2xl p-4 shadow-2xl">
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

          {/* Enhanced Tabs Section */}
          <div className="px-4 pb-32">
            <Tabs defaultValue="campaigns" className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-gray-800/80 via-gray-900/90 to-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-xl mb-6">
                <TabsTrigger 
                  value="campaigns" 
                  className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-cyan-500/50 data-[state=active]:border-purple-400/30 rounded-lg transition-all duration-200"
                >
                  Partnerships
                </TabsTrigger>
                <TabsTrigger 
                  value="about" 
                  className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-cyan-500/50 data-[state=active]:border-purple-400/30 rounded-lg transition-all duration-200"
                >
                  About
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className="text-gray-300 data-[state=active]:text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500/50 data-[state=active]:to-cyan-500/50 data-[state=active]:border-purple-400/30 rounded-lg transition-all duration-200"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="campaigns" className="space-y-4 mt-0">
                {/* Progress Journey Card */}
                <Card className="bg-gradient-to-r from-purple-900/60 via-indigo-900/50 to-cyan-900/60 border-purple-700/40 backdrop-blur-md rounded-2xl shadow-xl">
                  <CardContent className="p-5">
                    <h3 className="text-white font-bold text-lg mb-4 text-center">Your SUPEROOT Journey</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg border-2 border-green-300/30">
                          <span className="text-white text-lg font-bold">1</span>
                        </div>
                        <div className="text-center">
                          <p className="text-green-300 text-sm font-semibold">Free Sample</p>
                          <p className="text-gray-400 text-xs">Available now</p>
                        </div>
                      </div>
                      <div className="flex-1 h-0.5 bg-gradient-to-r from-green-400 via-yellow-400 to-gray-600 mx-3"></div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg border-2 border-yellow-400/30">
                          <span className="text-white text-lg font-bold">🔒</span>
                        </div>
                        <div className="text-center">
                          <p className="text-yellow-300 text-sm font-semibold">50% Off Box</p>
                          <p className="text-gray-400 text-xs">Complete step 1</p>
                        </div>
                      </div>
                      <div className="flex-1 h-0.5 bg-gray-600 mx-3"></div>
                      <div className="flex flex-col items-center space-y-2">
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-700 rounded-full flex items-center justify-center shadow-lg border-2 border-gray-500/30">
                          <span className="text-gray-300 text-lg font-bold">3</span>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-300 text-sm font-semibold">VIP Access</p>
                          <p className="text-gray-500 text-xs">Coming soon</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Partnership Cards */}
                {brandData.campaigns.map((campaign) => (
                  <Card key={campaign.id} className={`bg-gradient-to-br from-gray-900/90 via-gray-900/80 to-gray-800/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-2xl ${
                    campaign.status === 'locked' ? 'opacity-75' : ''
                  }`}>
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg mb-2">{campaign.title}</h4>
                          <p className="text-gray-300 text-sm mb-3 leading-relaxed">{campaign.description}</p>
                          <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">
                            {campaign.value}
                          </div>
                        </div>
                        <Badge 
                          className={`ml-4 px-3 py-1 font-semibold ${
                            campaign.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-400/40' :
                            campaign.status === 'locked' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400/40' :
                            'bg-blue-500/20 text-blue-400 border-blue-400/40'
                          }`}
                        >
                          {campaign.status === 'active' ? 'Available' :
                           campaign.status === 'locked' ? 'Locked' : 'Coming Soon'}
                        </Badge>
                      </div>
                      
                      {campaign.status === 'active' && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                            <span>Campaign Progress</span>
                            <span className="font-semibold">{campaign.claimed}/{campaign.total} claimed</span>
                          </div>
                          <div className="w-full bg-gray-700/60 rounded-full h-3 overflow-hidden">
                            <div 
                              className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-500 shadow-sm"
                              style={{ width: `${(campaign.claimed / campaign.total) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {Math.round((campaign.claimed / campaign.total) * 100)}% completed
                          </div>
                        </div>
                      )}

                      {campaign.status === 'locked' && campaign.lockReason && (
                        <div className="mb-4 p-3 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                          <p className="text-yellow-400 text-sm">
                            <span className="font-semibold">🔒 Locked:</span> {campaign.lockReason}
                          </p>
                        </div>
                      )}

                      {campaign.isPrerequisite && campaign.unlocks && (
                        <div className="mb-4 p-3 bg-cyan-400/10 border border-cyan-400/20 rounded-lg">
                          <p className="text-cyan-400 text-sm">
                            <span className="font-semibold">✨ Unlocks:</span> {campaign.unlocks}
                          </p>
                        </div>
                      )}

                      <Button
                        onClick={() => handleCampaignClaim(campaign.id)}
                        disabled={campaign.status !== 'active'}
                        className={`w-full py-3 font-semibold transition-all duration-200 ${
                          campaign.status === 'active' 
                            ? 'bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                            : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {campaign.status === 'active' ? 'Claim Partnership' :
                         campaign.status === 'locked' ? 'Complete Previous Partnership First' : 'Coming Soon'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="about" className="mt-0">
                <Card className="bg-gradient-to-br from-gray-900/90 via-purple-900/60 to-gray-900/90 backdrop-blur-md border border-gray-700/50 rounded-2xl shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="text-white font-bold text-xl mb-4">About SUPEROOT</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-cyan-400 font-semibold mb-2">Our Mission</h4>
                        <p className="text-gray-300 leading-relaxed">
                          SUPEROOT creates premium dry powder electrolyte mixes using natural root extracts. 
                          Our formulations support immunity, hydration, detox, mental clarity, stamina, and overall vitality 
                          for active lifestyles.
                        </p>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-semibold mb-2">Key Benefits</h4>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Enhanced Immunity</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Superior Hydration</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Natural Detox</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Mental Clarity</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Increased Stamina</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                            <span className="text-gray-300 text-sm">Overall Vitality</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="text-cyan-400 font-semibold mb-2">Company Info</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-gray-400 text-sm">Founded</p>
                            <p className="text-white font-semibold">{brandData.founded}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Location</p>
                            <p className="text-white font-semibold">{brandData.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Active Partnerships</p>
                            <p className="text-white font-semibold">{brandData.activeCampaigns}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">Total Offers</p>
                            <p className="text-white font-semibold">{brandData.totalOffers}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-bold text-lg">Customer Reviews</h3>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-4 h-4 ${i < Math.floor(brandData.rating) ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-white font-semibold">{brandData.rating}</span>
                      <span className="text-gray-400 text-sm">({brandData.totalReviews} reviews)</span>
                    </div>
                  </div>
                  
                  {brandData.reviews.map((review) => (
                    <Card key={review.id} className="bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-gray-800/80 backdrop-blur-md border border-gray-700/50 rounded-xl shadow-lg">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-sm">{review.user.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="text-white font-semibold">{review.user}</p>
                              <p className="text-gray-400 text-xs">{review.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3 h-3 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Fixed Bottom Navigation */}
        <div className="flex-shrink-0">
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
}