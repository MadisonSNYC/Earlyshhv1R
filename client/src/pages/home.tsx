
import React, { Suspense, lazy, memo, useCallback, useMemo, useState, useEffect } from 'react';
import { FixedSizeList as List } from 'react-window';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Search, Filter, MapPin, Bell, User, Map } from 'lucide-react';
import { useCampaigns } from '../hooks/use-campaigns';
import { useLocation } from '../hooks/use-location';
import { useAuth } from '../lib/auth';
import { useGlobalState } from '../hooks/use-global-state';
import { ErrorBoundary } from '../components/error-boundary';
import { CampaignListSkeleton, PageLoading } from '../components/loading-states';
import BottomNavigation from '../components/bottom-navigation';

// Lazy load heavy components
const CampaignCard = lazy(() => import('../components/campaign-card'));
const MapView = lazy(() => import('../components/map-view'));
const CouponModal = lazy(() => import('../components/coupon-modal'));

// Memoized components
const FilterButton = memo(({ 
  category, 
  active, 
  onClick 
}: { 
  category: string; 
  active: boolean; 
  onClick: (category: string) => void; 
}) => (
  <Button
    variant={active ? "default" : "outline"}
    size="sm"
    onClick={() => onClick(category)}
    className={`whitespace-nowrap ${
      active 
        ? 'bg-cyan-400 text-black' 
        : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
    }`}
  >
    {category}
  </Button>
));

const VirtualizedCampaignList = memo(({ 
  campaigns, 
  onCampaignClaim 
}: { 
  campaigns: any[]; 
  onCampaignClaim: (campaignId: string) => void; 
}) => {
  const itemHeight = 140; // Fixed height for each campaign card
  const containerHeight = Math.min(campaigns.length * itemHeight, 600); // Max 600px

  const Row = useCallback(({ index, style }: { index: number; style: React.CSSProperties }) => {
    const campaign = campaigns[index];
    return (
      <div style={style}>
        <div className="p-2">
          <Suspense fallback={<div className="h-[120px] bg-white/5 rounded-lg animate-pulse" />}>
            <CampaignCard 
              campaign={campaign} 
              onClaim={onCampaignClaim}
            />
          </Suspense>
        </div>
      </div>
    );
  }, [campaigns, onCampaignClaim]);

  return (
    <List
      height={containerHeight}
      itemCount={campaigns.length}
      itemSize={itemHeight}
      width="100%"
    >
      {Row}
    </List>
  );
});

export default function HomePage() {
  const { user } = useAuth();
  const { location, isLoading: locationLoading } = useLocation();
  const { viewMode, setViewMode } = useGlobalState();
  
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCoupon, setSelectedCoupon] = useState(null);
  
  const { 
    campaigns, 
    isLoading: campaignsLoading,
    error 
  } = useCampaigns({ 
    category: selectedCategory, 
    location,
    enabled: !locationLoading 
  });

  // Memoized filtered campaigns
  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    
    return campaigns.filter(campaign => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          campaign.brandName?.toLowerCase().includes(query) ||
          campaign.offerDescription?.toLowerCase().includes(query) ||
          campaign.category?.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [campaigns, searchQuery]);

  // Memoized categories
  const categories = useMemo(() => {
    const cats = campaigns?.reduce((acc, campaign) => {
      if (campaign.category && !acc.includes(campaign.category)) {
        acc.push(campaign.category);
      }
      return acc;
    }, ['All'] as string[]) || ['All'];
    
    return cats;
  }, [campaigns]);

  // Optimized handlers
  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
  }, []);

  const handleCampaignClaim = useCallback((campaignId: string) => {
    const campaign = campaigns?.find(c => c.id === campaignId);
    if (campaign) {
      setSelectedCoupon(campaign);
    }
  }, [campaigns]);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  if (locationLoading) {
    return <PageLoading message="Getting your location..." />;
  }

  if (error) {
    throw error;
  }

  return (
    <div className="min-h-screen electric-bg pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-bold text-white">
                Hey {user?.firstName || 'Explorer'} 👋
              </h1>
              <p className="text-gray-300 text-sm">
                {location ? `${filteredCampaigns.length} partnerships nearby` : 'Discovering partnerships...'}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                className="text-white"
              >
                {viewMode === 'list' ? <Map className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search brands, offers..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* Categories */}
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <FilterButton
                key={category}
                category={category}
                active={selectedCategory === category}
                onClick={handleCategoryChange}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {viewMode === 'map' ? (
          <ErrorBoundary>
            <Suspense fallback={<PageLoading message="Loading map..." />}>
              <MapView 
                campaigns={filteredCampaigns} 
                userLocation={location}
                onCampaignSelect={handleCampaignClaim}
              />
            </Suspense>
          </ErrorBoundary>
        ) : (
          <div className="space-y-4">
            {campaignsLoading ? (
              <CampaignListSkeleton count={3} />
            ) : filteredCampaigns.length > 0 ? (
              <VirtualizedCampaignList 
                campaigns={filteredCampaigns}
                onCampaignClaim={handleCampaignClaim}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400">No partnerships found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedCoupon && (
        <Suspense fallback={null}>
          <CouponModal
            coupon={selectedCoupon}
            onClose={() => setSelectedCoupon(null)}
            onRedeemed={() => setSelectedCoupon(null)}
          />
        </Suspense>
      )}

      <BottomNavigation />
    </div>
  );
}

FilterButton.displayName = 'FilterButton';
VirtualizedCampaignList.displayName = 'VirtualizedCampaignList';
