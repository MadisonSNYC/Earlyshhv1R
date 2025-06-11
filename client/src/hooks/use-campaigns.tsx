
import { useQuery } from '@tanstack/react-query';
import { campaignService } from '../services/campaign-service';
import { Campaign } from '@shared/schema';

interface UseCampaignsOptions {
  userLocation?: { latitude: number; longitude: number };
  radius?: number;
  filters?: {
    category?: string;
    priceRange?: [number, number];
    status?: string;
  };
}

export function useCampaigns(options: UseCampaignsOptions = {}) {
  return useQuery({
    queryKey: ['campaigns', options],
    queryFn: () => campaignService.getCampaigns(options),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCampaign(id: number) {
  return useQuery({
    queryKey: ['campaign', id],
    queryFn: () => campaignService.getCampaign(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useNearbyCampaigns(location: { latitude: number; longitude: number }, radius = 5) {
  return useQuery({
    queryKey: ['campaigns', 'nearby', location, radius],
    queryFn: () => campaignService.getNearbyCampaigns(location, radius),
    enabled: !!(location.latitude && location.longitude),
    staleTime: 2 * 60 * 1000, // 2 minutes for location-based data
  });
}
