import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import CampaignCard from '@/components/campaign-card';
import BottomNavigation from '@/components/bottom-navigation';
import PartnershipTermsModal from '@/components/partnership-terms-modal';
import MapView from '@/components/map-view';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Map, Grid3X3 } from 'lucide-react';
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
  if (distance < 1000) return `${Math.round(distance)}m`;
  return `${(distance / 1000).toFixed(1)}km`;
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
      <div className="min-h-screen earlyshh-bg flex items-center justify-center">
        <div className="text-white text-center">
          <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p>Loading amazing offers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen earlyshh-bg">
      {/* Header */}
      <header className="glass-card border-0 border-b border-white/10 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                Hey {user?.fullName || 'there'}! 👋
              </h1>
              <p className="text-sm text-gray-300">Discover exclusive deals near you</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="text-gray-300"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'map' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('map')}
                className="text-gray-300"
              >
                <Map className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search brands or offers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {['All', ...categories].map((category: string) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'secondary'}
                className={`whitespace-nowrap cursor-pointer ${
                  selectedCategory === category
                    ? 'bg-cyan-400 text-black'
                    : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </header>

      {/* Featured Brands Section */}
      <section className="max-w-md mx-auto px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Featured Brands</h2>
          <button className="text-purple-400 text-sm font-medium">View All</button>
        </div>
        
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide smooth-scroll">
          {campaigns.slice(0, 6).map((campaign: Campaign) => (
            <div
              key={campaign.id}
              className="flex-shrink-0 bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-4 min-w-[120px] cursor-pointer hover:border-purple-400/50 brand-card"
              onClick={() => {
                setSelectedCampaign(campaign);
                setShowPartnershipModal(true);
              }}
            >
              <div className="flex flex-col items-center text-center">
                <img
                  src={campaign.brandLogoUrl}
                  alt={campaign.brandName}
                  className="w-16 h-16 rounded-xl object-cover mb-3 shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64"><rect width="64" height="64" fill="%23374151"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="24" font-weight="bold">${campaign.brandName.charAt(0)}</text></svg>`;
                  }}
                />
                <h3 className="text-white font-medium text-sm mb-1 truncate w-full">
                  {campaign.brandName}
                </h3>
                <p className="text-gray-400 text-xs leading-tight line-clamp-2">
                  {campaign.category}
                </p>
                <div className="mt-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                  Active
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {viewMode === 'map' ? (
          <MapView 
            campaigns={filteredCampaigns}
            onCampaignClick={(campaign) => {
              setSelectedCampaign(campaign);
              setShowPartnershipModal(true);
            }}
            onCouponClaimed={handleCampaignClaim}
          />
        ) : (
          <>
            {Object.entries(groupedCampaigns).map(([category, categoryCampaigns]) => (
              <div key={category} className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">{category}</h2>
                  <span className="text-sm text-gray-400">
                    {(categoryCampaigns as any[]).length} available
                  </span>
                </div>
                
                <div className="space-y-4">
                  {(categoryCampaigns as any[]).map((campaign) => (
                    <CampaignCard
                      key={campaign.id}
                      campaign={campaign}
                      onClaim={() => handleCampaignClaim(campaign)}
                      onCardClick={() => {
                        setSelectedCampaign(campaign);
                        setShowPartnershipModal(true);
                      }}
                    />
                  ))}
                </div>
              </div>
            ))}

            {filteredCampaigns.length === 0 && (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Filter className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <h3 className="text-lg font-medium text-white mb-2">No offers found</h3>
                  <p className="text-gray-400">
                    Try adjusting your search or category filter
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
          campaign={selectedCampaign}
          onAccept={handlePartnershipAccept}
          onClose={() => setShowPartnershipModal(false)}
        />
      )}

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}