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
  if (days > 0) return `${days}d`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  if (hours > 0) return `${hours}h`;
  return 'Soon';
};

const formatDistance = (distance: number): string => {
  // Convert meters to feet (1 meter = 3.28084 feet)
  const feet = distance * 3.28084;
  if (feet < 5280) return `${Math.round(feet)} feet`;
  // Convert feet to miles (1 mile = 5280 feet)
  const miles = feet / 5280;
  return `${miles.toFixed(1)} mi`;
};

export default function HomePage() {
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
      
      // Navigate to QR code page
      setLocation(`/qr/${coupon.id}`);
    } catch (error) {
      console.error('Claim failed:', error);
    }
  };

  // Filter campaigns based on search and category
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
      <div className="min-h-screen earlyshh-bg flex items-center justify-center iphone-container">
        <div className="text-white text-center">
          <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p className="text-812-base">Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 relative overflow-hidden iphone-container iphone-safe-area">
      {/* Colorful overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-orange-400/30 via-pink-500/20 to-cyan-400/30" />
      
      {/* Additional depth layer for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 via-transparent to-gray-900/20" />
      
      {/* Header - Logo Only */}
      <header className="relative z-10 bg-gradient-to-r from-gray-900/80 via-purple-900/70 to-gray-900/80 backdrop-blur-md border-b border-pink-400/30 sticky top-0 shadow-lg">
        <div className="w-full px-4 py-4 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-812-title font-black bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Earlyshh
            </h1>
          </div>
        </div>
      </header>

      {/* Map Sneak Peek */}
      <section className="relative z-10 w-full px-4 py-3">
        <div className="bg-gradient-to-r from-gray-900/70 via-blue-900/60 to-gray-900/70 backdrop-blur-md rounded-2xl p-3 border border-cyan-400/20 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-cyan-400" />
              <span className="text-white font-bold text-812-sm">3 nearby</span>
            </div>
            <button 
              onClick={() => setViewMode('map')}
              className="text-cyan-300 hover:text-cyan-100 text-812-xs font-medium transition-colors duration-300"
            >
              View Map
            </button>
          </div>
          
          <div className="h-20 bg-gradient-to-br from-blue-900/50 to-purple-900/50 rounded-xl border border-blue-400/20 flex items-center justify-center">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-75"></div>
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-150"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Near You Section */}
      <section className="relative z-10 w-full px-4 py-2">
        <h2 className="text-812-title font-black text-white mb-4 drop-shadow-lg">Near you</h2>
        
        <div className="flex space-x-3 overflow-x-auto pb-3 scrollbar-hide">
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
                className={`flex-shrink-0 bg-gradient-to-br ${cardGradient} backdrop-blur-md border ${borderGradient} rounded-3xl p-3 w-[110px] cursor-pointer hover:border-purple-400/70 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-105 transition-all duration-300 group shadow-xl`}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setShowPartnershipModal(true);
                }}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-2">
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400/30 to-cyan-400/30 rounded-xl blur-sm group-hover:from-pink-400/50 group-hover:to-cyan-400/50 transition-all duration-300" />
                    <img
                      src={campaign.brandLogoUrl}
                      alt={campaign.brandName}
                      className="relative w-12 h-12 rounded-xl object-cover shadow-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23374151" rx="12"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="18" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                      }}
                    />
                  </div>
                  <h3 className="text-white font-bold text-xs mb-1 truncate w-full leading-tight">
                    {campaign.brandName}
                  </h3>
                  <p className="text-pink-200 text-xs mb-2 line-clamp-1">
                    {campaign.category}
                  </p>
                  <div className="bg-gradient-to-r from-green-400 to-cyan-400 text-white text-xs px-2 py-1 rounded-full font-medium shadow-sm">
                    Active
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Partnership Listings */}
      <main className="relative z-10 w-full px-4 py-6 pb-32">
        {viewMode === 'map' ? (
          <div className="text-center py-16">
            <button 
              onClick={() => setLocation('/map')}
              className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-400 text-white px-6 py-3 rounded-2xl font-bold hover:scale-105 transition-all duration-300"
            >
              View Map
            </button>
          </div>
        ) : (
          <>
            {Object.entries(groupedCampaigns).map(([category, categoryCampaigns]) => (
              <div key={category} className="mb-8">
                <div className="bg-gradient-to-r from-gray-900/60 via-blue-900/50 to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-cyan-300/20">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-black text-white capitalize drop-shadow-lg">{category}</h2>
                    <span className="text-sm text-cyan-200 font-medium drop-shadow-md">
                      {(categoryCampaigns as any[]).length} available
                    </span>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {(categoryCampaigns as any[]).map((campaign, index) => {
                    const cardGradients = [
                      'from-gray-900/80 via-purple-900/60 to-gray-900/80',
                      'from-gray-900/80 via-blue-900/60 to-gray-900/80',
                      'from-gray-900/80 via-pink-900/60 to-gray-900/80'
                    ];
                    const borderGradients = [
                      'border-purple-300/30',
                      'border-blue-300/30',
                      'border-pink-300/30'
                    ];
                    const cardGradient = cardGradients[index % cardGradients.length];
                    const borderGradient = borderGradients[index % borderGradients.length];
                    
                    return (
                      <div
                        key={campaign.id}
                        className={`bg-gradient-to-br ${cardGradient} backdrop-blur-md border ${borderGradient} rounded-2xl p-4 cursor-pointer hover:border-cyan-400/60 hover:bg-gradient-to-br hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-[1.02] transition-all duration-300 group shadow-xl w-full max-w-full`}
                        onClick={() => {
                          setSelectedCampaign(campaign);
                          setShowPartnershipModal(true);
                        }}
                      >
                        {/* Compact Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          {/* Brand Logo */}
                          <div className="relative flex-shrink-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/20 to-purple-400/20 rounded-lg blur-sm group-hover:from-pink-400/30 group-hover:to-cyan-400/30 transition-all duration-300" />
                            <img
                              src={campaign.brandLogoUrl}
                              alt={campaign.brandName}
                              className="relative w-12 h-12 rounded-lg object-cover shadow-lg border border-white/10"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48"><rect width="48" height="48" fill="%23374151" rx="8"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="16" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                              }}
                            />
                          </div>
                          
                          {/* Brand Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-bold text-base leading-tight drop-shadow-md truncate">
                              {campaign.brandName}
                            </h3>
                            <p className="text-pink-200/90 text-sm mt-0.5 drop-shadow-sm line-clamp-1">
                              {campaign.offerDescription}
                            </p>
                          </div>
                          
                          {/* Time Badge */}
                          <div className="flex-shrink-0">
                            <div className="bg-gradient-to-r from-orange-400/20 to-red-400/20 backdrop-blur-sm border border-orange-300/30 rounded-lg px-2 py-1">
                              <div className="flex items-center text-orange-200">
                                <Clock className="w-3 h-3 mr-1" />
                                <span className="text-xs font-semibold">{formatTimeLeft(new Date(campaign.expiresAt))}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Bottom Row */}
                        <div className="flex items-center justify-between">
                          {/* Left Info */}
                          <div className="flex items-center space-x-3 flex-1">
                            {/* Distance */}
                            <div className="flex items-center text-cyan-200/90">
                              <MapPin className="w-3 h-3 mr-1" />
                              <span className="text-xs font-medium">{formatDistance(150)}</span>
                            </div>
                            
                            {/* Available Spots */}
                            <div className="flex items-center space-x-1">
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                              <div className="w-1.5 h-1.5 bg-gray-500/50 rounded-full"></div>
                              <div className="w-1.5 h-1.5 bg-gray-500/50 rounded-full"></div>
                              <span className="text-xs text-gray-300 ml-1 font-medium">3/5</span>
                            </div>
                          </div>
                          
                          {/* Action Button */}
                          <button 
                            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-3 py-1.5 rounded-lg font-semibold text-xs transition-all duration-300 hover:scale-105 shadow-lg shadow-pink-500/30 hover:shadow-purple-500/40 flex items-center gap-1.5 border border-white/10 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCampaign(campaign);
                              setShowPartnershipModal(true);
                            }}
                          >
                            <Sparkles className="w-3 h-3" />
                            Partner
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gradient-to-r from-gray-900/60 to-purple-900/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-300/30">
                  <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 drop-shadow-lg" />
                  <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg">No partnerships found</h3>
                  <p className="text-purple-200 font-medium drop-shadow-md">
                    Try adjusting your search or category filter to discover amazing brand collaborations
                  </p>
                </div>
              </div>
            )}
          </>
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