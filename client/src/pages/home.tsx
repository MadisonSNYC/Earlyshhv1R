import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CampaignCard from '@/components/campaign-card';
import BottomNavigation from '@/components/bottom-navigation';
import CouponModal from '@/components/coupon-modal';
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
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

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
    setShowCouponModal(true);
  };

  const handleClaimConfirm = async () => {
    if (!selectedCampaign) return;
    
    try {
      const response = await fetch(`/api/coupons/claim/${selectedCampaign.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) throw new Error('Failed to claim coupon');
      
      setShowCouponModal(false);
      setSelectedCampaign(null);
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

      {/* Content */}
      <main className="max-w-md mx-auto px-4 py-6 pb-24">
        {Object.entries(groupedCampaigns).map(([category, categoryCampaigns]) => (
          <div key={category} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">{category}</h2>
              <span className="text-sm text-gray-400">
                {categoryCampaigns.length} available
              </span>
            </div>
            
            <div className="space-y-4">
              {categoryCampaigns.map((campaign) => (
                <CampaignCard
                  key={campaign.id}
                  campaign={campaign}
                  onClaim={() => handleCampaignClaim(campaign)}
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
      </main>

      {/* Coupon Modal */}
      <CouponModal
        isOpen={showCouponModal}
        onClose={() => setShowCouponModal(false)}
        onConfirm={handleClaimConfirm}
        isLoading={false}
        campaign={selectedCampaign}
        error={null}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}