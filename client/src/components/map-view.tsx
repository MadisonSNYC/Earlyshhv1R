import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus, Navigation } from "lucide-react";
import { Campaign } from "@shared/schema";

interface MapViewProps {
  campaigns: Campaign[];
  onCouponClaimed?: (coupon: any) => void;
}

export default function MapView({ campaigns, onCouponClaimed }: MapViewProps) {
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);

  const handlePinClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign);
  };

  return (
    <div className="relative h-full bg-gray-900 map-container">
      {/* Simulated Dark Map Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Grid pattern for map simulation */}
        <div 
          className="absolute inset-0 opacity-20" 
          style={{
            backgroundImage: `
              repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px),
              repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 21px)
            `
          }}
        />
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-10 space-y-2">
        <Button size="icon" variant="secondary" className="bg-white shadow-lg">
          <Plus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-white shadow-lg">
          <Minus className="h-4 w-4" />
        </Button>
        <Button size="icon" variant="secondary" className="bg-white shadow-lg">
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* User Location Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg animate-pulse-slow"></div>
        <div className="w-8 h-8 bg-blue-500 opacity-20 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
      </div>

      {/* Geofence circle */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-32 h-32 border-2 border-blue-400 border-dashed rounded-full opacity-50 geofence-circle"></div>
      </div>

      {/* Campaign Pins */}
      <div className="absolute top-1/3 left-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <button
          className="map-pin cursor-pointer"
          onClick={() => campaigns[0] && handlePinClick(campaigns[0])}
        >
          <div className="w-8 h-8 bg-primary rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-primary absolute top-full left-1/2 transform -translate-x-1/2"></div>
        </button>
      </div>

      <div className="absolute top-2/3 right-1/3 transform -translate-x-1/2 -translate-y-1/2">
        <button
          className="map-pin cursor-pointer"
          onClick={() => campaigns[1] && handlePinClick(campaigns[1])}
        >
          <div className="w-8 h-8 bg-green-500 rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent border-t-green-500 absolute top-full left-1/2 transform -translate-x-1/2"></div>
        </button>
      </div>

      {/* Bottom Sheet for Selected Pin */}
      {selectedCampaign && (
        <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-4 shadow-2xl transform transition-transform animate-in slide-in-from-bottom">
          <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4"></div>
          <Card className="border-none shadow-none">
            <CardContent className="p-0">
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={selectedCampaign.brandLogoUrl}
                  alt={selectedCampaign.brandName}
                  className="w-12 h-12 rounded-xl"
                />
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedCampaign.brandName}</h3>
                  <p className="text-sm text-gray-500">0.3 miles away</p>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{selectedCampaign.offerDescription}</h4>
              <p className="text-lg font-bold text-primary mb-4">Up to ${selectedCampaign.redeemableAmount}</p>
              <Button className="w-full bg-gradient-to-r from-primary to-secondary text-white font-semibold button-press">
                Claim Coupon
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
