import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { MapPin, List, Search, Filter, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import CampaignCard from '../components/campaign-card';
import MapView from '../components/map-view';
import CouponModal from '../components/coupon-modal';
import { campaignService } from '../services/campaign-service';
import { notificationService } from '../services/notification-service';
import { useAuth } from '../lib/auth';
import { useLocation } from '../hooks/use-location';
import { useCouponClaim } from '../hooks/use-coupon-claim';

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
      latitude: userLocation?.lat,
      longitude: userLocation?.lng,
      filter: selectedFilter,
      search: searchQuery
    }),
    enabled: !!userLocation
  });

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (locationLoading) {
    return <div>Loading location...</div>;
  }

  if (locationError) {
    return <div>Error: {locationError}</div>;
  }

  if (isLoading) {
    return <div>Loading campaigns...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Home Page</h1>

      <Input
        type="text"
        placeholder="Search campaigns..."
        value={searchQuery}
        onChange={handleSearchChange}
      />

      <div>
        <Button onClick={() => setViewMode('list')}>List View</Button>
        <Button onClick={() => setViewMode('map')}>Map View</Button>
      </div>

      <div>
        <Button onClick={() => handleFilterChange('all')}>All</Button>
        <Button onClick={() => handleFilterChange('food')}>Food</Button>
        <Button onClick={() => handleFilterChange('premium')}>Premium</Button>
      </div>

      {viewMode === 'list' ? (
        <div>
          {campaigns.map((campaign: any) => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              onClaim={() => handleClaimClick(campaign)}
            />
          ))}
        </div>
      ) : (
        <MapView
          campaigns={campaigns}
          userLocation={userLocation}
          onClaim={handleClaimClick}
        />
      )}

      <CouponModal
        isOpen={isClaimModalOpen}
        onClose={handleCloseModal}
        onConfirm={handleConfirmClaim}
        isLoading={isClaimLoading}
        campaign={selectedCampaign}
        error={claimError}
      />
    </div>
  );
}