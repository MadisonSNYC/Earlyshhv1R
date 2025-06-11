import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, List, Search, Filter, Bell, Plus } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import CampaignCard from '../components/campaign-card';
import MapView from '../components/map-view';
import CouponModal from '../components/coupon-modal';
import BottomNavigation from '../components/bottom-navigation';
import { PageLoading, CampaignListSkeleton } from '../components/loading-states';
import { campaignService } from '../services/campaign-service';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../lib/auth';
import { useLocation } from '../hooks/use-location';
import { useCouponClaim } from '../hooks/use-coupon-claim';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All', color: 'bg-gray-500' },
  { value: 'food', label: '🍽️ Food', color: 'bg-orange-500' },
  { value: 'fashion', label: '👗 Fashion', color: 'bg-pink-500' },
  { value: 'tech', label: '📱 Tech', color: 'bg-blue-500' },
  { value: 'beauty', label: '💄 Beauty', color: 'bg-purple-500' },
  { value: 'fitness', label: '💪 Fitness', color: 'bg-green-500' }
];

export default function HomePage() {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { user } = useAuth();
  const { latitude, longitude, error: locationError, loading: locationLoading } = useLocation();
  const {
    isClaimModalOpen,
    selectedCampaign,
    isClaimLoading,
    claimError,
    handleClaimClick,
    handleConfirmClaim,
    handleCloseModal
  } = useCouponClaim();

  const userLocation = latitude && longitude ? { lat: latitude, lng: longitude } : null;

  const { data: campaigns = [], isLoading, error } = useQuery({
    queryKey: ['campaigns', userLocation, selectedFilter, searchQuery],
    queryFn: () => campaignService.getCampaigns({
      lat: userLocation?.lat,
      lng: userLocation?.lng,
      category: selectedFilter,
      search: searchQuery
    }),
    enabled: !!userLocation
  });

  const { data: notificationCount = 0 } = useQuery({
    queryKey: ['notification-count'],
    queryFn: () => notificationService.getUnreadCount(),
    enabled: !!user
  });

  if (locationLoading) {
    return <PageLoading message="Getting your location..." />;
  }

  if (locationError) {
    return (
      <div className="min-h-screen electric-bg flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <MapPin className="w-12 h-12 text-red-400 mx-auto" />
          <div>
            <h2 className="text-xl font-bold text-white mb-2">Location Required</h2>
            <p className="text-gray-300 text-sm">{locationError}</p>
          </div>
          <Button 
            onClick={() => window.location.reload()}
            className="bg-gradient-to-r from-pink-500 to-cyan-500"
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen electric-bg pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 glass-morphism border-b border-white/10">
        <div className="flex items-center justify-between p-4 pt-12">
          <div>
            <h1 className="text-2xl font-rubik font-black earlyshh-text-gradient">EARLYSHH</h1>
            <p className="text-gray-400 text-sm">
              {campaigns.length} partnerships nearby
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white relative"
              onClick={() => window.location.href = '/notifications'}
            >
              <Bell className="h-6 w-6" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-red-500 text-xs">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search brands, products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass-morphism border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="px-4 pb-4">
          <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
            {FILTER_OPTIONS.map((filter) => (
              <Button
                key={filter.value}
                variant={selectedFilter === filter.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFilter(filter.value)}
                className={`flex-shrink-0 ${
                  selectedFilter === filter.value
                    ? 'bg-gradient-to-r from-pink-500 to-cyan-500 text-white'
                    : 'border-white/30 text-gray-300 hover:bg-white/10'
                }`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {/* View Toggle */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex bg-white/10 rounded-lg p-1">
              <Button
                variant={viewMode === 'list' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('list')}
                className={viewMode === 'list' ? 'bg-white/20' : 'hover:bg-white/10'}
              >
                <List className="w-4 h-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === 'map' ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode('map')}
                className={viewMode === 'map' ? 'bg-white/20' : 'hover:bg-white/10'}
              >
                <MapPin className="w-4 h-4 mr-1" />
                Map
              </Button>
            </div>

            <Button variant="ghost" size="sm" className="text-gray-400">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4">
        {isLoading ? (
          <CampaignListSkeleton count={5} />
        ) : error ? (
          <div className="text-center py-8 space-y-4">
            <div className="text-red-400">
              <p className="font-semibold">Failed to load partnerships</p>
              <p className="text-sm text-gray-400">{error.message}</p>
            </div>
            <Button 
              onClick={() => window.location.reload()}
              variant="outline"
              className="border-white/30"
            >
              Try Again
            </Button>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">
                No partnerships found
              </h3>
              <p className="text-gray-400 text-sm">
                {searchQuery || selectedFilter !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Check back soon for new partnerships in your area'}
              </p>
            </div>
          </div>
        ) : viewMode === 'list' ? (
          <div className="space-y-4">
            {campaigns.map((campaign: any) => (
              <CampaignCard
                key={campaign.id}
                campaign={campaign}
                onClaim={() => handleClaimClick(campaign)}
              />
            ))}
          </div>
        ) : (
          <div className="h-[600px] rounded-2xl overflow-hidden">
            <MapView
              campaigns={campaigns}
              userLocation={userLocation}
              onCampaignClick={handleClaimClick}
            />
          </div>
        )}
      </div>

      {/* Claim Modal */}
      <CouponModal
        isOpen={isClaimModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmClaim}
        isLoading={isClaimLoading}
        campaign={selectedCampaign}
        error={claimError}
      />

      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>
  );
}