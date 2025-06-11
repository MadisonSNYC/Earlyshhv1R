
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { campaignService } from '../services/campaign-service';
import { Campaign } from '../types';

interface UseCampaignsOptions {
  category?: string;
  location?: { lat: number; lng: number };
  radius?: number;
  enabled?: boolean;
}

export function useCampaigns({ 
  category, 
  location, 
  radius = 5, 
  enabled = true 
}: UseCampaignsOptions = {}) {
  const queryKey = useMemo(() => [
    'campaigns',
    { category, location, radius }
  ], [category, location, radius]);

  const {
    data: campaigns = [],
    isLoading,
    error,
    refetch
  } = useQuery<Campaign[]>({
    queryKey,
    queryFn: () => campaignService.getCampaigns({
      category,
      lat: location?.lat,
      lng: location?.lng,
      radius
    }),
    enabled,
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];
    
    return campaigns.filter(campaign => {
      if (category && category !== 'All' && campaign.category !== category) {
        return false;
      }
      return campaign.spotsLeft > 0;
    });
  }, [campaigns, category]);

  const campaignsByCategory = useMemo(() => {
    return filteredCampaigns.reduce((acc, campaign) => {
      const cat = campaign.category || 'Other';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(campaign);
      return acc;
    }, {} as Record<string, Campaign[]>);
  }, [filteredCampaigns]);

  return {
    campaigns: filteredCampaigns,
    campaignsByCategory,
    isLoading,
    error,
    refetch,
    totalCount: campaigns?.length || 0
  };
}
