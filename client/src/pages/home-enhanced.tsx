import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import BottomNavigation from '@/components/bottom-navigation';
import PartnershipTermsModal from '@/components/partnership-terms-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Map, Grid3X3, MapPin, Clock, Users, ExternalLink, Sparkles } from 'lucide-react';
import { Campaign } from '@/types';

const formatTimeLeft = (date: Date): string => {
  const now = new Date();
  const diff = date.getTime() - now.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h left`;
  return 'Ending soon';
};

const formatDistance = (distance: number): string => {
  if (distance < 1000) return `${Math.round(distance)} ft`;
  const miles = (distance / 5280).toFixed(1);
  return `${miles} mi`;
};

function HomePage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [, setLocation] = useLocation();

  // Fetch campaigns
  const { data: campaigns = [], isLoading: campaignsLoading } = useQuery({
    queryKey: ['/api/campaigns'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns');
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      return response.json();
    }
  });

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['/api/campaigns/categories'],
    queryFn: async () => {
      const response = await fetch('/api/campaigns/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    }
  });

  // Fetch user data
  const { data: user } = useQuery({
    queryKey: ['/api/user'],
    queryFn: async () => {
      const response = await fetch('/api/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  const handleCampaignClaim = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
    setShowPartnershipModal(true);
  };

  const handlePartnershipAccept = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await fetch(`/api/coupons/claim/${selectedCampaign.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 1 })
      });
      
      if (!response.ok) throw new Error('Failed to claim coupon');
      
      const coupon = await response.json();
      setShowPartnershipModal(false);
      setSelectedCampaign(null);
      
      setLocation(`/qr/${coupon.id}`);
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  const filteredCampaigns = campaigns.filter((campaign: Campaign) => {
    const matchesSearch = campaign.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         campaign.offerDescription.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || campaign.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedCampaigns = filteredCampaigns.reduce((acc: Record<string, Campaign[]>, campaign: Campaign) => {
    const category = campaign.category || 'General';
    if (!acc[category]) acc[category] = [];
    acc[category].push(campaign);
    return acc;
  }, {});

  if (campaignsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p>Loading amazing partnerships...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 relative overflow-hidden">
      {/* Colorful overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-500/20 to-cyan-400/30" />
      
      {/* Additional depth layer for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/20" />
      
      {/* Header */}
      <header className="relative z-10 bg-gradient-to-r from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md border-b border-pink-400/30 sticky top-0 shadow-lg">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-gradient-to-r from-gray-900/60 to-purple-900/60 backdrop-blur-sm rounded-2xl px-5 py-4 border border-pink-300/20 flex-1 mr-4">
              <h1 className="text-2xl font-black text-white mb-1 drop-shadow-lg">
                Hey {user?.fullName || 'there'}! 
                <span className="ml-2">👋</span>
              </h1>
              <p className="text-pink-200 font-medium drop-shadow-md">
                Discover exclusive partnerships near you
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                onClick={() => setViewMode('grid')}
                className={viewMode === 'grid' 
                  ? 'bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 text-white border-0 shadow-lg shadow-pink-400/30 rounded-2xl transition-all duration-300 w-12 h-12 p-0' 
                  : 'text-pink-200 hover:text-white bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-400/20 hover:to-cyan-400/20 rounded-2xl transition-all duration-300 w-12 h-12 p-0'
                }
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setLocation('/map')}
                className={viewMode === 'map' 
                  ? 'bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 text-white border-0 shadow-lg shadow-orange-400/30 rounded-2xl transition-all duration-300 w-12 h-12 p-0' 
                  : 'text-pink-200 hover:text-white bg-gray-800/50 hover:bg-gradient-to-r hover:from-orange-400/20 hover:to-purple-400/20 rounded-2xl transition-all duration-300 w-12 h-12 p-0'
                }
              >
                <Map className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5 drop-shadow-md" />
            <input
              type="text"
              placeholder="Search brands or partnerships..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-900/70 via-purple-900/60 to-gray-900/70 backdrop-blur-md border border-pink-300/30 rounded-3xl text-white placeholder-pink-200 focus:outline-none focus:border-cyan-400 focus:shadow-lg focus:shadow-cyan-400/30 transition-all duration-300 text-lg shadow-xl"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
            {['All', ...categories].map((category: string, index: number) => {
              const gradients = [
                'from-pink-400 to-purple-500',
                'from-orange-400 to-pink-500', 
                'from-purple-400 to-blue-500',
                'from-cyan-400 to-teal-500',
                'from-green-400 to-blue-500'
              ];
              const gradient = gradients[index % gradients.length];
              
              return (
                <Badge
                  key={category}
                  className={selectedCategory === category
                    ? `whitespace-nowrap cursor-pointer px-4 py-2 rounded-2xl font-medium transition-all duration-300 bg-gradient-to-r ${gradient} text-white shadow-lg shadow-pink-400/30`
                    : 'whitespace-nowrap cursor-pointer px-4 py-2 rounded-2xl font-medium transition-all duration-300 bg-gray-800/60 text-pink-200 hover:bg-gray-700/60 border border-pink-300/20 hover:border-pink-300/40'
                  }
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>
      </header>

      {/* Featured Brands Section */}
      <section className="relative z-10 max-w-md mx-auto px-6 py-6">
        <div className="bg-gradient-to-r from-gray-900/60 via-purple-900/50 to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-orange-300/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white drop-shadow-lg">Featured Brands</h2>
            <button className="text-transparent bg-gradient-to-r from-orange-400 via-pink-400 to-cyan-400 bg-clip-text font-semibold hover:scale-105 transition-transform duration-300 drop-shadow-lg">
              View All
            </button>
          </div>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {campaigns.slice(0, 6).map((campaign: Campaign, index: number) => {
            const cardGradients = [
              'from-pink-500/20 to-purple-500/20',
              'from-orange-500/20 to-pink-500/20',
              'from-purple-500/20 to-blue-500/20'
            ];
            const borderGradients = [
              'border-pink-300/30',
              'border-orange-300/30', 
              'border-purple-300/30'
            ];
            const cardGradient = cardGradients[index % cardGradients.length];
            const borderGradient = borderGradients[index % borderGradients.length];
            
            return (
              <div
                key={campaign.id}
                className={`flex-shrink-0 bg-gradient-to-br ${cardGradient} backdrop-blur-md border ${borderGradient} rounded-3xl p-6 min-w-[140px] cursor-pointer hover:border-purple-400/70 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-105 transition-all duration-300 group shadow-xl`}
                onClick={() => handleCampaignClaim(campaign)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-4">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-cyan-400/30 rounded-2xl blur-lg group-hover:from-pink-400/50 group-hover:to-cyan-400/50 transition-all duration-300" />
                    <img
                      src={campaign.brandLogoUrl}
                      alt={campaign.brandName}
                      className="relative w-16 h-16 rounded-2xl object-cover shadow-xl"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23374151" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                      }}
                    />
                  </div>
                  <h3 className="text-white font-bold text-sm mb-2 truncate w-full">
                    {campaign.brandName}
                  </h3>
                  <p className="text-pink-200 text-xs mb-3 line-clamp-2">
                    {campaign.category}
                  </p>
                  <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
                    Active
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Partnership Listings */}
      <main className="relative z-10 max-w-md mx-auto px-6 py-6 pb-32">
        {Object.entries(groupedCampaigns).map(([category, categoryCampaigns]) => (
          <div key={category} className="mb-8">
            <div className="bg-gradient-to-r from-gray-900/60 via-blue-900/50 to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-cyan-300/20">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-black text-white capitalize drop-shadow-lg">{category}</h2>
                <span className="text-sm text-cyan-200 font-medium drop-shadow-md">
                  {(categoryCampaigns as Campaign[]).length} available
                </span>
              </div>
            </div>
            
            <div className="space-y-6">
              {(categoryCampaigns as Campaign[]).map((campaign: Campaign, index: number) => {
                const slotsRemaining = Math.floor(campaign.maxCoupons * 0.7);
                const totalSlots = campaign.maxCoupons;
                const distance = 150 + (index * 130);
                const expiresAt = new Date(campaign.endDate);
                
                return (
                  <div
                    key={campaign.id}
                    className="bg-gradient-to-r from-gray-900/80 via-purple-900/60 to-gray-900/80 backdrop-blur-md border border-purple-300/30 rounded-3xl p-6 hover:border-purple-400/70 hover:bg-gradient-to-r hover:from-purple-900/70 hover:to-cyan-900/70 transition-all duration-300 group shadow-xl cursor-pointer"
                    onClick={() => handleCampaignClaim(campaign)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-purple-400/30 rounded-2xl blur-lg group-hover:from-pink-400/50 group-hover:to-cyan-400/50 transition-all duration-300" />
                        <img
                          src={campaign.brandLogoUrl}
                          alt={campaign.brandName}
                          className="relative w-16 h-16 rounded-2xl object-cover shadow-xl"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23374151" rx="16"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                          }}
                        />
                        <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-r from-green-400 to-cyan-400 rounded-full flex items-center justify-center shadow-lg">
                          <div className="w-2 h-2 bg-white rounded-full" />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-white font-bold text-lg drop-shadow-md">{campaign.brandName}</h3>
                          <Badge className="bg-gradient-to-r from-cyan-400/30 to-purple-400/30 text-cyan-300 border border-cyan-400/40 rounded-xl">
                            {campaign.category}
                          </Badge>
                        </div>
                        
                        <p className="text-pink-200 font-medium mb-4 drop-shadow-sm">
                          {campaign.offerDescription}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-orange-200">Early Access Spots</span>
                            <span className="text-white font-bold drop-shadow-md">
                              {slotsRemaining} remaining
                            </span>
                          </div>
                          
                          <div className="w-full bg-gray-700/50 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-orange-400 via-pink-500 to-cyan-400 h-2 rounded-full transition-all duration-300 shadow-lg"
                              style={{ 
                                width: `${(slotsRemaining / totalSlots) * 100}%` 
                              }}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-sm">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1 text-cyan-200">
                                <MapPin className="w-3 h-3" />
                                <span>{formatDistance(distance)}</span>
                              </div>
                              <div className="flex items-center space-x-1 text-orange-200">
                                <Clock className="w-3 h-3" />
                                <span>{formatTimeLeft(expiresAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <Button 
                          className="w-full mt-4 bg-gradient-to-r from-orange-400 via-pink-500 via-purple-500 to-cyan-400 hover:from-orange-500 hover:via-pink-600 hover:via-purple-600 hover:to-cyan-500 text-white font-bold py-3 rounded-2xl border-0 transition-all duration-300 transform hover:scale-105 shadow-xl shadow-pink-500/40"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignClaim(campaign);
                          }}
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          Unlock Partnership
                          <ExternalLink className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
        
        {filteredCampaigns.length === 0 && (
          <div className="text-center py-16">
            <div className="mb-6">
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No partnerships found</h3>
              <p className="text-gray-400">
                Try adjusting your search or category filter
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Partnership Terms Modal */}
      {showPartnershipModal && selectedCampaign && (
        <PartnershipTermsModal
          campaign={selectedCampaign as any}
          onAccept={handlePartnershipAccept}
          onClose={() => setShowPartnershipModal(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}

export default HomePage;