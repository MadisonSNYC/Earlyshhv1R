import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import BottomNavigation from '@/components/bottom-navigation';
import PartnershipTermsModal from '@/components/partnership-terms-modal';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, MapPin, Clock, Users, ExternalLink, Sparkles, Grid3X3, ArrowLeft } from 'lucide-react';
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

export default function MapPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [showPartnershipModal, setShowPartnershipModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
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

  if (campaignsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-500 via-purple-600 via-blue-500 to-cyan-500 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="loading-skeleton w-12 h-12 rounded-full mx-auto mb-4"></div>
          <p>Loading map locations...</p>
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
              <div className="flex items-center mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocation('/')}
                  className="text-pink-200 hover:text-white bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-400/20 hover:to-cyan-400/20 rounded-2xl transition-all duration-300 w-10 h-10 p-0 mr-3"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <h1 className="text-2xl font-black text-white drop-shadow-lg">
                  Partnership Map
                </h1>
              </div>
              <p className="text-pink-200 font-medium drop-shadow-md">
                Discover partnerships near 120 Bedford Ave, Williamsburg
              </p>
            </div>
            <div className="flex flex-col space-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setLocation('/')}
                className="text-pink-200 hover:text-white bg-gray-800/50 hover:bg-gradient-to-r hover:from-pink-400/20 hover:to-cyan-400/20 rounded-2xl transition-all duration-300 w-12 h-12 p-0"
              >
                <Grid3X3 className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-pink-300 w-5 h-5 drop-shadow-md" />
            <input
              type="text"
              placeholder="Search nearby partnerships..."
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
                  className={`whitespace-nowrap cursor-pointer px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                    selectedCategory === category
                      ? `bg-gradient-to-r ${gradient} text-white shadow-lg shadow-pink-400/30`
                      : 'bg-gray-800/60 text-pink-200 hover:bg-gray-700/60 border border-pink-300/20 hover:border-pink-300/40'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              );
            })}
          </div>
        </div>
      </header>

      {/* Map View */}
      <main className="relative z-10 max-w-md mx-auto px-6 py-6 pb-32">
        <div className="bg-gradient-to-r from-gray-900/60 via-blue-900/50 to-gray-900/60 backdrop-blur-sm rounded-2xl p-4 mb-6 border border-cyan-300/20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-white drop-shadow-lg">Nearby Partnerships</h2>
            <span className="text-sm text-cyan-200 font-medium drop-shadow-md">
              {filteredCampaigns.length} within 1km
            </span>
          </div>
        </div>

        {/* Mock Map Display */}
        <div className="bg-gradient-to-br from-gray-900/80 via-blue-900/60 to-gray-900/80 backdrop-blur-md border border-blue-300/30 rounded-3xl p-6 mb-6 shadow-xl">
          <div className="relative h-64 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-purple-400/10" />
            
            {/* Map pins for campaigns */}
            <div className="absolute top-1/4 left-1/3 animate-bounce">
              <div className="bg-gradient-to-r from-pink-400 to-purple-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="absolute top-1/2 right-1/4 animate-pulse">
              <div className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <div className="absolute bottom-1/3 left-1/2 animate-bounce delay-500">
              <div className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                <MapPin className="w-4 h-4 text-white" />
              </div>
            </div>
            
            {/* Center marker for user location */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-gradient-to-r from-green-400 to-cyan-400 rounded-full w-8 h-8 flex items-center justify-center shadow-xl animate-pulse">
                <div className="bg-white rounded-full w-3 h-3"></div>
              </div>
            </div>
            
            <div className="absolute bottom-4 left-4 bg-gradient-to-r from-gray-900/80 to-purple-900/60 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/20">
              <p className="text-white text-sm font-medium">📍 120 Bedford Ave, Williamsburg</p>
            </div>
          </div>
        </div>

        {/* Partnership List */}
        <div className="space-y-6">
          {filteredCampaigns.map((campaign: Campaign, index: number) => {
            const distances = [150, 280, 450, 320, 180, 390]; // meters from 120 Bedford Ave
            const distance = distances[index % distances.length];
            
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
                className={`bg-gradient-to-r ${cardGradient} backdrop-blur-md border ${borderGradient} rounded-3xl p-6 cursor-pointer hover:border-cyan-400/60 hover:bg-gradient-to-r hover:from-purple-500/30 hover:to-cyan-500/30 hover:scale-105 transition-all duration-300 group shadow-xl`}
                onClick={() => {
                  setSelectedCampaign(campaign);
                  setShowPartnershipModal(true);
                }}
              >
                <div className="space-y-4">
                  {/* Header Section */}
                  <div className="flex items-center space-x-4">
                    <div className="relative flex-shrink-0">
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/30 to-purple-400/30 rounded-2xl blur-lg group-hover:from-pink-400/50 group-hover:to-cyan-400/50 transition-all duration-300" />
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
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <h3 className="text-white font-black text-812-lg leading-tight drop-shadow-lg">
                          {campaign.brandName}
                        </h3>
                        <div className="flex items-center text-orange-200 drop-shadow-md">
                          <Clock className="w-4 h-4 mr-1.5" />
                          <span className="text-812-xs">{formatTimeLeft(new Date(campaign.endDate))}</span>
                        </div>
                      </div>
                      
                      <p className="text-pink-200 font-medium text-812-sm drop-shadow-md mt-1">
                        {campaign.offerDescription}
                      </p>
                    </div>
                  </div>
                  
                  {/* Info Section */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Visual Slots Indicator */}
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
                        <div className="w-2 h-2 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-sm"></div>
                        <div className="w-2 h-2 bg-gray-600/50 rounded-full"></div>
                        <div className="w-2 h-2 bg-gray-600/50 rounded-full"></div>
                      </div>
                      
                      <div className="flex items-center text-pink-200 drop-shadow-md">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        <span className="text-812-xs">{formatDistance(distance)}</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCampaignClaim(campaign);
                      }}
                      className="touch-button bg-gradient-to-r from-pink-400 via-purple-500 to-cyan-400 text-white px-4 py-2 rounded-2xl font-semibold text-812-xs hover:scale-105 transition-all duration-300 shadow-lg shadow-pink-400/30 hover:shadow-cyan-400/30 flex items-center gap-2"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Partner Up
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredCampaigns.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gradient-to-r from-gray-900/60 to-purple-900/60 backdrop-blur-sm rounded-3xl p-8 border border-purple-300/30">
              <Sparkles className="w-16 h-16 text-purple-400 mx-auto mb-4 drop-shadow-lg" />
              <h3 className="text-2xl font-black text-white mb-4 drop-shadow-lg">No partnerships found</h3>
              <p className="text-purple-200 font-medium drop-shadow-md">
                Try adjusting your search or category filter to discover amazing brand collaborations in Williamsburg
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